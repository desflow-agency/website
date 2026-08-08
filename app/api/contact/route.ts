import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

/*
|--------------------------------------------------------------------------
| DISCORD WEBHOOKS
|--------------------------------------------------------------------------
*/

const webhook =
  process.env.DISCORD_WEBHOOK_URL;

const suspiciousWebhook =
  process.env.DISCORD_SUSPICIOUS_WEBHOOK_URL;

/*
|--------------------------------------------------------------------------
| KONFIGURACJA ANTY-SPAM
|--------------------------------------------------------------------------
*/

const SUSPICIOUS_THRESHOLD = 40;

/*
|--------------------------------------------------------------------------
| BAD WORDS
|--------------------------------------------------------------------------
|
| Plik:
|
| data/bad-words.txt
|
| Jedno słowo w jednej linii.
|
*/

const badWordsPath = path.join(
  process.cwd(),
  "data",
  "bad-words.txt"
);

let badWords: string[] = [];

try {
  const file = fs.readFileSync(
    badWordsPath,
    "utf-8"
  );

  badWords = file
    .split(/\r?\n/)
    .map((word) =>
      word.trim()
    )
    .filter(Boolean)
    .map((word) =>
      normalizeText(word)
    );

  console.log(
    `Załadowano ${badWords.length} słów z bad-words.txt`
  );
} catch (error) {
  console.error(
    "Nie udało się załadować bad-words.txt:",
    error
  );
}

/*
|--------------------------------------------------------------------------
| NORMALIZACJA
|--------------------------------------------------------------------------
*/

function normalizeText(
  text: string
) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

/*
|--------------------------------------------------------------------------
| NORMALIZACJA AGRESYWNA
|--------------------------------------------------------------------------
|
| Pomaga wykrywać:
|
| jebać
| jebac
| JEBAC
| j.e.b.a.c
| j-e-b-a-c
| j e b a c
|
*/

function aggressiveNormalize(
  text: string
) {
  return normalizeText(text)
    .replace(
      /[\s._\-*!?@#$%^&+=:;,/\\|()[\]{}'"`~<>]+/g,
      ""
    );
}

/*
|--------------------------------------------------------------------------
| WYKRYWANIE PRZEKLEŃSTW
|--------------------------------------------------------------------------
*/

function findBadWords(
  text: string
) {
  const normalized =
    normalizeText(text);

  const aggressive =
    aggressiveNormalize(text);

  const found: string[] = [];

  for (const word of badWords) {
    if (!word) {
      continue;
    }

    /*
     * Normalne wykrywanie słowa
     */

    const escaped =
      word.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const wordRegex =
      new RegExp(
        `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
        "i"
      );

    if (
      wordRegex.test(normalized)
    ) {
      found.push(word);
      continue;
    }

    /*
     * Agresywne wykrywanie
     *
     * j.e.b.a.c
     * j-e-b-a-c
     * j e b a c
     */

    const aggressiveWord =
      aggressiveNormalize(word);

    if (
      aggressiveWord &&
      aggressive.includes(
        aggressiveWord
      )
    ) {
      found.push(word);
    }
  }

  return [
    ...new Set(found),
  ];
}

/*
|--------------------------------------------------------------------------
| LICZENIE MATCHY
|--------------------------------------------------------------------------
*/

function countMatches(
  text: string,
  regex: RegExp
) {
  return (
    text.match(regex)?.length ?? 0
  );
}

/*
|--------------------------------------------------------------------------
| LINKI
|--------------------------------------------------------------------------
*/

function countUrls(
  text: string
) {
  return (
    text.match(
      /https?:\/\/[^\s]+|www\.[^\s]+/gi
    ) ?? []
  ).length;
}

/*
|--------------------------------------------------------------------------
| CAPS LOCK
|--------------------------------------------------------------------------
*/

function getCapsRatio(
  text: string
) {
  const letters =
    text.match(
      /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g
    ) ?? [];

  if (!letters.length) {
    return 0;
  }

  const caps =
    text.match(
      /[A-ZĄĆĘŁŃÓŚŹŻ]/g
    )?.length ?? 0;

  return (
    caps / letters.length
  );
}

/*
|--------------------------------------------------------------------------
| ZNAKI SPECJALNE
|--------------------------------------------------------------------------
*/

function getSpecialCharacterRatio(
  text: string
) {
  if (!text.length) {
    return 0;
  }

  const special =
    text.match(
      /[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s.,!?'"()\-:;]/g
    )?.length ?? 0;

  return (
    special / text.length
  );
}

/*
|--------------------------------------------------------------------------
| POWTARZAJĄCE ZNAKI
|--------------------------------------------------------------------------
*/

function getRepeatedCharacterCount(
  text: string
) {
  const matches =
    text.match(
      /(.)\1{5,}/gi
    ) ?? [];

  return matches.length;
}

/*
|--------------------------------------------------------------------------
| POWTARZAJĄCE SŁOWA
|--------------------------------------------------------------------------
*/

function getRepeatedWordCount(
  text: string
) {
  const words =
    normalizeText(text)
      .split(/\s+/)
      .filter(Boolean);

  if (
    words.length < 4
  ) {
    return 0;
  }

  let repeated = 0;

  for (
    let i = 1;
    i < words.length;
    i++
  ) {
    if (
      words[i] ===
      words[i - 1]
    ) {
      repeated++;
    }
  }

  return repeated;
}

/*
|--------------------------------------------------------------------------
| POWTARZAJĄCE FRAZY
|--------------------------------------------------------------------------
*/

function getDuplicatePhraseScore(
  text: string
) {
  const words =
    normalizeText(text)
      .split(/\s+/)
      .filter(Boolean);

  if (
    words.length < 8
  ) {
    return 0;
  }

  const phrases =
    new Map<
      string,
      number
    >();

  for (
    let i = 0;
    i <= words.length - 4;
    i++
  ) {
    const phrase =
      words
        .slice(i, i + 4)
        .join(" ");

    phrases.set(
      phrase,
      (phrases.get(
        phrase
      ) ?? 0) + 1
    );
  }

  const repeatedPhrase =
    [...phrases.values()].some(
      (count) =>
        count >= 2
    );

  return repeatedPhrase
    ? 1
    : 0;
}

/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

function checkEmail(
  email: string
) {
  const normalized =
    email
      .toLowerCase()
      .trim();

  let score = 0;

  const reasons: string[] =
    [];

  /*
   * FORMAT
   */

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalized
    );

  if (!validEmail) {
    score += 25;

    reasons.push(
      "Nieprawidłowy adres e-mail"
    );
  }

  /*
   * TEMP MAIL
   */

  const suspiciousDomains =
    [
      "mailinator.com",
      "10minutemail.com",
      "guerrillamail.com",
      "temp-mail.org",
      "tempmail.com",
      "throwawaymail.com",
      "yopmail.com",
    ];

  const domain =
    normalized.split(
      "@"
    )[1] ?? "";

  if (
    suspiciousDomains.includes(
      domain
    )
  ) {
    score += 40;

    reasons.push(
      "Podejrzana domena e-mail"
    );
  }

  /*
   * LOSOWY EMAIL
   */

  const localPart =
    normalized.split(
      "@"
    )[0] ?? "";

  const numbers =
    localPart.match(
      /[0-9]/g
    )?.length ?? 0;

  if (
    localPart.length >= 12 &&
    numbers >= 7
  ) {
    score += 15;

    reasons.push(
      "Podejrzany adres e-mail"
    );
  }

  return {
    score,
    reasons,
  };
}

/*
|--------------------------------------------------------------------------
| TELEFON
|--------------------------------------------------------------------------
*/

function checkPhone(
  phone: string
) {
  if (!phone) {
    return {
      score: 0,
      reasons: [],
    };
  }

  const digits =
    phone.replace(
      /\D/g,
      ""
    );

  let score = 0;

  const reasons: string[] =
    [];

  /*
   * ZA KRÓTKI
   */

  if (
    digits.length > 0 &&
    digits.length < 7
  ) {
    score += 15;

    reasons.push(
      "Podejrzany numer telefonu"
    );
  }

  /*
   * SAME CYFRY
   */

  if (
    /^(\d)\1+$/.test(
      digits
    ) &&
    digits.length >= 6
  ) {
    score += 30;

    reasons.push(
      "Nieprawidłowy numer telefonu"
    );
  }

  return {
    score,
    reasons,
  };
}

/*
|--------------------------------------------------------------------------
| WIADOMOŚĆ
|--------------------------------------------------------------------------
*/

function checkBody(
  body: string
) {
  let score = 0;

  const reasons: string[] =
    [];

  /*
   * PRZEKLEŃSTWA
   */

  const foundBadWords =
    findBadWords(body);

  if (
    foundBadWords.length > 0
  ) {
    score += Math.min(
      40,
      foundBadWords.length *
        20
    );

    reasons.push(
      `Wykryto niedozwolone słowa (${foundBadWords.join(
        ", "
      )})`
    );
  }

  /*
   * DŁUGOŚĆ
   */

  if (
    body.length > 3000
  ) {
    score += 20;

    reasons.push(
      "Nietypowo długa wiadomość"
    );
  } else if (
    body.length > 1500
  ) {
    score += 10;

    reasons.push(
      "Bardzo długa wiadomość"
    );
  }

  /*
   * BARDZO KRÓTKA
   */

  const words =
    normalizeText(body)
      .split(/\s+/)
      .filter(Boolean);

  if (
    words.length <= 2 &&
    body.length < 15
  ) {
    score += 15;

    reasons.push(
      "Bardzo krótka wiadomość"
    );
  }

  /*
   * LINKI
   */

  const urlCount =
    countUrls(body);

  if (
    urlCount >= 4
  ) {
    score += 40;

    reasons.push(
      "Duża liczba linków"
    );
  } else if (
    urlCount >= 2
  ) {
    score += 25;

    reasons.push(
      "Wiele linków"
    );
  } else if (
    urlCount === 1
  ) {
    score += 5;
  }

  /*
   * POWTARZAJĄCE ZNAKI
   */

  const repeatedCharacters =
    getRepeatedCharacterCount(
      body
    );

  if (
    repeatedCharacters >= 2
  ) {
    score += 30;

    reasons.push(
      "Powtarzające się znaki"
    );
  } else if (
    repeatedCharacters === 1
  ) {
    score += 15;

    reasons.push(
      "Nietypowe powtórzenia znaków"
    );
  }

  /*
   * CAPS
   */

  const capsRatio =
    getCapsRatio(body);

  if (
    capsRatio >= 0.8 &&
    words.length >= 4
  ) {
    score += 25;

    reasons.push(
      "Nadmierne użycie wielkich liter"
    );
  } else if (
    capsRatio >= 0.6 &&
    words.length >= 5
  ) {
    score += 15;

    reasons.push(
      "Dużo wielkich liter"
    );
  }

  /*
   * ZNAKI SPECJALNE
   */

  const specialRatio =
    getSpecialCharacterRatio(
      body
    );

  if (
    specialRatio >= 0.35 &&
    body.length >= 20
  ) {
    score += 20;

    reasons.push(
      "Nietypowo dużo znaków specjalnych"
    );
  }

  /*
   * POWTARZAJĄCE SŁOWA
   */

  const repeatedWords =
    getRepeatedWordCount(
      body
    );

  if (
    repeatedWords >= 5
  ) {
    score += 30;

    reasons.push(
      "Powtarzające się słowa"
    );
  } else if (
    repeatedWords >= 3
  ) {
    score += 15;

    reasons.push(
      "Powtarzające się słowa"
    );
  }

  /*
   * POWTARZAJĄCE FRAZY
   */

  if (
    getDuplicatePhraseScore(
      body
    )
  ) {
    score += 25;

    reasons.push(
      "Powtarzające się fragmenty tekstu"
    );
  }

  /*
   * PRAKTYCZNIE SAME SYMBOLE
   */

  if (
    body.length >= 15 &&
    words.length <= 1
  ) {
    score += 20;

    reasons.push(
      "Nietypowa struktura wiadomości"
    );
  }

  return {
    score,
    reasons,
  };
}

/*
|--------------------------------------------------------------------------
| ANALIZA CAŁEGO ZGŁOSZENIA
|--------------------------------------------------------------------------
*/

function analyzeSubmission({
  name,
  email,
  phone,
  company,
  body,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  body: string;
}) {
  let score = 0;

  const reasons: string[] =
    [];

  /*
   * WIADOMOŚĆ
   */

  const bodyResult =
    checkBody(body);

  score +=
    bodyResult.score;

  reasons.push(
    ...bodyResult.reasons
  );

  /*
   * IMIĘ
   */

  const badNameWords =
    findBadWords(name);

  if (
    badNameWords.length > 0
  ) {
    score += 60;

    reasons.push(
      `Niedozwolone słowa w imieniu (${badNameWords.join(
        ", "
      )})`
    );
  }

  /*
   * FIRMA
   */

  const badCompanyWords =
    findBadWords(company);

  if (
    badCompanyWords.length > 0
  ) {
    score += 50;

    reasons.push(
      `Niedozwolone słowa w nazwie firmy (${badCompanyWords.join(
        ", "
      )})`
    );
  }

  /*
   * EMAIL
   */

  const emailResult =
    checkEmail(email);

  score +=
    emailResult.score;

  reasons.push(
    ...emailResult.reasons
  );

  /*
   * TELEFON
   */

  const phoneResult =
    checkPhone(phone);

  score +=
    phoneResult.score;

  reasons.push(
    ...phoneResult.reasons
  );

  /*
   * IMIĘ ZA KRÓTKIE
   */

  const normalizedName =
    normalizeText(name);

  if (
    normalizedName.length < 2
  ) {
    score += 15;

    reasons.push(
      "Podejrzanie krótkie imię"
    );
  }

  /*
   * FIRMA ZA DŁUGA
   */

  if (
    company &&
    company.length > 150
  ) {
    score += 10;

    reasons.push(
      "Nietypowo długa nazwa firmy"
    );
  }

  /*
   * DUPLIKATY POWODÓW
   */

  const uniqueReasons =
    [...new Set(reasons)];

  return {
    score,

    suspicious:
      score >=
      SUSPICIOUS_THRESHOLD,

    reasons:
      uniqueReasons,

    reason:
      uniqueReasons.length
        ? uniqueReasons.join(
            " • "
          )
        : null,
  };
}

/*
|--------------------------------------------------------------------------
| DISCORD WEBHOOK
|--------------------------------------------------------------------------
*/

async function sendDiscord(
  url: string | undefined,
  message: any
) {
  if (!url) {
    console.error(
      "Brak webhooka Discord"
    );

    return false;
  }

  try {
    const response =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              message
            ),
        }
      );

    if (!response.ok) {
      console.error(
        "Discord webhook error:",
        await response.text()
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "DISCORD ERROR:",
      error
    );

    return false;
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(
  req: Request
) {
  try {
    /*
     * FORM DATA
     */

    const formData =
      await req.formData();

    /*
     * HONEYPOT
     */

    if (
      formData.get("website")
    ) {
      return NextResponse.json({
        success: true,
      });
    }

    /*
     * DANE
     */

    const name =
      String(
        formData.get("name") ||
          ""
      ).trim();

    const email =
      String(
        formData.get("email") ||
          ""
      ).trim();

    const phone =
      String(
        formData.get("phone") ||
          ""
      ).trim();

    const company =
      String(
        formData.get("company") ||
          ""
      ).trim();

    const body =
      String(
        formData.get("body") ||
          ""
      ).trim();

    /*
     * WALIDACJA
     */

    if (
      !name ||
      !email ||
      !body
    ) {
      return NextResponse.json(
        {
          error:
            "Brak wymaganych danych",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ANALIZA
     */

    const analysis =
      analyzeSubmission({
        name,
        email,
        phone,
        company,
        body,
      });

    console.log(
      "ANALIZA ZGŁOSZENIA:",
      {
        score:
          analysis.score,

        suspicious:
          analysis.suspicious,

        reasons:
          analysis.reasons,
      }
    );

    /*
     * ZAPIS DO PRISMA
     */

    const newMessage =
      await prisma.message.create({
        data: {
          name,

          email,

          phone:
            phone || null,

          company:
            company || null,

          body,

          status:
            "NEW",

          suspicious:
            analysis.suspicious,

          suspiciousReason:
            analysis.reason,

          history: {
            create: {
              action:
                analysis.suspicious
                  ? `Utworzono podejrzane zgłoszenie — ${analysis.reason}`
                  : "Utworzono zgłoszenie",
            },
          },
        },
      });

    console.log(
      "NOWE ZGŁOSZENIE:",
      newMessage.id,
      analysis.suspicious
        ? "⚠️ PODEJRZANE"
        : "✅ NORMALNE"
    );

    /*
     * DISCORD EMBED
     */

    const embed = {
      title:
        analysis.suspicious
          ? "⚠️ Podejrzane zgłoszenie"
          : "📩 Nowe zgłoszenie - Desflow",

      color:
        analysis.suspicious
          ? 0xff3b30
          : 0x5b5cf0,

      fields: [
        {
          name:
            "👤 Klient",

          value:
            name.substring(
              0,
              1024
            ),

          inline: true,
        },

        {
          name:
            "📧 Email",

          value:
            email.substring(
              0,
              1024
            ),

          inline: true,
        },

        {
          name:
            "📞 Telefon",

          value:
            (
              phone ||
              "Brak"
            ).substring(
              0,
              1024
            ),

          inline: true,
        },

        {
          name:
            "🏢 Firma",

          value:
            (
              company ||
              "Brak"
            ).substring(
              0,
              1024
            ),

          inline: true,
        },

        {
          name:
            "💬 Wiadomość",

          value:
            body.substring(
              0,
              1000
            ),
        },
      ],

      footer: {
        text:
          analysis.suspicious
            ? `⚠️ SPAM SCORE: ${analysis.score} • ${
                analysis.reason ||
                "Podejrzane zgłoszenie"
              } • ID: ${newMessage.id}`
            : `Desflow • ID: ${newMessage.id}`,
      },

      timestamp:
        new Date().toISOString(),
    };

    /*
     * PODEJRZANE
     *
     * → osobny webhook
     * → bez @everyone
     */

    if (
      analysis.suspicious
    ) {
      await sendDiscord(
        suspiciousWebhook,
        {
          content:
            "🚨 **Podejrzane zgłoszenie**",

          allowed_mentions: {
            parse: [],
          },

          embeds: [
            embed,
          ],
        }
      );
    }

    /*
     * NORMALNE
     *
     * → główny webhook
     * → @everyone
     */

    else {
      await sendDiscord(
        webhook,
        {
          content:
            "@everyone",

          allowed_mentions: {
            parse: [
              "everyone",
            ],
          },

          embeds: [
            embed,
          ],
        }
      );
    }

    /*
     * ODPOWIEDŹ
     */

    return NextResponse.json({
      success: true,

      id:
        newMessage.id,

      suspicious:
        analysis.suspicious,

      score:
        analysis.score,
    });
  } catch (error) {
    console.error(
      "CONTACT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}