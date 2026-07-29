import { handlers } from "@/lib/auth";

// Auth.js exposes an object with GET and POST handlers; Next.js Route Handlers
// need the individual functions, not the object itself.
export const { GET, POST } = handlers;
