import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDiscordLog } from "@/lib/discord-log";

import {
  requireAdmin,
  forbidden,
  hasPermission
} from "@/lib/admin-api";

import {
  PERMISSIONS
} from "@/lib/permissions";




// PATCH - aktualizacja zgłoszenia

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id:string;
    }>;
  }
){


try{


  const employee =
    await requireAdmin();



  if(!employee){

    return forbidden();

  }




  if(
    !hasPermission(
      employee,
      PERMISSIONS.MESSAGES_EDIT
    )
  ){

    return forbidden();

  }






  const {
    id
  } =
  await context.params;





  const body =
    await req.json();






    const oldMessage =
    await prisma.message.findUnique({
    
      where:{
        id
      }
    
    });





  if(!oldMessage){


    return NextResponse.json(

      {
        error:"Nie znaleziono zgłoszenia"
      },

      {
        status:404
      }

    );


  }
  // WORKER może edytować tylko swoje zgłoszenia

if(
  employee.role === "WORKER" &&
  oldMessage.assignedTo !== employee.id
){

  return NextResponse.json(

    {
      error:
      "Nie możesz edytować tego zgłoszenia"
    },

    {
      status:403
    }

  );

}









  /*
    ZMIANA STATUSU
  */


  if(
    body.status &&
    body.status !== oldMessage.status
  ){



    await prisma.messageHistory.create({

      data:{


        messageId:id,


        employeeId:
        employee.id,



        action:
        `Zmieniono status z ${oldMessage.status} na ${body.status}`


      }

    });







    await sendDiscordLog(

      "🔄 Zmieniono status zgłoszenia",

      `
👤 Klient:
${oldMessage.name}


📧 Email:
${oldMessage.email}


👨‍💻 Wykonał:
${employee.globalName || employee.username}


📌 Poprzedni:
${oldMessage.status}


➡️ Nowy:
${body.status}
`

    );



  }









  /*
    PRZYDZIELENIE PRACOWNIKA
  */


  if(

    body.assignedTo !== undefined &&

    body.assignedTo !== oldMessage.assignedTo

  ){

    if(
      employee.role === "WORKER"
      ){
      
      return NextResponse.json(
      
      {
      error:
      "Brak uprawnień do przypisywania zgłoszeń"
      },
      
      {
      status:403
      }
      
      );
      
      }



    if(body.assignedTo){



      const assignedEmployee =
        await prisma.employee.findUnique({

          where:{
            id:body.assignedTo
          }

        });





      const employeeName =
        assignedEmployee?.globalName ||
        assignedEmployee?.username ||
        "Nieznany";







      await prisma.messageHistory.create({

        data:{


          messageId:id,


          employeeId:
          employee.id,



          action:
          `Przydzielono zgłoszenie do ${employeeName}`


        }

      });







      await sendDiscordLog(

        "👥 Przydzielono zgłoszenie",

        `
👤 Klient:
${oldMessage.name}


👨‍💻 Wykonał:
${employee.globalName || employee.username}


👥 Nowy opiekun:
${employeeName}
`

      );



    }
    else{



      await prisma.messageHistory.create({

        data:{


          messageId:id,


          employeeId:
          employee.id,



          action:
          "Usunięto przypisaną osobę"


        }

      });



    }



  }









  const updated =
    await prisma.message.update({

      where:{
        id
      },



      data:{



        ...(body.status && {

          status:
          body.status

        }),





        ...(body.assignedTo !== undefined && {

          assignedTo:
          body.assignedTo || null

        })



      },



      include:{


        history:{


          orderBy:{


            createdAt:"desc"


          },


          include:{


            employee:true


          }


        }


      }



    });







  return NextResponse.json(

    updated

  );





}
catch(error){


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












// DELETE

export async function DELETE(

req:Request,

context:{
  params:Promise<{
    id:string
  }>
}

){


try{


  const employee =
    await requireAdmin();





  if(!employee){

    return forbidden();

  }






  if(
    !hasPermission(
      employee,
      PERMISSIONS.MESSAGES_DELETE
    )
  ){

    return forbidden();

  }








  const {
    id
  } =
  await context.params;







  const message =
    await prisma.message.findUnique({

      where:{
        id
      }

    });







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









  await prisma.messageHistory.deleteMany({

    where:{
      messageId:id
    }

  });








  await prisma.message.delete({

    where:{
      id
    }

  });









  await sendDiscordLog(

    "🗑️ Usunięto zgłoszenie",

    `
👤 Klient:
${message.name}


📧 Email:
${message.email}


👨‍💻 Usunął:
${employee.globalName || employee.username}


🆔 ID:
${id}
`

  );







  return NextResponse.json({

    success:true

  });






}
catch(error){



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