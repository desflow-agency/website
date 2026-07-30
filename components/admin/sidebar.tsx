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





type Props = {

    user:{
        name?:string|null;

        image?:string|null;

        role?:string;
    };


    activeTab:AdminTab;


    setTab:
    (
        tab:AdminTab
    )=>void;

};







const links = [


{
    name:"Dashboard",

    icon:LayoutDashboard,

    tab:"dashboard"

},



{
    name:"Zgłoszenia",

    icon:MessageSquare,

    tab:"messages"

},



{
    name:"Pracownicy",

    icon:Users,

    tab:"employees"

},



] as const;









export function Sidebar({

    user,

    activeTab,

    setTab

}:Props){





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

links.map(
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
duration-200


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

strokeWidth={2}

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