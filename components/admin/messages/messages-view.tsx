"use client";

import { useEffect, useState } from "react";

import type {
    ContactMessage,
    Employee
} from "../types";

import { MessageCard } from "./message-card";


export function MessagesView() {


    const [messages, setMessages] =
        useState<ContactMessage[]>([]);


    const [employees, setEmployees] =
        useState<Employee[]>([]);



    async function load() {


        const [
            messagesRes,
            employeesRes
        ] = await Promise.all([

            fetch("/api/admin/messages"),

            fetch("/api/admin/employees")

        ]);



        const messagesData =
            await messagesRes.json();


        const employeesData =
            await employeesRes.json();



        setMessages(
            messagesData
        );


        setEmployees(
            employeesData
        );

    }




    useEffect(() => {

        load();

    }, []);





    async function updateMessage(
        id: string,
        data: any
    ) {
    
        const res = await fetch(
            `/api/admin/messages/${id}`,
            {
                method: "PATCH",
    
                headers:{
                    "Content-Type":"application/json"
                },
    
                body: JSON.stringify(data)
            }
        );
    
    
        const updated =
            await res.json();
    
    
        console.log(
            "UPDATED MESSAGE:",
            updated
        );
    
    
        setMessages(prev =>
            prev.map(message =>
                message.id === id
                    ? updated
                    : message
            )
        );
    
    }

    async function deleteMessage(
        id: string
    ) {

        await fetch(
            `/api/admin/messages/${id}`,
            {
                method: "DELETE"
            }
        );


        load();

    }



    return (

        <div className="
      space-y-5
    ">



            <div>

                <h2 className="
          text-2xl
          font-bold
        ">

                    Zgłoszenia

                </h2>


                <p className="
          text-sm
          text-gray-500
        ">

                    Obsługa klientów

                </p>

            </div>





            <div className="
        space-y-3
        max-w-5xl
      ">


                {
                    [
                        ...messages
                    ]
                        .sort(
                            (a, b) => {

                                const order: any = {

                                    NEW: 1,

                                    IN_PROGRESS: 2,

                                    WAITING: 3,

                                    DONE: 4,

                                    CLOSED: 5

                                };


                                return (
                                    order[a.status] -
                                    order[b.status]
                                );

                            }
                        )
                        .map(
                            (message) => (

                                <MessageCard

                                    key={
                                        message.id
                                    }

                                    message={
                                        message
                                    }

                                    employees={
                                        employees
                                    }

                                    onUpdate={
                                        updateMessage
                                    }

                                    onDelete={
                                        deleteMessage
                                    }

                                />

                            )
                        )
                }


            </div>



        </div>

    );

}