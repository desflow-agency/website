import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// Pobiera aktualnie zalogowanego pracownika

export async function getCurrentEmployee() {

  const session = await auth();


  if (!session?.user) {
    return null;
  }


  const discordId =
    session.user.id;



  let employee =
    await prisma.employee.findUnique({

      where:{
        discordId
      }

    });



  const trustedAdmins =
    process.env.ADMIN_DISCORD_IDS
      ?.split(",")
      .map(id => id.trim())
      ?? [];



  if (
    trustedAdmins.includes(discordId)
    &&
    !employee
  ) {

    employee =
      await prisma.employee.create({

        data: {

          discordId,

          username:
            session.user.name ?? "Admin",

          role:
            "ADMIN",

          permissions:
            []

        }

      });

  }



  return employee;

}




// Sprawdza czy użytkownik jest administratorem

export async function requireAdmin() {


  const employee =
    await getCurrentEmployee();



  if (!employee) {

    return null;

  }



  if (
    employee.role !== "ADMIN"
  ) {

    return null;

  }



  return employee;

}







// Sprawdza konkretne uprawnienie

export async function requirePermission(
  permission: string
) {


  const employee =
    await getCurrentEmployee();



  if (!employee) {

    return null;

  }



  // ADMIN ma wszystkie uprawnienia

  if (
    employee.role === "ADMIN"
  ) {

    return employee;

  }



  const permissions =
    employee.permissions ?? [];



  if (
    permissions.includes(permission)
  ) {

    return employee;

  }



  return null;

}







// Sprawdzenie uprawnienia dla już pobranego pracownika

export function hasPermission(
  employee: any,
  permission: string
) {


  if (!employee) {

    return false;

  }



  if (
    employee.role === "ADMIN"
  ) {

    return true;

  }



  return (
    employee.permissions ?? []
  )
  .includes(permission);

}







// Odpowiedź 403

export function forbidden() {


  return NextResponse.json(

    {
      error:
        "Brak dostępu"
    },

    {
      status: 403
    }

  );

}







// Odpowiedź 400

export function invalidRequest() {


  return NextResponse.json(

    {
      error:
        "Nieprawidłowe dane"
    },

    {
      status: 400
    }

  );

}







// Ochrona przed requestami z innych źródeł

export function isSameOrigin(
  request: Request
) {


  const origin =
    request.headers.get("origin");



  return (

    !origin ||

    origin ===
      new URL(request.url).origin

  );

}