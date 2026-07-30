import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";


const filePath = path.join(
  process.cwd(),
  "data",
  "employees.json"
);



export async function GET() {


  const session = await auth();



  console.log(
    "SESSION:",
    session
  );



  if (!session?.user?.id) {

    return NextResponse.json(
      {
        error:"Brak sesji"
      },
      {
        status:401
      }
    );

  }



  let employees:any[] = [];



  if(fs.existsSync(filePath)){

    employees =
      JSON.parse(
        fs.readFileSync(
          filePath,
          "utf-8"
        )
      );

  }




  const employee =
    employees.find(
      item =>
      item.discordId === session.user.id
    );





  return NextResponse.json({

    id:
      session.user.id,


    discordId:
      session.user.id,


    username:
      session.user.name ??
      "Discord User",


    globalName:
      session.user.name ??
      "Discord User",


    avatar:
      session.user.image ??
      "https://cdn.discordapp.com/embed/avatars/0.png",


    role:
      employee?.role ??
      "ADMIN",


    permissions:
      employee?.permissions ??
      [
        "all"
      ]


  });


}