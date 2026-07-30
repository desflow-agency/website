import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  forbidden
} from "@/lib/admin-api";


export async function GET(){


  const employee =
    await requirePermission(
      "employees.view"
    );


  if(!employee){

    return forbidden();

  }




  const employees =
    await prisma.employee.findMany({


      where:{
        lastLogin:{
          not:null
        }
      },


      orderBy:{
        lastLogin:"desc"
      },


      take:5,


      select:{


        id:true,

        username:true,

        globalName:true,

        avatar:true,

        lastLogin:true


      }


    });



  return NextResponse.json(
    employees
  );


}