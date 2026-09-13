#!/usr/bin/env node
/*
 * Nagrywa stronę internetową jako krótki, zapętlony film do sekcji "Strony WWW".
 *
 *   npm run record -- https://klient.pl
 *   npm run record -- https://klient.pl --name klient --stops 3 --hide ".cookie-banner"
 *
 * Wynik (domyślnie w public/websites): <nazwa>.webm, <nazwa>.mp4, <nazwa>.webp (poster).
 * Pełna lista opcji: npm run record -- --help
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { chromium, devices } from "playwright";

const HELP = `
Nagrywanie strony do sekcji "Strony WWW"

Użycie:
  npm run record -- <adres> [opcje]

Opcje:
  -n, --name <nazwa>      Nazwa plików wynikowych (domyślnie: domena, np. "klient-pl")
      --out <folder>      Folder wynikowy (domyślnie: public/websites)
      --width <px>        Szerokość okna (domyślnie: 1280)
      --height <px>       Wysokość okna (domyślnie: 800)
      --scale <x>         Gęstość pikseli renderowania. 2 = ostrzejszy tekst, ale wolniej (domyślnie: 1)
      --mobile            Widok telefonu 390×844 (film pionowy, np. do makiety telefonu)
      --stops <liczba>    Ile ekranów przewinąć w dół (domyślnie: automatycznie, maks. 4)
      --delay <ms>        Postój na górze strony przed przewijaniem (domyślnie: 2500)
      --pause <ms>        Postój po każdym przewinięciu (domyślnie: 2200)
      --speed <ms>        Czas przewinięcia o jeden ekran (domyślnie: 1400)
      --no-back           Nie wracaj na górę na końcu nagrania
      --intro             Nagraj też animacje startowe (od momentu ładowania strony)
      --hide <selektor>   Ukryj element CSS, np. baner cookies (można podać kilka razy)
      --click <selektor>  Kliknij element przed nagraniem, np. "Akceptuj" (można podać kilka razy)
      --max-duration <s>  Maksymalna długość filmu w sekundach (domyślnie: 20)
      --fps <liczba>      Klatki na sekundę w pliku wynikowym (domyślnie: 30)
      --headed            Pokaż okno przeglądarki podczas nagrywania
      --keep-frames       Nie usuwaj klatek tymczasowych
  -h, --help              Ta pomoc

Przykłady:
  npm run record -- https://klient.pl --name klient
  npm run record -- http://localhost:3000 --name desflow --stops 3 --scale 2
  npm run record -- https://klient.pl --hide "#cookie-banner" --click "text=Akceptuję"
`;

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    name: { type: "string", short: "n" },
    out: { type: "string", default: "public/websites" },
    width: { type: "string", default: "1280" },
    height: { type: "string", default: "800" },
    scale: { type: "string" },
    mobile: { type: "boolean", default: false },
    stops: { type: "string" },
    delay: { type: "string", default: "2500" },
    pause: { type: "string", default: "2200" },
    speed: { type: "string", default: "1400" },
    back: { type: "boolean", default: true },
    intro: { type: "boolean", default: false },
    hide: { type: "string", multiple: true, default: [] },
    click: { type: "string", multiple: true, default: [] },
    "max-duration": { type: "string", default: "20" },
    fps: { type: "string", default: "30" },
    headed: { type: "boolean", default: false },
    "keep-frames": { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (options.help || positionals.length === 0) {
  console.log(HELP);
  process.exit(options.help ? 0 : 1);
}

/* ================================================== */
/* KONFIGURACJA                                       */
/* ================================================== */

const url = normalizeUrl(positionals[0]);
const name = slugify(options.name || new URL(url).host || path.parse(new URL(url).pathname).name) || "strona";
const outDir = path.resolve(process.cwd(), options.out);

const viewport = options.mobile
  ? { width: 390, height: 844 }
  : { width: toInt(options.width, "width"), height: toInt(options.height, "height") };

const scale = Number(options.scale ?? (options.mobile ? 2 : 1));
const fps = toInt(options.fps, "fps");
const maxDuration = Number(options["max-duration"]);

// Desktop: renderujemy w "scale", ale film ma rozmiar okna (downsampling = ostrzejszy tekst).
// Mobile: film ma rozmiar okna × scale, bo 390 px szerokości to za mało.
const output = options.mobile
  ? { width: even(viewport.width * scale), height: even(viewport.height * scale) }
  : { width: even(viewport.width), height: even(viewport.height) };

const scrollPlan = {
  stops: options.stops ? toInt(options.stops, "stops") : null,
  delay: toInt(options.delay, "delay"),
  pause: toInt(options.pause, "pause"),
  speed: toInt(options.speed, "speed"),
  back: options.back,
};

/* ================================================== */
/* NAGRYWANIE                                         */
/* ================================================== */

const framesDir = await mkdtemp(path.join(tmpdir(), `record-${name}-`));
const frames = [];
const pendingWrites = [];
let recording = false;
let recordFrom = 0;

log(`▶ Nagrywam ${url}`);
log(`  okno ${viewport.width}×${viewport.height} @${scale}x → film ${output.width}×${output.height}, ${fps} fps`);

let browser;

try {
  browser = await chromium.launch({
    headless: !options.headed,
    args: ["--hide-scrollbars", "--force-color-profile=srgb", "--autoplay-policy=no-user-gesture-required"],
  });
} catch (error) {
  if (String(error).includes("Executable doesn't exist")) {
    fail("Brak przeglądarki Playwright. Zainstaluj ją poleceniem:\n\n  npx playwright install chromium\n");
  }
  throw error;
}

try {
  const context = await browser.newContext({
    ...(options.mobile ? devices["iPhone 13"] : {}),
    viewport,
    deviceScaleFactor: scale,
    locale: "pl-PL",
    reducedMotion: "no-preference",
  });

  // Ukrycie pasków przewijania i wskazanych elementów (np. banerów cookies) jeszcze przed renderem.
  const css = [
    "html{scrollbar-width:none!important}",
    "::-webkit-scrollbar{display:none!important}",
    ...options.hide.map((selector) => `${selector}{display:none!important;visibility:hidden!important}`),
  ].join("\n");

  await context.addInitScript((styles) => {
    const inject = () => {
      const style = document.createElement("style");
      style.dataset.recorder = "true";
      style.textContent = styles;
      document.documentElement.appendChild(style);
    };
    if (document.documentElement) inject();
    else document.addEventListener("DOMContentLoaded", inject, { once: true });
  }, css);

  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});

    if (!recording || metadata.timestamp < recordFrom) return;

    const file = `f${String(frames.length).padStart(6, "0")}.jpg`;
    frames.push({ file, time: metadata.timestamp });
    pendingWrites.push(writeFile(path.join(framesDir, file), Buffer.from(data, "base64")));
  });

  const startScreencast = () =>
    cdp.send("Page.startScreencast", {
      format: "jpeg",
      quality: 92,
      maxWidth: Math.round(viewport.width * scale),
      maxHeight: Math.round(viewport.height * scale),
      everyNthFrame: 1,
    });

  if (options.intro) {
    // Nagrywamy od początku, ale odcinamy biały ekran sprzed DOMContentLoaded.
    recording = true;
    await startScreencast();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    recordFrom = Date.now() / 1000;
    await page.waitForLoadState("load").catch(() => {});
    await clickAll(page, options.click);
  } else {
    await page.goto(url, { waitUntil: "load", timeout: 60_000 });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await clickAll(page, options.click);
    await page.evaluate(() => document.fonts?.ready);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    recording = true;
    await startScreencast();
  }

  log("  przewijam stronę…");

  await Promise.race([
    page.evaluate(runScrollScript, scrollPlan),
    page.waitForTimeout(maxDuration * 1000 + 2000),
  ]);

  const endTime = Date.now() / 1000;
  recording = false;
  await cdp.send("Page.stopScreencast").catch(() => {});
  await Promise.all(pendingWrites);

  if (frames.length < 2) {
    fail("Nie udało się przechwycić klatek. Spróbuj z opcją --headed.");
  }

  const duration = endTime - frames[0].time;
  const captureFps = frames.length / duration;
  log(`  przechwycono ${frames.length} klatek w ${duration.toFixed(1)} s (~${captureFps.toFixed(0)} fps)`);

  if (captureFps < 20) {
    log("  ⚠ Mało klatek — animacje mogą być szarpane. Zamknij ciężkie programy, spróbuj --headed albo --scale 1.");
  }

  /* ================================================== */
  /* KODOWANIE                                          */
  /* ================================================== */

  await writeConcatList(frames, endTime);
  await mkdir(outDir, { recursive: true });

  const files = {
    webm: path.join(outDir, `${name}.webm`),
    mp4: path.join(outDir, `${name}.mp4`),
    poster: path.join(outDir, `${name}.webp`),
  };

  const input = ["-f", "concat", "-safe", "0", "-i", "frames.ffconcat"];
  const filters = ["-vf", `fps=${fps},scale=${output.width}:${output.height}:flags=lanczos,format=yuv420p`];
  const limit = ["-t", String(maxDuration)];

  log("  koduję MP4 (H.264)…");
  await ffmpeg([...input, ...filters, ...limit, "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-movflags", "+faststart", "-an", files.mp4]);

  log("  koduję WebM (VP9)…");
  await ffmpeg([...input, ...filters, ...limit, "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", files.webm]);

  log("  zapisuję poster (WebP)…");
  await ffmpeg(["-i", frames[0].file, "-vf", `scale=${output.width}:${output.height}:flags=lanczos`, "-c:v", "libwebp", "-quality", "82", files.poster]);

  /* ================================================== */
  /* PODSUMOWANIE                                       */
  /* ================================================== */

  log("\n✔ Gotowe:");
  for (const file of Object.values(files)) {
    const { size } = await stat(file);
    log(`  ${path.relative(process.cwd(), file)}  (${formatSize(size)})`);
  }

  const publicDir = path.resolve(process.cwd(), "public");
  if (outDir.startsWith(publicDir)) {
    const webPath = (file) => "/" + path.relative(publicDir, file).split(path.sep).join("/");
    log(`
Wklej do tablicy "showcases" w components/public-site/websites-section.tsx:

  media: {
    kind: "video",
    webm: "${webPath(files.webm)}",
    mp4: "${webPath(files.mp4)}",
    poster: "${webPath(files.poster)}",
  },
`);
  }
} finally {
  await browser.close();
  if (!options["keep-frames"]) {
    await rm(framesDir, { recursive: true, force: true });
  } else {
    log(`  klatki zostawione w: ${framesDir}`);
  }
}

/* ================================================== */
/* POMOCNICZE                                         */
/* ================================================== */

// Uruchamiane w przeglądarce: płynne przewijanie z postojami, na końcu powrót na górę.
async function runScrollScript({ stops, delay, pause, speed, back }) {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const root = document.scrollingElement || document.documentElement;

  const scrollTo = (to, ms) =>
    new Promise((resolve) => {
      const from = root.scrollTop;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / ms, 1);
        window.scrollTo({ top: from + (to - from) * ease(progress), behavior: "instant" });
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

  await wait(delay);

  const screen = window.innerHeight;
  const count = stops ?? Math.min(4, Math.max(1, Math.floor((root.scrollHeight - screen) / screen)));

  for (let index = 1; index <= count; index++) {
    // Wysokość liczona na nowo — strona może się wydłużyć po doładowaniu treści.
    const max = root.scrollHeight - screen;
    const target = Math.min(screen * index, max);
    if (target <= root.scrollTop + 4) break;

    await scrollTo(target, speed * ((target - root.scrollTop) / screen));
    await wait(pause);
  }

  if (back && root.scrollTop > 0) {
    await scrollTo(0, Math.min(2600, speed * 1.3));
    await wait(900);
  }
}

async function clickAll(page, selectors) {
  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 5000 });
      await page.waitForTimeout(500);
    } catch {
      log(`  ⚠ Nie znaleziono elementu do kliknięcia: ${selector}`);
    }
  }
}

// Klatki z screencastu mają zmienny odstęp (Chrome wysyła je tylko przy zmianach),
// więc zapisujemy dokładny czas trwania każdej klatki dla ffmpeg.
async function writeConcatList(list, endTime) {
  const lines = ["ffconcat version 1.0"];

  list.forEach((frame, index) => {
    const next = list[index + 1]?.time ?? endTime;
    lines.push(`file '${frame.file}'`, `duration ${Math.max(next - frame.time, 0.001).toFixed(4)}`);
  });

  lines.push(`file '${list.at(-1).file}'`);
  await writeFile(path.join(framesDir, "frames.ffconcat"), lines.join("\n"));
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegInstaller.path, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      cwd: framesDir,
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg zakończył się kodem ${code}`))));
  });
}

function normalizeUrl(value) {
  if (existsSync(value)) return pathToFileURL(path.resolve(value)).toString();

  const withProtocol = /^(https?|file):\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    fail(`Nieprawidłowy adres: ${value}`);
  }
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ł/g, "l")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toInt(value, label) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number <= 0) fail(`Nieprawidłowa wartość --${label}: ${value}`);
  return number;
}

function even(value) {
  return Math.round(value / 2) * 2;
}

function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function log(message) {
  console.log(message);
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}
