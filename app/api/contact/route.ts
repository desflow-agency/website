import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



const webhook =
  process.env.DISCORD_WEBHOOK_URL;


const suspiciousWebhook =
  process.env.DISCORD_SUSPICIOUS_WEBHOOK_URL;





const badWords = [

  "kurwa",
  "chuj",
  "jebac",
  "jebać",
  "pierdol",
  "idiota",
  "debil",

];






function checkMessage(
  text:string
){


  const lower =
    text.toLowerCase();




  const found =
    badWords.some(
      word =>
      lower.includes(word)
    );




  const spam =
    text.length > 1000 ||
    /(.)\1{6,}/.test(text);





  return {

    suspicious:
      found || spam,


    reason:
      found
      ?
      "Wykryto wulgaryzmy"
      :
      spam
      ?
      "Podejrzany spam"
      :
      null

  };


}









async function sendDiscord(

  url:string | undefined,

  message:any

){



  if(!url){

    console.log(
      "Brak webhooka Discord"
    );

    return;

  }




  try{


    const response =
      await fetch(

        url,

        {

          method:"POST",

          headers:{

            "Content-Type":
            "application/json"

          },


          body:

          JSON.stringify(message)

        }

      );




    if(!response.ok){


      console.error(

        "Discord webhook error:",

        await response.text()

      );


    }




  }
  catch(error){


    console.error(

      "DISCORD ERROR:",

      error

    );


  }



}









export async function POST(
  req:Request
){


try{



const formData =
  await req.formData();





// honeypot

if(
  formData.get("website")
){


  return NextResponse.json({

    success:true

  });


}







const name =
String(
  formData.get("name") || ""
);



const email =
String(
  formData.get("email") || ""
);



const phone =
String(
  formData.get("phone") || ""
);



const company =
String(
  formData.get("company") || ""
);



const body =
String(
  formData.get("body") || ""
);







if(
  !name ||
  !email ||
  !body
){


return NextResponse.json(

{

error:
"Brak wymaganych danych"

},

{

status:400

}

);


}








const filter =
checkMessage(body);









/*
  ZAPIS DO NEON
*/


const newMessage =

await prisma.message.create({

data:{



name,


email,



phone:
phone || null,



company:
company || null,



body,



status:
"NEW",



suspicious:
filter.suspicious,



suspiciousReason:
filter.reason,



history:{


create:{


action:
"Utworzono zgłoszenie"


}


}



}



});









console.log(

"NOWE ZGŁOSZENIE:",

newMessage.id

);









const embed = {



title:

filter.suspicious

?

"⚠️ Podejrzane zgłoszenie"

:

"📩 Nowe zgłoszenie - Desflow",





color:

filter.suspicious

?

0xff0000

:

0x5b5cf0,







fields:[



{

name:"👤 Klient",

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

value:phone || "Brak",

inline:true

},



{

name:"🏢 Firma",

value:company || "Brak",

inline:true

},



{

name:"💬 Wiadomość",

value:
body.substring(0,1000)

}



],





footer:{


text:

filter.suspicious

?

`Powód: ${filter.reason}`

:

"Desflow • Kontakt"



},




timestamp:

new Date().toISOString()



};









if(

filter.suspicious &&

suspiciousWebhook

){



await sendDiscord(

suspiciousWebhook,

{


content:

"🚨 Podejrzana wiadomość",



embeds:[

embed

]


}


);



}
else{



await sendDiscord(

webhook,

{


content:

"@everyone",



allowed_mentions:{


parse:[

"everyone"

]

},



embeds:[

embed

]


}


);



}









return NextResponse.json({

success:true,

id:newMessage.id

});






}
catch(error){



console.error(

"CONTACT ERROR:",

error

);




return NextResponse.json(

{

error:

"Server error"

},

{

status:500

}

);



}


}