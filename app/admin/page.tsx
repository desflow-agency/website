import { AdminWorkspace } from "@/components/admin-workspace";
import { auth, isAdmin, signIn } from "@/lib/auth";

async function loginWithDiscord() {
  "use server";
  await signIn("discord", { redirectTo: "/admin" });
}

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <section className="card max-w-md p-9 text-center">
          <p className="eyebrow">Panel administracyjny</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Witaj ponownie.</h1>
          <p className="mt-3 text-[#686b7d]">
            Dostęp mają wyłącznie konta Discord wskazane w zmiennej ADMIN_IDS.
          </p>
          <form action={loginWithDiscord}>
            <button className="btn btn-primary mt-7 w-full justify-center" type="submit">
              Zaloguj przez Discord
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!isAdmin(session.user.id)) {
    return <main className="grid min-h-screen place-items-center p-6"><p className="card p-7 font-semibold">403 — Access Denied</p></main>;
  }

  return <AdminWorkspace userName={session.user.name?.split(" ")[0] || "Admin"} />;
}
