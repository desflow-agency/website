"use client";

import { Inbox, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { messageStatuses, messageStatusOrder, toneClasses } from "../labels";
import type { ContactMessage, Employee } from "../types";
import { EmptyState, fetchList, IconButton, PageHeader, Panel, Skeleton } from "../ui";
import { MessageCard } from "./message-card";

type Filter = "ALL" | keyof typeof messageStatuses;

const order: Record<string, number> = { NEW: 1, IN_PROGRESS: 2, WAITING: 3, DONE: 4, CLOSED: 5 };

export function MessagesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const [messagesData, employeesData] = await Promise.all([
      fetchList<ContactMessage>("/api/admin/messages"),
      fetchList<Employee>("/api/admin/employees"),
    ]);

    setMessages(messagesData);
    setEmployees(employeesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateMessage(id: string, data: Partial<Pick<ContactMessage, "status" | "assignedTo">>) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const updated = await res.json().catch(() => null);

    if (!res.ok || !updated?.id) {
      alert(updated?.error || "Nie udało się zapisać zmian");
      return;
    }

    setMessages((previous) => previous.map((message) => (message.id === id ? updated : message)));
  }

  async function deleteMessage(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Nie udało się usunąć zgłoszenia");
    }

    load();
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: messages.length };
    for (const message of messages) result[message.status] = (result[message.status] || 0) + 1;
    return result;
  }, [messages]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return [...messages]
      .filter((message) => filter === "ALL" || message.status === filter)
      .filter(
        (message) =>
          !needle ||
          [message.name, message.email, message.company, message.phone, message.body]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(needle))
      )
      .sort(
        (a, b) =>
          (order[a.status] ?? 9) - (order[b.status] ?? 9) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [messages, filter, query]);

  const filters: { value: Filter; label: string }[] = [
    { value: "ALL", label: "Wszystkie" },
    ...messageStatusOrder.map((status) => ({ value: status, label: messageStatuses[status].label })),
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        kicker="Obsługa klientów"
        title="*Zgłoszenia*"
        description="Wiadomości z formularza kontaktowego. Przypisz osobę, zmieniaj status i śledź historię."
        actions={
          <IconButton
            label="Odśwież"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            <RefreshCw size={17} className={cn(loading && "animate-spin")} />
          </IconButton>
        }
      />

      {/* FILTRY + SZUKAJKA */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="admin-scroll -mx-4 overflow-x-auto px-4 pb-1 xl:mx-0 xl:px-0 xl:pb-0">
          <div className="flex w-max gap-1 rounded-full border border-line bg-ink/[0.03] p-1">
            {filters.map(({ value, label }) => {
              const active = filter === value;
              const tone = value === "ALL" ? null : messageStatuses[value].tone;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                    active ? "bg-fg text-canvas" : "text-soft hover:text-fg"
                  )}
                >
                  {tone && <span className={cn("h-1.5 w-1.5 rounded-full", toneClasses[tone].dot)} />}
                  {label}
                  <span className={cn("text-xs", active ? "text-canvas/60" : "text-faint")}>{counts[value] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="relative block xl:w-80">
          <span className="sr-only">Szukaj zgłoszeń</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj: imię, e-mail, firma…"
            className="admin-field rounded-full pl-11"
          />
        </label>
      </div>

      {/* LISTA */}
      {loading && messages.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24 rounded-3xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Inbox size={20} />}
            title={messages.length === 0 ? "Brak zgłoszeń" : "Nic nie pasuje"}
            text={messages.length === 0 ? "Nowe wiadomości z formularza pojawią się tutaj." : "Zmień filtr albo wyszukiwaną frazę."}
          />
        </Panel>
      ) : (
        <ul className="space-y-3">
          {visible.map((message, index) => (
            <MessageCard
              key={message.id}
              index={index}
              message={message}
              employees={employees}
              onUpdate={updateMessage}
              onDelete={deleteMessage}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
