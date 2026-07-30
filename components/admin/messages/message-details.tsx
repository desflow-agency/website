"use client";

import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Clock,
  History,
  UserRound
} from "lucide-react";


type Props = {

  message:any;

  onClose:()=>void;

};



export function MessageDetails({
  message,
  onClose
}:Props){


console.log(
  "MESSAGE DETAILS UPDATE:",
  message
);

console.log(
    "MESSAGE HISTORY:",
    JSON.stringify(message?.history, null, 2)
  );



  function formatDate(value:any){

    console.log(
      "FORMAT DATE VALUE:",
      value
    );
  
  
    if(!value){
      return "Brak daty";
    }
  
  
    return new Date(value).toLocaleString(
      "pl-PL",
      {
        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
      }
    );
  
  }





return (

<div
className="
fixed
inset-0
z-50
bg-black/30
backdrop-blur-sm
flex
justify-end
"
>


<div
className="
h-full
w-full
max-w-xl
bg-white
shadow-2xl
p-6
overflow-y-auto
"
>



<div
className="
flex
items-center
justify-between
mb-6
"
>


<h2
className="
text-xl
font-bold
"
>
Szczegóły zgłoszenia
</h2>



<button
onClick={onClose}
className="
rounded-xl
p-2
hover:bg-gray-100
"
>

<X size={20}/>

</button>


</div>






<div className="space-y-4">






{/* KLIENT */}


<div
className="
rounded-2xl
bg-gray-50
p-5
"
>


<div
className="
flex
items-center
gap-2
font-semibold
mb-3
"
>

<User size={18}/>

Klient

</div>



<p className="font-medium">

{message.name}

</p>





<div
className="
mt-3
space-y-2
text-sm
text-gray-500
"
>



<div
className="
flex
items-center
gap-2
"
>

<Mail size={15}/>

{message.email}

</div>





{
message.phone && (

<div
className="
flex
items-center
gap-2
"
>

<Phone size={15}/>

{message.phone}

</div>

)
}







{
message.company && (

<div
className="
flex
items-center
gap-2
"
>

<Building2 size={15}/>

{message.company}

</div>

)
}



</div>


</div>









{/* WIADOMOŚĆ */}


<div
className="
rounded-2xl
border
p-5
"
>


<p
className="
font-semibold
mb-3
"
>

Wiadomość

</p>



<p
className="
leading-7
text-gray-700
"
>

{message.body}

</p>


</div>









{/* HISTORIA */}

<div
className="
rounded-2xl
border
p-5
"
>

<p
className="
font-semibold
mb-5
flex
items-center
gap-2
"
>

<History size={18}/>

Historia zmian

</p>


<div className="space-y-5">


{
message.history?.length > 0 ? (

[...message.history]
.sort(
(a:any,b:any)=>
new Date(b.createdAt).getTime() -
new Date(a.createdAt).getTime()
)
.map(
(item:any)=>{


console.log(
"HISTORY ITEM:",
item
);


return (

<div
key={item.id}
className="
border-l-2
pl-4
"
>


<p
className="
font-medium
text-sm
"
>

{item.action}

</p>



<p
className="
text-xs
text-gray-400
mt-2
flex
items-center
gap-2
"
>

<Clock size={12}/>


{
formatDate(
item.createdAt
)
}


</p>


</div>

);


}

)


)

:(

<p
className="
text-sm
text-gray-400
"
>
Brak historii zmian
</p>

)

}


</div>

</div>







{/* STATUS */}


<div
className="
rounded-2xl
bg-gray-50
p-5
"
>


<div
className="
flex
items-center
gap-2
font-semibold
mb-3
"
>

<UserRound size={18}/>

Status

</div>





<span
className="
inline-flex
rounded-full
bg-blue-100
px-3
py-1
text-sm
font-medium
text-blue-700
"
>

{message.status}

</span>



</div>







</div>



</div>



</div>


);


}