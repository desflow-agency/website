export async function getDiscordUser(
    id:string
  ){
  
    const res = await fetch(
      `https://discord.com/api/v10/users/${id}`,
      {
        headers:{
          Authorization:
            `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
  
  
    if(!res.ok){
  
      throw new Error(
        "Nie znaleziono użytkownika Discord"
      );
  
    }
  
  
    const user =
      await res.json();
  
  
  
    return {
  
      id:user.id,
  
      username:
        user.username,
  
      globalName:
        user.global_name,
  
      avatar:
        user.avatar
  
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
  
        : `https://cdn.discordapp.com/embed/avatars/0.png`
  
    };
  
  }