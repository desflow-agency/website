"use client";


import {
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  LogIn
} from "lucide-react";


import {
  useEffect,
  useState
} from "react";


import {
  useEmployees
} from "../admin/hooks/use-employees";


import {
  useMessages
} from "../admin/hooks/use-messages";





export function DashboardView(){



  const {
    employees
  } = useEmployees();





  const {
    messages
  } = useMessages();





  const [
    logins,
    setLogins
  ] = useState<any[]>([]);








  useEffect(()=>{


    fetch(
      "/api/admin/dashboard/logins"
    )
    .then(
      res=>res.json()
    )
    .then(
      data=>setLogins(data)
    );


  },[]);









  const newMessages =
    messages.filter(
      message =>
      message.status === "NEW"
    ).length;





  const inProgress =
    messages.filter(
      message =>
      message.status === "IN_PROGRESS"
    ).length;





  const completed =
    messages.filter(
      message =>
      message.status === "DONE"
    ).length;









  const cards = [


    {

      title:"Pracownicy",

      value:
      employees.length,

      icon:
      Users

    },



    {

      title:"Nowe zgłoszenia",

      value:
      newMessages,

      icon:
      MessageSquare

    },



    {

      title:"W trakcie",

      value:
      inProgress,

      icon:
      Clock

    },



    {

      title:"Zakończone",

      value:
      completed,

      icon:
      CheckCircle

    },


  ];









return (


<div className="
space-y-6
">







<div>


<h2 className="
text-2xl
font-bold
">

Dashboard

</h2>



<p className="
text-sm
text-gray-500
">

Najważniejsze informacje

</p>


</div>









<div className="
grid
gap-4
md:grid-cols-2
xl:grid-cols-4
">


{
cards.map(
(card)=>(


<Card

key={
card.title
}

title={
card.title
}

value={
card.value
}

Icon={
card.icon
}

/>


)
)

}



</div>









<div className="
grid
gap-5
lg:grid-cols-2
">








<div className="
rounded-2xl
border
bg-white
p-5
">



<h3 className="
font-bold
mb-4
">

Ostatnie zgłoszenia

</h3>





<div className="
space-y-3
">


{
messages
.slice(0,5)
.map(
message=>(


<div

key={
message.id
}

className="
rounded-xl
bg-gray-50
p-3
"

>


<p className="
font-medium
">

{message.name}

</p>



<p className="
text-sm
text-gray-500
">

{message.email}

</p>



<span className="
text-xs
">

{message.status}

</span>



</div>


)

)

}



</div>



</div>









<div className="
rounded-2xl
border
bg-white
p-5
">



<h3 className="
font-bold
mb-4
">

Pracownicy

</h3>





<div className="
space-y-3
">


{
employees
.slice(0,5)
.map(
employee=>(


<div

key={
employee.id
}

className="
flex
items-center
gap-3
"

>


<img

src={
employee.avatar ||
"/avatar.png"
}

className="
h-10
w-10
rounded-full
"

/>




<div>


<p className="
font-medium
">

{
employee.globalName ||
employee.username
}

</p>



<p className="
text-xs
text-gray-500
">

{employee.role}

</p>


</div>



</div>


)

)

}




</div>



</div>









</div>









<div className="
rounded-2xl
border
bg-white
p-5
">



<div className="
flex
items-center
gap-2
mb-5
">


<LogIn size={20}/>



<h3 className="
font-bold
">

Ostatnie logowania

</h3>



</div>








<div className="
space-y-3
">


{

logins.length === 0 && (


<p className="
text-sm
text-gray-500
">

Brak logowań

</p>


)


}






{
logins.map(
employee=>(


<div

key={
employee.id
}

className="
flex
items-center
justify-between
rounded-xl
bg-gray-50
p-3
"

>


<div className="
flex
items-center
gap-3
">



<img

src={
employee.avatar ||
"/avatar.png"
}

className="
h-10
w-10
rounded-full
"

/>




<div>


<p className="
font-medium
">

{
employee.globalName ||
employee.username
}

</p>



<p className="
text-xs
text-gray-500
">

Ostatnio:

{
employee.lastLogin
?
new Date(
employee.lastLogin
).toLocaleString()
:
"Brak"
}


</p>



</div>




</div>






</div>


)

)

}



</div>






</div>







</div>


);



}









function Card({

title,

value,

Icon


}:{

title:string;

value:number;

Icon:any;

}){



return (


<div className="
rounded-2xl
border
bg-white
p-5
">



<div className="
flex
items-center
justify-between
">



<div>


<p className="
text-sm
text-gray-500
">

{title}

</p>



<h3 className="
mt-1
text-3xl
font-bold
">

{value}

</h3>



</div>






<div className="
rounded-xl
bg-gray-100
p-3
">


<Icon size={22}/>


</div>





</div>





</div>



);



}