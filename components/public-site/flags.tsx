// Flagi jako SVG — emoji flag nie wyświetlają się na Windowsie.

export function Flag({ code, className }: { code: "pl" | "de" | "gb"; className?: string }) {
  if (code === "pl") {
    return (
      <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
        <rect width="24" height="8" fill="#fff" />
        <rect y="8" width="24" height="8" fill="#dc143c" />
      </svg>
    );
  }

  if (code === "de") {
    return (
      <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
        <rect width="24" height="5.34" fill="#000" />
        <rect y="5.33" width="24" height="5.34" fill="#dd0000" />
        <rect y="10.66" width="24" height="5.34" fill="#ffce00" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <clipPath id="flag-gb-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#flag-gb-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#c8102e" strokeWidth="3" />
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0V40M0 20H60" stroke="#c8102e" strokeWidth="7" />
      </g>
    </svg>
  );
}
