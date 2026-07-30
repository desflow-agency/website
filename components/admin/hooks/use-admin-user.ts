"use client";

import {
  useEffect,
  useState
} from "react";

import type {
  AdminUser
} from "../types";


export function useAdminUser(){

  const [user,setUser] =
    useState<AdminUser | null>(null);


  const [loading,setLoading] =
    useState(true);



  async function loadUser(){

    try{

      const res =
        await fetch(
          "/api/admin/me"
        );


      if(!res.ok)
        throw new Error(
          "Nie udało się pobrać użytkownika"
        );


      const data =
        await res.json();


      console.log(
        "ADMIN USER:",
        data
      );


      setUser(data);


    }catch(error){

      console.error(
        error
      );

    }finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    loadUser();

  },[]);



  return {
    user,
    loading,
    reload:loadUser
  };

}