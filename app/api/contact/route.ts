import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";


const filePath = path.join(
  process.cwd(),
  "data",
  "messages.json"
);


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



function checkMessage(text:string){

  const lower =
    text.toLowerCase();


  const found =
    badWords.some(word =>
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
        ? "Wykryto wulgaryzmy"
        : spam
          ? "Podejrzany spam"
          : null
  };

}



function getMessages(){

  if(!fs.existsSync(filePath)){

    fs.mkdirSync(
      path.dirname(filePath),
      {
        recursive:true
      }
    );


    fs.writeFileSync(
      filePath,
      "[]"
    );

  }


  return JSON.parse(
    fs.readFileSync(
      filePath,
      "utf-8"
    )
  );

}



function saveMessages(
  data:any[]
){

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      data,
      null,
      2
    )
  );

}



async function sendDiscord(
  url:string,
  message:any
){

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

}



export async function POST(
  req:Request
){

try{


const formData =
  await req.formData();



if(formData.get("website")){

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



const filter =
 checkMessage(body);



const messages =
 getMessages();



const newMessage = {

 id:
 randomUUID(),

 name,

 email,

 phone,

 company,

 body,


 status:
 "NEW",


 assignedTo:
 null,


 suspicious:
 filter.suspicious,


 suspiciousReason:
 filter.reason,


 createdAt:
 new Date().toISOString(),


 history:[

 {
  id:
  randomUUID(),

  action:
  "Utworzono zgłoszenie",

  date:
  new Date().toISOString()
 }

 ]

};



messages.push(
 newMessage
);


saveMessages(
 messages
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
 value:name || "Brak",
 inline:true
},

{
 name:"📧 Email",
 value:email || "Brak",
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
else if(webhook){


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

 success:true

});



}catch(error){


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