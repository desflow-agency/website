"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode, useEffect } from "react";

import { Accent } from "@/components/public-site/rich-text";
import { cn } from "@/lib/utils";

import { type Tone, toneClasses } from "./labels";

// Wspólne klocki panelu admina — w stylu strony publicznej (te same tokeny kolorów i motywy).

export const DISCORD_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
          <Accent text={title} />
        </h1>
        {description && <p className="mt-3 max-w-xl text-[15px] leading-7 text-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.header>
  );
}

export function Panel({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("surface rounded-3xl", className)}
    >
      {children}
    </motion.section>
  );
}

export function PanelTitle({ icon, title, action }: { icon?: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
      <h2 className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
        {icon && <span className="text-brand">{icon}</span>}
        {title}
      </h2>
      {action}
    </div>
  );
}

type ButtonVariant = "primary" | "ghost" | "danger" | "subtle";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-fg text-canvas hover:shadow-[0_8px_30px_rgba(139,140,255,0.35)] hover:-translate-y-px",
  ghost: "border border-line-strong bg-ink/[0.03] text-fg hover:border-ink/25 hover:bg-ink/[0.07]",
  subtle: "text-soft hover:bg-ink/[0.06] hover:text-fg",
  danger: "border border-rose-500/25 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15",
};

export function Button({
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-45",
        size === "sm" && "h-9 px-3.5 text-[13px]",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-[15px]",
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-line-strong bg-ink/[0.03] text-soft transition hover:bg-ink/[0.08] hover:text-fg disabled:pointer-events-none disabled:opacity-45",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ tone = "neutral", children, dot = false, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone].badge,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", toneClasses[tone].dot)} />}
      {children}
    </span>
  );
}

export function Avatar({ src, name, size = 40, className }: { src?: string | null; name?: string | null; size?: number; className?: string }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-linear-to-br from-brand/30 to-mint/20 font-semibold text-fg ring-1 ring-line-strong",
          className
        )}
      >
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- awatary z Discorda, różne rozmiary
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-line-strong", className)}
    />
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  className,
  disabled,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      className={cn("admin-field", className)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">{icon}</span>
      <p className="mt-4 font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-xs text-sm text-soft">{text}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-ink/[0.06]", className)} />;
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
}

// Okno na środku ekranu (na telefonie wysuwane od dołu).
export function Modal({
  open,
  onClose,
  title,
  kicker,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  useEscape(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Zamknij"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="admin-scroll relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] border border-line-strong bg-panel p-6 shadow-float sm:max-w-lg sm:rounded-[28px] sm:p-7"
          >
            <DialogHeader kicker={kicker} title={title} onClose={onClose} />
            <div className="mt-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Panel wysuwany z prawej strony.
export function Drawer({
  open,
  onClose,
  title,
  kicker,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEscape(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <motion.button
            type="button"
            aria-label="Zamknij"
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-line-strong bg-panel shadow-float"
          >
            <div className="border-b border-line p-6">
              <DialogHeader kicker={kicker} title={title} onClose={onClose} />
            </div>
            <div className="admin-scroll flex-1 overflow-y-auto p-6">{children}</div>
            {footer && <div className="border-t border-line p-6">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function DialogHeader({ kicker, title, onClose }: { kicker?: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className={cn("text-2xl font-semibold tracking-[-0.03em]", kicker && "mt-3")}>{title}</h2>
      </div>
      <IconButton label="Zamknij" onClick={onClose}>
        <X size={18} />
      </IconButton>
    </div>
  );
}

// Pobieranie JSON z API panelu: błąd uprawnień / serwera nie wywraca widoku.
export async function fetchList<T>(url: string): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
