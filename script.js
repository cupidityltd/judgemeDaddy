const $ = s => document.querySelector(s);

const judgePools = {
  judge1: [
    "Convicted. Next case.",
    "Interesting. Unfortunately, interesting is not a defence.",
    "The timeline raises several legal concerns.",
    "I have questions. Many questions.",
    "That excuse arrived suspiciously well-rehearsed.",
    "The court requests supporting evidence.",
    "I am not convinced.",
    "Technically possible. Emotionally questionable.",
    "You expect this court to believe that?",
    "The evidence is weak, but the confidence is remarkable.",
    "I have seen better arguments written on a napkin.",
    "The court remains deeply suspicious."
  ],
  judge2: [
    "I don't believe you, but I respect the storytelling.",
    "That is absolutely ridiculous. 8/10.",
    "I wasn't prepared for that.",
    "Somehow, this makes more sense than the truth.",
    "Creative. Reckless. Beautiful.",
    "The excuse has plot development.",
    "I would like to hear the director's cut.",
    "This is either genius or an administrative disaster.",
    "Points for originality. Zero points for punctuality.",
    "The audacity is impressive.",
    "I object to the excuse. I endorse the creativity.",
    "Frankly, I have heard worse."
  ],
  judge3: [
    "Honestly? I've had days like this.",
    "I'm leaning toward mercy.",
    "You know what? I'll allow it.",
    "I believe approximately 63% of this story.",
    "The excuse is weak, but the struggle feels real.",
    "You look guilty. But also exhausted.",
    "I have made worse decisions.",
    "The court understands. Unfortunately, deadlines do not.",
    "I'm willing to give you the benefit of the doubt.",
    "There is something painfully human about this excuse.",
    "I cannot prove you are lying. That will have to do.",
    "I vote for kindness today."
  ]
};

const debates = [
  ["JUDGE 01", "Absolutely not.", "JUDGE 02", "Counterpoint: absolutely yes.", "JUDGE 03", "Can we please remember we're supposed to be professionals?"],
  ["JUDGE 01", "The evidence is weak.", "JUDGE 02", "The story is strong.", "JUDGE 03", "Then perhaps we should stop pretending this is simple."],
  ["JUDGE 01", "I recommend consequences.", "JUDGE 02", "I recommend snacks.", "JUDGE 03", "I recommend a compromise."],
  ["JUDGE 01", "This is suspicious.", "JUDGE 02", "This is entertaining.", "JUDGE 03", "Both statements can be true."],
  ["JUDGE 01", "Motion denied.", "JUDGE 02", "Motion dramatically denied.", "JUDGE 03", "Fine. But I'm ordering mercy."],
  ["JUDGE 01", "We cannot reward this behaviour.", "JUDGE 02", "We absolutely can reward good storytelling.", "JUDGE 03", "I regret joining this bench."]
];

const verdicts = [
  {name:"CASE DISMISSED", category:"MERCY", line:"The court has chosen kindness today. You are free to go.", escape:null},
  {name:"NOT GUILTY", category:"ACQUITTED", line:"The evidence is insufficient to convict. Congratulations, defendant.", escape:null},
  {name:"EMOTIONALLY ACQUITTED", category:"SPECIAL RULING", line:"Technically questionable. Emotionally convincing.", escape:null},
  {name:"INSUFFICIENT EVIDENCE", category:"TECHNICALITY", line:"Nobody can prove otherwise. The court refuses to investigate further.", escape:null},
  {name:"PLEA ACCEPTED", category:"NEGOTIATED SETTLEMENT", line:"The defendant has negotiated their way out of prosecution.", escape:null},
  {name:"GUILTY, WITH CONDITIONS", category:"CONDITIONAL MERCY", line:"The court finds you responsible, but rehabilitation remains possible.", escape:null},
  {name:"BARELY BELIEVABLE", category:"SUSPICIOUS ACQUITTAL", line:"We don't believe you. Unfortunately, we admire the confidence.", escape:null},
  {name:"THE COURT IS CONFUSED", category:"ADMINISTRATIVE CHAOS", line:"Nobody understands what happened. Case dismissed.", escape:null},
  {name:"APPEAL GRANTED", category:"SECOND CHANCE", line:"You get one more chance. Please use it responsibly.", escape:null},
  {name:"TECHNICALITY", category:"LEGAL ESCAPE", line:"You escaped on a technicality. Nobody is proud of this.", escape:null},
  {name:"MERCY GRANTED", category:"HUMAN RULING", line:"The court recognizes that sometimes life simply happens.", escape:null},
  {name:"GUILTY OF BEING CUTE", category:"COUPLE COURT", line:"The court detects romantic circumstances and has lost interest in prosecution.", escape:{title:"ROMANTIC AMNESTY",text:"Sentence suspended. Pay 50 hugs and 10 forehead kisses. Case closed."}},
  {name:"GUILTY, BUT FORGIVEN", category:"COUPLE COURT", line:"The court finds the defendant responsible. Fortunately, forgiveness has been authorized.", escape:{title:"THE KISS CLAUSE",text:"Fine: ₹0. Restitution: 1,000 kisses. The court will not be accepting appeals."}},
  {name:"CASE DISMISSED ❤️", category:"LOVE & MERCY", line:"The judges have unanimously decided that this relationship needs fewer legal proceedings.", escape:{title:"THE ICE-CREAM SETTLEMENT",text:"Both parties are ordered to get ice cream together and discuss the matter like civilized humans."}},
  {name:"SUSPENDED SENTENCE", category:"COUPLE COURT", line:"Punishment is suspended pending immediate acts of affection.", escape:{title:"AFFECTIONAL SERVICE",text:"Pay 3 compliments, provide 1 snack, and deliver 1 extremely sincere apology."}},
  {name:"NOT GUILTY ❤️", category:"ROMANTIC ACQUITTAL", line:"The court finds the defendant surprisingly adorable and therefore legally inconvenient to punish.", escape:{title:"THE HUG CLAUSE",text:"You have been spared. Required payment: 50 hugs."}}
];

const loveWords = [
  "love","lover","boyfriend","girlfriend","husband","wife","partner","couple","date",
  "dating","crush","kiss","kisses","hug","hugs","heart","romantic","romance","babe",
  "baby","darling","sweetheart","fiance","fiancé","anniversary","relationship"
];

let currentCase = newCase();
let currentExcuse = "";
let currentVerdict = null;

$("#caseNumber").textContent = currentCase;
$("#docketNumber").textContent = currentCase;
$("#certCase").textContent = currentCase;

$("#excuse").addEventListener("input", e => {
  $("#charCount").textContent = `${e.target.value.length} / 280`;
});

$("#excuseForm").addEventListener("submit", e => {
  e.preventDefault();
  currentExcuse = $("#excuse").value.trim();
  if (!currentExcuse) return;

  currentCase = newCase();
  $("#caseNumber").textContent = currentCase;
  $("#docketNumber").textContent = currentCase;
  $("#certCase").textContent = currentCase;
  $("#caseQuote").textContent = `“${currentExcuse}”`;

  $("#courtroom").classList.remove("hidden");
  $("#certificateSection").classList.add("hidden");
  $("#verdictPanel").classList.add("hidden");
  $("#debate").classList.add("hidden");

  document.querySelectorAll(".judge-card").forEach(card => {
    card.classList.remove("active","decided");
    $(".judge-thinking",card).textContent = "Reviewing evidence...";
    $(".judge-verdict",card).textContent = "";
  });

  $("#courtroom").scrollIntoView({behavior:"smooth",block:"start"});
  setTimeout(() => judge(0), 650);
});

function judge(index){
  if(index >= 3){ setTimeout(showDebate, 450); return; }
  const card = $(`#judge${index+1}`);
  const pool = judgePools[`judge${index+1}`];
  card.classList.add("active");

  const thoughts = ["Cross-checking the facts...","Consulting the imaginary legal handbook...","Considering mercy...","Studying the defendant's confidence..."];
  $(".judge-thinking",card).textContent = thoughts[Math.floor(Math.random()*thoughts.length)];

  setTimeout(() => {
    $(".judge-verdict",card).textContent = pool[Math.floor(Math.random()*pool.length)];
    $(".judge-thinking",card).textContent = "Decision recorded.";
    card.classList.add("decided");
    setTimeout(() => judge(index+1), 850);
  }, 800);
}

function showDebate(){
  const d = debates[Math.floor(Math.random()*debates.length)];
  $("#debateText").innerHTML = `<strong>${d[0]}:</strong> ${escapeHtml(d[1])}<br><strong>${d[2]}:</strong> ${escapeHtml(d[3])}<br><strong>${d[4]}:</strong> ${escapeHtml(d[5])}`;
  $("#debate").classList.remove("hidden");
  setTimeout(showVerdict, 1100);
}

function showVerdict(){
  const isLove = loveWords.some(word => currentExcuse.toLowerCase().includes(word));
  const loveVerdicts = verdicts.filter(v => v.category.includes("COUPLE") || v.category.includes("LOVE") || v.name.includes("❤️"));
  const normalVerdicts = verdicts.filter(v => !v.category.includes("COUPLE") && !v.category.includes("LOVE") && !v.name.includes("❤️"));

  // Love cases get a strong chance of a playful romantic ruling, while normal cases
  // can still receive any non-romantic outcome.
  const pool = isLove ? [...normalVerdicts, ...loveVerdicts, ...loveVerdicts] : normalVerdicts;
  currentVerdict = pool[Math.floor(Math.random()*pool.length)];

  $("#verdictCategory").textContent = currentVerdict.category;
  $("#verdictWord").textContent = currentVerdict.name;
  $("#verdictLine").textContent = currentVerdict.line;

  if(currentVerdict.escape){
    $("#escapeTitle").textContent = currentVerdict.escape.title;
    $("#escapeText").textContent = currentVerdict.escape.text;
    $("#escapeCard").classList.remove("hidden");
  }else{
    $("#escapeCard").classList.add("hidden");
  }

  $("#verdictPanel").classList.remove("hidden");
  setTimeout(() => $("#verdictPanel").scrollIntoView({behavior:"smooth",block:"center"}), 250);
}

$("#certificateBtn").addEventListener("click", () => {
  populateCertificate();
  $("#certificateSection").classList.remove("hidden");
  $("#certificateSection").scrollIntoView({behavior:"smooth",block:"start"});
});

function populateCertificate(){
  if(!currentVerdict) return;
  $("#certExcuse").textContent = `“${currentExcuse}”`;
  $("#certVerdict").textContent = currentVerdict.name;
  $("#certSubVerdict").textContent = currentVerdict.line;
  const settlement = $("#certSettlement");
  if(currentVerdict.escape){
    settlement.textContent = `${currentVerdict.escape.title}: ${currentVerdict.escape.text}`;
    settlement.classList.remove("hidden");
  }else{
    settlement.classList.add("hidden");
  }
  $("#certDate").textContent = new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
}

$("#shareBtn").addEventListener("click", async () => {
  if(!currentVerdict) return;
  const settlement = currentVerdict.escape ? `\n${currentVerdict.escape.title}: ${currentVerdict.escape.text}` : "";
  const text = `⚖️ THE EXCUSE COURT\nCase ${currentCase}\nVerdict: ${currentVerdict.name}\n${currentVerdict.line}${settlement}\nExcuse: “${currentExcuse}”`;
  try{
    if(navigator.share) await navigator.share({title:"The Excuse Court Verdict",text});
    else { await navigator.clipboard.writeText(text); toast("Verdict copied."); }
  }catch(e){ if(e.name !== "AbortError") toast("Could not share. Verdict copied instead."); }
});

$("#copyBtn").addEventListener("click", async () => {
  populateCertificate();
  const settlement = currentVerdict.escape ? `\n${currentVerdict.escape.title}: ${currentVerdict.escape.text}` : "";
  const text = `⚖️ THE EXCUSE COURT | ${currentCase}\n${currentVerdict.name}\n${currentVerdict.line}${settlement}\nExcuse: “${currentExcuse}”`;
  await navigator.clipboard.writeText(text);
  toast("Verdict copied.");
});

$("#downloadSvgBtn").addEventListener("click", () => {
  populateCertificate();
  const svg = certificateSvg();
  download(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}),`${currentCase}-court-record.svg`);
  toast("Court record downloaded as SVG.");
});

$("#downloadPngBtn").addEventListener("click", () => {
  populateCertificate();
  const svg = certificateSvg();
  const url = URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width=1600; canvas.height=1050;
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#fbf4df"; ctx.fillRect(0,0,1600,1050);
    ctx.drawImage(img,0,0,1600,1050);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      download(blob,`${currentCase}-court-record.png`);
      toast("Court record downloaded as PNG.");
    },"image/png");
  };
  img.src=url;
});

function certificateSvg(){
  const excuse = escapeXml(currentExcuse.length>190 ? currentExcuse.slice(0,187)+"..." : currentExcuse);
  const verdict = escapeXml(currentVerdict.name);
  const line = escapeXml(currentVerdict.line);
  const settlement = currentVerdict.escape ? escapeXml(`${currentVerdict.escape.title}: ${currentVerdict.escape.text}`) : "";
  const date = escapeXml(new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1050" viewBox="0 0 1600 1050">
<rect width="1600" height="1050" fill="#fbf4df"/>
<rect x="24" y="24" width="1552" height="1002" fill="none" stroke="#191714" stroke-width="5"/>
<rect x="48" y="48" width="1504" height="954" fill="none" stroke="#191714" stroke-width="9"/>
<rect x="68" y="68" width="1464" height="914" fill="none" stroke="#191714" stroke-width="2"/>
<text x="800" y="120" text-anchor="middle" font-family="Courier New" font-size="18" letter-spacing="5">THE EXCUSE COURT • COURT OF QUESTIONABLE JUSTICE</text>
<text x="800" y="205" text-anchor="middle" font-size="70">⚖</text>
<text x="800" y="305" text-anchor="middle" font-family="Georgia" font-size="68">OFFICIAL COURT RECORD</text>
<text x="800" y="365" text-anchor="middle" font-family="Courier New" font-size="15" letter-spacing="4">CASE NUMBER ${escapeXml(currentCase)}</text>
<text x="800" y="425" text-anchor="middle" font-family="Courier New" font-size="15" letter-spacing="4">THE DEFENDANT PRESENTED</text>
<text x="800" y="485" text-anchor="middle" font-family="Courier New" font-size="22">${excuse}</text>
<line x1="430" y1="530" x2="1170" y2="530" stroke="#191714" stroke-width="2"/>
<text x="800" y="585" text-anchor="middle" font-family="Courier New" font-size="15" letter-spacing="4">FINAL DECISION</text>
<text x="800" y="650" text-anchor="middle" font-family="Georgia" font-size="43" font-weight="bold" fill="#9e3027">${verdict}</text>
<text x="800" y="705" text-anchor="middle" font-family="Courier New" font-size="19">${line}</text>
${settlement ? `<text x="800" y="770" text-anchor="middle" font-family="Courier New" font-size="16">${settlement}</text>` : ""}
<text x="800" y="830" text-anchor="middle" font-family="Courier New" font-size="15">${date}</text>
<line x1="250" y1="900" x2="600" y2="900" stroke="#191714"/>
<line x1="1000" y1="900" x2="1350" y2="900" stroke="#191714"/>
<text x="425" y="930" text-anchor="middle" font-family="Courier New" font-size="13">THE COURT</text>
<text x="1175" y="930" text-anchor="middle" font-family="Courier New" font-size="13">RECORDS CLERK</text>
<text x="1450" y="970" text-anchor="end" font-family="Courier New" font-size="12">Valid until somebody objects.</text>
</svg>`;
}

function newCase(){return "EC-"+String(Math.floor(Math.random()*9999)+1).padStart(4,"0")}
function escapeHtml(v){return v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeXml(v){return escapeHtml(v)}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function toast(message){$("#toast").textContent=message;$("#toast").classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>$("#toast").classList.remove("show"),2400)}
