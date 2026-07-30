import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { auth, signIn } from "@/lib/auth";


async function loginWithDiscord() {
  "use server";

  await signIn("discord", {
    redirectTo: "/admin",
  });
}



export default async function AdminPage() {

  const session = await auth();



  if (!session) {

    return (
      <main className="grid min-h-screen place-items-center p-6">

        <section className="card max-w-md p-9 text-center">

          <p className="eyebrow">
            Panel administracyjny
          </p>


          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Witaj ponownie.
          </h1>


          <p className="mt-3 text-[#686b7d]">
            Zaloguj się przez Discord, aby wejść do panelu.
          </p>


          <form action={loginWithDiscord}>

            <button
              className="btn btn-primary mt-7 w-full justify-center"
              type="submit"
            >
              Zaloguj przez Discord
            </button>

          </form>


        </section>

      </main>
    );

  }



  return (
    <AdminWorkspace
  
      user={{
        name: session.user.name,
        image: session.user.image,
        role: "ADMIN"
      }}
  
      userName={
        session.user.name?.split(" ")[0] || "Admin"
      }
  
    />
  );

}