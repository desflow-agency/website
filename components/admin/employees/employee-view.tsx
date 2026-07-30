"use client";

import {
    useEffect,
    useState
} from "react";

import {
    UserPlus,
    Trash2,
    Shield,
    Check
} from "lucide-react";



const permissions = [

    {
        label:"Podgląd zgłoszeń",
        value:"messages.view"
    },

    {
        label:"Edycja zgłoszeń",
        value:"messages.edit"
    },

    {
        label:"Usuwanie zgłoszeń",
        value:"messages.delete"
    },

    {
        label:"Podgląd pracowników",
        value:"employees.view"
    },

    {
        label:"Edycja pracowników",
        value:"employees.edit"
    }

];





export function EmployeesView(){


const [
employees,
setEmployees
]=useState<any[]>([]);



const [
discordId,
setDiscordId
]=useState("");



const [
loading,
setLoading
]=useState(false);



async function load(){


const res =
await fetch(
"/api/admin/employees"
);


const data =
await res.json();


setEmployees(
Array.isArray(data)
?
data
:
[]
);


}





useEffect(()=>{

load();

},[]);







async function addEmployee(){


if(!discordId)
return;



setLoading(true);



const res =
await fetch(
"/api/admin/employees",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
discordId
})

}

);



setLoading(false);



if(res.ok){

setDiscordId("");

load();

}


}








async function update(
id:string,
data:any
){


await fetch(
`/api/admin/employees/${id}`,
{

method:"PATCH",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

}

);


load();

}





async function remove(
id:string
){


await fetch(
`/api/admin/employees/${id}`,
{
method:"DELETE"
}
);


load();


}







return (

<div className="
space-y-8
max-w-5xl
">







<div>


<h1 className="
text-3xl
font-bold
">

Pracownicy

</h1>


<p className="
text-gray-500
mt-1
">

Zarządzaj dostępem i uprawnieniami zespołu

</p>


</div>









{/* DODAWANIE */}


<div className="
bg-white
rounded-3xl
border
p-6
shadow-sm
">


<div className="
flex
items-center
gap-3
mb-5
">


<div className="
w-10
h-10
rounded-2xl
bg-black
text-white
flex
items-center
justify-center
">


<UserPlus size={20}/>


</div>


<div>

<h3 className="
font-semibold
">

Dodaj pracownika

</h3>


<p className="
text-sm
text-gray-500
">

Podaj Discord ID użytkownika

</p>


</div>


</div>







<div className="
flex
gap-3
">


<input

value={discordId}

onChange={
e=>setDiscordId(
e.target.value
)
}


placeholder="
Discord ID np. 123456789
"


className="
flex-1
rounded-2xl
border
px-4
py-3
outline-none
focus:ring-2
focus:ring-black/10
"

/>




<button

onClick={addEmployee}

disabled={loading}

className="
rounded-2xl
bg-black
text-white
px-6
font-medium
hover:opacity-90
transition
"

>


{
loading
?
"Dodawanie..."
:
"Dodaj"
}


</button>



</div>



</div>









{/* LISTA */}


<div className="
space-y-5
">



<div className="
bg-white
rounded-2xl
border
p-5
space-y-3
">


<h3 className="font-semibold">
Dodaj pracownika
</h3>



<div className="flex gap-3">


<input

value={discordId}

onChange={
e=>setDiscordId(
e.target.value
)
}

placeholder="Discord ID"

className="
border
rounded-xl
px-4
py-2
flex-1
"

/>




<button

onClick={
async()=>{


await fetch(
"/api/admin/employees",
{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
discordId
})

}

);


setDiscordId("");

load();


}

}

className="
bg-black
text-white
rounded-xl
px-5
"

>

Dodaj


</button>



</div>


</div>

{
employees.map(
employee=>(


<div

key={
employee.id
}

className="
bg-white
rounded-3xl
border
p-6
shadow-sm
"


>





<div className="
flex
justify-between
items-start
gap-5
">






<div className="
flex
items-center
gap-4
">



<img

src={
employee.avatar ||
"/avatar.png"
}

alt="avatar"

className="
w-16
h-16
rounded-2xl
object-cover
"

/>





<div>


<h3 className="
font-semibold
text-lg
">

{
employee.globalName ||
employee.username
}

</h3>



<p className="
text-sm
text-gray-500
">

Discord ID:

{
employee.discordId
}

</p>



</div>




</div>







<button

onClick={
()=>remove(
employee.id
)
}

className="
w-10
h-10
rounded-xl
bg-red-50
text-red-500
flex
items-center
justify-center
hover:bg-red-100
"

>

<Trash2 size={18}/>


</button>




</div>









<div className="
mt-6
flex
items-center
gap-3
">


<div className="
flex
items-center
gap-2
text-sm
font-medium
">


<Shield size={16}/>

Rola


</div>



<span
className={`
px-3
py-1
rounded-full
text-xs
font-semibold

${
employee.role === "ADMIN"

?

"bg-red-100 text-red-700"

:

employee.role === "MANAGER"

?

"bg-blue-100 text-blue-700"

:

"bg-gray-100 text-gray-700"

}

`}
>

{employee.role}

</span>

<select

value={employee.role}

onChange={
e=>
update(
employee.id,
{
role:e.target.value
}
)
}

className="
border
rounded-xl
px-4
py-2
bg-white
font-medium
"

>


<option value="ADMIN">
ADMIN
</option>


<option value="MANAGER">
MANAGER
</option>


<option value="WORKER">
WORKER
</option>


</select>


</div>









<div className="
mt-6
grid
grid-cols-2
gap-3
">


{

permissions.map(
perm=>{


const active =
(employee.permissions || [])
.includes(
perm.value
);



return (

<button

key={
perm.value
}

onClick={()=>{


let arr =
[
...(employee.permissions || [])
];



if(active){

arr =
arr.filter(
x=>x!==perm.value
);

}
else{

arr.push(
perm.value
);

}



update(
employee.id,
{
permissions:arr
}
);


}}

className={`
flex
items-center
gap-3
rounded-2xl
border
px-4
py-3
text-sm
transition

${
active
?
"bg-black text-white border-black"
:
"bg-gray-50 hover:bg-gray-100"
}

`}


>


<div className="
w-5
h-5
rounded-md
border
flex
items-center
justify-center
">


{
active &&
<Check size={14}/>
}


</div>



{
perm.label
}


</button>


)

}

)

}



</div>









</div>



)

)

}




</div>





</div>

);

}