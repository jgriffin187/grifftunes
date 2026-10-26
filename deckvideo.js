// GriffTunes full-screen turntable: a looping video of a real deck with the
// current album art drawn on the record label.
//
// Drop-in replacement for deck3d.js: createDeck(canvas, hooks) returns the same
// { start, stop, resize, setLabel, setAccent, rpm } object the page already uses.
//
// The loop is 7.2 s = exactly 4 turns at 33 1/3 RPM, so the label angle comes
// straight from video.currentTime and always matches the record in the footage.
// Starting, stopping, 45 RPM and scratching all work by changing the video's
// playback rate or position, so the label follows automatically.

const TAU = Math.PI * 2;
const VIDEO_SRC = './turntable-loop.mp4';
const LOOP_SEC = 7.2, TURNS = 4, SEC_PER_TURN = LOOP_SEC / TURNS;
const SRC_W = 1920, SRC_H = 1080;

// Measured from the footage, in source-video pixels.
const LABEL = { x: 779.6, y: 356.1, r: 208.2 };
const RECORD_R = 640;
const HITS = [
  { act: 'start', x: 88, y: 920, w: 178, h: 160 },          // START · STOP
  { act: 'start', cx: 130, cy: 805, r: 70 },                // ON / OFF knob
  { act: 'rpm33', x: 283, y: 1018, w: 98, h: 42 },
  { act: 'rpm45', x: 389, y: 1018, w: 100, h: 42 },
  { act: 'skip', cx: 1635, cy: 798, r: 48 },                // pitch RESET button = next song
];
// Speed indicator lights inside the 33 / 45 buttons (lit: 33 in the footage).
const LED33 = { x: 338, y: 1032, w: 36, h: 15 }, LED45 = { x: 446, y: 1032, w: 36, h: 15 };

export function createDeck(canvas, hooks) {
  const g = canvas.getContext('2d');
  const vid = document.createElement('video');
  vid.id = 'dkVid'; vid.muted = true; vid.loop = true; vid.playsInline = true; vid.preload = 'auto';
  vid.setAttribute('playsinline', ''); vid.setAttribute('aria-hidden', 'true');
  vid.src = VIDEO_SRC;
  canvas.parentNode.insertBefore(vid, canvas);
  let ready = false;
  vid.addEventListener('loadeddata', () => { ready = true; if (!running) vid.currentTime = 1.3; fit(); }, { once: true });

  // ---------- layout: map source-video pixels to canvas pixels (object-fit: cover) ----------
  let map = { s: 1, ox: 0, oy: 0, dpr: 1 };
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const s = Math.max(w / SRC_W, h / SRC_H);
    map = { s, ox: (w - SRC_W * s) / 2, oy: (h - SRC_H * s) / 2, dpr };
  }
  const toScreen = (x, y) => [(map.ox + x * map.s) * map.dpr, (map.oy + y * map.s) * map.dpr];
  const toSource = e => { const r = canvas.getBoundingClientRect(); return [((e.clientX - r.left) - map.ox) / map.s, ((e.clientY - r.top) - map.oy) / map.s]; };

  // ---------- label artwork ----------
  let accent = '#ff7a2f', accent2 = '#22e4ff', curImg = null, labelTex = houseLabel();
  function bake(draw) {
    const S = 512, R = S / 2, c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    x.save(); x.beginPath(); x.arc(R, R, R, 0, TAU); x.clip();
    draw(x, S);
    const e = x.createRadialGradient(R, R, R * .7, R, R, R);   // slight edge burn: printed paper, not a sticker
    e.addColorStop(0, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,.28)');
    x.fillStyle = e; x.fillRect(0, 0, S, S); x.restore();
    x.lineWidth = S * .012; x.strokeStyle = 'rgba(0,0,0,.55)'; x.beginPath(); x.arc(R, R, R - x.lineWidth / 2, 0, TAU); x.stroke();
    const b = document.createElement('canvas'); b.width = b.height = S;
    const bx = b.getContext('2d'); bx.filter = 'blur(0.6px)'; bx.drawImage(c, 0, 0);
    return b;
  }
  function houseLabel() {
    return bake((x, S) => {
      const R = S / 2;
      x.fillStyle = '#17141c'; x.fillRect(0, 0, S, S);
      const gr = x.createLinearGradient(0, 0, S, S); gr.addColorStop(0, accent); gr.addColorStop(1, accent2);
      x.strokeStyle = gr; x.lineWidth = S * .03; x.beginPath(); x.arc(R, R, R * .86, 0, TAU); x.stroke();
      x.fillStyle = '#f4d2b2'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `400 ${S * .13}px Monoton, "Arial Black", sans-serif`; x.fillText('GriffTunes', R, R * .62, S * .78);
      x.fillStyle = 'rgba(244,210,178,.6)'; x.font = `700 ${S * .045}px Bungee, Arial, sans-serif`;
      x.fillText('33⅓ RPM · STEREO', R, R * 1.42);
    });
  }
  function artLabel(im) {
    return bake((x, S) => {
      x.fillStyle = '#222'; x.fillRect(0, 0, S, S);
      const w = im.naturalWidth || im.width, h = im.naturalHeight || im.height, k = S / Math.min(w, h);
      x.filter = 'saturate(0.92) contrast(1.02)';
      x.drawImage(im, (S - w * k) / 2, (S - h * k) / 2, w * k, h * k);
      x.filter = 'none';
    });
  }
  function setLabel(img, acc) {
    if (acc) accent = acc;
    if (!img) { curImg = null; labelTex = houseLabel(); return; }
    if (img === curImg) return; curImg = img;
    const load = cors => {
      const im = new Image(); if (cors) im.crossOrigin = 'anonymous';
      im.onload = () => { if (curImg === img) labelTex = artLabel(im); };
      im.onerror = () => { if (cors) load(false); else if (curImg === img) labelTex = houseLabel(); };
      im.src = img;
    };
    load(true);
  }
  function setAccent(a, b) { const changed = a !== accent || b !== accent2; accent = a || accent; accent2 = b || accent2; if (changed && !curImg) labelTex = houseLabel(); }

  // ---------- motor: playback rate eases up and down like a heavy platter ----------
  let rpm = 33, rate = 0, running = false, raf = 0, last = 0, dragging = null;
  function motor(dt) {
    const s = hooks.state();
    const target = s.playing ? (rpm === 45 ? 45 / (100 / 3) : 1) : 0;
    rate += (target - rate) * Math.min(1, dt * (target > rate ? 2.4 : 1.4));
    if (target === 0 && rate < .07) rate = 0;
    if (dragging || !ready) return;
    if (rate === 0) { if (!vid.paused) vid.pause(); return; }
    const r = Math.max(.0625, rate);
    if (Math.abs(vid.playbackRate - r) > .005) vid.playbackRate = r;
    if (vid.paused) vid.play().catch(() => {});
  }

  // ---------- drawing ----------
  const pressed = new Map();
  function draw() {
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height);
    if (!ready) return;
    const px = map.s * map.dpr;

    // 45 RPM: swap the lit and unlit speed lights by copying them from the video itself
    if (rpm === 45) {
      for (const [from, to] of [[LED45, LED33], [LED33, LED45]]) {
        const [x, y] = toScreen(to.x, to.y);
        g.drawImage(vid, from.x, from.y, from.w, from.h, x, y, to.w * px, to.h * px);
      }
    }

    // label: art spins with the footage; a few copies across the shutter angle give motion blur
    const ang = ((vid.currentTime % LOOP_SEC) / LOOP_SEC) * TURNS * TAU;
    const [cx, cy] = toScreen(LABEL.x, LABEL.y), R = LABEL.r * 1.035 * px;
    const spin = dragging ? 0 : (vid.paused ? 0 : vid.playbackRate), blur = .06 * spin, N = spin > .1 ? 9 : 1;
    g.save(); g.translate(cx, cy);
    for (let i = 0; i < N; i++) {
      g.globalAlpha = 1 / (i + 1);
      g.save(); g.rotate(ang - blur * (i / Math.max(1, N - 1) - .5)); g.drawImage(labelTex, -R, -R, R * 2, R * 2); g.restore();
    }
    g.globalAlpha = 1;
    const L = g.createLinearGradient(-R, -R, R, R);           // room light stays put while the label turns
    L.addColorStop(0, 'rgba(255,255,255,.16)'); L.addColorStop(.45, 'rgba(255,255,255,0)'); L.addColorStop(1, 'rgba(0,0,0,.18)');
    g.fillStyle = L; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    const sp = R * .085;                                         // spindle
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(sp * .25, sp * .35, sp * 1.15, 0, TAU); g.fill();
    const sg = g.createRadialGradient(-sp * .35, -sp * .4, 0, 0, 0, sp);
    sg.addColorStop(0, '#fff'); sg.addColorStop(.45, '#c9cbcf'); sg.addColorStop(1, '#5d6066');
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, sp, 0, TAU); g.fill();
    g.restore();

    // brief press feedback on the deck's buttons
    const now = performance.now();
    for (const [h, t0] of pressed) {
      const k = (now - t0) / 220; if (k >= 1) { pressed.delete(h); continue; }
      g.fillStyle = `rgba(0,0,0,${.28 * Math.sin(k * Math.PI)})`;
      if (h.r) { const [x, y] = toScreen(h.cx, h.cy); g.beginPath(); g.arc(x, y, h.r * px, 0, TAU); g.fill(); }
      else { const [x, y] = toScreen(h.x, h.y); g.fillRect(x, y, h.w * px, h.h * px); }
    }

    // soft shade behind the song caption (top-left, over the black vinyl)
    const W = canvas.width, H = canvas.height;
    const rad = Math.min(W * .45, H * .6);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, rad);
    sh.addColorStop(0, 'rgba(0,0,0,.55)'); sh.addColorStop(.6, 'rgba(0,0,0,.25)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh; g.fillRect(0, 0, rad, rad);
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min(.25, (t - (last || t)) / 1000); last = t;
    motor(dt); draw();
    raf = requestAnimationFrame(frame);
  }

  // ---------- input ----------
  const hitAt = ([x, y]) => HITS.find(h => h.r ? Math.hypot(x - h.cx, y - h.cy) < h.r : x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
  const onRecord = ([x, y]) => Math.hypot(x - LABEL.x, y - LABEL.y) < RECORD_R;
  const angleAt = ([x, y]) => Math.atan2(y - LABEL.y, x - LABEL.x);
  let hoverAct = null;
  canvas.addEventListener('pointerdown', e => {
    const p = toSource(e), h = hitAt(p);
    if (h) {
      pressed.set(h, performance.now());
      if (h.act === 'start') hooks.onStart();
      else if (h.act === 'skip') hooks.onSkip();
      else { rpm = h.act === 'rpm45' ? 45 : 33; hooks.onRpm && hooks.onRpm(rpm); }
      return;
    }
    if (onRecord(p) && ready) {
      canvas.setPointerCapture(e.pointerId);
      dragging = { a0: angleAt(p), t0: vid.currentTime, moved: 0, total: 0, at: performance.now(), wasPaused: vid.paused };
      vid.pause();
    }
  });
  canvas.addEventListener('pointermove', e => {
    const p = toSource(e);
    if (!dragging) {
      const h = hitAt(p), a = h ? h.act : (onRecord(p) ? 'platter' : null);
      canvas.style.cursor = a ? 'pointer' : '';
      if (e.pointerType === 'mouse' && hooks.onHover && a !== hoverAct) { hoverAct = a; hooks.onHover(a, e.clientX, e.clientY); }
      return;
    }
    let da = angleAt(p) - dragging.a0; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
    const t = dragging.t0 + (da / TAU) * SEC_PER_TURN;
    vid.currentTime = ((t % LOOP_SEC) + LOOP_SEC) % LOOP_SEC;
    dragging.total += Math.abs(da - (dragging.lastDa || 0)); dragging.lastDa = da;
    if (Math.abs(da) > 1.4) { hooks.onScratch(); dragging.a0 = angleAt(p); dragging.t0 = vid.currentTime; dragging.lastDa = 0; }
  });
  const up = () => {
    if (!dragging) return;
    const tap = dragging.total < .08 && performance.now() - dragging.at < 400;
    dragging = null;
    if (tap) hooks.onStart();
  };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', () => { if (hoverAct && hooks.onHover) { hoverAct = null; hooks.onHover(null); } });

  return {
    start() { if (running) return; running = true; last = 0; fit(); raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); vid.pause(); rate = 0; },
    resize: fit, setLabel, setAccent,
    get rpm() { return rpm; }
  };
}
