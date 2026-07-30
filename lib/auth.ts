import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";



export const isAdmin = (id?: string) => {

  return (
    process.env.ADMIN_IDS || ""
  )
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .includes(id || "");

};






export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({



  providers:[


    Discord({


      clientId:
        process.env.AUTH_DISCORD_ID,


      clientSecret:
        process.env.AUTH_DISCORD_SECRET,



      authorization:{


        params:{


          scope:
          "identify email"


        }


      },



      profile(profile){


        const avatar =

          profile.avatar

          ?

          `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith("a_") ? "gif" : "png"}?size=256`

          :

          `https://cdn.discordapp.com/embed/avatars/0.png`;



        return {

          id:
          profile.id,


          name:
          profile.global_name ||
          profile.username,


          email:
          profile.email,


          image:
          avatar,


          username:
          profile.username,


          global_name:
          profile.global_name,


          avatar:
          profile.avatar

        };


      }


    })


  ],






  callbacks:{






    authorized: async ({
      auth
    }) => {


      return !!auth?.user;


    },









    jwt: async ({
      token,
      account,
      profile
    }) => {



      if(account && profile){



        console.log(
          "DISCORD LOGIN:",
          profile
        );





        const discord =
          profile as {

            id:string;

            username:string;

            global_name?:string;

            avatar?:string|null;

            image?:string|null;

            email?:string|null;

          };







        const avatar =

          discord.image

          ?

          discord.image

          :

          discord.avatar

          ?

          `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.${discord.avatar.startsWith("a_") ? "gif" : "png"}?size=256`

          :

          `https://cdn.discordapp.com/embed/avatars/0.png`;









        const admin =
          isAdmin(
            discord.id
          );










        const employee =

        await prisma.employee.upsert({



          where:{


            discordId:
            discord.id


          },



          update:{



            username:
            discord.username,



            globalName:
            discord.global_name || null,



            avatar,



            lastLogin:
            new Date()


          },




          create:{



            discordId:
            discord.id,



            username:
            discord.username,



            globalName:
            discord.global_name || null,



            avatar,



            role:

            admin

            ?

            "ADMIN"

            :

            "WORKER",




            permissions:

            admin

            ?

            [
              "ALL"
            ]

            :

            [],




            lastLogin:
            new Date()


          }



        });









        await prisma.auditLog.create({


          data:{


            employeeId:
            employee.id,


            action:
            "Zalogowano do panelu administracyjnego",


            target:
            "ADMIN_PANEL"


          }


        });









        token.discordId =
        discord.id;



        token.username =
        discord.global_name ||
        discord.username;



        token.avatar =
        avatar;



        token.role =
        employee.role;



      }








      return token;



    },









    session: async ({
      session,
      token
    }) => {



      if(session.user){



        session.user.id =
        String(
          token.discordId || ""
        );



        session.user.name =
        String(
          token.username || ""
        );



        session.user.image =
        String(
          token.avatar || ""
        );



      }




      return session;



    }




  },







  pages:{


    signIn:
    "/admin"


  }



});