"use client";

import { ArrowRight, Building2, CheckCircle, Clock, Loader2, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

import { Reveal } from "./reveal";
import { Gradient } from "./rich-text";

type ContactText = Dictionary["contact"];

export function ContactSection({ t, locale }: { t: ContactText; locale: Locale }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-strong/20 blur-[160px]" />

      <div className="container-site">
        <Reveal>
          <div className="noise relative overflow-hidden rounded-[36px] border border-line-strong bg-panel/80 p-6 backdrop-blur-xl md:p-12">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />

            <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div className="flex flex-col justify-center">
                <p className="kicker">{t.kicker}</p>

                <h2 id="contact-title" className="title-lg mt-5">
                  <Gradient text={t.title} />
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-soft md:text-lg">{t.lead}</p>

                <div className="mt-10 space-y-3">
                  <ContactInfo icon={<Mail size={18} />} title={t.emailLabel} href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </ContactInfo>
                  <ContactInfo icon={<Clock size={18} />} title={t.responseLabel}>
                    {t.responseValue}
                  </ContactInfo>
                </div>
              </div>

              <ContactForm t={t} privacyHref={localizePath(locale, "/privacy")} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactInfo({
  icon,
  title,
  href,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      <span>
        <span className="block text-xs text-faint">{title}</span>
        <span className="block font-medium">{children}</span>
      </span>
    </>
  );

  const className = "flex items-center gap-4 rounded-2xl border border-line bg-ink/[0.02] p-4 transition-colors";

  return href ? (
    <a href={href} className={`${className} hover:border-line-strong hover:bg-ink/[0.05]`}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function ContactForm({ t, privacyHref }: { t: ContactText; privacyHref: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });

      if (!response.ok) throw new Error();

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  }

  return (
    <form onSubmit={handleSubmit} className="relative rounded-[28px] border border-line bg-canvas/60 p-5 md:p-8" aria-label={t.formAria}>
      <div className="grid gap-4">
        {/* Honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField icon={<User size={17} />} name="name" label={t.name} autoComplete="name" required />
          <InputField icon={<Mail size={17} />} name="email" type="email" label={t.email} autoComplete="email" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField icon={<Phone size={17} />} name="phone" type="tel" label={t.phone} autoComplete="tel" />
          <InputField icon={<Building2 size={17} />} name="company" label={t.company} autoComplete="organization" />
        </div>

        <label className="block">
          <span className="sr-only">{t.bodyLabel}</span>
          <textarea
            required
            name="body"
            rows={6}
            placeholder={t.bodyPlaceholder}
            className="min-h-40 w-full resize-none rounded-2xl border border-line bg-ink/[0.03] px-5 py-4 text-fg outline-none transition-all placeholder:text-faint hover:border-line-strong focus:border-brand/60 focus:bg-ink/[0.05] focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <button
          disabled={status === "loading"}
          type="submit"
          className="group mt-1 flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-fg px-6 font-semibold text-canvas transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(139,140,255,0.35)] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "loading" && (
            <>
              {t.sending} <Loader2 size={18} className="animate-spin" />
            </>
          )}
          {status === "success" && (
            <>
              {t.sent} <CheckCircle size={18} className="text-emerald-500" />
            </>
          )}
          {status === "error" && <>{t.error}</>}
          {status === "idle" && (
            <>
              {t.submit}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-xs leading-5 text-faint">
          {t.privacyNote}{" "}
          <a href={privacyHref} className="text-soft underline decoration-line-strong underline-offset-2 transition hover:text-fg">
            {t.privacyLink}
          </a>
          .
        </p>

        <p className="sr-only" role="status" aria-live="polite">
          {status === "success" ? t.srSent : status === "error" ? t.srError : ""}
        </p>
      </div>
    </form>
  );
}

function InputField({
  icon,
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
}: {
  icon: React.ReactNode;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex h-14 items-center gap-3 rounded-2xl border border-line bg-ink/[0.03] px-4 transition-all hover:border-line-strong focus-within:border-brand/60 focus-within:bg-ink/[0.05] focus-within:ring-4 focus-within:ring-brand/10">
      <span className="text-faint" aria-hidden="true">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
      <input
        required={required}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={required ? `${label} *` : label}
        className="h-full w-full bg-transparent text-fg outline-none placeholder:text-faint"
      />
    </label>
  );
}
