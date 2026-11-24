// Cute 3D monster for the hero (three.js, soft toon shading with thin ink outlines).
// Intro: pops up small and waves, hops, then grows so you see it from head to belly.
// It sits on the left, behind the text, and its eyes and head follow the mouse.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("monster");
const hero = document.querySelector(".hero");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { renderer = null; }

if (renderer && canvas && hero) {
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  scene.add(new THREE.HemisphereLight(0xfff4ea, 0x3b2f7a, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5eead4, 1.4); // teal rim light, matches the backdrop glow
  rim.position.set(5, 1, -4);
  scene.add(rim);

  // soft 4-step toon ramp
  const ramp = new THREE.DataTexture(new Uint8Array([120, 120, 120, 255, 175, 175, 175, 255, 225, 225, 225, 255, 255, 255, 255, 255]), 4, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
  ramp.needsUpdate = true;
  const toon = (color) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });
  const flat = (color) => new THREE.MeshBasicMaterial({ color });
  const INK = new THREE.MeshBasicMaterial({ color: 0x14102e, side: THREE.BackSide });

  function part(geo, mat, outline = 0.03) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, mat));
    if (outline) { const o = new THREE.Mesh(geo, INK); o.scale.setScalar(1 + outline); g.add(o); }
    return g;
  }

  // palette
  const BODY = 0xff8f7a;     // peach coral
  const BODY_SHADE = 0xf0705e;
  const BELLY = 0xfff1e2;    // cream
  const HORN = 0xb9a6ff;     // lavender
  const ACCENT = 0x2dd4bf;   // teal
  const BLUSH = 0xff5f8f;

  const root = new THREE.Group();
  const bob = new THREE.Group();
  const head = new THREE.Group();
  root.add(bob); bob.add(head); scene.add(root);

  // body: a soft egg
  const body = part(new THREE.SphereGeometry(1, 72, 56), toon(BODY), 0.025);
  body.scale.set(1.18, 1.28, 1.05);
  head.add(body);

  // belly
  const belly = part(new THREE.SphereGeometry(1, 48, 32), toon(BELLY), 0);
  belly.scale.set(0.64, 0.52, 0.34);
  belly.position.set(0, -0.74, 0.74);
  head.add(belly);

  // freckle spots on the top of the head
  [[-0.42, 1.0, 0.62, 0.09], [-0.18, 1.12, 0.52, 0.07], [0.82, 0.62, 0.62, 0.08]].forEach(([x, y, z, r]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), toon(BODY_SHADE));
    s.position.set(x, y, z); s.scale.z = 0.35; s.lookAt(x * 3, y * 3, z * 3);
    head.add(s);
  });

  // little curved horns
  [-1, 1].forEach((side) => {
    const horn = part(new THREE.ConeGeometry(0.17, 0.48, 32), toon(HORN), 0.07);
    horn.position.set(side * 0.5, 1.2, 0.05);
    horn.rotation.z = -side * 0.38;
    head.add(horn);
  });

  // round ears
  [-1, 1].forEach((side) => {
    const ear = part(new THREE.SphereGeometry(0.24, 32, 24), toon(BODY), 0.06);
    ear.scale.set(0.55, 1, 0.5);
    ear.position.set(side * 1.12, 0.62, 0);
    ear.rotation.z = side * 0.6;
    head.add(ear);
  });

  // antenna with a teal ball
  const antenna = new THREE.Group();
  antenna.position.set(0, 1.24, 0.05);
  const stalk = part(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 12), toon(BODY_SHADE), 0.3);
  stalk.position.y = 0.21; antenna.add(stalk);
  const ball = part(new THREE.SphereGeometry(0.11, 24, 16), toon(ACCENT), 0.12);
  ball.position.y = 0.47; antenna.add(ball);
  head.add(antenna);

  // big glossy kawaii eyes, set low on the face
  const eyes = [];
  [-1, 1].forEach((side) => {
    const eye = new THREE.Group();
    eye.position.set(side * 0.4, 0.28, 0.84);
    eye.add(part(new THREE.SphereGeometry(0.34, 48, 36), toon(0xffffff), 0.06));
    const look = new THREE.Group();
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.255, 40, 30), flat(0x1b1440));
    iris.position.z = 0.2; iris.scale.z = 0.55;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 10, 40), flat(0x4b3aa8));
    ring.position.z = 0.335;
    const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), flat(0xffffff));
    shine1.position.set(0.08, 0.09, 0.345);
    const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), flat(0xffffff));
    shine2.position.set(-0.08, -0.08, 0.345);
    look.add(iris, ring, shine1, shine2);
    eye.add(look);
    head.add(eye);
    eyes.push({ eye, look });
  });

  // blush
  [-1, 1].forEach((side) => {
    const c = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: BLUSH, transparent: true, opacity: 0.55 }));
    c.scale.set(0.16, 0.085, 0.04);
    c.position.set(side * 0.74, -0.02, 0.82);
    c.lookAt(side * 2.2, 0, 3);
    head.add(c);
  });

  // small smile with one fang
  const mouth = new THREE.Group();
  mouth.position.set(0, -0.12, 1.02);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.024, 10, 32, Math.PI), flat(0x14102e));
  smile.rotation.z = Math.PI;
  mouth.add(smile);
  const fang = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 12), flat(0xffffff));
  fang.rotation.x = Math.PI; fang.position.set(0.06, -0.1, 0.01);
  mouth.add(fang);
  head.add(mouth);

  // stubby arms
  const arms = [-1, 1].map((side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 1.08, -0.25, 0.15);
    const arm = part(new THREE.CapsuleGeometry(0.15, 0.4, 8, 16), toon(BODY), 0.08);
    arm.position.y = -0.3; pivot.add(arm);
    const hand = part(new THREE.SphereGeometry(0.19, 24, 16), toon(BODY), 0.08);
    hand.position.y = -0.62; pivot.add(hand);
    pivot.rotation.z = side * 0.4;
    bob.add(pivot);
    return pivot;
  });

  // ---------- framing ----------
  let vw = 10, vh = 6.3, S = 1.6, finalY = 0, smallY = 0, baseX = 0;
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    vw = vh * camera.aspect;
    const wide = camera.aspect > 1.1;
    // left side, behind the text column
    S = wide ? Math.min(1.8, vw * 0.145) : Math.min(1.0, vw * 0.24);
    baseX = wide ? (0.15 - 0.5) * vw : (0.72 - 0.5) * vw;
    const eyesAt = wide ? 0.58 : 0.3;
    finalY = vh * (0.5 - eyesAt) - 0.28 * S;
    smallY = -vh / 2 + 1.28 * S * 0.32 + 0.1;
  }
  resize();
  window.addEventListener("resize", resize);

  // ---------- pointer ----------
  const mouse = new THREE.Vector2(0, 0);
  let lastMove = -10;
  function onMove(x, y) {
    const r = hero.getBoundingClientRect();
    mouse.x = ((x - r.left) / r.width) * 2 - 1;
    mouse.y = -((y - r.top) / r.height) * 2 + 1;
    lastMove = performance.now() / 1000;
  }
  window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); }, { passive: true });

  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -4.5);
  const target = new THREE.Vector3();
  const smoothTarget = new THREE.Vector3(0, 0, 4.5);
  const headDir = new THREE.Vector2();

  const outBack = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  let start = null, visible = true, nextBlink = 2.5, blinkT = -1;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  function frame(ms) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const now = ms / 1000;
    if (start === null) start = now + 0.4;
    const t = reduce ? 99 : now - start;

    let scale, y, wave = 0, hop = 0;
    const sSmall = S * 0.34;
    const below = -vh / 2 - 2 * sSmall;
    if (t < 0) { scale = sSmall; y = below; }
    else if (t < 1.0) { scale = sSmall; y = below + (smallY - below) * outBack(clamp01(t)); wave = 1; }
    else if (t < 2.4) { scale = sSmall; y = smallY; wave = 1; hop = Math.abs(Math.sin((t - 1.0) * Math.PI * 1.45)) * 0.35 * sSmall; }
    else if (t < 3.8) { const k = outBack(clamp01((t - 2.4) / 1.4)); scale = sSmall + (S - sSmall) * k; y = smallY + (finalY - smallY) * k; wave = 1 - k; }
    else { scale = S; y = finalY; }

    root.scale.setScalar(scale);
    root.position.set(baseX, y + hop, 0);

    const breathe = Math.sin(now * 2.2);
    bob.scale.set(1 - breathe * 0.012, 1 + breathe * 0.018, 1);
    bob.rotation.z = Math.sin(now * 0.9) * 0.03;

    arms[1].rotation.z = 0.4 + wave * (1.9 + Math.sin(now * 12) * 0.45);
    arms[0].rotation.z = -0.4 - Math.sin(now * 1.6) * 0.08;

    antenna.rotation.z = Math.sin(now * 3.1) * 0.18;
    antenna.rotation.x = Math.cos(now * 2.3) * 0.1;

    if (now - lastMove > 4) {
      mouse.x += (Math.sin(now * 0.5) * 0.5 - mouse.x) * 0.02;
      mouse.y += (Math.cos(now * 0.37) * 0.3 - mouse.y) * 0.02;
    }
    ray.setFromCamera(mouse, camera);
    if (ray.ray.intersectPlane(plane, target)) smoothTarget.lerp(target, 0.12);
    eyes.forEach(({ look }) => look.lookAt(smoothTarget));

    // head turns toward the pointer, relative to where the monster stands
    headDir.set(smoothTarget.x - baseX, smoothTarget.y - (y + 0.3 * scale));
    head.rotation.y += (THREE.MathUtils.clamp(headDir.x / 6, -0.5, 0.5) - head.rotation.y) * 0.08;
    head.rotation.x += (THREE.MathUtils.clamp(-headDir.y / 7, -0.3, 0.3) - head.rotation.x) * 0.08;

    if (now > nextBlink && blinkT < 0) blinkT = 0;
    if (blinkT >= 0) {
      blinkT += 1 / 60;
      const b = blinkT < 0.08 ? 1 - blinkT / 0.08 : Math.min(1, (blinkT - 0.08) / 0.1);
      eyes.forEach(({ eye }) => { eye.scale.y = Math.max(0.08, b); });
      if (blinkT > 0.2) { blinkT = -1; nextBlink = now + 2 + Math.random() * 3.5; eyes.forEach(({ eye }) => { eye.scale.y = 1; }); }
    }

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
