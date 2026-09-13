import { notFound } from "next/navigation";

// Każdy nieznany adres w obrębie wersji językowej → strona 404 w tym języku.
export default function CatchAll() {
  notFound();
}
