"use client";


export function SidebarHeader(){

return (

<div className="
flex
items-center
gap-3
px-5
py-5
">

<div className="
h-11
w-11
overflow-hidden
flex
items-center
justify-center
">

<img

src="/dfblack.png"

alt="Logo"

className="
h-full
w-full
object-cover
"

/>

</div>




<div>

<h1 className="
font-bold
text-lg
leading-none
">

desflow

</h1>


<p className="
text-xs
text-gray-500
mt-1
">

Admin Panel

</p>


</div>



</div>

);

}