"use client";


type Props = {

user:{
name?:string | null;

image?:string | null;

role?:string;

}

};


export function SidebarUser({
user
}:Props){


return (

<div className="
mt-auto
p-4
">


<div className="
rounded-2xl
bg-gray-50
p-4
">


<div className="
flex
items-center
gap-3
">


<img

src={
user.image ||
"/avatar.png"
}

alt="avatar"

className="
h-10
w-10
rounded-full
object-cover
"

/>




<div>


<p className="
font-semibold
text-sm
">

{
user.name ||
"Admin"
}

</p>


<p className="
text-xs
text-gray-500
">

{
user.role ||
"ADMIN"
}

</p>


</div>



</div>



</div>


</div>

);


}