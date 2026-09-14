"use client";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  LogIn,
  MessageSquare,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  eventPriorities,
  labelFor,
  messageStatuses,
  messageStatusOrder,
  roles,
  timeAgo,
  type Tone,
  toneClasses,
} from "@/components/admin/labels";
import type { AdminTab, ContactMessage, Employee } from "@/components/admin/types";
import { Avatar, Badge, EmptyState, fetchList, PageHeader, Panel, PanelTitle, Skeleton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Login = {
  id: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
  lastLogin?: string | null;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  status: string;
  priority: string;
};

const todayLabel = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long" });
const dayLabel = new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "numeric", month: "short" });

export function DashboardView({
  userName,
  can,
  setTab,
}: {
  userName: string;
  can: (permission: string | null) => boolean;
  setTab: (tab: AdminTab) => void;
}) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logins, setLogins] = useState<Login[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const canMessages = can("messages.view");
  const canEmployees = can("employees.view");
  const canCalendar = can("calendar.view");

  useEffect(() => {
    Promise.all([
      canMessages ? fetchList<ContactMessage>("/api/admin/messages") : [],
      canEmployees ? fetchList<Employee>("/api/admin/employees") : [],
      canEmployees ? fetchList<Login>("/api/admin/dashboard/logins") : [],
      canCalendar ? fetchList<CalendarEvent>("/api/admin/calendar") : [],
    ]).then(([messagesData, employeesData, loginsData, eventsData]) => {
      setMessages(messagesData);
      setEmployees(employeesData);
      setLogins(loginsData);
      setEvents(eventsData);
      setLoading(false);
    });
  }, [canMessages, canEmployees, canCalendar]);

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(messageStatusOrder.map((status) => [status, 0])) as Record<string, number>;
    for (const message of messages) byStatus[message.status] = (byStatus[message.status] || 0) + 1;
    return byStatus;
  }, [messages]);

  const upcoming = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return events
      .filter((event) => new Date(event.start) >= startOfToday && !["COMPLETED", "CANCELLED"].includes(event.status))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  }, [events]);

  const latest = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [messages]
  );

  const stats: { label: string; value: number; hint: string; icon: typeof Inbox; tone: Tone; tab: AdminTab; show: boolean }[] = [
    { label: "Nowe zgłoszenia", value: counts.NEW || 0, hint: "czekają na odpowiedź", icon: Inbox, tone: "brand", tab: "messages", show: canMessages },
    { label: "W trakcie", value: (counts.IN_PROGRESS || 0) + (counts.WAITING || 0), hint: "w realizacji i oczekujące", icon: Clock3, tone: "amber", tab: "messages", show: canMessages },
    { label: "Zakończone", value: counts.DONE || 0, hint: "gotowe projekty", icon: CheckCircle2, tone: "mint", tab: "messages", show: canMessages },
    canEmployees
      ? { label: "Zespół", value: employees.length, hint: "osób z dostępem", icon: Users, tone: "sky", tab: "employees", show: true }
      : { label: "Najbliższe zadania", value: upcoming.length, hint: "w kalendarzu", icon: CalendarClock, tone: "sky", tab: "calendar", show: canCalendar },
  ];

  const visibleStats = stats.filter((stat) => stat.show);
  const total = messages.length;
  const capitalizedDate = todayLabel.format(new Date()).replace(/^./, (letter) => letter.toUpperCase());

  return (
    <div className="space-y-8">
      <PageHeader
        kicker={capitalizedDate}
        title={`Cześć, *${userName}*`}
        description="Oto, co dzieje się dziś w desflow."
        actions={
          canMessages && (
            <button
              type="button"
              onClick={() => setTab("messages")}
              className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-canvas transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,140,255,0.35)]"
            >
              Otwórz zgłoszenia
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )
        }
      />

      {/* STATYSTYKI */}
      {visibleStats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleStats.map(({ label, value, hint, icon: Icon, tone, tab }, index) => (
            <Panel key={label} delay={0.05 * index} className="group">
              <button
                type="button"
                onClick={() => setTab(tab)}
                className="relative flex w-full cursor-pointer flex-col p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-2xl", toneClasses[tone].soft)}>
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="text-faint opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg group-hover:opacity-100"
                  />
                </div>
                {loading ? (
                  <Skeleton className="mt-6 h-10 w-16" />
                ) : (
                  <p className="mt-6 text-[2.6rem] font-semibold leading-none tracking-[-0.05em]">{value}</p>
                )}
                <p className="mt-3 text-sm font-medium">{label}</p>
                <p className="mt-0.5 text-xs text-faint">{hint}</p>
              </button>
            </Panel>
          ))}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-5">
        {/* OSTATNIE ZGŁOSZENIA */}
        {canMessages && (
          <Panel delay={0.15} className={cn(canCalendar ? "lg:col-span-3" : "lg:col-span-5")}>
            <PanelTitle
              icon={<MessageSquare size={17} />}
              title="Ostatnie zgłoszenia"
              action={
                <button type="button" onClick={() => setTab("messages")} className="cursor-pointer text-[13px] font-medium text-soft transition hover:text-fg">
                  Wszystkie →
                </button>
              }
            />

            {total > 0 && (
              <div className="px-5 pt-5 sm:px-6">
                <div className="flex h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                  {messageStatusOrder.map((status) =>
                    counts[status] ? (
                      <span
                        key={status}
                        style={{ width: `${(counts[status] / total) * 100}%` }}
                        className={cn("h-full", toneClasses[messageStatuses[status].tone].bar)}
                      />
                    ) : null
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-soft">
                  {messageStatusOrder.map((status) => (
                    <span key={status} className="inline-flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", toneClasses[messageStatuses[status].tone].dot)} />
                      {messageStatuses[status].label}
                      <span className="text-faint">{counts[status] || 0}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-2 sm:p-3">
              {loading ? (
                <div className="space-y-2 p-2">
                  {[0, 1, 2].map((item) => (
                    <Skeleton key={item} className="h-14" />
                  ))}
                </div>
              ) : latest.length === 0 ? (
                <EmptyState icon={<Inbox size={20} />} title="Brak zgłoszeń" text="Nowe wiadomości z formularza pojawią się tutaj." />
              ) : (
                <ul>
                  {latest.map((message) => {
                    const status = labelFor(messageStatuses, message.status);

                    return (
                      <li key={message.id}>
                        <button
                          type="button"
                          onClick={() => setTab("messages")}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-ink/[0.04]"
                        >
                          <Avatar name={message.name} size={38} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{message.name}</p>
                            <p className="truncate text-xs text-soft">{message.company || message.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge tone={status.tone} dot>
                              {status.label}
                            </Badge>
                            <span className="text-[11px] text-faint">{timeAgo(message.createdAt)}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Panel>
        )}

        {/* NAJBLIŻSZE ZADANIA */}
        {canCalendar && (
          <Panel delay={0.2} className={cn(canMessages ? "lg:col-span-2" : "lg:col-span-5")}>
            <PanelTitle
              icon={<CalendarClock size={17} />}
              title="Najbliższe zadania"
              action={
                <button type="button" onClick={() => setTab("calendar")} className="cursor-pointer text-[13px] font-medium text-soft transition hover:text-fg">
                  Kalendarz →
                </button>
              }
            />
            <div className="p-2 sm:p-3">
              {loading ? (
                <div className="space-y-2 p-2">
                  {[0, 1, 2].map((item) => (
                    <Skeleton key={item} className="h-12" />
                  ))}
                </div>
              ) : upcoming.length === 0 ? (
                <EmptyState icon={<CalendarClock size={20} />} title="Nic zaplanowanego" text="Dodaj zadanie w kalendarzu." />
              ) : (
                <ul>
                  {upcoming.map((event) => {
                    const priority = labelFor(eventPriorities, event.priority);

                    return (
                      <li key={event.id} className="flex items-center gap-3 rounded-2xl px-3 py-3">
                        <span className={cn("h-9 w-1 shrink-0 rounded-full", toneClasses[priority.tone].bar)} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{event.title}</p>
                          <p className="text-xs capitalize text-soft">{dayLabel.format(new Date(event.start))}</p>
                        </div>
                        <Badge tone={priority.tone}>{priority.label}</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Panel>
        )}

        {/* ZESPÓŁ */}
        {canEmployees && (
          <Panel delay={0.25} className="lg:col-span-3">
            <PanelTitle
              icon={<Users size={17} />}
              title="Zespół"
              action={
                <button type="button" onClick={() => setTab("employees")} className="cursor-pointer text-[13px] font-medium text-soft transition hover:text-fg">
                  Zarządzaj →
                </button>
              }
            />
            <div className="grid gap-2 p-3 sm:grid-cols-2">
              {loading
                ? [0, 1].map((item) => <Skeleton key={item} className="h-16" />)
                : employees.slice(0, 6).map((employee) => {
                    const role = labelFor(roles, employee.role);

                    return (
                      <div key={employee.id} className="flex items-center gap-3 rounded-2xl border border-line bg-ink/[0.02] p-3">
                        <Avatar src={employee.avatar} name={employee.globalName || employee.username} size={40} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{employee.globalName || employee.username}</p>
                          <Badge tone={role.tone} className="mt-1 px-2 py-0 text-[11px]">
                            {role.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </Panel>
        )}

        {/* LOGOWANIA */}
        {canEmployees && (
          <Panel delay={0.3} className="lg:col-span-2">
            <PanelTitle icon={<LogIn size={17} />} title="Ostatnie logowania" />
            <div className="p-2 sm:p-3">
              {!loading && logins.length === 0 ? (
                <EmptyState icon={<LogIn size={20} />} title="Brak logowań" />
              ) : (
                <ul>
                  {logins.map((login) => (
                    <li key={login.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
                      <Avatar src={login.avatar} name={login.globalName || login.username} size={34} />
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">{login.globalName || login.username}</p>
                      <span className="text-xs text-faint">{timeAgo(login.lastLogin)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
