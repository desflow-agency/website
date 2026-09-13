// Warstwa tylko po to, żeby not-found.tsx nie leżał przy głównym layoucie z dynamicznym [locale]
// (Next.js nie renderuje wtedy własnej strony 404 po stronie serwera).
export default function FallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
