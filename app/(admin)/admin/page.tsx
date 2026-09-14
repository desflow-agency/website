import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa6";

import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { adminThemeText } from "@/components/admin/theme-text";
import { Accent } from "@/components/public-site/rich-text";
import { ThemeToggle } from "@/components/public-site/theme-toggle";
import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Panel administracyjny",
  robots: { index: false, follow: false },
};

async function loginWithDiscord() {
  "use server";

  await signIn("discord", { redirectTo: "/admin" });
}

async function logout() {
  "use server";

  await signOut({ redirectTo: "/admin" });
}

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="site noise relative grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
          <div className="grid-lines absolute inset-0" />
          <div className="absolute -left-24 top-0 h-[520px] w-[520px] animate-aurora rounded-full bg-brand-strong/25 blur-[140px]" />
          <div className="absolute -right-16 bottom-0 h-[420px] w-[420px] animate-aurora rounded-full bg-mint/10 blur-[140px] [animation-delay:-9s]" />
        </div>

        <ThemeToggle t={adminThemeText} className="absolute right-4 top-4 sm:right-6 sm:top-6" />

        <section className="surface relative w-full max-w-md p-8 shadow-frame sm:p-10">
          <div className="flex items-center gap-2.5">
            <Image src="/dfblack.png" alt="" width={36} height={36} priority className="logo-mark h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">desflow</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              <ShieldCheck size={13} />
              Admin
            </span>
          </div>

          <p className="kicker mt-10">Panel administracyjny</p>
          <h1 className="title-lg mt-4">
            <Accent text="Witaj *ponownie.*" />
          </h1>
          <p className="mt-4 leading-7 text-soft">
            Zaloguj się kontem Discord, żeby obsługiwać zgłoszenia, kalendarz i zespół.
          </p>

          <form action={loginWithDiscord} className="mt-9">
            <button
              type="submit"
              className="group flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#5865F2] px-6 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4752c4] hover:shadow-[0_12px_40px_rgba(88,101,242,0.45)]"
            >
              <FaDiscord size={20} />
              Zaloguj przez Discord
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-faint">
            Dostęp mają tylko osoby dodane do zespołu desflow.
          </p>

          <div className="mt-8 border-t border-line pt-6">
            <a href="/" className="group inline-flex items-center gap-2 text-sm font-medium text-soft transition hover:text-fg">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Wróć na stronę desflow
            </a>
          </div>
        </section>
      </main>
    );
  }

  const employee = await prisma.employee.findUnique({
    where: { discordId: session.user.id },
  });

  return (
    <AdminWorkspace
      user={{
        name: session.user.name,
        image: session.user.image,
        role: employee?.role || "WORKER",
        employee,
      }}
      userName={session.user.name?.split(" ")[0] || "Admin"}
      logout={logout}
    />
  );
}
