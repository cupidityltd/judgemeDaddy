const $ = (selector) => document.querySelector(selector);

const form = $("#excuseForm");
const excuseInput = $("#excuse");
const charCount = $("#charCount");
const courtroom = $("#courtroom");
const certificateSection = $("#certificateSection");
const toast = $("#toast");

const judges = [
  {
    id: "judge1",
    lines: [
      "Convicted. Next case.",
      "Convicted. I have heard worse.",
      "Guilty. The evidence is offensively weak.",
      "Convicted. Please respect the assignment."
    ]
  },
  {
    id: "judge2",
    lines: [
      "Impressed by creativity.",
      "I hate to admit it, but that was inventive.",
      "Creative. Suspicious, but creative.",
      "Points for originality. Zero points for punctuality."
    ]
  },
  {
    id: "judge3",
    lines: [
      "Has used the same excuse.",
      "I have personally submitted this exact defence.",
      "Objection. I used this one last semester.",
      "The court recognizes this excuse from personal experience."
    ]
  }
];

let currentCase = "EC-" + String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
let currentExcuse = "";
let finalVerdict = "GUILTY";
let finalLine = "But suspiciously believable.";

$("#caseNumber").textContent = currentCase;
$("#docketNumber").textContent = currentCase;
$("#certCase").textContent = currentCase;

excuseInput.addEventListener("input", () => {
  charCount.textContent = `${excuseInput.value.length} / 240`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  currentExcuse = excuseInput.value.trim();
  if (!currentExcuse) return;

  courtroom.classList.remove("hidden");
  certificateSection.classList.add("hidden");
  $("#verdictPanel").style.display = "none";

  judges.forEach((judge) => {
    const card = $("#" + judge.id);
    card.classList.remove("active", "decided");
    $(".judge-verdict", card).textContent = "Awaiting evidence...";
  });

  courtroom.scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => judgeNext(0), 650);
});

function judgeNext(index) {
  if (index >= judges.length) {
    setTimeout(showFinalVerdict, 450);
    return;
  }

  const judge = judges[index];
  const card = $("#" + judge.id);
  const verdict = $(".judge-verdict", card);

  card.classList.add("active");

  setTimeout(() => {
    verdict.textContent = judge.lines[Math.floor(Math.random() * judge.lines.length)];
    card.classList.add("decided");

    if (index === judges.length - 1) {
      setTimeout(showFinalVerdict, 500);
    } else {
      setTimeout(() => judgeNext(index + 1), 850);
    }
  }, 800);
}

function showFinalVerdict() {
  $("#verdictPanel").style.display = "block";
  const variants = [
    ["GUILTY", "But suspiciously believable."],
    ["GUILTY", "The court has questions. Your excuse has style."],
    ["GUILTY", "Believable enough to cause administrative concern."],
    ["GUILTY", "The evidence is flimsy. The confidence is not."]
  ];
  [finalVerdict, finalLine] = variants[Math.floor(Math.random() * variants.length)];
  $("#verdictWord").textContent = finalVerdict;
  $("#verdictLine").textContent = finalLine;
  window.scrollTo({ top: document.body.scrollHeight * .62, behavior: "smooth" });
}

$("#certificateBtn").addEventListener("click", () => {
  populateCertificate();
  certificateSection.classList.remove("hidden");
  certificateSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

function populateCertificate() {
  $("#certExcuse").textContent = `“${currentExcuse}”`;
  $("#certVerdict").textContent = `${finalVerdict}, ${finalLine.toUpperCase()}`;
  $("#certDate").textContent = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric"
  });
}

$("#shareBtn").addEventListener("click", async () => {
  const text = `⚖️ THE EXCUSE COURT\nCase ${currentCase}\nVerdict: ${finalVerdict}, ${finalLine}\nExcuse: “${currentExcuse}”`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "The Excuse Court Verdict", text });
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Verdict copied to clipboard.");
    }
  } catch {
    showToast("Share cancelled.");
  }
});

$("#copyBtn").addEventListener("click", async () => {
  populateCertificate();
  const text = `⚖️ THE EXCUSE COURT | ${currentCase}\nVerdict: ${finalVerdict}, ${finalLine}\nExcuse: “${currentExcuse}”`;
  await navigator.clipboard.writeText(text);
  showToast("Verdict copied.");
});

$("#downloadSvgBtn").addEventListener("click", () => {
  populateCertificate();
  const svg = certificateToSvg();
  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${currentCase}-excuse-certificate.svg`);
  showToast("Certificate downloaded as SVG.");
});

$("#downloadPngBtn").addEventListener("click", () => {
  populateCertificate();
  const svg = certificateToSvg();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1050;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fbf4df";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((png) => {
      downloadBlob(png, `${currentCase}-excuse-certificate.png`);
      showToast("Certificate downloaded as PNG.");
    }, "image/png");
  };
  img.src = url;
});

function certificateToSvg() {
  const safeExcuse = escapeXml(currentExcuse.length > 190 ? currentExcuse.slice(0, 187) + "..." : currentExcuse);
  const safeVerdict = escapeXml(`${finalVerdict}, ${finalLine.toUpperCase()}`);
  const date = escapeXml(new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric"
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1050" viewBox="0 0 1600 1050">
  <rect width="1600" height="1050" fill="#fbf4df"/>
  <rect x="24" y="24" width="1552" height="1002" fill="none" stroke="#171512" stroke-width="5"/>
  <rect x="48" y="48" width="1504" height="954" fill="none" stroke="#171512" stroke-width="9"/>
  <rect x="68" y="68" width="1464" height="914" fill="none" stroke="#171512" stroke-width="2"/>
  <text x="800" y="120" text-anchor="middle" font-family="Courier New, monospace" font-size="18" letter-spacing="5" fill="#171512">THE EXCUSE COURT • COURT OF QUESTIONABLE JUSTICE</text>
  <text x="800" y="205" text-anchor="middle" font-size="68">⚖</text>
  <text x="800" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="66" fill="#171512">OFFICIAL EXCUSE</text>
  <text x="800" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="66" fill="#171512">CERTIFICATE</text>
  <text x="800" y="425" text-anchor="middle" font-family="Courier New, monospace" font-size="15" letter-spacing="4">THIS DOCUMENT HEREBY RECORDS THAT</text>
  <text x="800" y="480" text-anchor="middle" font-family="Georgia, serif" font-size="30">THE DEFENDANT</text>
  <text x="800" y="535" text-anchor="middle" font-family="Courier New, monospace" font-size="15" letter-spacing="4">SUBMITTED THE FOLLOWING DEFENCE</text>
  <text x="800" y="585" text-anchor="middle" font-family="Courier New, monospace" font-size="23" fill="#171512">${safeExcuse}</text>
  <line x1="430" y1="625" x2="1170" y2="625" stroke="#171512" stroke-width="2"/>
  <text x="800" y="680" text-anchor="middle" font-family="Courier New, monospace" font-size="21">VERDICT:</text>
  <text x="800" y="725" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="27" fill="#9f3027">${safeVerdict}</text>
  <text x="800" y="780" text-anchor="middle" font-family="Courier New, monospace" font-size="16">${date}</text>
  <line x1="240" y1="870" x2="620" y2="870" stroke="#171512"/>
  <line x1="980" y1="870" x2="1360" y2="870" stroke="#171512"/>
  <text x="430" y="900" text-anchor="middle" font-family="Courier New, monospace" font-size="13">THE COURT</text>
  <text x="1170" y="900" text-anchor="middle" font-family="Courier New, monospace" font-size="13">THE RECORDS CLERK</text>
  <text x="1460" y="960" text-anchor="end" font-family="Courier New, monospace" font-size="12">CASE ${escapeXml(currentCase)}</text>
</svg>`;
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, char => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;"
  }[char]));
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
