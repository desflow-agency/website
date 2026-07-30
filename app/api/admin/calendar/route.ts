import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {

    try {

        const events =
            await prisma.calendarEvent.findMany({

                include: {
                    employee: true,
                    message: true
                },

                orderBy: {
                    createdAt: "desc"
                }

            });


        return NextResponse.json(events);


    } catch (error) {

        console.error(
            "GET CALENDAR ERROR",
            error
        );


        return NextResponse.json(
            {
                error:"Błąd pobierania"
            },
            {
                status:500
            }
        );

    }

}







export async function POST(
    req: Request
) {

    try {

        const body =
            await req.json();



        const event =
            await prisma.calendarEvent.create({

                data:{


                    title:
                        body.title,


                    description:
                        body.description || null,


                    start:
                        new Date(body.start),



                    ...(body.end
                        ? {
                            end:new Date(body.end)
                        }
                        : {}
                    ),



                    status:
                        body.status || "PLANNED",



                    priority:
                        body.priority || "MEDIUM",



                    ...(body.employeeId
                        ? {

                            employee:{
                                connect:{
                                    id:body.employeeId
                                }
                            }

                        }
                        : {}
                    ),



                    ...(body.messageId
                        ? {

                            message:{
                                connect:{
                                    id:body.messageId
                                }
                            }

                        }
                        : {}
                    )

                }

            });



        return NextResponse.json(event);



    } catch(error){


        console.error(
            "CREATE EVENT ERROR",
            error
        );


        return NextResponse.json(
            {
                error:"Nie udało się stworzyć zadania"
            },
            {
                status:500
            }
        );

    }

}









export async function PATCH(
    req:Request
){

    try {


        const body =
            await req.json();



        if(!body.id){

            return NextResponse.json(
                {
                    error:"Brak ID"
                },
                {
                    status:400
                }
            );

        }





        const updated =
            await prisma.calendarEvent.update({

                where:{
                    id:body.id
                },


                data:{



                    ...(body.status !== undefined && {

                        status:
                            body.status

                    }),





                    ...(body.priority !== undefined && {

                        priority:
                            body.priority

                    }),






                    ...(body.employeeId !== undefined && {

                        employee:

                            body.employeeId

                            ?

                            {
                                connect:{
                                    id:body.employeeId
                                }
                            }

                            :

                            {
                                disconnect:true
                            }

                    }),






                    ...(body.messageId !== undefined && {

                        message:

                            body.messageId

                            ?

                            {
                                connect:{
                                    id:body.messageId
                                }
                            }

                            :

                            {
                                disconnect:true
                            }

                    }),






                    // DRAG & DROP KALENDARZA

                    ...(body.start !== undefined && {

                        start:
                            new Date(body.start)

                    }),






                    ...(body.end !== undefined && (

                        body.end

                        ?

                        {

                            end:
                                new Date(body.end)

                        }

                        :

                        {

                            end:null

                        }

                    ))

                }

            });




        return NextResponse.json(updated);



    } catch(error){


        console.error(
            "UPDATE EVENT ERROR",
            error
        );


        return NextResponse.json(
            {
                error:"Nie udało się edytować"
            },
            {
                status:500
            }
        );


    }

}
export async function DELETE(
    req: Request
){

    try {


        const { searchParams } =
            new URL(req.url);


        const id =
            searchParams.get("id");



        if(!id){

            return NextResponse.json(
                {
                    error:"Brak ID"
                },
                {
                    status:400
                }
            );

        }



        const deleted =
            await prisma.calendarEvent.delete({

                where:{
                    id
                }

            });



        return NextResponse.json(
            deleted
        );



    } catch(error){


        console.error(
            "DELETE EVENT ERROR",
            error
        );


        return NextResponse.json(
            {
                error:"Nie udało się usunąć zadania"
            },
            {
                status:500
            }
        );


    }

}