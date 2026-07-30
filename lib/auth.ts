import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";


export const isAdmin = (id?: string) =>
  (process.env.ADMIN_IDS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .includes(id || "");



export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({

  providers: [

    Discord({

      clientId:
        process.env.AUTH_DISCORD_ID,

      clientSecret:
        process.env.AUTH_DISCORD_SECRET,

      authorization: {
        params: {
          scope: "identify email",
        },
      },

    }),

  ],



  callbacks: {


    authorized: async ({ auth }) => {

      return !!auth?.user;

    },



    jwt: async ({
      token,
      account,
      profile,
    }) => {


      console.log(
        "DISCORD ACCOUNT:",
        account
      );


      console.log(
        "DISCORD PROFILE:",
        profile
      );



      if(account && profile) {


        const discord =
          profile as {
            id:string;
            username:string;
            global_name?:string;
            avatar?:string|null;
          };



        token.discordId =
          discord.id;



        token.username =
          discord.global_name ||
          discord.username;



        token.avatar =
          discord.avatar

          ? `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png?size=256`

          : `https://cdn.discordapp.com/embed/avatars/0.png`;


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

    },


  },



  pages: {

    signIn:"/admin"

  },


});