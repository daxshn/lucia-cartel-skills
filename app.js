const SKILLS = [
  {
    folder: "doodle-shorts-remotion",
    name: "Doodle people in 3D rooms",
    accent: "#f6c343",
    text: "Hand-drawn doodle characters, round white faces and stick legs, living in soft-lit three.js rooms with a moving camera. You give it an idea and get a 40 to 65 second vertical short with voice, bold captions and music. The skill file is written in Russian; Claude reads it fine.",
    needs: ["Remotion", "three.js", "Node 18+", "ffmpeg"],
    file: "downloads/doodle-shorts-remotion.zip",
    size: "32 KB",
    clips: [
      ["doodle-gta6", "GTA 6's 200 GB leak"],
      ["doodle-sea", "438 days lost at sea"],
    ],
  },
  {
    folder: "ClaudeAnimationBase1",
    name: "Painted characters that feel handmade",
    accent: "#ff6b8b",
    text: "A p5.js and p5.brush starter kit for brush-stroke characters with boiling linework and watercolour fills. Claude storyboards first, builds shot by shot, checks contact sheets and renders the MP4. This is what makes the “Every type of person” videos.",
    needs: ["p5.js", "p5.brush", "Node", "Chrome", "ffmpeg", "A GPU helps"],
    file: "downloads/ClaudeAnimationBase1.zip",
    size: "7.5 MB",
    clips: [
      ["clawd-bf", "Every type of person on Black Friday"],
      ["clawd-tg", "Every type of person at Thanksgiving"],
    ],
  },
  {
    folder: "in-this-city-gta-short",
    name: "Open-world game shorts in Blender",
    accent: "#3fd0c9",
    text: "30 to 45 second “In this city…” rule shorts that look like a 3D open-world game: a sunny city, a player, cars and big word captions. Claude drives Blender with Python, no clicking. The zip includes the city, people, shot and caption scripts from the bank balance short.",
    needs: ["Blender", "EEVEE", "Python", "ffmpeg", "A voice tool"],
    file: "downloads/in-this-city-gta-short.zip",
    size: "31 KB",
    clips: [
      ["city-bank", "If GTA 6 showed your bank balance"],
      ["city-lie", "Every lie shrinks you an inch"],
    ],
  },
  {
    folder: "faceless-shorts",
    name: "Six faceless styles, zero cost",
    accent: "#ff9a45",
    text: "Science what-ifs, mysteries, stick-figure survival steps, x-ray explainers, paper-cut history and funny true stories. Everything is code: a free local voice, word-synced captions, numpy sound. No AI images, no API keys, no credits.",
    needs: ["Python", "Kokoro voice", "Whisper", "Chrome", "ffmpeg"],
    file: "downloads/faceless-shorts.zip",
    size: "10.4 MB",
    clips: [
      ["faceless-blackhole", "What if you fell into a black hole?"],
      ["faceless-phone", "What if you swallowed your phone?"],
      ["faceless-survive", "100 days in an apocalypse"],
    ],
  },
  {
    folder: "cartoon-audio-short",
    name: "Cartoon true stories over your voice",
    accent: "#a98bff",
    text: "Flat bean-head cartoon characters in a colourful 3D world with ink outlines and gliding cameras. It offers ten ideas, writes the script, then times every shot to your voiceover and mixes music and sound effects at half the voice level.",
    needs: ["Remotion", "three.js", "Node", "ffmpeg", "Your voiceover"],
    file: "downloads/cartoon-audio-short.zip",
    size: "98 KB",
    clips: [
      ["cartoon-gimli", "The Gimli Glider"],
      ["cartoon-door", "The door nobody dares to open"],
      ["cartoon-unabomber", "The Unabomber"],
    ],
  },
];

const TITLES = [
  "What if the internet shut down for a week?",
  "What would you do if you were lost at sea?",
  "Why do we get goosebumps?",
  "What if you swallowed your phone?",
  "Why can't you remember being a baby?",
  "If GTA 6 showed your bank balance",
  "What if the moon disappeared tonight?",
  "What if you fell into a black hole?",
  "The volcano that erased summer",
  "The Gimli Glider",
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";

/* ---------- title letters ---------- */
document.querySelectorAll("[data-split]").forEach((line, li) => {
  const text = line.textContent;
  line.textContent = "";
  line.setAttribute("aria-hidden", "true");
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = ch;
    s.style.animationDelay = `${0.55 + li * 0.35 + i * 0.07}s`;
    line.appendChild(s);
  });
});

/* ---------- skyline ---------- */
function rand(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function buildSkyline(svg, { seed, color, minH, maxH, windows, spire }) {
  const W = 1600, H = 400, r = rand(seed);
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const frag = document.createDocumentFragment();
  let x = -10;
  while (x < W) {
    const w = 50 + r() * 90;
    const h = minH + r() * (maxH - minH);
    const b = document.createElementNS(NS, "rect");
    b.setAttribute("x", x); b.setAttribute("y", H - h);
    b.setAttribute("width", w + 1); b.setAttribute("height", h);
    b.setAttribute("fill", color);
    frag.appendChild(b);
    if (spire && r() > 0.72) {
      const p = document.createElementNS(NS, "polygon");
      const cx = x + w / 2;
      p.setAttribute("points", `${cx - w * 0.25},${H - h} ${cx},${H - h - 40 - r() * 50} ${cx + w * 0.25},${H - h}`);
      p.setAttribute("fill", color);
      frag.appendChild(p);
    }
    if (windows) {
      for (let wy = H - h + 14; wy < H - 14; wy += 22) {
        for (let wx = x + 10; wx < x + w - 14; wx += 18) {
          if (r() > 0.62) {
            const win = document.createElementNS(NS, "rect");
            win.setAttribute("x", wx); win.setAttribute("y", wy);
            win.setAttribute("width", 8); win.setAttribute("height", 11);
            win.setAttribute("class", "win");
            win.style.animationDelay = `${1.2 + r() * 2.4}s`;
            frag.appendChild(win);
          }
        }
      }
    }
    x += w + 2 + r() * 8;
  }
  svg.appendChild(frag);
}
buildSkyline(document.getElementById("skyline-far"), { seed: 7, color: "#5b2a78", minH: 120, maxH: 330, windows: false, spire: true });
buildSkyline(document.getElementById("skyline-near"), { seed: 31, color: "#1a0f2e", minH: 70, maxH: 260, windows: true, spire: false });
document.querySelectorAll(".skyline .win").forEach((w) => {
  w.classList.add(Math.random() > 0.93 ? "flick" : "on");
});

/* ---------- ticker ---------- */
const ticker = document.getElementById("ticker");
const tickerHTML = TITLES.map((t) => `<span>${t}</span>`).join("");
ticker.innerHTML = tickerHTML + tickerHTML;

/* ---------- skills ---------- */
const DL_ICON = '<svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m6 10 6 6 6-6"/><path d="M4 21h16"/></svg>';
const list = document.getElementById("skill-list");
list.innerHTML = SKILLS.map((s) => `
  <article class="skill reveal" style="--accent:${s.accent}" aria-labelledby="sk-${s.folder}">
    <div class="skill-text">
      <span class="chip">${s.folder}</span>
      <h3 id="sk-${s.folder}">${s.name}</h3>
      <p>${s.text}</p>
      <ul class="needs" aria-label="What it uses">${s.needs.map((n) => `<li>${n}</li>`).join("")}</ul>
      <a class="btn btn-gold" href="${s.file}" download>${DL_ICON} Download skill <small>${s.size}</small></a>
    </div>
    <div class="board">
      <div class="reel">
        ${s.clips.map(([id, title]) => `
          <figure>
            <div class="phone"><video muted loop playsinline preload="none" poster="media/${id}.jpg" data-src="media/${id}.mp4" aria-label="Clip from ${title}"></video></div>
            <figcaption>${title}</figcaption>
          </figure>`).join("")}
      </div>
    </div>
  </article>`).join("");

/* ---------- film styles (Lemo-Opuscar) ---------- */
const STYLES = [
  ["rubber-hose", "1930s rubber hose cartoon", "Coffee Cup Chase", "A coffee cup chases a runaway sugar cube around the kitchen.", "81 KB"],
  ["cel-anime-80s", "80s cel anime", "City Lights, 1987", "A courier girl rides through a rain-soaked neon city before dawn.", "97 KB"],
  ["ukiyoe", "Ukiyo-e woodblock", "Toward the Mountain", "Every shot is a woodblock print, with a great wave at the climax.", "67 KB"],
  ["papercut-red", "Red paper-cut", "Nian Comes to Town", "One girl's giant paper-cut lights up the village to scare off a beast.", "92 KB"],
  ["hd-2d", "2.5D pixel art", "The Lampbearer", "A girl carries the last flame through a night forest to a dark lighthouse.", "90 KB"],
  ["shadow-puppet", "Shadow puppetry", "Hou Yi Shoots the Suns", "Ten suns scorch the earth, told with leather puppets on a lit screen.", "78 KB"],
  ["stained-glass", "Stained glass", "The Dragon of the East Window", "Sunlight crosses a cathedral window, waking each pane of a dragon tale.", "75 KB"],
  ["neon-tubes", "Neon tubes", "Midnight Snack", "A neon cat steals the goldfish from the sign down the street.", "116 KB"],
  ["crayon-world", "Crayon world 3D", "The Butterfly", "A first-person flight over a crayon village to one old man's flower.", "56 KB"],
  ["backrooms", "Liminal found footage", "Night Shift Orientation", "A new hire films their first night in an endless yellow office.", "68 KB"],
];
document.getElementById("style-grid").innerHTML = STYLES.map(([slug, name, film, line, size]) => `
  <article class="style-card reveal">
    <div class="screen"><video muted loop playsinline preload="none" poster="media/styles/${slug}.jpg" data-src="media/styles/${slug}.mp4" aria-label="Clip from ${film}"></video></div>
    <div class="style-body">
      <h3>${name}</h3>
      <p><strong>${film}.</strong> ${line}</p>
      <a class="btn btn-gold btn-sm" href="downloads/styles/${slug}.zip" download>${DL_ICON} Download style <small>${size}</small></a>
    </div>
  </article>`).join("");

/* ---------- play videos only while on screen ---------- */
const videos = document.querySelectorAll("video[data-src]");
const vio = new IntersectionObserver((entries) => {
  entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src) { v.src = v.dataset.src; }
      if (!reduceMotion) v.play().catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  });
}, { rootMargin: "200px 0px" });
videos.forEach((v) => vio.observe(v));

/* ---------- row reveal ---------- */
const rio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
  });
}, { threshold: 0.18 });
document.querySelectorAll(".reveal").forEach((el) => rio.observe(el));

/* ---------- nav background ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
