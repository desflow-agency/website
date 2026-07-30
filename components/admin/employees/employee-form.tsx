"use client";

import {
  useState
} from "react";



type Props = {

  onAdded:
  () => void;

};



export function EmployeeForm({
  onAdded
}: Props) {


  const [
    discordId,
    setDiscordId
  ] = useState("");



  const [
    role,
    setRole
  ] = useState<
    "ADMIN" |
    "MANAGER" |
    "EMPLOYEE"
  >(
    "EMPLOYEE"
  );



  const [
    loading,
    setLoading
  ] = useState(false);





  async function submit() {


    if(!discordId.trim()) {

      alert(
        "Podaj Discord ID pracownika"
      );

      return;

    }





    setLoading(true);



    try {


      const res =
        await fetch(
          "/api/admin/employees",
          {

            method:"POST",

            headers:{
              "Content-Type":
              "application/json"
            },


            body:JSON.stringify({

              discordId:
                discordId.trim(),

              role,

              permissions:[]

            })

          }
        );





      const data =
        await res.json();





      if(!res.ok) {


        alert(
          data.error ||
          "Nie udało się dodać pracownika"
        );


        return;

      }






      setDiscordId("");

      setRole(
        "EMPLOYEE"
      );



      onAdded();




    } catch(error) {


      console.error(
        "ADD EMPLOYEE ERROR",
        error
      );


      alert(
        "Wystąpił błąd"
      );



    } finally {


      setLoading(false);


    }


  }





  return (

    <div className="
      rounded-2xl
      border-none
      bg-white
      p-5
    ">


      <h3 className="
        mb-4
        font-bold
      ">

        Dodaj pracownika

      </h3>





      <div className="
        flex
        gap-3
      ">



        <input

          value={discordId}

          onChange={
            e =>
            setDiscordId(
              e.target.value
            )
          }


          placeholder="Discord ID"


          disabled={loading}


          className="
            flex-1
            rounded-xl
            
            px-4
            py-3
          "

        />







        <select

          value={role}


          disabled={loading}


          onChange={
            e =>
            setRole(
              e.target.value as
              "ADMIN" |
              "MANAGER" |
              "EMPLOYEE"
            )
          }


          className="
            rounded-xl
            border border-gray-900/15
            px-4
          "

        >


          <option value="EMPLOYEE">
            EMPLOYEE
          </option>


          <option value="MANAGER">
            MANAGER
          </option>


          <option value="ADMIN">
            ADMIN
          </option>


        </select>







        <button

          disabled={
            loading ||
            !discordId.trim()
          }


          onClick={submit}


          className={`
            rounded-xl
            px-5
            text-white

            ${
              loading ||
              !discordId.trim()

              ?

              "cursor-not-allowed bg-gray-400"

              :

              "bg-black hover:bg-gray-800"

            }

          `}

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

  );


}