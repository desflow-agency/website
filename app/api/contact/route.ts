import { NextResponse } from "next/server";


const cooldown = new Map<string, number>();


export async function POST(req: Request) {

  try {

    const webhook =
      process.env.DISCORD_WEBHOOK_URL;


    if (!webhook) {
      return NextResponse.json(
        {
          error: "Webhook missing"
        },
        {
          status:500
        }
      );
    }



    const ip =
      req.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ??
      "unknown";



    const last =
      cooldown.get(ip);



    if (
      last &&
      Date.now() - last < 30000
    ) {

      return NextResponse.json(
        {
          error:
          "Za szybko. Odczekaj 30 sekund."
        },
        {
          status:429
        }
      );

    }



    cooldown.set(
      ip,
      Date.now()
    );



    const formData =
      await req.formData();



    // Anti bot

    if (
      formData.get("website")
    ) {

      return NextResponse.json({
        success:true
      });

    }



    const name =
      String(
        formData.get("name")
        ?? ""
      );


    const email =
      String(
        formData.get("email")
        ?? ""
      );


    const phone =
      String(
        formData.get("phone")
        ?? "Nie podano"
      );


    const company =
      String(
        formData.get("company")
        ?? "Nie podano"
      );


    const body =
      String(
        formData.get("body")
        ?? ""
      );

      console.log("WEBHOOK:", webhook);

    await fetch(
      webhook,
      {
        method:"POST",

        headers:{
          "Content-Type":
          "application/json",
        },


        body:JSON.stringify({

          content:
          "@everyone",


          allowed_mentions:{
            parse:[
              "everyone"
            ],
          },


          embeds:[
            {

              title:
              "📩 Nowa wiadomość - Desflow",


              color:
              0x5b5cf0,


              fields:[

                {
                  name:"👤 Osoba",
                  value:name,
                  inline:true
                },

                {
                  name:"📧 Email",
                  value:email,
                  inline:true
                },

                {
                  name:"📞 Telefon",
                  value:phone,
                  inline:true
                },

                {
                  name:"🏢 Firma",
                  value:company,
                  inline:true
                },

                {
                  name:"💬 Wiadomość",
                  value:body
                }

              ],


              footer:{
                text:
                "Desflow • Kontakt"
              },


              timestamp:
              new Date()
              .toISOString()

            }
          ]

        })
      }
    );



    return NextResponse.json({
      success:true
    });



  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        error:"Server error"
      },
      {
        status:500
      }
    );

  }

}