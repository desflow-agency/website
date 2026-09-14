"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { DashboardView } from "../dashboard/dashboard-view";
import { CalendarView } from "./calendar/calendar-view";
import { EmployeesView } from "./employees/employee-view";
import { MessagesView } from "./messages/messages-view";
import { MobileBar, Sidebar } from "./sidebar";
import type { AdminTab, ContactMessage } from "./types";
import { fetchList } from "./ui";

type AdminEmployee = {
  id: string;
  role: string;
  permissions: string[];
};

export type AdminWorkspaceUser = {
  name?: string | null;
  image?: string | null;
  role?: string;
  employee?: AdminEmployee | null;
};

const tabs: AdminTab[] = ["dashboard", "messages", "employees", "calendar"];

const tabPermission: Record<AdminTab, string | null> = {
  dashboard: null,
  messages: "messages.view",
  employees: "employees.view",
  calendar: "calendar.view",
};

export function AdminWorkspace({
  user,
  userName,
  logout,
}: {
  user: AdminWorkspaceUser;
  userName: string;
  logout: () => Promise<void>;
}) {
  const [tab, setTabState] = useState<AdminTab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [newMessages, setNewMessages] = useState(0);

  const can = useCallback(
    (permission: string | null) => {
      if (!permission) return true;
      const employee = user.employee;
      if (!employee) return false;
      if (employee.role === "ADMIN") return true;
      return (employee.permissions || []).includes(permission);
    },
    [user.employee]
  );

  // Zakładka w adresie (#messages) — odświeżenie strony zostawia w tym samym miejscu.
  const setTab = useCallback(
    (next: AdminTab) => {
      if (!can(tabPermission[next])) return;
      setTabState(next);
      setMenuOpen(false);
      window.history.replaceState(null, "", next === "dashboard" ? window.location.pathname : `#${next}`);
      window.scrollTo({ top: 0 });
    },
    [can]
  );

  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as AdminTab;
    if (tabs.includes(fromHash) && can(tabPermission[fromHash])) setTabState(fromHash);
  }, [can]);

  // Licznik nowych zgłoszeń przy pozycji w menu.
  useEffect(() => {
    if (!can("messages.view")) return;

    fetchList<ContactMessage>("/api/admin/messages").then((messages) =>
      setNewMessages(messages.filter((message) => message.status === "NEW").length)
    );
  }, [tab, can]);

  const sidebarProps = {
    user,
    activeTab: tab,
    setTab,
    can: (item: AdminTab) => can(tabPermission[item]),
    newMessages,
    logout,
  };

  return (
    <div className="site noise relative flex min-h-dvh">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 left-1/3 h-[520px] w-[820px] rounded-full bg-brand-strong/[0.13] blur-[160px]" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[520px] rounded-full bg-mint/[0.05] blur-[160px]" />
      </div>

      <Sidebar {...sidebarProps} className="sticky top-0 hidden h-dvh w-72 shrink-0 lg:flex" />

      <MobileBar open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />

      {/* MENU — MOBILE */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <motion.button
              type="button"
              aria-label="Zamknij menu"
              tabIndex={-1}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-[min(20rem,86vw)]"
            >
              <Sidebar {...sidebarProps} className="flex h-full w-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative min-w-0 flex-1 px-4 pb-16 pt-24 sm:px-8 lg:px-10 lg:pt-10">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "dashboard" && <DashboardView userName={userName} can={can} setTab={setTab} />}
              {tab === "messages" && <MessagesView />}
              {tab === "employees" && <EmployeesView />}
              {tab === "calendar" && <CalendarView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
