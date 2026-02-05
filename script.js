const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const msg = params.get("msg");

const nameEl = document.getElementById("name");
const toName = document.getElementById("toName");
const loveMessageEl = document.getElementById("loveMessage");
const dateEl = document.getElementById("date");

if (name && nameEl) nameEl.textContent = name;
if (name && toName) toName.textContent = name;
if (msg && loveMessageEl) loveMessageEl.textContent = msg;

if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const heartsRoot = document.getElementById("heartBurst");

function popHearts(count = 18) {
  const emojis = ["❤️", "💗", "💘", "💞", "💖", "💕"];
  const env = document.getElementById("envelopeBtn");
  const rect = env.getBoundingClientRect();

  // center of envelope
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
        s.className = "burst-heart";
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // spawn at envelope center
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;

    // random burst direction
    const angle = Math.random() * Math.PI * 2;           // 0..2π
    const distance = 90 + Math.random() * 140;           // how far it flies
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const upwardBias = 40 + Math.random() * 50;
    s.style.setProperty("--dx", `${dx}px`);
    s.style.setProperty("--dy", `${dy - upwardBias}px`);

    // variation
    s.style.setProperty("--dur", `${650 + Math.random() * 650}ms`);
    s.style.fontSize = `${16 + Math.random() * 20}px`;

    heartsRoot.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
}

const envelopeBtn = document.getElementById("envelopeBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");

let opened = false;

envelopeBtn.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.closest(".yn-row")) return;

  opened = !opened;
  envelopeBtn.classList.toggle("open", opened);
  popHearts(opened ? 26 : 10);
});

const noFlash = document.getElementById("noFlash");

const noMessages = [
  "Are you sure?",
  "Really????.",
  "Regan, please.",
  "This is your last chance.",
  "No option has been revoked. I love you ❤️"
];

let noClicks = 0;
let flashTimer = null;

function flashNoMessage(text) {
  if (!noFlash) return;
  noFlash.textContent = text;

  noFlash.classList.remove("show");
  // force reflow so the animation can retrigger each time
  void noFlash.offsetWidth;
  noFlash.classList.add("show");

  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => noFlash.classList.remove("show"), 1100);
}

noBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  noClicks += 1;

  const idx = Math.min(noClicks - 1, noMessages.length - 1);
  flashNoMessage(noMessages[idx]);

  // On the 5th click: disappear entirely
  if (noClicks >= 5) {
    noBtn.style.display = "none";
    popHearts(18);
    return;
  }

  const body = document.querySelector(".letter-body");
  const bodyRect = body.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  
  const margin = 10;
  
  const boxLeft = bodyRect.left + margin;
  const boxRight = bodyRect.right - margin;
  const boxTop = bodyRect.top + margin;
  const boxBottom = bodyRect.bottom - margin;
  
  // Compute the allowed top-left range for the button so it fully fits
  const minX = boxLeft;
  const maxX = boxRight - btnRect.width;
  const minY = boxTop;
  const maxY = boxBottom - btnRect.height;
  
  if (maxX <= minX || maxY <= minY) return;
  
  // Choose a random position where the button fully fits
  const targetX = minX + Math.random() * (maxX - minX);
  const targetY = minY + Math.random() * (maxY - minY);
  
  const dx = targetX - btnRect.left;
  const dy = targetY - btnRect.top;

  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;

  popHearts(10);
});

yesBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  result.hidden = false;
  result.textContent = "YAY 💖 okay cool you’re stuck with me.";

  // Big celebration: raining hearts
  startHeartRain();

  popHearts(55);

  // After the celebration, reset everything back to the start
  setTimeout(() => {
    resetCardToStart();
  }, 3000);
});

const heartRain = document.getElementById("heartRain");

function startHeartRain(durationMs = 2600, intensity = 80) {
  if (!heartRain) return;

  const emojis = ["❤️", "💗", "💘", "💞", "💖", "💕"];

  heartRain.innerHTML = "";
  document.body.classList.add("raining");

  const heartsPerSecond = Math.min(70, Math.max(80, intensity)); 
  const tickMs = 70; // spawn in little "bursts"
  const heartsPerTick = Math.max(2, Math.round((heartsPerSecond * tickMs) / 1000));

  // Hard cap to prevent lag
  const MAX_HEARTS_ON_SCREEN = 180;

  const spawnBatch = () => {
    if (heartRain.childElementCount > MAX_HEARTS_ON_SCREEN) return;

    for (let i = 0; i < heartsPerTick; i++) {
      const h = document.createElement("span");
      h.className = "rain-heart";
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const x = Math.random() * window.innerWidth;
      const drift = (Math.random() - 0.5) * 220;
      const dur = 1200 + Math.random() * 900;   
      const size = 16 + Math.random() * 22;    
      const rot = (Math.random() - 0.5) * 520;

      h.style.left = `${x}px`;
      h.style.fontSize = `${size}px`;
      h.style.setProperty("--drift", `${drift}px`);
      h.style.setProperty("--dur", `${dur}ms`);
      h.style.setProperty("--rot", `${rot}deg`);

      heartRain.appendChild(h);
      h.addEventListener("animationend", () => h.remove());
    }
  };

  const timer = setInterval(spawnBatch, tickMs);

  setTimeout(() => {
    clearInterval(timer);
    // Let remaining hearts finish, then clear
    setTimeout(() => {
      heartRain.innerHTML = "";
      document.body.classList.remove("raining");
    }, 900);
  }, durationMs);
}

function resetCardToStart() {
  // Reset envelope
  opened = false;
  envelopeBtn.classList.remove("open");

  // Reset "Yes" result message
  result.hidden = true;
  result.textContent = "";

  // Reset "No" behavior
  if (typeof noClicks !== "undefined") noClicks = 0;

  if (noBtn) {
    noBtn.style.display = "";
    noBtn.style.transform = "";
    noBtn.style.position = "";
    noBtn.style.left = "";
    noBtn.style.top = "";
  }

  if (typeof noFlash !== "undefined" && noFlash) {
    noFlash.textContent = "";
    noFlash.classList.remove("show");
  }
}
