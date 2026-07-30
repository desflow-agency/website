import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  forbidden
} from "@/lib/admin-api";




// GET pracownicy

export async function GET(){


try{


const employee =
await requirePermission(
"employees.view"
);



if(!employee){

return forbidden();

}





const employees =
await prisma.employee.findMany({

orderBy:{
createdAt:"desc"
}

});




return NextResponse.json(
employees
);



}
catch(error){


console.error(
"GET EMPLOYEES ERROR",
error
);



return NextResponse.json(

{
error:"Błąd pobierania pracowników"
},

{
status:500
}

);


}



}









// POST dodawanie pracownika


export async function POST(
req:Request
){


try{


const admin =
await requirePermission(
"employees.edit"
);



if(!admin){

return forbidden();

}






const body =
await req.json();



const discordId =
body.discordId;





if(
!discordId
){

return NextResponse.json(

{
error:"Brak Discord ID"
},

{
status:400
}

);

}








// pobranie użytkownika Discord


const discordResponse =
await fetch(

`https://discord.com/api/v10/users/${discordId}`,

{

headers:{

Authorization:

`Bot ${process.env.DISCORD_BOT_TOKEN}`

}

}

);





if(
!discordResponse.ok
){

return NextResponse.json(

{
error:
"Nie znaleziono użytkownika Discord"
},

{
status:404
}

);

}






const discordUser =
await discordResponse.json();






const avatar =
discordUser.avatar

?

`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`

:

`https://cdn.discordapp.com/embed/avatars/0.png`;









const employee =
await prisma.employee.create({

data:{


discordId:


discordUser.id,



username:

discordUser.username,



globalName:

discordUser.global_name || null,



avatar,



role:

"WORKER",



permissions:[

"messages.view"

]


}


});







return NextResponse.json(

employee

);





}
catch(error){


console.error(
"CREATE EMPLOYEE ERROR",
error
);



return NextResponse.json(

{
error:"Nie udało się dodać pracownika"
},

{
status:500
}

);



}



}