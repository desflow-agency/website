"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, LayoutDashboard, LogOut, Menu, MessageSquare, Users, X } from "lucide-react";
import Image from "next/image";

import { ThemeToggle } from "@/components/public-site/theme-toggle";
import { cn } from "@/lib/utils";

import type { AdminWorkspaceUser } from "./admin-workspace";
import { labelFor, roles } from "./labels";
import { adminThemeText } from "./theme-text";
import type { AdminTab } from "./types";
import { Avatar, Badge, IconButton } from "./ui";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { name: "Zgłoszenia", icon: MessageSquare, tab: "messages" },
  { name: "Pracownicy", icon: Users, tab: "employees" },
  { name: "Kalendarz", icon: Calendar, tab: "calendar" },
] as const;

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Image src="/dfblack.png" alt="" width={36} height={36} priority className="logo-mark h-8 w-8" />
      <span className="text-lg font-semibold tracking-tight">desflow</span>
      <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        Admin
      </span>
    </div>
  );
}

export function Sidebar({
  user,
  activeTab,
  setTab,
  can,
  newMessages,
  logout,
  className,
}: {
  user: AdminWorkspaceUser;
  activeTab: AdminTab;
  setTab: (tab: AdminTab) => void;
  can: (tab: AdminTab) => boolean;
  newMessages: number;
  logout: () => Promise<void>;
  className?: string;
}) {
  const role = labelFor(roles, user.role);

  return (
    <aside className={cn("z-20 flex-col border-r border-line bg-panel/70 backdrop-blur-2xl", className)}>
      <div className="px-6 pb-2 pt-6">
        <Logo />
      </div>

      {/* STATUS */}
      <div className="mx-4 mt-5 flex items-center gap-2.5 rounded-2xl border border-mint/15 bg-mint/[0.07] px-4 py-3 text-[13px] font-medium text-mint">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        System online
      </div>

      <p className="mt-8 px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Menu</p>

      <nav aria-label="Panel administracyjny" className="mt-3 flex-1 px-3">
        <ul className="space-y-1">
          {links
            .filter((link) => can(link.tab))
            .map(({ name, icon: Icon, tab }) => {
              const active = activeTab === tab;

              return (
                <li key={tab}>
                  <button
                    type="button"
                    onClick={() => setTab(tab)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300",
                      active ? "text-fg" : "text-soft hover:bg-ink/[0.04] hover:text-fg"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`admin-nav-${className?.includes("lg:flex") ? "desktop" : "mobile"}`}
                        className="absolute inset-0 rounded-xl border border-line-strong bg-ink/[0.07]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      >
                        <span className="absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-brand" />
                      </motion.span>
                    )}
                    <Icon size={18} strokeWidth={1.9} className={cn("relative", active && "text-brand")} />
                    <span className="relative">{name}</span>
                    {tab === "messages" && newMessages > 0 && (
                      <span className="relative ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
                        {newMessages}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
        </ul>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-soft transition hover:bg-ink/[0.04] hover:text-fg"
        >
          <ArrowUpRight size={18} strokeWidth={1.9} />
          Otwórz stronę
        </a>
      </nav>

      {/* UŻYTKOWNIK */}
      <div className="p-4">
        <div className="rounded-2xl border border-line bg-ink/[0.03] p-3">
          <div className="flex items-center gap-3">
            <Avatar src={user.image} name={user.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name || "Admin"}</p>
              <Badge tone={role.tone} className="mt-1 px-2 py-0 text-[11px]">
                {role.label}
              </Badge>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <ThemeToggle t={adminThemeText} />
            <form action={logout} className="flex-1">
              <button
                type="submit"
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line-strong bg-ink/[0.03] text-[13px] font-medium text-soft transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
              >
                <LogOut size={15} />
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Górny pasek na telefonie i tablecie.
export function MobileBar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex h-16 items-center justify-between border-b border-line bg-canvas/80 px-4 backdrop-blur-2xl lg:hidden">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle t={adminThemeText} />
        <IconButton label={open ? "Zamknij menu" : "Otwórz menu"} onClick={onToggle} aria-expanded={open}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </IconButton>
      </div>
    </div>
  );
}
