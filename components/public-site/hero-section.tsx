"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Palette,
  Video,
  Smartphone,
  Globe,
} from "lucide-react";
import { useState } from "react";


const services = [
  {
    id: "branding",
    title: "Branding",
    icon: Palette,
    subtitle:
      "Tworzymy identyfikacje marek, które zostają w pamięci.",
    result:
      "+84% rozpoznawalności",
    color:
      "from-purple-500 to-indigo-500",
  },

  {
    id: "video",
    title: "Produkcja video",
    icon: Video,
    subtitle:
      "Montaż reklam, rolek i materiałów promocyjnych.",
    result:
      "+120% wyświetleń",
    color:
      "from-red-500 to-orange-500",
  },

  {
    id: "social",
    title: "Social Media",
    icon: Smartphone,
    subtitle:
      "Strategia, content i rozwój społeczności.",
    result:
      "+240% zaangażowania",
    color:
      "from-blue-500 to-cyan-500",
  },
];



export function HeroSection() {

  const [active, setActive] =
    useState("branding");


  const current =
    services.find(
      item => item.id === active
    )!;



  return (

    <section
      className="
      gradient
      grid-bg
      relative
      overflow-hidden
      pt-28
      "
    >


      <div
        className="
        shell
        grid
        min-h-170
        items-center
        gap-12
        py-20
        lg:grid-cols-2
        "
      >




        {/* LEFT SIDE */}



        <motion.div

          initial={{
            opacity: 0,
            y: 25
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            duration: .7
          }}

        >


          <p className="eyebrow">
            Desflow · Kreatywna agencja
          </p>



          <h1
            className="
            headline
            font-semibold
            "
          >

            Tworzymy marki,
            które ludzie{" "}

            <span className="
            text-[#5b5cf0]
            ">
              pamiętają.
            </span>


          </h1>



          <p className="sub">

            Łączymy strategię,
            design i technologię,
            aby tworzyć marki
            z charakterem.

          </p>





          <div
            className="
            mt-8
            flex
            flex-wrap
            gap-3
            "
          >


            <a
              href="#offer"
              className="
              btn
              btn-primary
              "
            >

              Zobacz ofertę

              <ArrowRight size={17} />

            </a>




            <a
              href="#contact"
              className="
              btn
              btn-light
              "
            >

              Darmowa wycena

            </a>


          </div>






          <div
            className="
            mt-10
            flex
            items-center
            gap-3
            text-sm
            text-[#686b7d]
            "
          >


            <div
              className="
              flex
              -space-x-2
              "
            >

              {[1, 2, 3].map(item => (

                <div

                  key={item}

                  className="
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-full
                  border-2
                  border-white
                  bg-[#dad9ff]
                  "
                >

                  <Star
                    size={12}
                    fill="currentColor"
                  />

                </div>

              ))}


            </div>



            Ponad 50 zrealizowanych projektów



          </div>



        </motion.div>






        {/* RIGHT SIDE */}



        <CreativeShowcase

          active={active}

          setActive={setActive}

          current={current}

        />




      </div>


    </section>

  );

}
function CreativeShowcase({
  active,
  setActive,
  current,
}: any) {


  const [mouse, setMouse] =
    useState({
      x: 50,
      y: 50
    });


  const Icon =
    current.icon;



  const previews: any = {

    branding: {
      title: "Identyfikacja marki",
      items: [
        "Logo",
        "Kolory",
        "Typografia"
      ],
      comment:
        "Nowa identyfikacja wygląda świetnie!",
      stat:
        "+84% rozpoznawalności"
    },


    video: {
      title: "Produkcja video",
      items: [
        "Reklamy",
        "Shorty",
        "Montaż"
      ],
      comment:
        "Materiały zwiększyły zasięg marki.",
      stat:
        "+120% wyświetleń"
    },


    social: {
      title: "Social Media",
      items: [
        "Strategia",
        "Content",
        "Publikacje"
      ],
      comment:
        "Profil zaczął dynamicznie rosnąć.",
      stat:
        "+240% zaangażowania"
    },


    web: {
      title: "Strona internetowa",
      items: [
        "UX/UI",
        "Frontend",
        "Optymalizacja"
      ],
      comment:
        "Nowa strona poprawiła wyniki.",
      stat:
        "+65% konwersji"
    }

  };



  const preview =
    previews[active];





  return (

    <div

      onMouseMove={(e) => {

        const rect =
          e.currentTarget
            .getBoundingClientRect();


        setMouse({

          x:
            ((e.clientX - rect.left)
              /
              rect.width)
            *
            100,


          y:
            ((e.clientY - rect.top)
              /
              rect.height)
            *
            100

        });


      }}


      className="
      relative
      mx-auto
      h-[560px]
      w-full
      max-w-[540px]
      "

    >





      {/* CURSOR LIGHT */}


      <motion.div

        animate={{

          left: `${mouse.x}%`,
          top: `${mouse.y}%`

        }}

        transition={{

          type: "spring",
          stiffness: 120,
          damping: 20

        }}

        className="
        pointer-events-none
        absolute
        h-56
        w-56
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-[#5b5cf0]/20
        blur-3xl
        "

      />







      {/* BACKGROUND GLOW */}


      <motion.div

        animate={{

          scale: [
            1,
            1.15,
            1
          ],

          opacity: [
            .25,
            .5,
            .25
          ]

        }}

        transition={{

          duration: 6,
          repeat: Infinity

        }}

        className="
        absolute
        inset-20
        rounded-full
        bg-[#5b5cf0]
        blur-[120px]
        "

      />









      {/* MAIN CARD */}


      <motion.div


        whileHover={{

          scale: 1.04,
          rotateX: 6,
          rotateY: -6

        }}


        transition={{

          type: "spring",
          stiffness: 150,
          damping: 15

        }}


        className="
        absolute
        left-1/2
        top-1/2
        w-[360px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-[35px]
        border
        border-white/60
        bg-white/80
        p-6
        shadow-2xl
        backdrop-blur-xl
        "

        style={{

          perspective: 1000

        }}

      >







        {/* HEADER */}


        <div
          className="
          flex
          items-center
          justify-between
          "
        >


          <div>


            <p
              className="
              text-xs
              text-gray-500
              "
            >

              Studio kreatywne

            </p>



            <h2
              className="
              text-xl
              font-black
              "
            >

              desflow

            </h2>


          </div>





          <div
            className="
            flex
            items-center
            gap-2
            rounded-full
            bg-green-100
            px-3
            py-1
            text-xs
            font-bold
            text-green-700
            "
          >

            <span
              className="
              h-2
              w-2
              animate-pulse
              rounded-full
              bg-green-500
              "
            />


            ONLINE


          </div>


        </div>








        {/* PROJECT PREVIEW */}


        <motion.div


          key={active}


          initial={{

            opacity: 0,
            scale: .9,
            y: 20

          }}


          animate={{

            opacity: 1,
            scale: 1,
            y: 0

          }}


          transition={{

            duration: .35

          }}


          className={`
          mt-6
          rounded-3xl
          bg-gradient-to-br
          ${current.color}
          p-6
          text-white
          `}

        >


          <Icon
            size={40}
            className="
            mb-5
            "
          />



          <h3
            className="
            text-2xl
            font-black
            "
          >

            {preview.title}


          </h3>





          <div
            className="
            mt-5
            space-y-2
            "
          >

            {preview.items.map(
              (item: string) => (

                <motion.div

                  key={item}

                  initial={{
                    opacity: 0,
                    x: -15
                  }}

                  animate={{
                    opacity: 1,
                    x: 0
                  }}

                  className="
                rounded-xl
                bg-white/20
                px-3
                py-2
                text-sm
                backdrop-blur
                "

                >

                  ✓ {item}

                </motion.div>

              ))}


          </div>



        </motion.div>
        {/* RESULT CARD */}

        <motion.div

          key={preview.stat}

          initial={{
            opacity: 0,
            y: 15
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            duration: .4
          }}

          className="
mt-5
flex
items-center
justify-between
rounded-2xl
bg-gray-100
p-4
"

        >

          <div>

            <p
              className="
    text-xs
    text-gray-500
    "
            >
              Wynik projektu
            </p>


            <b
              className="
    text-lg
    "
            >
              {preview.stat}
            </b>


          </div>


          <span
            className="
  text-xl
  "
          >
            🚀
          </span>


        </motion.div>







        {/* SERVICE BUTTONS */}


        <div
          className="
mt-5
grid
grid-cols-2
gap-2
"
        >

          {services.map(service => {


            const ServiceIcon =
              service.icon;


            return (

              <motion.button


                key={service.id}


                onClick={() =>
                  setActive(service.id)
                }


                whileHover={{

                  y: -5,
                  scale: 1.04

                }}


                whileTap={{

                  scale: .95

                }}



                className={`
      flex
      items-center
      gap-2
      rounded-xl
      p-3
      text-xs
      transition-all

      ${active === service.id

                    ?

                    "bg-[#5b5cf0] text-white shadow-lg shadow-[#5b5cf0]/30"

                    :

                    "bg-gray-100 hover:bg-gray-200"

                  }

      `}

              >


                <ServiceIcon
                  size={15}
                />


                {service.title}


              </motion.button>


            );


          })}


        </div>




      </motion.div>









      {/* CLIENT OPINION */}



      <motion.div


        animate={{

          y: [
            0,
            -15,
            0
          ],


          rotate: [
            -3,
            3,
            -3
          ]

        }}


        transition={{

          duration: 5,
          repeat: Infinity

        }}



        className="
absolute
-left-15
top-24
w-52
rounded-2xl
bg-white
p-4
shadow-xl
"

      >


        <p
          className="
text-xs
text-gray-500
"
        >
          Opinia klienta
        </p>



        <motion.p

          key={preview.comment}

          initial={{
            opacity: 0
          }}

          animate={{
            opacity: 1
          }}

          className="
mt-2
text-sm
font-medium
"

        >

          "{preview.comment}"

        </motion.p>



        <div
          className="
mt-2
text-yellow-400
"
        >
          ★★★★★
        </div>



      </motion.div>









      {/* CURRENT PROJECT */}



      <motion.div


        animate={{

          y: [
            0,
            15,
            0
          ],


          rotate: [
            5,
            -5,
            5
          ]

        }}



        transition={{

          duration: 6,
          repeat: Infinity

        }}



        className="
absolute
right-0
bottom-24
rounded-2xl
bg-white
p-4
shadow-xl
"

      >


        <p
          className="
text-xs
text-gray-500
"
        >

          Aktualnie tworzymy

        </p>



        <b>

          {current.title}

        </b>


      </motion.div>







      {/* FLOATING PARTICLES */}



      {[
        {
          left: "10%",
          top: "15%",
        },
        {
          left: "85%",
          top: "20%",
        },
        {
          left: "20%",
          top: "80%",
        },
        {
          left: "75%",
          top: "75%",
        },
        {
          left: "50%",
          top: "8%",
        },

      ].map((particle, index) => (


        <motion.span

          key={index}


          animate={{

            y: [
              0,
              -35,
              0
            ],

            opacity: [
              .2,
              1,
              .2
            ]

          }}


          transition={{

            duration:
              3 + index,

            repeat: Infinity,

            delay:
              index * .3

          }}


          style={{

            left:
              particle.left,

            top:
              particle.top

          }}


          className="
absolute
h-2
w-2
rounded-full
bg-[#5b5cf0]
"

        />


      ))}





    </div>

  );

}