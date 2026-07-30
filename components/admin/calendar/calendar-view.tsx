"use client";

import {
    useEffect,
    useState
} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
    CalendarDays,
    Plus,
    X,
    Clock,
    AlertTriangle,
    User,
    Trash2,
    Save,
    ChevronLeft,
    ChevronRight
} from "lucide-react";


type Employee = {

    id:string;

    username:string;

    globalName?:string | null;

    avatar?:string | null;

};



type CalendarEvent = {

    id:string;

    title:string;

    description?:string | null;

    start:string;

    end?:string | null;

    status:string;

    priority:string;

    employee?:Employee | null;

};





export function CalendarView(){


const [events,setEvents] =
useState<CalendarEvent[]>([]);



const [employees,setEmployees] =
useState<Employee[]>([]);



const [selected,setSelected] =
useState<CalendarEvent | null>(null);



const [openCreate,setOpenCreate] =
useState(false);




const [title,setTitle] =
useState("");

const [description,setDescription] =
useState("");

const [date,setDate] =
useState("");

const [employeeId,setEmployeeId] =
useState("");

const [priority,setPriority] =
useState("MEDIUM");

const [status,setStatus] =
useState("PLANNED");





const [editEmployee,setEditEmployee] =
useState("");

const [editPriority,setEditPriority] =
useState("");

const [editStatus,setEditStatus] =
useState("");





async function loadEvents(){

    const res =
    await fetch(
        "/api/admin/calendar"
    );


    const data =
    await res.json();


    setEvents(data);

}






useEffect(()=>{


    loadEvents();


    fetch(
        "/api/admin/employees"
    )
    .then(
        r=>r.json()
    )
    .then(
        setEmployees
    );


},[]);







async function createEvent(){


    if(!title || !date)
        return;



    await fetch(
        "/api/admin/calendar",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                title,

                description,

                start:date,

                employeeId:
                employeeId || null,

                priority,

                status

            })

        }
    );



    setTitle("");

    setDescription("");

    setDate("");

    setEmployeeId("");

    setPriority("MEDIUM");

    setStatus("PLANNED");

    setOpenCreate(false);



    loadEvents();

}








function openEvent(event:CalendarEvent){


    setSelected(event);



    setEditEmployee(
        event.employee?.id || ""
    );


    setEditPriority(
        event.priority
    );


    setEditStatus(
        event.status
    );


}









async function saveChanges(){


    if(!selected)
        return;



    await fetch(
        "/api/admin/calendar",
        {

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                id:selected.id,


                employeeId:
                editEmployee || null,


                priority:
                editPriority,


                status:
                editStatus

            })

        }
    );



    setSelected(null);


    loadEvents();


}







async function deleteEvent(){


    if(!selected)
        return;

    if(!confirm("Usunąć to zadanie?"))
        return;



    await fetch(
        `/api/admin/calendar?id=${selected.id}`,
        {
            method:"DELETE"
        }
    );



    setSelected(null);


    loadEvents();

}








const today =
events.filter(
e=>
e.start.startsWith(
new Date()
.toISOString()
.split("T")[0]
)
).length;





const urgent =
events.filter(
e=>
e.priority==="URGENT"
).length;









return (

<div className="space-y-6">



<div className="flex justify-between items-center">


<div>

<h1
className="
text-3xl
font-bold
flex
gap-3
items-center
"
>

<CalendarDays/>

Kalendarz projektów

</h1>


<p className="text-gray-500">

Zarządzanie zadaniami zespołu

</p>


</div>




<button

onClick={()=>setOpenCreate(true)}

className="
bg-black
text-white
rounded-xl
px-5
py-3
flex
items-center
gap-2
hover:opacity-90
transition
"

>

<Plus size={18}/>

Nowe zadanie

</button>



</div>









<div className="
grid
md:grid-cols-3
gap-4
">


<Stat

title="Wszystkie"

value={events.length}

icon={<CalendarDays/>}

/>



<Stat

title="Dzisiaj"

value={today}

icon={<Clock/>}

/>



<Stat

title="Pilne"

value={urgent}

icon={<AlertTriangle/>}

/>


</div>









<div
className="
bg-white
border
rounded-3xl
p-6
shadow-sm
"
>



<FullCalendar


plugins={[

dayGridPlugin,

interactionPlugin

]}



initialView="dayGridMonth"



height="750px"



editable={true}



dayMaxEventRows={5}



eventDisplay="block"




eventClassNames="
!rounded-xl
!border-none
!min-h-[42px]
shadow-sm
"




eventContent={(arg)=>{


const event =
events.find(
e=>e.id===arg.event.id
);



if(!event)
return null;




return (

<div
className="
flex
items-center
gap-2
px-2
py-2
w-full
overflow-hidden
"
>


{
event.employee?.avatar ?


<img

src={
event.employee.avatar
}

className="
w-7
h-7
rounded-full
object-cover
ring-2
ring-white
"

/>


:

<div
className="
w-7
h-7
rounded-full
bg-white/40
flex
items-center
justify-center
"
>

<User size={14}/>

</div>


}



<span
className="
text-xs
font-semibold
truncate
"
>

{event.title}

</span>



</div>

)


}}




events={

events.map(event=>(

{

id:event.id,

title:event.title,

start:event.start,

end:event.end || undefined,


backgroundColor:

getColor(
event.status,
event.priority
)


}

))

}




eventClick={(info)=>{


const event =
events.find(
e=>e.id===info.event.id
);



if(event)

openEvent(event);


}}







eventDrop={async(info)=>{


await fetch(

"/api/admin/calendar",

{

method:"PATCH",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

id:
info.event.id,


start:
info.event.start
?.toISOString(),


end:
info.event.end
?.toISOString() || null


})


}

);



loadEvents();


}}



/>


</div>
{/* CREATE TASK */}

{
openCreate && (

<Modal

title="Nowe zadanie"

close={()=>setOpenCreate(false)}

>


<input

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:border-black
"

placeholder="Nazwa zadania"

value={title}

onChange={
e=>setTitle(e.target.value)
}

/>




<textarea

className="
w-full
rounded-xl
border
px-4
py-3
outline-none
focus:border-black
min-h-30
"

placeholder="Opis zadania"

value={description}

onChange={
e=>setDescription(e.target.value)
}

/>





<input

type="date"

className="
w-full
rounded-xl
border
px-4
py-3
"

value={date}

onChange={
e=>setDate(e.target.value)
}

/>






<SelectBox


value={employeeId}


onChange={setEmployeeId}


options={[

{
label:"👤 Bez pracownika",
value:""
},


...employees.map(e=>({

label:
e.globalName || e.username,

value:e.id

}))


]}


/>







<SelectBox


value={priority}


onChange={setPriority}


options={[

{
label:"🟢 Niski",
value:"LOW"
},

{
label:"🟡 Normalny",
value:"MEDIUM"
},

{
label:"🟠 Wysoki",
value:"HIGH"
},

{
label:"🔴 Pilny",
value:"URGENT"
}


]}


/>






<SelectBox


value={status}


onChange={setStatus}


options={[

{
label:"📅 Zaplanowane",
value:"PLANNED"
},

{
label:"⚙️ W trakcie",
value:"IN_PROGRESS"
},

{
label:"👀 Klient",
value:"CLIENT_REVIEW"
},

{
label:"✅ Gotowe",
value:"COMPLETED"
}

]}


/>






<button

onClick={createEvent}

className="
w-full
rounded-2xl
bg-black
text-white
py-4
font-semibold
hover:opacity-90
transition
"

>

Dodaj zadanie

</button>



</Modal>


)

}









{/* EDIT DRAWER */}


{
selected && (


<div

className="
fixed
right-0
top-0
h-full
w-full
max-w-md
bg-white
shadow-2xl
z-50
p-8
overflow-y-auto
"

>



<div

className="
flex
justify-between
items-start
"

>


<div>

<p

className="
text-sm
text-gray-400
"

>

Zadanie

</p>


<h2

className="
text-2xl
font-bold
"

>

Edycja

</h2>


</div>




<button

onClick={()=>setSelected(null)}

className="
p-2
rounded-xl
hover:bg-gray-100
"

>

<X/>

</button>


</div>







<div className="
mt-8
space-y-6
">


<div>


<div

className="
flex
items-center
gap-3
"

>


{
selected.employee?.avatar && (

<img

src={
selected.employee.avatar
}

className="
w-10
h-10
rounded-full
object-cover
"

 />

)

}



<div>

<h3

className="
text-xl
font-bold
"

>

{selected.title}

</h3>


<p

className="
text-sm
text-gray-500
"

>

{
selected.description ||
"Brak opisu"
}

</p>


</div>


</div>


</div>








<div

className="
rounded-3xl
bg-gray-50
p-5
space-y-5
"

>


<div>


<p

className="
text-xs
uppercase
tracking-wide
text-gray-400
mb-2
"

>

Pracownik

</p>


<SelectBox

value={editEmployee}

onChange={setEditEmployee}

options={[

{
label:"👤 Bez pracownika",
value:""
},


...employees.map(e=>({

label:
e.globalName || e.username,

value:e.id

}))


]}


/>


</div>









<div>


<p

className="
text-xs
uppercase
tracking-wide
text-gray-400
mb-2
"

>

Status

</p>


<SelectBox

value={editStatus}

onChange={setEditStatus}

options={[

{
label:"📅 Zaplanowane",
value:"PLANNED"
},

{
label:"⚙️ W trakcie",
value:"IN_PROGRESS"
},

{
label:"👀 Klient",
value:"CLIENT_REVIEW"
},

{
label:"✅ Gotowe",
value:"COMPLETED"
},

{
label:"❌ Anulowane",
value:"CANCELLED"
}


]}


/>


</div>







<div>


<p

className="
text-xs
uppercase
tracking-wide
text-gray-400
mb-2
"

>

Priorytet

</p>



<SelectBox

value={editPriority}

onChange={setEditPriority}

options={[

{
label:"🟢 Niski",
value:"LOW"
},

{
label:"🟡 Normalny",
value:"MEDIUM"
},

{
label:"🟠 Wysoki",
value:"HIGH"
},

{
label:"🔴 Pilny",
value:"URGENT"
}


]}


/>


</div>




</div>









<button

onClick={saveChanges}

className="
mt-6
w-full
rounded-2xl
bg-black
text-white
py-4
font-semibold
flex
justify-center
items-center
gap-2
"

>

<Save size={18}/>

Zapisz zmiany

</button>








<button

onClick={deleteEvent}

className="
mt-3
w-full
rounded-2xl
bg-red-50
text-red-600
py-4
font-semibold
flex
justify-center
items-center
gap-2
hover:bg-red-100
"

>


<Trash2 size={18}/>

Usuń zadanie


</button>





</div>


</div>


)

}



</div>

);

}









function Modal({

children,

title,

close

}:any){


return (

<div

className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
z-50
"

>


<div

className="
bg-white
rounded-3xl
p-7
w-full
max-w-lg
space-y-4
shadow-2xl
"

>


<div

className="
flex
justify-between
items-center
"

>


<h2

className="
text-xl
font-bold
"

>

{title}

</h2>



<button

onClick={close}

className="
rounded-xl
p-2
hover:bg-gray-100
"

>

<X/>

</button>



</div>



{children}


</div>


</div>


)


}









function SelectBox({

value,

onChange,

options

}:{

value:string;

onChange:(v:string)=>void;

options:{
label:string;
value:string;
}[];

}){


return (

<select


value={value}


onChange={
e=>onChange(e.target.value)
}



className="
w-full
rounded-xl
border
bg-white
px-4
py-3
font-medium
outline-none
cursor-pointer
hover:border-black
transition
"

>


{

options.map(option=>(


<option

key={option.value}

value={option.value}

>

{option.label}

</option>


))


}



</select>


)


}









function Stat({

icon,

title,

value

}:any){


return (

<div

className="
bg-white
border
rounded-2xl
p-5
flex
items-center
gap-4
"

>


<div

className="
bg-gray-100
rounded-xl
p-3
"

>

{icon}

</div>



<div>


<p

className="
text-gray-500
text-sm
"

>

{title}

</p>



<h3

className="
text-3xl
font-bold
"

>

{value}

</h3>



</div>



</div>

)


}









function getColor(

status:string,

priority:string

){


if(priority==="URGENT")

return "#ef4444";



if(status==="COMPLETED")

return "#22c55e";



if(status==="IN_PROGRESS")

return "#f59e0b";



return "#6366f1";


}