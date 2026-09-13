import { Lock, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrowserFrame({
  address,
  children,
  className,
}: {
  address: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line-strong bg-panel shadow-frame",
        className
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-line bg-raised px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="mx-auto flex h-6 min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 rounded-md bg-ink/[0.06] px-3 font-mono text-[11px] text-soft">
          <Lock size={10} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{address}</span>
        </div>

        <RotateCw size={13} className="hidden text-faint sm:block" aria-hidden="true" />
      </div>

      <div className="relative bg-black">{children}</div>
    </div>
  );
}
