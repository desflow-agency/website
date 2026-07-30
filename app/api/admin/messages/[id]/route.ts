import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { sendDiscordLog } from "@/lib/discord-log";



const filePath = path.join(
  process.cwd(),
  "data",
  "messages.json"
);



const employeesPath = path.join(
  process.cwd(),
  "data",
  "employees.json"
);





function getMessages(){


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



  const file =
    fs.readFileSync(
      filePath,
      "utf-8"
    );


  return JSON.parse(file);


}






function saveMessages(
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







function getEmployee(
  id:string
){


  if(
    !fs.existsSync(employeesPath)
  ){

    return null;

  }



  const employees =
    JSON.parse(
      fs.readFileSync(
        employeesPath,
        "utf-8"
      )
    );



  return employees.find(
    (employee:any)=>
      employee.id === id
  );


}








// PATCH - aktualizacja zgłoszenia

export async function PATCH(
  req:Request,
  context:{
    params:Promise<{
      id:string
    }>
  }
){


try{


const {
  id
} =
await context.params;



const body =
await req.json();



const messages =
getMessages();




const index =
messages.findIndex(
(message:any)=>
  message.id === id
);




if(index === -1){


return NextResponse.json(
{
 error:"Nie znaleziono zgłoszenia"
},
{
 status:404
}
);


}





const old =
messages[index];


const history =
old.history || [];






if(
body.status &&
body.status !== old.status
){


history.push({

id:
randomUUID(),

action:
`Zmieniono status z ${old.status} na ${body.status}`,

date:
new Date().toISOString()

});



await sendDiscordLog(

"🔄 Zmieniono status zgłoszenia",

`
👤 Klient:
${old.name}

📧 Email:
${old.email}

📌 Poprzedni:
${old.status}

➡️ Nowy:
${body.status}
`

);


}







if(
body.assignedTo !== undefined &&
body.assignedTo !== old.assignedTo
){



if(body.assignedTo){



const employee =
getEmployee(
  body.assignedTo
);



const employeeName =
employee?.globalName ||
employee?.username ||
employee?.name ||
body.assignedTo;





history.push({

id:
randomUUID(),

action:
`Przydzielono zgłoszenie do ${employeeName}`,

employeeId:
body.assignedTo,

date:
new Date().toISOString()

});






await sendDiscordLog(

"👥 Przydzielono zgłoszenie",

`
👤 Klient:
${old.name}

📧 Email:
${old.email}

👨‍💻 Nowy opiekun:
${employeeName}

🆔 Discord:
${employee?.discordId || "brak"}
`

);





}else{


history.push({

id:
randomUUID(),

action:
"Usunięto przypisaną osobę",

date:
new Date().toISOString()

});


}




}




const updated = {


...old,


...body,


history


};





messages[index] =
updated;



saveMessages(
messages
);





return NextResponse.json(
updated
);




}catch(error){


console.error(
"PATCH MESSAGE ERROR:",
error
);



return NextResponse.json(
{
error:"Błąd serwera"
},
{
status:500
}
);


}


}









// DELETE - usuwanie zgłoszenia

export async function DELETE(
  req:Request,
  context:{
    params:Promise<{
      id:string
    }>
  }
){


try{


const {
  id
} =
await context.params;




const messages =
getMessages();





const message =
messages.find(
(message:any)=>
  message.id === id
);





if(!message){


return NextResponse.json(
{
error:"Nie znaleziono zgłoszenia"
},
{
status:404
}
);


}






const filtered =
messages.filter(
(message:any)=>
  message.id !== id
);





saveMessages(
filtered
);







try{


await sendDiscordLog(

"🗑️ Usunięto zgłoszenie",

`
👤 Klient:
${message.name}

📧 Email:
${message.email}

🆔 ID:
${id}
`

);


}catch(error){


console.error(
"DISCORD LOG ERROR:",
error
);


}







return NextResponse.json({

success:true

});






}catch(error){


console.error(
"DELETE MESSAGE ERROR:",
error
);




return NextResponse.json(
{
error:"Nie udało się usunąć zgłoszenia"
},
{
status:500
}
);


}


}