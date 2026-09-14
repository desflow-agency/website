"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, ChevronDown, Copy, Mail, Phone, Reply, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { formatDateTime, labelFor, messageStatuses, optionsFor, roles, timeAgo, toneClasses } from "../labels";
import type { ContactMessage, Employee } from "../types";
import { Avatar, Badge, Button, Field, SelectField } from "../ui";
import { HistoryList } from "./history-list";

type Props = {
  message: ContactMessage;
  employees: Employee[];
  index: number;
  onUpdate: (id: string, data: Partial<Pick<ContactMessage, "status" | "assignedTo">>) => void;
  onDelete: (id: string) => void;
};

export function MessageCard({ message, employees, index, onUpdate, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const status = labelFor(messageStatuses, message.status);
  const assignedEmployee = employees.find((employee) => employee.id === message.assignedTo);
  const assignedName = assignedEmployee ? assignedEmployee.globalName || assignedEmployee.username : null;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(message.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      className={cn("surface relative overflow-hidden rounded-3xl transition-colors", open && "border-line-strong")}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", toneClasses[status.tone].bar)} aria-hidden="true" />

      {/* NAGŁÓWEK */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 p-4 pl-5 text-left transition hover:bg-ink/[0.02] sm:p-5 sm:pl-6"
      >
        <Avatar name={message.name} size={44} className="hidden sm:grid" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="truncate text-[15px] font-semibold">{message.name}</h3>
            {message.company && (
              <span className="inline-flex items-center gap-1 truncate text-sm text-soft">
                <Building2 size={13} />
                {message.company}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-faint">{message.email}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.03] py-0.5 pl-0.5 pr-2.5 text-xs text-soft">
              {assignedEmployee ? (
                <Avatar src={assignedEmployee.avatar} name={assignedName} size={18} />
              ) : (
                <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-ink/[0.06]">
                  <UserRound size={11} />
                </span>
              )}
              {assignedName || "Nieprzydzielone"}
            </span>
            <span className="text-xs text-faint" title={formatDateTime(message.createdAt)}>
              {timeAgo(message.createdAt)}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong text-soft transition-transform duration-300",
            open && "rotate-180 bg-ink/[0.06] text-fg"
          )}
        >
          <ChevronDown size={17} />
        </span>
      </button>

      {/* SZCZEGÓŁY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 border-t border-line p-4 pl-5 sm:p-6 sm:pl-6 lg:grid-cols-[1.35fr_1fr]">
              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Wiadomość</p>
                  <blockquote className="mt-3 whitespace-pre-wrap rounded-2xl border border-line bg-ink/[0.03] p-4 text-[15px] leading-7 text-fg/90">
                    {message.body}
                  </blockquote>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent("Odpowiedź od desflow")}`}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-[13px] font-semibold text-canvas transition hover:-translate-y-px"
                  >
                    <Reply size={15} />
                    Odpisz
                  </a>
                  <Button size="sm" onClick={copyEmail}>
                    {copied ? <Check size={15} className="text-mint" /> : <Copy size={15} />}
                    {copied ? "Skopiowano" : "Kopiuj e-mail"}
                  </Button>
                  {message.phone && (
                    <a
                      href={`tel:${message.phone.replace(/\s+/g, "")}`}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-ink/[0.03] px-3.5 text-[13px] font-semibold transition hover:bg-ink/[0.07]"
                    >
                      <Phone size={15} />
                      {message.phone}
                    </a>
                  )}
                  <span className="inline-flex h-9 items-center gap-2 px-1 text-[13px] text-faint">
                    <Mail size={14} />
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>

                <HistoryList history={message.history} />
              </div>

              <div className="space-y-4 rounded-2xl border border-line bg-ink/[0.02] p-4 sm:p-5 lg:self-start">
                <Field label="Status">
                  <SelectField
                    value={message.status}
                    onChange={(value) => onUpdate(message.id, { status: value as ContactMessage["status"] })}
                    options={optionsFor(messageStatuses)}
                  />
                </Field>

                <Field label="Osoba odpowiedzialna">
                  <SelectField
                    value={message.assignedTo || ""}
                    onChange={(value) => onUpdate(message.id, { assignedTo: value })}
                    options={[
                      { label: "Brak osoby", value: "" },
                      ...employees.map((employee) => ({ label: employee.globalName || employee.username, value: employee.id })),
                    ]}
                  />
                </Field>

                {assignedEmployee && (
                  <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
                    <Avatar src={assignedEmployee.avatar} name={assignedName} size={36} />
                    <div className="min-w-0 text-xs leading-5 text-soft">
                      <p className="truncate text-sm font-semibold text-fg">{assignedName}</p>
                      <p>
                        {labelFor(roles, assignedEmployee.role).label} · aktywność:{" "}
                        {assignedEmployee.lastActive ? timeAgo(assignedEmployee.lastActive) : "brak danych"}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (window.confirm("Czy na pewno chcesz usunąć zgłoszenie?")) onDelete(message.id);
                  }}
                >
                  <Trash2 size={15} />
                  Usuń zgłoszenie
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
