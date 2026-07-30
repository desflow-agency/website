"use client";


import { useEffect, useState } from "react";

import type {
  Employee
} from "../types";

import { EmployeeCard } from "./employee-card";
import { EmployeeForm } from "./employee-form";



export function EmployeesView(){


  const [employees,setEmployees] =
    useState<Employee[]>([]);



  async function loadEmployees(){


    const res =
      await fetch(
        "/api/admin/employees"
      );


    const data =
      await res.json();


    setEmployees(data);


  }





  useEffect(()=>{

    loadEmployees();

  },[]);






  async function deleteEmployee(
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





  return (

    <div className="
      space-y-6
    ">


      <div>

        <h2 className="
          text-2xl
          font-bold
        ">

          Pracownicy

        </h2>


        <p className="
          text-sm
          text-gray-500
        ">

          Zarządzaj dostępem przez Discord

        </p>


      </div>




      <EmployeeForm
        onAdded={
          loadEmployees
        }
      />





      <div className="
        grid
        gap-4
        md:grid-cols-2
      ">


        {
          employees.map(
            (employee)=>(

              <EmployeeCard

                key={
                  employee.id
                }

                employee={
                  employee
                }

                onDelete={
                  deleteEmployee
                }

              />

            )
          )
        }


      </div>


    </div>

  );

}