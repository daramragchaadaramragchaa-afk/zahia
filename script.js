// ===== Helpers =====
const $ = (id) => document.getElementById(id);

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function rand(min, max){ return Math.random() * (max - min) + min; }

const heartsLayer = document.querySelector(".hearts-layer");
let heartsOn = true;
let heartTimer = null;

// Floating hearts generator
function spawnHeart(x = rand(0, window.innerWidth)){
  if(!heartsOn) return;
  const h = document.createElement("div");
  h.className = "heart";
  const size = rand(10, 18);
  h.style.width = `${size}px`;
  h.style.height = `${size}px`;
  h.style.left = `${x}px`;
  h.style.bottom = `-20px`;
  h.style.opacity = `${rand(0.5, 1)}`;
  h.style.animationDuration = `${rand(4, 8)}s`;
  heartsLayer.appendChild(h);

  // remove after animation
  setTimeout(() => h.remove(), 9000);
}

function startHearts(){
  if(heartTimer) return;
  heartTimer = setInterval(() => spawnHeart(), 240);
}
function stopHearts(){
  clearInterval(heartTimer);
  heartTimer = null;
}

// Burst particles at a point
function burst(x, y){
  const count = 26;
  for(let i=0;i<count;i++){
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.setProperty("--dx", `${rand(-120, 120)}px`);
    p.style.setProperty("--dy", `${rand(-140, 140)}px`);
    p.style.opacity = `${rand(0.6, 1)}`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

// ===== Modal logic =====
const modal = $("modal");
function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// ===== Name binding =====
function syncNames(){
  const from = $("fromName").value.trim() || "Би";
  const to = $("toName").value.trim() || "Чи";
  $("fromOut").textContent = from;
  $("toOut").textContent = to;
}
$("fromName").addEventListener("input", syncNames);
$("toName").addEventListener("input", syncNames);

// ===== Letter open =====
$("openLetter").addEventListener("click", (e) => {
  syncNames();
  openModal();
  burst(window.innerWidth * 0.5, window.innerHeight * 0.35);
});

// close modal handlers
$("closeModal").addEventListener("click", closeModal);
$("xClose").addEventListener("click", closeModal);
window.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape") closeModal();
});

// Surprise button
$("burst").addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  burst(rect.left + rect.width/2, rect.top + rect.height/2);
  // spawn a few hearts from center
  for(let i=0;i<14;i++) spawnHeart(window.innerWidth/2 + rand(-60, 60));
});

// Download letter as txt
$("downloadTxt").addEventListener("click", () => {
  syncNames();
  const text =
`Хайрт ${$("toOut").textContent} минь,

${$("letterBody").textContent}

Хайраар,
${$("fromOut").textContent}`;
  const blob = new Blob([text], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "valentine-letter.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// ===== Wish generator =====
const wishes = [
  "Чамтай хамт байгаа мөч бүр миний аз жаргал. 💗",
  "Өнөөдөр чамд маш их хайртай гэдгээ дахин хэлмээр байна. 💘",
  "Инээмсэглэл чинь миний хамгийн дуртай зүйл. ✨",
  "Чиний дэргэд би өөрөөрөө байх хамгийн амархан. 🌙",
  "Бидний дурсамж улам олон болох болтугай. 📸",
  "Өдөр бүрийг хамтдаа илүү дулаан болгоё. ☕"
];

$("makeWish").addEventListener("click", (e) => {
  const w = wishes[Math.floor(Math.random() * wishes.length)];
  $("wishBox").textContent = w;
  const rect = e.target.getBoundingClientRect();
  burst(rect.left + rect.width/2, rect.top + rect.height/2);
});

// ===== Photo shuffle (gradient variations) =====
const photoBox = $("photoBox");
const photoThemes = [
  ["rgba(255,77,166,.22)","rgba(139,92,246,.18)","rgba(255,45,111,.14)"],
  ["rgba(139,92,246,.22)","rgba(255,255,255,.12)","rgba(255,77,166,.12)"],
  ["rgba(255,45,111,.22)","rgba(255,77,166,.16)","rgba(139,92,246,.12)"],
  ["rgba(255,255,255,.10)","rgba(255,77,166,.18)","rgba(139,92,246,.18)"],
];

function setPhotoTheme(){
  const t = photoThemes[Math.floor(Math.random() * photoThemes.length)];
  photoBox.style.background =
    `radial-gradient(220px 180px at 20% 30%, ${t[0]}, transparent 60%),
     radial-gradient(240px 200px at 80% 20%, ${t[1]}, transparent 60%),
     radial-gradient(260px 220px at 60% 90%, ${t[2]}, transparent 60%),
     linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))`;
}
$("swapPhoto").addEventListener("click", (e) => {
  setPhotoTheme();
  const rect = e.target.getBoundingClientRect();
  burst(rect.left + rect.width/2, rect.top + rect.height/2);
});
setPhotoTheme();

// ===== Copy custom letter =====
$("copyText").addEventListener("click", async (e) => {
  const t = $("customText").value.trim();
  if(!t){
    $("customText").focus();
    return;
  }
  try{
    await navigator.clipboard.writeText(t);
    const rect = e.target.getBoundingClientRect();
    burst(rect.left + rect.width/2, rect.top + rect.height/2);
  }catch{
    // fallback
    $("customText").select();
    document.execCommand("copy");
  }
});
$("clearText").addEventListener("click", () => {
  $("customText").value = "";
  $("customText").focus();
});

// ===== Hearts toggle =====
$("toggleHearts").addEventListener("click", () => {
  heartsOn = !heartsOn;
  $("toggleHearts").textContent = heartsOn ? "💞 Hearts: ON" : "🖤 Hearts: OFF";
  $("toggleHearts").setAttribute("aria-pressed", String(heartsOn));
  if(heartsOn) startHearts();
  else stopHearts();
});

// Click anywhere creates small heart burst
window.addEventListener("pointerdown", (e) => {
  // avoid when clicking modal backdrop to close
  if(modal.classList.contains("show")) return;
  if(Math.random() < 0.55){
    spawnHeart(e.clientX);
  }
});

// ===== Countdown to Feb 14 (local year) =====
function getValentineTarget(){
  const now = new Date();
  const year = now.getFullYear();
  // Feb is month 1 (0-indexed)
  const t = new Date(year, 1, 14, 0, 0, 0);
  // If already passed this year, use next year
  if(now > t) return new Date(year + 1, 1, 14, 0, 0, 0);
  return t;
}

function tickCountdown(){
  const now = new Date();
  const target = getValentineTarget();
  const diff = target - now;

  if(diff <= 0){
    $("d").textContent = "0";
    $("h").textContent = "0";
    $("m").textContent = "0";
    $("s").textContent = "0";
    $("countHint").textContent = "Өнөөдөр Валентины өдөр! 💘";
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / (24 * 3600));
  const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  $("d").textContent = String(days);
  $("h").textContent = String(hours);
  $("m").textContent = String(mins);
  $("s").textContent = String(secs);

  const mm = target.toLocaleString(undefined, { month:"long" });
  $("countHint").textContent = `Зорилтот өдөр: ${mm} 14 (${target.getFullYear()})`;
}

setInterval(tickCountdown, 1000);
tickCountdown();

// Start hearts initially
startHearts();

// Quick action: send heart
$("sendHeart").addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  burst(rect.left + rect.width/2, rect.top + rect.height/2);
  for(let i=0;i<10;i++) spawnHeart(rand(0, window.innerWidth));
});
