"use client";

import type { EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Clock3, Loader, Plus, Save, Trash2 } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { eventPriorities, eventStatuses, formatDateTime, labelFor, optionsFor, toneClasses } from "../labels";
import { Avatar, Badge, Button, Drawer, Field, fetchList, IconButton, Modal, PageHeader, Panel, SelectField } from "../ui";

type Employee = {
  id: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
};

type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  start: string;
  end?: string | null;
  status: string;
  priority: string;
  employee?: Employee | null;
};

const emptyForm = { title: "", description: "", date: "", employeeId: "", priority: "MEDIUM", status: "PLANNED" };

// Statusy dostępne przy tworzeniu (anulowanie dopiero przy edycji).
const createStatuses = optionsFor(eventStatuses).filter((option) => option.value !== "CANCELLED");

function isSameDay(value: string, day: Date) {
  const date = new Date(value);
  return date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth() && date.getDate() === day.getDate();
}

async function send(method: "POST" | "PATCH" | "DELETE", body?: unknown, query = "") {
  const res = await fetch(`/api/admin/calendar${query}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    alert(data?.error || (res.status === 403 ? "Brak uprawnień do edycji kalendarza" : "Coś poszło nie tak"));
  }

  return res.ok;
}

export function CalendarView() {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewTitle, setViewTitle] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [edit, setEdit] = useState({ employeeId: "", priority: "", status: "" });

  const loadEvents = useCallback(async () => {
    setEvents(await fetchList<CalendarEvent>("/api/admin/calendar"));
  }, []);

  useEffect(() => {
    loadEvents();
    fetchList<Employee>("/api/admin/employees").then(setEmployees);
  }, [loadEvents]);

  const employeeOptions = useMemo(
    () => [{ label: "Bez pracownika", value: "" }, ...employees.map((employee) => ({ label: employee.globalName || employee.username, value: employee.id }))],
    [employees]
  );

  const openNew = (date = "") => {
    setForm({ ...emptyForm, date });
    setOpenCreate(true);
  };

  async function createEvent(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.date) return;

    setSaving(true);
    const ok = await send("POST", {
      title: form.title.trim(),
      description: form.description,
      start: form.date,
      employeeId: form.employeeId || null,
      priority: form.priority,
      status: form.status,
    });
    setSaving(false);

    if (!ok) return;
    setOpenCreate(false);
    setForm(emptyForm);
    loadEvents();
  }

  function openEvent(event: CalendarEvent) {
    setSelected(event);
    setEdit({ employeeId: event.employee?.id || "", priority: event.priority, status: event.status });
  }

  async function saveChanges() {
    if (!selected) return;

    setSaving(true);
    const ok = await send("PATCH", {
      id: selected.id,
      employeeId: edit.employeeId || null,
      priority: edit.priority,
      status: edit.status,
    });
    setSaving(false);

    if (!ok) return;
    setSelected(null);
    loadEvents();
  }

  async function deleteEvent() {
    if (!selected || !window.confirm("Usunąć to zadanie?")) return;

    if (await send("DELETE", undefined, `?id=${selected.id}`)) {
      setSelected(null);
      loadEvents();
    }
  }

  const today = new Date();
  const stats = [
    { label: "Wszystkie zadania", value: events.length, icon: CalendarDays, tone: "brand" as const },
    { label: "Na dziś", value: events.filter((event) => isSameDay(event.start, today)).length, icon: Clock3, tone: "sky" as const },
    { label: "W trakcie", value: events.filter((event) => event.status === "IN_PROGRESS").length, icon: Loader, tone: "amber" as const },
    { label: "Pilne", value: events.filter((event) => event.priority === "URGENT").length, icon: AlertTriangle, tone: "rose" as const },
  ];

  const api = () => calendarRef.current?.getApi();

  const renderEvent = (arg: EventContentArg) => {
    const event = events.find((item) => item.id === arg.event.id);
    if (!event) return null;

    const priority = labelFor(eventPriorities, event.priority);
    const status = labelFor(eventStatuses, event.status);
    const done = event.status === "COMPLETED" || event.status === "CANCELLED";

    return (
      <div
        className={cn(
          "flex w-full items-center gap-1.5 overflow-hidden rounded-[10px] border border-line bg-raised px-1.5 py-1 text-fg shadow-sm transition hover:border-line-strong sm:gap-2 sm:px-2 sm:py-1.5",
          done && "opacity-55"
        )}
        title={`${event.title} · ${status.label} · ${priority.label}`}
      >
        <span className={cn("h-5 w-1 shrink-0 rounded-full", toneClasses[priority.tone].bar)} />
        {event.employee && <Avatar src={event.employee.avatar} name={event.employee.globalName || event.employee.username} size={18} className="hidden sm:grid" />}
        <span className={cn("truncate text-[11px] font-semibold sm:text-xs", done && "line-through")}>{event.title}</span>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      <PageHeader
        kicker="Planowanie"
        title="Kalendarz *projektów*"
        description="Zadania zespołu w jednym miejscu. Przeciągnij zadanie, żeby zmienić termin, albo kliknij dzień, żeby dodać nowe."
        actions={
          <Button variant="primary" onClick={() => openNew()}>
            <Plus size={17} />
            Nowe zadanie
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }, index) => (
          <Panel key={label} delay={index * 0.05} className="flex items-center gap-4 p-4 sm:p-5">
            <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneClasses[tone].soft)}>
              <Icon size={19} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl">{value}</p>
              <p className="mt-1.5 truncate text-xs text-soft sm:text-sm">{label}</p>
            </div>
          </Panel>
        ))}
      </div>

      <Panel delay={0.15} className="admin-calendar p-3 sm:p-6">
        {/* PASEK NAWIGACJI */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-0">
          <h2 className="text-xl font-semibold capitalize tracking-[-0.03em] sm:text-2xl">{viewTitle}</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => api()?.today()}>
              Dziś
            </Button>
            <IconButton label="Poprzedni miesiąc" onClick={() => api()?.prev()} className="rounded-full">
              <ChevronLeft size={18} />
            </IconButton>
            <IconButton label="Następny miesiąc" onClick={() => api()?.next()} className="rounded-full">
              <ChevronRight size={18} />
            </IconButton>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pl"
          firstDay={1}
          headerToolbar={false}
          height="auto"
          fixedWeekCount={false}
          editable
          dayMaxEventRows={3}
          moreLinkText={(count) => `+${count} więcej`}
          eventDisplay="block"
          datesSet={(info) => setViewTitle(info.view.title)}
          events={events.map((event) => ({ id: event.id, title: event.title, start: event.start, end: event.end || undefined }))}
          eventContent={renderEvent}
          eventClick={(info) => {
            const event = events.find((item) => item.id === info.event.id);
            if (event) openEvent(event);
          }}
          dateClick={(info) => openNew(info.dateStr)}
          eventDrop={async (info) => {
            const ok = await send("PATCH", {
              id: info.event.id,
              start: info.event.start?.toISOString(),
              end: info.event.end?.toISOString() || null,
            });
            if (!ok) info.revert();
            loadEvents();
          }}
        />

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-1 pt-4 text-xs text-soft sm:px-0">
          <span className="text-faint">Priorytet:</span>
          {Object.values(eventPriorities).map(({ label, tone }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <span className={cn("h-3 w-1 rounded-full", toneClasses[tone].bar)} />
              {label}
            </span>
          ))}
        </div>
      </Panel>

      {/* NOWE ZADANIE */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} kicker="Kalendarz" title="Nowe zadanie">
        <form onSubmit={createEvent} className="space-y-4">
          <Field label="Nazwa zadania">
            <input
              autoFocus
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="np. Rolka dla AdviceBot"
              className="admin-field"
            />
          </Field>

          <Field label="Opis">
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Szczegóły, linki, uwagi…"
              className="admin-field"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Termin">
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="admin-field"
              />
            </Field>
            <Field label="Pracownik">
              <SelectField value={form.employeeId} onChange={(employeeId) => setForm({ ...form, employeeId })} options={employeeOptions} />
            </Field>
            <Field label="Priorytet">
              <SelectField value={form.priority} onChange={(priority) => setForm({ ...form, priority })} options={optionsFor(eventPriorities)} />
            </Field>
            <Field label="Status">
              <SelectField value={form.status} onChange={(status) => setForm({ ...form, status })} options={createStatuses} />
            </Field>
          </div>

          <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={saving || !form.title.trim() || !form.date}>
            <Plus size={17} />
            {saving ? "Dodawanie…" : "Dodaj zadanie"}
          </Button>
        </form>
      </Modal>

      {/* EDYCJA */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        kicker="Zadanie"
        title={selected?.title || ""}
        footer={
          <div className="flex gap-2">
            <Button variant="danger" onClick={deleteEvent} className="shrink-0">
              <Trash2 size={16} />
              Usuń
            </Button>
            <Button variant="primary" onClick={saveChanges} disabled={saving} className="flex-1">
              <Save size={16} />
              {saving ? "Zapisywanie…" : "Zapisz zmiany"}
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge tone={labelFor(eventStatuses, selected.status).tone} dot>
                {labelFor(eventStatuses, selected.status).label}
              </Badge>
              <Badge tone={labelFor(eventPriorities, selected.priority).tone}>
                Priorytet: {labelFor(eventPriorities, selected.priority).label}
              </Badge>
            </div>

            <div className="rounded-2xl border border-line bg-ink/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Opis</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-soft">{selected.description || "Brak opisu"}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-faint">
                <CalendarDays size={13} />
                {formatDateTime(selected.start)}
                {selected.end && ` → ${formatDateTime(selected.end)}`}
              </p>
            </div>

            {selected.employee && (
              <div className="flex items-center gap-3">
                <Avatar src={selected.employee.avatar} name={selected.employee.globalName || selected.employee.username} size={36} />
                <p className="text-sm">
                  <span className="text-faint">Przypisane do </span>
                  <span className="font-semibold">{selected.employee.globalName || selected.employee.username}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Field label="Pracownik">
                <SelectField value={edit.employeeId} onChange={(employeeId) => setEdit({ ...edit, employeeId })} options={employeeOptions} />
              </Field>
              <Field label="Status">
                <SelectField value={edit.status} onChange={(status) => setEdit({ ...edit, status })} options={optionsFor(eventStatuses)} />
              </Field>
              <Field label="Priorytet">
                <SelectField value={edit.priority} onChange={(priority) => setEdit({ ...edit, priority })} options={optionsFor(eventPriorities)} />
              </Field>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
