"use client";

import { motion } from "framer-motion";
import { Check, Copy, Search, Shield, Trash2, UserPlus, Users } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { labelFor, optionsFor, permissionGroups, roles, timeAgo } from "../labels";
import type { Employee } from "../types";
import { Avatar, Badge, Button, EmptyState, fetchList, IconButton, PageHeader, Panel, SelectField, Skeleton } from "../ui";

export function EmployeesView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [discordId, setDiscordId] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setEmployees(await fetchList<Employee>("/api/admin/employees"));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addEmployee(event: FormEvent) {
    event.preventDefault();
    const id = discordId.trim();
    if (!id) return;

    setAdding(true);
    setError("");

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Nie udało się dodać pracownika.");
        return;
      }

      setDiscordId("");
      load();
    } finally {
      setAdding(false);
    }
  }

  async function update(id: string, data: Partial<Pick<Employee, "role" | "permissions">>) {
    // Od razu na ekranie, potem zapis na serwerze.
    setEmployees((previous) => previous.map((employee) => (employee.id === id ? { ...employee, ...data } : employee)));

    const res = await fetch(`/api/admin/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      alert(body?.error || "Nie udało się zapisać zmian");
    }

    load();
  }

  async function remove(employee: Employee) {
    const name = employee.globalName || employee.username;
    if (!window.confirm(`Usunąć ${name} z zespołu? Ta osoba straci dostęp do panelu.`)) return;

    const res = await fetch(`/api/admin/employees/${employee.id}`, { method: "DELETE" });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      alert(body?.error || "Nie udało się usunąć pracownika");
    }

    load();
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return employees;
    return employees.filter((employee) =>
      [employee.username, employee.globalName, employee.discordId].filter(Boolean).some((value) => value!.toLowerCase().includes(needle))
    );
  }, [employees, query]);

  return (
    <div className="space-y-7">
      <PageHeader
        kicker="Zespół"
        title="*Pracownicy*"
        description="Dodawaj osoby po Discord ID, nadawaj role i decyduj, do czego mają dostęp."
      />

      {/* DODAWANIE */}
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
              <UserPlus size={21} strokeWidth={1.9} />
            </span>
            <div>
              <h2 className="font-semibold">Dodaj pracownika</h2>
              <p className="mt-0.5 text-sm text-soft">
                Discord → Ustawienia → Zaawansowane → Tryb dewelopera, potem PPM na osobie → „Kopiuj ID”.
              </p>
            </div>
          </div>

          <form onSubmit={addEmployee} className="flex w-full gap-2 lg:max-w-md">
            <input
              value={discordId}
              onChange={(event) => setDiscordId(event.target.value)}
              placeholder="Discord ID, np. 123456789012345678"
              inputMode="numeric"
              disabled={adding}
              className="admin-field rounded-full"
            />
            <Button type="submit" variant="primary" disabled={adding || !discordId.trim()} className="h-[46px] shrink-0">
              {adding ? "Dodawanie…" : "Dodaj"}
            </Button>
          </form>
        </div>

        {error && <p className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p>}
      </Panel>

      {/* LISTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-soft">
          {loading ? "Wczytywanie…" : `${employees.length} ${employees.length === 1 ? "osoba" : employees.length < 5 && employees.length > 1 ? "osoby" : "osób"} w zespole`}
        </p>
        <label className="relative block sm:w-72">
          <span className="sr-only">Szukaj pracownika</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj osoby…"
            className="admin-field rounded-full pl-11"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((item) => (
            <Skeleton key={item} className="h-72 rounded-3xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyState icon={<Users size={20} />} title={employees.length ? "Nikt nie pasuje" : "Brak pracowników"} text="Dodaj pierwszą osobę po Discord ID." />
        </Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((employee, index) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              index={index}
              onUpdate={(data) => update(employee.id, data)}
              onRemove={() => remove(employee)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeeCard({
  employee,
  index,
  onUpdate,
  onRemove,
}: {
  employee: Employee;
  index: number;
  onUpdate: (data: Partial<Pick<Employee, "role" | "permissions">>) => void;
  onRemove: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const name = employee.globalName || employee.username;
  const role = labelFor(roles, employee.role);
  const isAdmin = employee.role === "ADMIN";
  const granted = employee.permissions || [];

  const togglePermission = (value: string) => {
    const next = granted.includes(value) ? granted.filter((item) => item !== value) : [...granted, value];
    onUpdate({ permissions: next });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="surface flex flex-col p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <Avatar src={employee.avatar} name={name} size={56} className="rounded-2xl" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight">{name}</h3>
            <Badge tone={role.tone} dot>
              {role.label}
            </Badge>
          </div>
          {employee.globalName && <p className="truncate text-sm text-soft">@{employee.username}</p>}

          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(employee.discordId);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              } catch {}
            }}
            className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs text-faint transition hover:text-fg"
            title="Kopiuj Discord ID"
          >
            {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} />}
            {employee.discordId}
          </button>
        </div>

        <IconButton label={`Usuń ${name}`} onClick={onRemove} className="hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500">
          <Trash2 size={17} />
        </IconButton>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-soft">
          <Shield size={15} />
          Rola
        </span>
        <SelectField
          value={employee.role}
          onChange={(value) => onUpdate({ role: value as Employee["role"] })}
          options={optionsFor(roles)}
          ariaLabel={`Rola: ${name}`}
        />
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Uprawnienia</p>
          {isAdmin && <span className="text-xs text-soft">Administrator ma pełny dostęp</span>}
        </div>

        <div className="mt-4 space-y-3">
          {permissionGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="w-24 shrink-0 text-sm text-soft">{group.title}</span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((permission) => {
                  const active = isAdmin || granted.includes(permission.value);

                  return (
                    <button
                      key={permission.value}
                      type="button"
                      disabled={isAdmin}
                      aria-pressed={active}
                      onClick={() => togglePermission(permission.value)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition disabled:cursor-default",
                        active
                          ? "border-brand/40 bg-brand/15 text-fg"
                          : "border-line-strong bg-ink/[0.02] text-soft hover:border-ink/25 hover:text-fg"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-4 w-4 place-items-center rounded-[5px] border transition",
                          active ? "border-brand bg-brand text-white" : "border-line-strong"
                        )}
                      >
                        {active && <Check size={11} strokeWidth={3} />}
                      </span>
                      {permission.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(employee.lastLogin || employee.lastActive) && (
        <p className="mt-5 text-xs text-faint">Ostatnio w panelu: {timeAgo(employee.lastLogin || employee.lastActive)}</p>
      )}
    </motion.article>
  );
}
