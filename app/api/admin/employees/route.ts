import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getDiscordUser } from "@/lib/discord";



const filePath = path.join(
  process.cwd(),
  "data",
  "employees.json"
);





function getEmployees() {


  if (!fs.existsSync(filePath)) {


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



  return JSON.parse(
    fs.readFileSync(
      filePath,
      "utf-8"
    )
  );


}






function saveEmployees(
  data:any[]
){


  fs.writeFileSync(
    filePath,
    JSON.stringify(
      data,
      null,
      2
    )
  );


}









// GET - lista pracowników

export async function GET(){


  try{


    const employees =
      getEmployees();



    return NextResponse.json(
      employees
    );



  }catch(error){


    console.error(
      "EMPLOYEES GET ERROR",
      error
    );


    return NextResponse.json(
      {
        error:
        "Nie udało się pobrać pracowników"
      },
      {
        status:500
      }
    );


  }


}









// POST - dodanie pracownika

export async function POST(
 req:Request
){


try{


const body =
 await req.json();




if(
 !body.discordId ||
 !body.role
){


return NextResponse.json(
 {
  error:
  "Discord ID i rola są wymagane"
 },
 {
  status:400
 }
);


}






const employees =
 getEmployees();





const exists =
 employees.find(
  (employee:any)=>
   employee.discordId === body.discordId
 );





if(exists){


return NextResponse.json(
 {
  error:
  "Ten użytkownik już istnieje"
 },
 {
  status:409
 }
);


}







const discordUser =
 await getDiscordUser(
  body.discordId
);






const avatar =
  discordUser.avatar ||
  "https://cdn.discordapp.com/embed/avatars/0.png";









const newEmployee = {


id:
 randomUUID(),



discordId:
 discordUser.id,



username:
 discordUser.username,



globalName:
 discordUser.globalName ??
 discordUser.username,



avatar,



role:
 body.role,



permissions:
 body.permissions ?? [],



createdAt:
 new Date().toISOString()


};







employees.push(
 newEmployee
);





saveEmployees(
 employees
);






return NextResponse.json(
 newEmployee,
 {
  status:201
 }
);






}catch(error){


console.error(
 "EMPLOYEE POST ERROR",
 error
);



return NextResponse.json(
 {
  error:
  "Nie udało się dodać pracownika"
 },
 {
  status:500
 }
);



}

}









// DELETE - usuwanie pracownika

export async function DELETE(
 req:Request
){


try{


const body =
 await req.json();




const employees =
 getEmployees();




const filtered =
 employees.filter(
  (employee:any)=>
   employee.id !== body.id
 );





saveEmployees(
 filtered
);





return NextResponse.json(
 {
  success:true
 }
);





}catch(error){


console.error(
 "EMPLOYEE DELETE ERROR",
 error
);



return NextResponse.json(
 {
  error:
  "Nie udało się usunąć pracownika"
 },
 {
  status:500
 }
);



}

}