import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
export const isAdmin = (id?: string) => (process.env.ADMIN_IDS || "").split(",").map(x=>x.trim()).filter(Boolean).includes(id || "");
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [Discord], callbacks: { authorized: async ({auth}) => !!auth?.user && isAdmin(auth.user.id), jwt: async ({token, profile}) => { if(profile) token.id = profile.id; return token; }, session: async ({session,token}) => { session.user.id = String(token.id || ""); return session; } }, pages: { signIn: "/admin" } });
