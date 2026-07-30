"use client";


import {
    useState
} from "react";


import {
    ChevronDown,
    ChevronUp
} from "lucide-react";


import type {
    ContactMessage,
    Employee
} from "../types";


import {
    HistoryList
} from "./history-list";



function statusStyle(status: string) {

    switch (status) {

        case "NEW":
            return "bg-green-100 text-green-700";

        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-700";

        case "WAITING":
            return "bg-yellow-100 text-yellow-700";

        case "DONE":
            return "bg-purple-100 text-purple-700";

        case "CLOSED":
            return "bg-gray-200 text-gray-700";

        default:
            return "bg-gray-100 text-gray-700";

    }

}



function statusName(status: string) {

    switch (status) {

        case "NEW":
            return "Nowe";

        case "IN_PROGRESS":
            return "W trakcie";

        case "WAITING":
            return "Oczekuje";

        case "DONE":
            return "Zakończone";

        case "CLOSED":
            return "Zamknięte";

        default:
            return status;

    }

}




type Props = {

    message: ContactMessage;

    employees: Employee[];

    onUpdate:
    (
        id:string,
        data:any
    )=>void;


    onDelete:
    (
        id:string
    )=>void;

};







export function MessageCard({

    message,

    employees,

    onUpdate,

    onDelete

}:Props){



const [open,setOpen] =
    useState(false);





const assignedEmployee =
    employees.find(
        e=>e.id === message.assignedTo
    );






return (

<div className="
rounded-2xl
border border-gray-900/15
bg-white
p-5
">





<div className="
flex
items-center
justify-between
">





<div>



<h3 className="
font-bold
">

{message.name}

</h3>





<div className="
text-sm
text-gray-500
">

{message.email}

{" • "}

{message.company || "Brak firmy"}

</div>






<div className="
mt-2
flex
gap-2
text-xs
">





<span
className={`
rounded-full
px-3
py-1
text-xs
font-semibold

${statusStyle(message.status)}
`}
>

{statusName(message.status)}

</span>







<div className="
relative
group
flex
items-center
gap-2
rounded-full
bg-gray-100
px-3
py-1
cursor-pointer
">


{

assignedEmployee

?

<>


<img

src={
assignedEmployee.avatar ||
"/avatar.png"
}

alt={
assignedEmployee.username
}

className="
h-5
w-5
rounded-full
object-cover
"

/>


<span>

{
assignedEmployee.username ||
"Nieznany"
}

</span>






<div className="
absolute
left-0
top-8
z-50
hidden
group-hover:block
w-72
rounded-2xl
border
bg-white
p-4
shadow-xl
">


<div className="
flex
items-center
gap-3
mb-4
">


<img

src={
assignedEmployee.avatar ||
"/avatar.png"
}

alt="avatar"

className="
h-12
w-12
rounded-full
object-cover
"

/>



<div>

<p className="
font-bold
text-base
">

{
assignedEmployee.username
}

</p>


<p className="
text-xs
text-gray-500
">

Discord

</p>


</div>


</div>






<div className="
space-y-2
text-sm
text-gray-600
">


<p>

<b>ID:</b>

{" "}

{
assignedEmployee.discordId ||
"Brak"
}

</p>




<p>

<b>Rola:</b>

{" "}

{
assignedEmployee.role
}

</p>




<p>

<b>Ostatnia aktywność:</b>

{" "}

{

assignedEmployee.lastActive

?

new Date(
assignedEmployee.lastActive
)
.toLocaleString(
"pl-PL"
)

:

"Brak danych"

}

</p>



</div>



</div>



</>


:

<span>
Nieprzydzielone
</span>

}



</div>






</div>



</div>







<button

onClick={()=>
setOpen(!open)
}

>

{

open

?

<ChevronUp/>

:

<ChevronDown/>

}

</button>



</div>








{

open && (


<div className="
mt-5
space-y-4
">





<div>

<p className="
font-semibold
">

Wiadomość:

</p>



<p className="
text-gray-600
">

{message.body}

</p>


</div>







<button

onClick={()=>{


const confirmDelete =
window.confirm(
"Czy na pewno chcesz usunąć zgłoszenie?"
);



if(confirmDelete){

onDelete(
message.id
);

}


}}

className="
rounded-xl
bg-red-500
cursor-pointer
hover:bg-red-600
px-4
py-2
text-white
"

>

Usuń zgłoszenie

</button>









<div className="
flex
gap-3
">





<select

value={
message.status
}

onChange={
e=>
onUpdate(
message.id,
{
status:e.target.value
}
)
}

className="
rounded-xl
border border-gray-900/15
px-3
py-2
"

>


<option value="NEW">
Nowe
</option>


<option value="IN_PROGRESS">
W trakcie
</option>


<option value="WAITING">
Oczekuje
</option>


<option value="DONE">
Zakończone
</option>


<option value="CLOSED">
Zamknięte
</option>


</select>









<select

value={
message.assignedTo || ""
}

onChange={
e=>
onUpdate(
message.id,
{
assignedTo:e.target.value
}
)
}

className="
rounded-xl
border border-gray-900/15
px-3
py-2
"

>


<option value="">
Brak osoby
</option>




{

employees.map(
employee=>(

<option

key={
employee.id
}

value={
employee.id
}

>

{
employee.username
}

</option>

)

)

}



</select>






</div>






<HistoryList

history={
message.history
}

/>






</div>


)

}



</div>


);


}