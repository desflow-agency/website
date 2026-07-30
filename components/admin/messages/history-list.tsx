"use client";

import type {
  MessageHistory
} from "../types";


export function HistoryList({

history

}:{

history:MessageHistory[];

}){


return (

<div>


<h4 className="
font-semibold
mb-3
">

Historia zmian

</h4>



<div className="
space-y-3
">


{
history.map((item)=>(


<div

key={item.id}

className="
rounded-xl
bg-gray-50
p-3
"


>


<p className="
text-sm
font-medium
">

{item.action}

</p>



{
item.employee && (

<div className="
flex
items-center
gap-2
mt-3
">


<img
  src={
    item.employee.avatar ||
    "/default-avatar.png"
  }
  className="
  w-7
  h-7
  rounded-full
  "
/>



<div>

<p className="
text-xs
font-medium
">

{item.employee.globalName ||
item.employee.username}

</p>


<p className="
text-xs
text-gray-400
">

Wykonano akcję

</p>


</div>


</div>

)

}



<p className="
text-xs
text-gray-400
mt-2
">


{
new Date(
item.createdAt
)
.toLocaleString(
"pl-PL"
)
}


</p>



</div>


))

}



</div>


</div>


);


}