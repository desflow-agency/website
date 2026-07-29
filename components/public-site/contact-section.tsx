"use client";

import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  return (
    <section id="contact" className="shell py-16">
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
              Napisz kilka zdań o swoim projekcie.
              Odpowiemy w ciągu 24 godzin.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}


function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setStatus("loading");

    const form = e.currentTarget;

    const data = new FormData(form);


    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });


      if (!res.ok) {
        throw new Error();
      }


      form.reset();
      setStatus("success");


      setTimeout(() => {
        setStatus("idle");
      }, 5000);


    } catch {
      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4"
    >

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />


      <div className="grid gap-4 sm:grid-cols-2">

        <input
          required
          name="name"
          placeholder="Imię i nazwisko"
          className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white placeholder:text-white/60 outline-none"
        />


        <input
          required
          type="email"
          name="email"
          placeholder="E-mail"
          className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white placeholder:text-white/60 outline-none"
        />

      </div>



      <div className="grid gap-4 sm:grid-cols-2">

        <input
          name="phone"
          placeholder="Telefon"
          className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white placeholder:text-white/60 outline-none"
        />


        <input
          name="company"
          placeholder="Firma"
          className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white placeholder:text-white/60 outline-none"
        />

      </div>



      <textarea
        required
        name="body"
        rows={5}
        placeholder="W czym możemy pomóc?"
        className="resize-none rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white placeholder:text-white/60 outline-none"
      />



      <button
        disabled={status === "loading"}
        type="submit"
        className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-[#111322] transition hover:scale-[1.02] disabled:opacity-60"
      >

        {status === "loading" && (
          <>
            Wysyłanie
            <Loader2
              className="animate-spin"
              size={18}
            />
          </>
        )}


        {status === "success" && (
          <>
            Wiadomość wysłana
            <CheckCircle size={18}/>
          </>
        )}


        {status === "error" && (
          <>
            Błąd wysyłania
          </>
        )}


        {status === "idle" && (
          <>
            Wyślij wiadomość
            <ArrowRight size={18}/>
          </>
        )}

      </button>

    </form>
  );
}