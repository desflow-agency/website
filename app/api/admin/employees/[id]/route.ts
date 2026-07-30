import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


const filePath = path.join(
  process.cwd(),
  "data",
  "employees.json"
);



function getEmployees(){

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
}=await context.params;



const employees =
getEmployees();



const filtered =
employees.filter(
(employee:any)=>
employee.id !== id
);



if(
filtered.length === employees.length
){

return NextResponse.json(
{
error:"Nie znaleziono pracownika"
},
{
status:404
}
);

}



saveEmployees(
filtered
);



return NextResponse.json(
{
success:true
}
);



}catch(error){


console.error(error);


return NextResponse.json(
{
error:"Nie udało się usunąć pracownika"
},
{
status:500
}
);


}

}