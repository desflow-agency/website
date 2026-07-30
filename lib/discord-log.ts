export async function sendDiscordLog(
    title:string,
    description:string,
    color:number = 0x5b5cf0
  ){
  
  const webhook =
  process.env.DISCORD_LOG_WEBHOOK_URL;
  
  
  
  if(!webhook)
  return;
  
  
  
  try{
  
  
  await fetch(
  webhook,
  {
  method:"POST",
  
  headers:{
  "Content-Type":
  "application/json"
  },
  
  body:JSON.stringify({
  
  embeds:[
  
  {
  
  title,
  
  description,
  
  color,
  
  timestamp:
  new Date()
  .toISOString()
  
  }
  
  ]
  
  })
  
  }
  
  );
  
  
  
  }catch(error){
  
  console.error(
  "Discord log error:",
  error
  );
  
  }
  
  
  }