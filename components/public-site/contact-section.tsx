"use client";

import {
  ArrowRight,
  Loader2,
  CheckCircle,
  Mail,
  Phone,
  Building2,
  User,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";


export function ContactSection() {
  return (
    <section
      id="contact"
      className="
        relative
        overflow-hidden
        py-24
      "
    >

      {/* Soft Apple style background */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute
            left-1/2
            top-0
            h-137.5
            w-137.5
            -translate-x-1/2
            rounded-full
            bg-indigo-400/10
            blur-[140px]
          "
        />


        <div
          className="
            absolute
            right-0
            top-1/3
            h-100
            w-100
            rounded-full
            bg-blue-400/10
            blur-[130px]
          "
        />


        <div
          className="
            absolute
            bottom-0
            left-0
            h-87.5
            w-87.5
            rounded-full
            bg-cyan-400/10
            blur-[120px]
          "
        />

      </div>



      <div className="shell relative">


        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.7,
          }}

          className="
            relative
            overflow-hidden
            rounded-[42px]
            border-b
            border-purple-500/10
            bg-linear-to-br from-purple-500/15 via-transparent to-purple-500/15
            p-6
            shadow-[0_30px_80px_rgba(0,0,0,0.08)]
            backdrop-blur-2xl
            md:p-12
          "

        >


          {/* Card gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-linear-to-br
              from-indigo-500/8
              via-transparent
              to-blue-500/8
            "
          />



          {/* Decorative glow */}

          <motion.div

            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}

            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}

            className="
              pointer-events-none
              absolute
              right-20
              top-10
              hidden
              h-32
              w-32
              rounded-full
              bg-indigo-400/10
              blur-3xl
              lg:block
            "

          />




          <div
            className="
              relative
              grid
              gap-12
              lg:grid-cols-[0.9fr_1.1fr]
              lg:gap-16
            "
          >



            {/* LEFT CONTENT */}


            <motion.div

              initial={{
                opacity: 0,
                x: -30,
              }}

              whileInView={{
                opacity: 1,
                x: 0,
              }}

              viewport={{
                once: true,
              }}

              transition={{
                duration: 0.6,
              }}

              className="
                flex
                flex-col
                justify-center
              "

            >



              <div

                className="
                  mb-6
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-black/6
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  shadow-sm
                "

              >

                <Sparkles
                  size={16}
                  className="text-indigo-500"
                />

                Porozmawiajmy

              </div>





              <h2

                className="
                  max-w-xl
                  text-4xl
                  font-bold
                  leading-[1.16]
                  tracking-tighter
                  text-[#111111]
                  md:text-6xl
                "

              >

                Gotowy rozwinąć

                <span

                  className="
                    block
                    bg-linear-to-r
                    from-indigo-600
                    via-purple-400
                    to-indigo-700
                    bg-clip-text
                    text-transparent
                  "

                >

                  Twoją markę?

                </span>


              </h2>




              <p

                className="
                  mt-6
                  max-w-md
                  text-base
                  leading-7
                  text-gray-500
                  md:text-lg
                "

              >

                Napisz kilka zdań o swoim projekcie.
                Przygotujemy rozwiązanie dopasowane
                do Twoich potrzeb i odpowiemy
                w ciągu 24 godzin.

              </p>




              <div
                className="
                  mt-10
                  space-y-4
                "
              >


                <ContactInfo

                  icon={
                    <Mail size={20} />
                  }

                  title="E-mail"

                  text="kontakt@desflow.pl"

                />



                <ContactInfo

                  icon={
                    <Building2 size={20} />
                  }

                  title="Dla firm"

                  text="Projekty cyfrowe i marketing"

                />


              </div>



            </motion.div>
            {/* FORM */}

            <ContactForm />


          </div>

        </motion.div>


      </div>

    </section>
  );
}





function ContactInfo({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {

  return (

    <motion.div

      whileHover={{
        y: -3,
      }}

      transition={{
        duration: 0.2,
      }}

      className="
flex
items-center
gap-4
rounded-2xl
border
border-black/6
bg-white/80
p-4
backdrop-blur-xl
transition
"

    >


      <div

        className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-indigo-50
text-indigo-600
"

      >

        {icon}

      </div>




      <div>

        <p
          className="
  text-sm
  text-gray-400
"
        >
          {title}
        </p>


        <p
          className="
  font-medium
  text-[#111111]
"
        >
          {text}
        </p>


      </div>


    </motion.div>

  );
}







function ContactForm() {

  const [
    status,
    setStatus
  ] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");




  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    setStatus("loading");


    const form = e.currentTarget;


    const data = new FormData(form);



    try {


      const res = await fetch(
        "/api/contact",
        {
          method: "POST",
          body: data,
        }
      );



      if (!res.ok) {

        throw new Error();

      }



      form.reset();


      setStatus("success");



      setTimeout(() => {

        setStatus("idle");

      }, 5000);



    } catch {


      setStatus("error");



      setTimeout(() => {

        setStatus("idle");

      }, 5000);


    }


  }





  return (

    <motion.form

      initial={{
        opacity: 0,
        x: 40,
      }}


      whileInView={{
        opacity: 1,
        x: 0,
      }}


      viewport={{
        once: true,
      }}


      transition={{
        duration: 0.7,
        delay: 0.15,
      }}



      onSubmit={handleSubmit}



      className="
relative
rounded-[34px]
border
border-black/6
bg-white/80
p-5
shadow-[0_20px_50px_rgba(0,0,0,0.06)]
backdrop-blur-xl
md:p-8
"

    >




      {/* form glow */}

      <div

        className="
pointer-events-none
absolute
inset-0
rounded-[34px]
bg-linear-to-br
from-indigo-500/5
via-transparent
to-blue-500/5
"

      />





      <div
        className="
relative
grid
gap-5
"
      >




        {/* Honeypot */}

        <input

          type="text"

          name="website"

          tabIndex={-1}

          autoComplete="off"

          className="hidden"

        />






        <div

          className="
  grid
  gap-5
  sm:grid-cols-2
"

        >


          <InputField

            icon={
              <User size={18} />
            }

            name="name"

            placeholder="Imię i nazwisko"

            required

          />



          <InputField

            icon={
              <Mail size={18} />
            }

            name="email"

            type="email"

            placeholder="E-mail"

            required

          />



        </div>





        <div

          className="
  grid
  gap-5
  sm:grid-cols-2
"

        >



          <InputField

            icon={
              <Phone size={18} />
            }

            name="phone"

            placeholder="Telefon"

          />




          <InputField

            icon={
              <Building2 size={18} />
            }

            name="company"

            placeholder="Firma"

          />



        </div>





        <textarea

          required

          name="body"

          rows={6}

          placeholder="W czym możemy pomóc?"

          className="
  min-h-37.5
  w-full
  resize-none
  rounded-2xl
  border
  border-black/8
  bg-gray-50
  px-5
  py-4
  text-[#111111]
  outline-none
  transition-all

  placeholder:text-gray-400

  hover:bg-white

  focus:border-indigo-500/40

  focus:bg-white

  focus:ring-4

  focus:ring-indigo-500/10
"

        />





        <button

          disabled={
            status === "loading"
          }


          type="submit"


          className="
  group
  mt-2
  flex
  h-14
  items-center
  justify-center
  gap-3
  rounded-2xl
  bg-[#111111]
  px-6
  font-semibold
  text-white
  transition-all
   cursor-pointer
  hover:-translate-y-1

  hover:shadow-xl

  hover:shadow-black/20

  disabled:pointer-events-none

  disabled:opacity-60
"

        >



          {status === "loading" && (

            <>

              Wysyłanie


              <Loader2

                size={18}

                className="
        animate-spin
      "

              />


            </>

          )}






          {status === "success" && (

            <>

              Wiadomość wysłana


              <CheckCircle

                size={18}

              />


            </>

          )}





          {status === "error" && (

            <>
              Błąd wysyłania
            </>

          )}




          {status === "idle" && (

            <>

              Wyślij wiadomość


              <ArrowRight

                size={18}

                className="
        transition-transform
        group-hover:translate-x-1
      "

              />


            </>

          )}


        </button>



      </div>



    </motion.form>

  );

}
function InputField({
  icon,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div
      className="
    flex
    h-14
    items-center
    gap-3
    rounded-2xl
    
    border
    border-gray-200
    
    bg-gray-50
    px-4
    
    transition-all
    
    hover:border-gray-300
    hover:bg-white
    
    focus-within:border-indigo-500
    focus-within:bg-white
    focus-within:ring-2
    focus-within:ring-indigo-500/15
    "
    >

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-indigo-50
          text-indigo-500
        "
      >
        {icon}
      </div>



      <input
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        className="
          h-full
          w-full
          bg-transparent
          text-[#111]
          outline-none

          placeholder:text-gray-400
        "
      />

    </div>
  );
} 