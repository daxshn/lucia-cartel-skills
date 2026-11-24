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

/* ---------- hero: 7 different clips on a smooth endless conveyor ---------- */
// columns of phones that all slide top to bottom; the phone nearest the centre is
// big and sharp, everything else blurs with distance. Mix of channel shorts and
// Lemo-Opuscar films (cropped to 9:16, in media/hero/).
const HERO_POOL = [
  "hero/rubber-hose", "doodle-gta6", "hero/neon-tubes", "city-bank", "hero/papercut-red",
  "clawd-bf", "hero/hd-2d", "faceless-goosebumps", "cartoon-gimli", "faceless-blackhole",
  "city-lie", "doodle-sea", "faceless-phone", "cartoon-door", "clawd-tg",
];
const COLS = [-2, -1, 0, 1, 2];
const PER_COL = 4;
const COL_SPEED = { "-2": 22, "-1": 30, "0": 40, "1": 30, "2": 22 }; // px/s, centre fastest
const carousel = document.getElementById("carousel");
const heroItems = [];
let n = 0;
COLS.forEach((c) => {
  for (let r = 0; r < PER_COL; r++) {
    const id = HERO_POOL[(n * PER_COL + r) % HERO_POOL.length];
    heroItems.push({ c, r, id });
  }
  n++;
});
carousel.innerHTML = heroItems.map(({ id }) => `<div class="phone"><video muted loop playsinline preload="metadata" poster="media/${id}.jpg" src="media/${id}.mp4"></video></div>`).join("");
document.getElementById("dots").remove();
heroItems.forEach((it, i) => { it.el = carousel.children[i]; it.v = it.el.firstElementChild; it.blur = -1; });
const heroBox = document.querySelector(".billboards");
let heroOff = 0, heroSpeed = 0, heroTarget = reduceMotion ? 0 : 1, heroLast = 0;
heroBox.addEventListener("mouseenter", () => { heroTarget = reduceMotion ? 0 : 0.25; });
heroBox.addEventListener("mouseleave", () => { heroTarget = reduceMotion ? 0 : 1; });
function drawHero(t) {
  const dt = heroLast ? Math.min(0.05, (t - heroLast) / 1000) : 0;
  heroLast = t;
  heroSpeed += (heroTarget - heroSpeed) * Math.min(1, dt * 2.5);
  heroOff += heroSpeed * dt;
  const W = carousel.offsetWidth || 560;
  const H = carousel.offsetHeight || 600;
  const ph = heroItems[0].el.offsetHeight || 260;
  const pw = heroItems[0].el.offsetWidth || 150;
  const gapX = pw * 1.04; // phones sit close together
  const spY = ph * 1.04;
  const L = spY * PER_COL;
  const half = L / 2;
  heroItems.forEach((it) => {
    const shift = it.c * spY * 0.37; // stagger columns so rows don't line up
    const y = ((((it.r * spY + heroOff * COL_SPEED[it.c] + shift) % L) + L) % L) - half; // top to bottom
    const x = it.c * gapX;
    const dn = Math.min(1, Math.hypot(x / (W * 0.55), y / (H * 0.62)));
    const focus = Math.max(0, 1 - dn / 0.4);               // 1 only for the centre phone
    const scale = 1; // no zoom: every phone stays the same size, focus = sharp + glow
    const blur = dn < 0.14 ? 0 : Math.round(Math.min(2.5, dn * 3.6) * 2) / 2; // light blur, quantised to keep repaints cheap
    const edge = Math.max(0, Math.min(1, (half - Math.abs(y)) / (spY * 0.5))); // fade at the wrap point
    it.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
    it.el.style.opacity = edge;
    it.el.style.zIndex = String(100 - Math.round(dn * 60));
    if (blur !== it.blur) {
      it.el.style.filter = blur ? `blur(${blur}px) brightness(${1 - dn * 0.22})` : "none";
      it.blur = blur;
    }
    it.el.classList.toggle("focus", focus > 0.45);
    const visible = edge > 0.05;
    if (visible && it.v.paused && !reduceMotion) it.v.play().catch(() => {});
    else if (!visible && !it.v.paused) it.v.pause();
  });
  requestAnimationFrame(drawHero);
}
requestAnimationFrame(drawHero);

/* ---------- ticker ---------- */
const ticker = document.getElementById("ticker");
const tickerHTML = TITLES.map((t) => `<span>${t}</span>`).join("");
ticker.innerHTML = tickerHTML + tickerHTML;

/* ---------- skills ---------- */
const DL_ICON = '<svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m6 10 6 6 6-6"/><path d="M4 21h16"/></svg>';
/* featured: one big billboard */
const FEATURED = {
  slug: "rubber-hose",
  name: "1930s rubber hose cartoon",
  accent: "#f6c343",
  text: "Black-and-white cartoons with bendy rubber-hose limbs, pie-cut eyes and bouncing props, like a reel from 1930. Claude draws every frame in code, adds film grain and gate weave, and scores it. In the demo, a coffee cup chases a runaway sugar cube around the kitchen.",
  needs: ["Canvas code", "Node", "ffmpeg", "Film grain + jitter"],
  size: "81 KB",
  film: "Coffee Cup Chase",
};
document.getElementById("skill-list").innerHTML = `
  <article class="skill featured reveal" style="--accent:${FEATURED.accent}" aria-labelledby="sk-featured">
    <div class="skill-text">
      <span class="chip">${FEATURED.slug}</span>
      <h3 id="sk-featured">${FEATURED.name}</h3>
      <p>${FEATURED.text}</p>
      <ul class="needs" aria-label="What it uses">${FEATURED.needs.map((n) => `<li>${n}</li>`).join("")}</ul>
      <a class="btn btn-gold" href="downloads/styles/${FEATURED.slug}.zip" download>${DL_ICON} Download skill <small>${FEATURED.size}</small></a>
      <p class="credit">A Lemo-Opuscar style by Lemomo. Free for non-commercial use, with credit.</p>
    </div>
    <div class="board">
      <figure class="wide">
        <div class="screen"><video muted loop playsinline preload="none" poster="media/styles/${FEATURED.slug}.jpg" data-src="media/styles/${FEATURED.slug}.mp4" aria-label="Clip from ${FEATURED.film}"></video></div>
        <figcaption>${FEATURED.film}</figcaption>
      </figure>
    </div>
  </article>`;

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
const BLURB = {
  "doodle-shorts-remotion": "Doodle people with round white faces living in soft-lit three.js rooms. Idea in, 40–65 s short out, with voice, captions and music.",
  "ClaudeAnimationBase1": "Brush-stroke characters with boiling linework and watercolour fills, built with p5.js. The kit behind “Every type of person”.",
  "in-this-city-gta-short": "“In this city…” rule shorts that look like a 3D open-world game, built in Blender with Python. Includes the bank balance scripts.",
  "faceless-shorts": "Six faceless looks: science what-ifs, mysteries, stick figures, x-ray, paper history, true stories. Free local voice, zero cost.",
  "cartoon-audio-short": "Bean-head cartoon characters in a 3D world with ink outlines, timed shot by shot to your own voiceover.",
};
const mine = SKILLS.map((s) => `
  <article class="style-card reveal" style="--accent:${s.accent}">
    <div class="screen duo">${s.clips.slice(0, 2).map(([id, title]) => `<video muted loop playsinline preload="none" poster="media/${id}.jpg" data-src="media/${id}.mp4" aria-label="Clip from ${title}"></video>`).join("")}</div>
    <div class="style-body">
      <span class="chip">${s.folder}</span>
      <h3>${s.name}</h3>
      <p>${BLURB[s.folder]}</p>
      <a class="btn btn-gold btn-sm" href="${s.file}" download>${DL_ICON} Download skill <small>${s.size}</small></a>
    </div>
  </article>`);
const styles = STYLES.filter(([slug]) => slug !== FEATURED.slug).map(([slug, name, film, line, size]) => `
  <article class="style-card reveal" style="--accent:#f6c343">
    <div class="screen"><video muted loop playsinline preload="none" poster="media/styles/${slug}.jpg" data-src="media/styles/${slug}.mp4" aria-label="Clip from ${film}"></video></div>
    <div class="style-body">
      <span class="chip">${slug}</span>
      <h3>${name}</h3>
      <p><strong>${film}.</strong> ${line}</p>
      <a class="btn btn-gold btn-sm" href="downloads/styles/${slug}.zip" download>${DL_ICON} Download skill <small>${size}</small></a>
    </div>
  </article>`);
document.getElementById("style-grid").innerHTML = [...mine, ...styles].join("");

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
