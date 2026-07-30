import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


const filePath = path.join(
  process.cwd(),
  "data",
  "messages.json"
);



function ensureFile(){

  if(!fs.existsSync(filePath)){

    fs.mkdirSync(
      path.dirname(filePath),
      {
        recursive:true
      }
    );


    fs.writeFileSync(
      filePath,
      "[]"
    );

  }

}




function getMessages(){

  ensureFile();


  const file =
    fs.readFileSync(
      filePath,
      "utf-8"
    );


  return JSON.parse(file);

}




// POBIERANIE ZGŁOSZEŃ

export async function GET(){

  try{


    const messages =
      getMessages();



    return NextResponse.json(
      messages
    );


  }catch(error){


    console.error(
      "GET MESSAGES ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:"Nie udało się pobrać zgłoszeń"
      },
      {
        status:500
      }
    );


  }

}
