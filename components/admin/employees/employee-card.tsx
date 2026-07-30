"use client";


import Image from "next/image";
import { Trash2 } from "lucide-react";


import type {
    Employee
} from "../types";



type Props = {

    employee: Employee;

    onDelete:
    (id: string) => void;

};




export function EmployeeCard({
    employee,
    onDelete
}: Props) {



    return (

        <div className="
 rounded-2xl
 border-none
 bg-white
 p-5
 flex
 items-center
 justify-between
">


            <div className="
 flex
 items-center
 gap-4
">


                <div className="
 relative
 h-14
 w-14
 overflow-hidden
 rounded-full
 bg-gray-100
">


                    <Image

                        src={
                            employee.avatar ||
                            "/avatar.png"
                        }

                        alt="alt"

                        fill

                        className="
 object-cover
 "

                    />


                </div>




                <div>


                    <h3 className="
 font-bold
">


                        {
                            employee.globalName
                                ?
                                `${employee.globalName} (${employee.username})`
                                :
                                employee.username
                        }



                    </h3>



                    <p className="
 text-xs
 text-gray-500
">

                        ID:

                        {" "}

                        {employee.discordId}


                    </p>



                    <span className="
 mt-2
 inline-block
 rounded-full
 bg-gray-100
 px-3
 py-1
 text-xs
 font-semibold
">


                        {employee.role}


                    </span>



                </div>


            </div>





            <button

                onClick={() =>
                    onDelete(employee.id)
                }

                className="
 rounded-xl
 p-2
 text-red-500
 hover:bg-red-50
"

            >

                <Trash2 size={18} />


            </button>



        </div>

    );


}