"use client";


import {
    LayoutDashboard,
    MessageSquare,
    Users,
} from "lucide-react";


import {
    SidebarHeader
} from "./sidebar-header";


import {
    SidebarStatus
} from "./siderbar-status";


import {
    SidebarUser
} from "./sidebar-user";


import type {
    AdminTab
} from "./types";






type Employee = {

    role:string;

    permissions:string[];

};






type Props = {


    user:{

        name?:string|null;

        image?:string|null;

        role?:string;

    };


    employee?:Employee|null;



    activeTab:AdminTab;



    setTab:
    (
        tab:AdminTab
    )=>void;


};








export function Sidebar({

    user,

    employee,

    activeTab,

    setTab


}:Props){






function can(
    permission:string
){


    if(!employee){

        return false;

    }



    if(employee.role === "ADMIN"){

        return true;

    }



    return (
        employee.permissions || []
    )
    .includes(
        permission
    );


}









const links = [
    {
        name:"Dashboard",
        icon:LayoutDashboard,
        tab:"dashboard",
        show:true
    },
    {
        name:"Zgłoszenia",
        icon:MessageSquare,
        tab:"messages",
        show:
        can(
            "messages.view"
        )
    },

    {
        name:"Pracownicy",
        icon:Users,
        tab:"employees",
        show:
        can(
            "employees.view"
        )
    },
    ] as const;









return (


<aside className="
flex
h-screen
w-72
flex-col
bg-white
">





<SidebarHeader />





<SidebarStatus />









<nav className="
mt-6
flex-1
space-y-1
px-4
">







{

links

.filter(
link=>link.show
)

.map(
(link)=>{


const Icon =
link.icon;




return (



<button


key={
link.tab
}



onClick={()=>


setTab(
link.tab
)


}



className={`

flex
w-full
items-center
gap-3
rounded-xl
px-4
py-3
text-sm
font-medium
transition-all


${
activeTab === link.tab

?

"bg-black text-white shadow-md"

:

"text-gray-600 hover:bg-gray-100 hover:text-black"

}

`}



>



<Icon

size={20}

/>




<span>

{
link.name
}

</span>



</button>


);


}

)

}



</nav>










<SidebarUser

user={
user
}

/>








</aside>



);


}