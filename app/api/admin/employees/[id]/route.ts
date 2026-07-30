import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import {
  requirePermission,
  forbidden
} from "@/lib/admin-api";




// EDYCJA PRACOWNIKA

export async function PATCH(

req:Request,

context:{
  params:Promise<{
    id:string
  }>
}

){


try{


const admin =
await requirePermission(
"employees.edit"
);



if(!admin){

return forbidden();

}






const {
id
} =
await context.params;





const body =
await req.json();





const employee =
await prisma.employee.findUnique({

where:{
id
}

});





if(!employee){


return NextResponse.json(

{
error:"Nie znaleziono pracownika"
},

{
status:404
}

);


}








const updated =
await prisma.employee.update({

where:{
id
},


data:{



...(body.role && {

role:
body.role

}),





...(body.permissions && {

permissions:
body.permissions

})



}


});







return NextResponse.json(

updated

);



}
catch(error){


console.error(
"UPDATE EMPLOYEE ERROR",
error
);



return NextResponse.json(

{
error:"Błąd aktualizacji"
},

{
status:500
}

);



}



}









// USUWANIE PRACOWNIKA


export async function DELETE(

req:Request,

context:{
params:Promise<{
id:string
}>
}

){



try{


const admin =
await requirePermission(
"employees.edit"
);



if(!admin){

return forbidden();

}






const {
id
}
=
await context.params;





const employee =
await prisma.employee.findUnique({

where:{
id
}

});





if(!employee){


return NextResponse.json(

{
error:"Nie znaleziono pracownika"
},

{
status:404
}

);


}







// blokada usunięcia samego siebie

if(
employee.id === admin.id
){


return NextResponse.json(

{
error:
"Nie możesz usunąć siebie"
},

{
status:400
}

);


}








// blokada ostatniego admina


if(
employee.role === "ADMIN"
){



const admins =
await prisma.employee.count({

where:{
role:"ADMIN"
}

});




if(admins <= 1){


return NextResponse.json(

{
error:
"Nie można usunąć ostatniego administratora"
},

{
status:400
}

);


}



}








await prisma.employee.delete({

where:{
id
}

});








return NextResponse.json({

success:true

});





}
catch(error){


console.error(
"DELETE EMPLOYEE ERROR",
error
);



return NextResponse.json(

{
error:"Błąd usuwania"
},

{
status:500
}

);


}



}