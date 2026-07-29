"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  return (
    <section
      id="kontakt"
      className="shell py-16"
    >
      <div className="rounded-4xl bg-[#5b5cf0] p-8 text-white md:p-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-[#d7d6ff]">
              Porozmawiajmy
            </p>

            <h2 className="mt-2 text-5xl font-bold tracking-[-.06em]">
              Gotowy rozwinąć Twoją markę?
            </h2>

            <p className="mt-5 max-w-md leading-7 text-[#e4e3ff]">
              Napisz kilka zdań o swoim wyzwaniu. Odpowiemy w ciągu
              24 godzin.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      action="/api/contact"
      method="post"
      onSubmit={() => setSent(true)}
      className="grid gap-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Imię i nazwisko"
        />

        <input
          required
          type="email"
          name="email"
          placeholder="E-mail"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="phone"
          placeholder="Telefon"
        />

        <input
          name="company"
          placeholder="Firma"
        />
      </div>

      <textarea
        required
        name="body"
        rows={3}
        placeholder="W czym możemy pomóc?"
      />

      <button
        type="submit"
        className="btn bg-white text-[#111322]"
      >
        {sent
          ? "Dziękujemy — wrócimy z odpowiedzią."
          : "Wyślij wiadomość"}

        <ArrowRight size={16} />
      </button>
    </form>
  );
}