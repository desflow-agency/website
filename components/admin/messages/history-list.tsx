"use client";

import { History } from "lucide-react";

import { formatDateTime, timeAgo } from "../labels";
import type { MessageHistory } from "../types";
import { Avatar } from "../ui";

export function HistoryList({ history }: { history: MessageHistory[] }) {
  const items = [...(history || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
        <History size={13} />
        Historia zmian
      </p>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-faint">Brak historii zmian.</p>
      ) : (
        <ol className="relative mt-4 space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line-strong">
          {items.map((item, index) => (
            <li key={item.id} className="relative pl-7">
              <span
                className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-panel ${index === 0 ? "bg-brand" : "bg-line-strong"}`}
              />
              <p className="text-sm font-medium">{item.action}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-faint">
                {item.employee && (
                  <span className="inline-flex items-center gap-1.5 text-soft">
                    <Avatar src={item.employee.avatar} name={item.employee.globalName || item.employee.username} size={18} />
                    {item.employee.globalName || item.employee.username}
                  </span>
                )}
                <span title={formatDateTime(item.createdAt)}>{timeAgo(item.createdAt)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
