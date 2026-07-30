"use client";

import { useState } from "react";

import type {
    AdminTab
} from "./types";


import { Sidebar } from "./sidebar";

import { DashboardView } from "../dashboard/dashboard-view";
import { MessagesView } from "./messages/messages-view";
import { EmployeesView } from "./employees/employee-view";

type AdminWorkspaceUser = {

    name?: string | null;

    image?: string | null;

    role?: string;

};

type Props = {

    userName?: string;

};




export function AdminWorkspace({

    user,

    userName

}: {

    user: AdminWorkspaceUser;

    userName: string;

}) {


    const [
        tab,
        setTab
    ] = useState<AdminTab>(
        "dashboard"
    );





    return (

        <div className="
      flex
      min-h-screen
      bg-[#f7f7fb]
    ">



            <Sidebar

                user={user}

                activeTab={tab}

                setTab={setTab}

            />





            <main className="
        flex-1
        p-6
      ">





                {
                    tab === "dashboard" && (

                        <DashboardView />

                    )
                }






                {
                    tab === "messages" && (

                        <MessagesView />

                    )
                }






                {
                    tab === "employees" && (

                        <EmployeesView />

                    )
                }




            </main>



        </div>

    );


}