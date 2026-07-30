"use client";


import {
 useEffect,
 useState
} from "react";


import type {
 ContactMessage
} from "../types";




export function useMessages(){


const [
 messages,
 setMessages
]=useState<ContactMessage[]>([]);



const [
 loading,
 setLoading
]=useState(true);







async function loadMessages(){


try{


const res =
 await fetch(
 "/api/admin/messages"
 );


const data =
 await res.json();



setMessages(
 data
);



}catch(error){


console.error(
 "MESSAGES ERROR",
 error
);


}finally{


setLoading(false);


}


}








async function updateMessage(
 id:string,
 data:any
){


await fetch(

`/api/admin/messages/${id}`,

{

method:"PATCH",

headers:{
 "Content-Type":
 "application/json"
},


body:
JSON.stringify(data)


}

);



loadMessages();


}






useEffect(()=>{

loadMessages();

},[]);






return {


messages,

loading,

reload:
loadMessages,

updateMessage


};



}