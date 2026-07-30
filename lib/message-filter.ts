export type MessageFilterResult = {
    suspicious: boolean;
    score: number;
    reasons: string[];
  };
  
  
  const badWords = [
    "kurwa",
    "kurwy",
    "kurwo",
    "chuj",
    "chujowy",
    "huj",
    "jebac",
    "jebany",
    "pierdol",
    "spierdalaj",
    "wypierdalaj",
    "debil",
    "idiota",
    "kretyn",
    "cwel",
    "szmata",
  
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "scam",
    "scammer"
  ];
  
  
  const tempEmails = [
    "mailinator.com",
    "10minutemail.com",
    "tempmail.com",
    "temp-mail.org",
    "guerrillamail.com",
    "yopmail.com"
  ];
  
  
  function normalize(text:string){
  
    return text
      .toLowerCase()
      .replace(/[0-9]/g, (char)=>{
  
        const map:any = {
          "0":"o",
          "1":"i",
          "3":"e",
          "4":"a",
          "5":"s",
          "7":"t"
        };
  
        return map[char] ?? char;
  
      })
      .replace(/[\W_]+/g,"");
  }
  
  
  
  function hasBadWords(text:string){
  
    const clean = normalize(text);
  
    return badWords.find(word =>
      clean.includes(word)
    );
  
  }
  
  
  
  function countLinks(text:string){
  
    const matches =
      text.match(
        /(https?:\/\/|www\.|discord\.gg|discord\.com\/invite)/gi
      );
  
    return matches?.length ?? 0;
  
  }
  
  
  
  function hasRepeatedCharacters(text:string){
  
    return /(.)\1{7,}/.test(text);
  
  }
  
  
  
  function hasCaps(text:string){
  
    const letters =
      text.replace(/[^a-zA-Z]/g,"");
  
  
    if(letters.length < 10)
      return false;
  
  
    const upper =
      letters
        .split("")
        .filter(x =>
          x === x.toUpperCase()
        )
        .length;
  
  
    return upper / letters.length > 0.7;
  
  }
  
  
  
  function emojiSpam(text:string){
  
    const emojis =
      text.match(
        /[\u{1F300}-\u{1FAFF}]/gu
      );
  
  
    return (emojis?.length ?? 0) >= 8;
  
  }
  
  
  
  function containsTempEmail(email:string){
  
    return tempEmails.some(domain =>
      email
        .toLowerCase()
        .endsWith(domain)
    );
  
  }
  
  
  
  function isSpamText(text:string){
  
    const patterns = [
      "xdxdxd",
      "lololol",
      "aaaaaaa",
      "111111",
      "!!!!!!",
      "qwerty"
    ];
  
  
    const clean =
      normalize(text);
  
  
    return patterns.some(x =>
      clean.includes(
        normalize(x)
      )
    );
  
  }
  
  
  
  function tooShort(text:string){
  
    return text.trim().length < 8;
  
  }
  
  
  
  export function analyzeMessage(data:{
    name:string;
    email:string;
    company?:string;
    phone?:string;
    body:string;
  }):MessageFilterResult{
  
  
    let score = 0;
  
    const reasons:string[] = [];
  
  
    const fullText =
      `
      ${data.name}
      ${data.email}
      ${data.company ?? ""}
      ${data.phone ?? ""}
      ${data.body}
      `;
  
  
  
    const badWord =
      hasBadWords(fullText);
  
  
    if(badWord){
  
      score += 8;
  
      reasons.push(
        `Wulgaryzm: ${badWord}`
      );
  
    }
  
  
  
    const links =
      countLinks(fullText);
  
  
    if(links){
  
      score += links * 3;
  
      reasons.push(
        `Linki: ${links}`
      );
  
    }
  
  
  
    if(
      fullText.includes(
        "discord.gg"
      )
    ){
  
      score += 8;
  
      reasons.push(
        "Zaproszenie Discord"
      );
  
    }
  
  
  
    if(
      containsTempEmail(
        data.email
      )
    ){
  
      score += 6;
  
      reasons.push(
        "Tymczasowy email"
      );
  
    }
  
  
  
    if(
      hasRepeatedCharacters(
        fullText
      )
    ){
  
      score += 5;
  
      reasons.push(
        "Powtarzające się znaki"
      );
  
    }
  
  
  
    if(
      hasCaps(
        data.body
      )
    ){
  
      score += 3;
  
      reasons.push(
        "Duży CAPS LOCK"
      );
  
    }
  
  
  
    if(
      emojiSpam(
        fullText
      )
    ){
  
      score += 3;
  
      reasons.push(
        "Spam emoji"
      );
  
    }
  
  
  
    if(
      isSpamText(
        fullText
      )
    ){
  
      score += 5;
  
      reasons.push(
        "Spam tekstowy"
      );
  
    }
  
  
  
    if(
      tooShort(
        data.body
      )
    ){
  
      score += 3;
  
      reasons.push(
        "Za krótka wiadomość"
      );
  
    }
  
  
  
    return {
  
      suspicious:
        score >= 8,
  
      score,
  
      reasons
  
    };
  
  }