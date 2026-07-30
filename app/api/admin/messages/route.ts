import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  forbidden
} from "@/lib/admin-api";




// POBIERANIE ZGŁOSZEŃ

export async function GET(){


  try{


    const employee =
    await requirePermission(
      "messages.view"
    );



    if(!employee){

      return forbidden();

    }






    let where:any = {};





    // WORKER widzi tylko swoje zgłoszenia

    if(
      employee.role === "WORKER"
    ){

      where = {

        assignedTo:
        employee.id

      };

    }








    const messages =
    await prisma.message.findMany({



      where,



      include:{



        history:{


          orderBy:{


            createdAt:"desc"


          },



          include:{


            employee:true


          }


        }



      },



      orderBy:{


        createdAt:"desc"


      }



    });







    return NextResponse.json(

      messages

    );





  }
  catch(error){



    console.error(

      "GET MESSAGES ERROR:",

      error

    );




    return NextResponse.json(

      {

        error:
        "Nie udało się pobrać zgłoszeń"

      },


      {

        status:500

      }


    );



  }



}