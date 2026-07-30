"use client";


import {
  useEffect,
  useState
} from "react";


import type {
 Employee
} from "../types";




export function useEmployees(){



const [
 employees,
 setEmployees
]=useState<Employee[]>([]);



const [
 loading,
 setLoading
]=useState(true);





async function loadEmployees(){


try{


const res =
 await fetch(
 "/api/admin/employees"
 );


const data =
 await res.json();



setEmployees(
 data
);



}catch(error){


console.error(
 "EMPLOYEES ERROR",
 error
);


}finally{


setLoading(false);


}


}






async function removeEmployee(
 id:string
){


await fetch(
 "/api/admin/employees",
 {

  method:"DELETE",

  headers:{
   "Content-Type":
   "application/json"
  },


  body:JSON.stringify({
   id
  })


 }
);



loadEmployees();


}





useEffect(()=>{


loadEmployees();


},[]);





return {

 employees,

 loading,

 reload:
 loadEmployees,

 removeEmployee

};


}