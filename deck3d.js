// GriffTunes GT-1 — a 3D turntable (original design) rendered with three.js.
// The page drives it through the object returned by createDeck().
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const TAU = Math.PI * 2;

function canvasTex(size, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Circular "brushed" direction map for anisotropic highlights (vinyl grooves, spun aluminium).
function circularAnisoMap(size, strength = 1) {
  return canvasTex(size, (x, n) => {
    const img = x.createImageData(n, n), d = img.data, c = n / 2;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const dx = i - c + .5, dy = j - c + .5, r = Math.hypot(dx, dy) || 1;
      const tx = -dy / r, ty = dx / r, k = (j * n + i) * 4;
      d[k] = (tx * .5 + .5) * 255; d[k + 1] = (ty * .5 + .5) * 255; d[k + 2] = 255 * strength; d[k + 3] = 255;
    }
    x.putImageData(img, 0, 0);
  }, false);
}

function grooveArt(x, n, labelImg, accent) {
  const c = n / 2, R = n / 2, lab = R * .335;
  x.fillStyle = '#060607'; x.fillRect(0, 0, n, n);
  // grooves with track gaps
  const gaps = [.93, .82, .71, .6, .5];
  for (let r = R * .985; r > lab * 1.12; r -= 1.1) {
    const f = r / R, gap = gaps.some(g => Math.abs(f - g) < .006);
    const v = gap ? 26 : 10 + ((r * 7.13) % 3) * 2 + (Math.sin(r * .9) > .6 ? 3 : 0);
    x.strokeStyle = `rgb(${v},${v},${v + 1})`; x.lineWidth = 1.2;
    x.beginPath(); x.arc(c, c, r, 0, TAU); x.stroke();
  }
  // lead-out / run-out area
  x.fillStyle = '#0d0d0f'; x.beginPath(); x.arc(c, c, lab * 1.12, 0, TAU); x.fill();
  // label
  x.save(); x.beginPath(); x.arc(c, c, lab, 0, TAU); x.clip();
  if (labelImg) {
    const s = lab * 2, ar = labelImg.width / labelImg.height;
    const w = ar >= 1 ? s * ar : s, h = ar >= 1 ? s : s / ar;
    x.drawImage(labelImg, c - w / 2, c - h / 2, w, h);
  } else {
    const g = x.createLinearGradient(c - lab, c - lab, c + lab, c + lab);
    g.addColorStop(0, accent[0]); g.addColorStop(1, accent[1]); x.fillStyle = g; x.fillRect(c - lab, c - lab, lab * 2, lab * 2);
    x.fillStyle = 'rgba(255,255,255,.92)'; x.font = `700 ${lab * .2}px Outfit, Arial, sans-serif`; x.textAlign = 'center'; x.fillText('GriffTunes', c, c - lab * .38);
  }
  const vg = x.createRadialGradient(c, c, lab * .6, c, c, lab); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)');
  x.fillStyle = vg; x.fillRect(c - lab, c - lab, lab * 2, lab * 2);
  x.restore();
  x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 3; x.beginPath(); x.arc(c, c, lab, 0, TAU); x.stroke();
}

export function createDeck(canvas, hooks) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  let pr = Math.min(1.75, window.devicePixelRatio || 1); renderer.setPixelRatio(pr);
  let ema = 1 / 60, emaN = 0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
  scene.environmentIntensity = .32;

  const camera = new THREE.PerspectiveCamera(30, 16 / 9, .1, 100);

  // ---------- lights ----------
  scene.add(new THREE.HemisphereLight(0x8890a0, 0x0b0a0c, .35));
  const key = new THREE.DirectionalLight(0xfff2e6, 1.9);
  key.position.set(-4, 9, 3); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 4; key.shadow.bias = -.0004;
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 25 });
  scene.add(key);
  const rim = new THREE.PointLight(0xff3bd6, 7, 12, 2); rim.position.set(3.5, 2.2, -3.8); scene.add(rim);
  const rim2 = new THREE.PointLight(0x22e4ff, 4, 12, 2); rim2.position.set(-4.2, 1.6, -3.2); scene.add(rim2);
  const spot = new THREE.SpotLight(0xffffff, 16, 12, .55, .8, 1.6); spot.position.set(-.9, 6.5, 1.2); spot.target.position.set(-.9, 0, 0); scene.add(spot, spot.target);

  // ---------- materials ----------
  const satin = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0e, roughness: .62, metalness: .05, clearcoat: .25, clearcoatRoughness: .55 });
  const satinTop = satin.clone(); satinTop.color.set(0x0f0f12); satinTop.envMapIntensity = .5; satin.envMapIntensity = .6;
  const copper = new THREE.MeshPhysicalMaterial({ color: 0xc07b4c, roughness: .3, metalness: 1 });
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe8e8ee, roughness: .12, metalness: 1 });
  const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x2a2a2f, roughness: .35, metalness: .85 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: .9 });
  const alumAniso = circularAnisoMap(256, 1);
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9c9cf, roughness: .32, metalness: 1, anisotropy: .9, anisotropyMap: alumAniso });
  const knurl = canvasTex(1024, (x, n) => { for (let i = 0; i < n; i += 4) { x.fillStyle = (i / 4) % 2 ? '#7a7a82' : '#2a2a2f'; x.fillRect(i, 0, 4, n) } });
  knurl.wrapS = THREE.RepeatWrapping; knurl.repeat.set(3, 1);
  const knurlMat = new THREE.MeshPhysicalMaterial({ map: knurl, metalness: 1, roughness: .38, color: 0xbbbbc4 });

  // ---------- plinth ----------
  const W = 6.6, D = 4.7, Hh = .55, top = Hh;
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(W, Hh, D, 6, .14), [satin, satin, satinTop, satin, satin, satin]);
  plinth.position.y = Hh / 2; plinth.castShadow = plinth.receiveShadow = true; scene.add(plinth);
  const trim = new THREE.Mesh(new RoundedBoxGeometry(W + .04, .05, D + .04, 4, .08), copper); trim.position.y = .045; scene.add(trim);
  for (const [fx, fz] of [[-W / 2 + .55, -D / 2 + .55], [W / 2 - .55, -D / 2 + .55], [-W / 2 + .55, D / 2 - .55], [W / 2 - .55, D / 2 - .55]]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(.32, .38, .14, 40), rubber); f.position.set(fx, -.05, fz); scene.add(f);
  }
  // floor catches the shadow
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .55 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.12; floor.receiveShadow = true; scene.add(floor);

  // ---------- platter + record ----------
  const PX = -.72, PZ = .02, PR = 1.74;
  const spin = new THREE.Group(); spin.position.set(PX, top, PZ); scene.add(spin);
  const well = new THREE.Mesh(new THREE.CylinderGeometry(PR + .06, PR + .06, .02, 128), rubber); well.position.set(PX, top + .005, PZ); scene.add(well);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(PR, PR - .02, .2, 160, 1), [knurlMat, alu, darkMetal]);
  platter.position.y = .1; platter.castShadow = true; platter.receiveShadow = true; spin.add(platter);
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(PR - .07, PR - .07, .012, 128), rubber); mat.position.y = .206; spin.add(mat);

  const RR = 1.52;
  const grooveCanvas = document.createElement('canvas'); grooveCanvas.width = grooveCanvas.height = 2048;
  let accent = ['#ff2bd6', '#22e4ff'];
  grooveArt(grooveCanvas.getContext('2d'), 2048, null, accent);
  const grooveTex = new THREE.CanvasTexture(grooveCanvas); grooveTex.colorSpace = THREE.SRGBColorSpace; grooveTex.anisotropy = 8;
  const vinylAniso = circularAnisoMap(512, 1);
  const vinylTop = new THREE.MeshPhysicalMaterial({ map: grooveTex, roughness: .42, metalness: 0, specularIntensity: .45, clearcoat: .35, clearcoatRoughness: .3, anisotropy: .55, anisotropyMap: vinylAniso });
  const vinylEdge = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: .3, clearcoat: .8 });
  const record = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, .03, 160), [vinylEdge, vinylTop, vinylEdge]);
  record.position.y = .228; record.castShadow = true; record.receiveShadow = true; spin.add(record);
  // the cylinder's top cap UVs map the full disc
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(.04, .045, .26, 24), chrome); spindle.position.y = .3; spin.add(spindle);

  // ---------- tonearm ----------
  const AX = PX + PR + .95, AZ = PZ - 1.42;
  const d = Math.hypot(PX - AX, PZ - AZ), L = d * 1.03, phi = Math.atan2(PZ - AZ, PX - AX);
  const angFor = r => phi - Math.acos(Math.min(1, Math.max(-1, (d * d + L * L - r * r) / (2 * d * L))));
  const restA = angFor(PR + .45), outerA = angFor(RR * .955), innerA = angFor(RR * .38);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.42, .46, .08, 64), darkMetal); base.position.set(AX, top + .04, AZ); base.castShadow = true; scene.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.43, .012, 12, 80), copper); ring.rotation.x = Math.PI / 2; ring.position.set(AX, top + .08, AZ); scene.add(ring);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.13, .15, .42, 40), chrome); post.position.set(AX, top + .29, AZ); post.castShadow = true; scene.add(post);
  const yaw = new THREE.Group(); yaw.position.set(AX, top + .5, AZ); scene.add(yaw);
  const tilt = new THREE.Group(); yaw.add(tilt);
  const gimbal = new THREE.Mesh(new THREE.SphereGeometry(.12, 32, 16), chrome); tilt.add(gimbal);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.032, .032, L, 24), chrome); tube.rotation.z = Math.PI / 2; tube.position.x = L / 2; tube.castShadow = true; tilt.add(tube);
  const stub = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .7, 24), chrome); stub.rotation.z = Math.PI / 2; stub.position.x = -.35; tilt.add(stub);
  const cw = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .32, 48), [knurlMat, darkMetal, darkMetal]); cw.rotation.z = Math.PI / 2; cw.position.x = -.62; cw.castShadow = true; tilt.add(cw);
  const head = new THREE.Group(); head.position.x = L; head.rotation.y = .38; tilt.add(head);
  const shell = new THREE.Mesh(new THREE.BoxGeometry(.5, .035, .2), darkMetal); shell.position.set(.12, -.06, 0); shell.castShadow = true; head.add(shell);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(.16, .02, .05), chrome); lip.position.set(.42, -.05, .1); lip.rotation.y = -.5; head.add(lip);
  const cart = new THREE.Mesh(new THREE.BoxGeometry(.24, .1, .14), new THREE.MeshPhysicalMaterial({ color: 0xc07b4c, roughness: .35, metalness: .6 })); cart.position.set(.1, -.13, 0); cart.castShadow = true; head.add(cart);
  const stylus = new THREE.Mesh(new THREE.ConeGeometry(.014, .06, 8), chrome); stylus.rotation.x = Math.PI; stylus.position.set(.14, -.2, 0); head.add(stylus);
  // arm rest
  const restX = AX + Math.cos(restA) * L * .78, restZ = AZ + Math.sin(restA) * L * .78;
  const restPost = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .42, 24), darkMetal); restPost.position.set(restX, top + .21, restZ); restPost.castShadow = true; scene.add(restPost);
  const cradle = new THREE.Mesh(new THREE.TorusGeometry(.06, .018, 10, 24, Math.PI), rubber); cradle.position.set(restX, top + .44, restZ); cradle.rotation.y = -restA; scene.add(cradle);

  // ---------- controls ----------
  const clickables = [];
  const startBase = new THREE.Mesh(new THREE.CylinderGeometry(.46, .5, .05, 64), darkMetal); startBase.position.set(-W / 2 + .8, top + .025, D / 2 - .78); scene.add(startBase);
  const startLamp = new THREE.MeshPhysicalMaterial({ color: 0x3a1a10, emissive: 0xff6a2a, emissiveIntensity: 0, roughness: .3 });
  const startBtn = new THREE.Mesh(new THREE.CylinderGeometry(.38, .4, .1, 64), [darkMetal, satin, satin]); startBtn.position.set(-W / 2 + .8, top + .1, D / 2 - .78); startBtn.castShadow = true; startBtn.userData.act = 'start'; scene.add(startBtn); clickables.push(startBtn);
  const startRing = new THREE.Mesh(new THREE.TorusGeometry(.41, .014, 10, 80), copper); startRing.rotation.x = Math.PI / 2; startRing.position.set(-W / 2 + .8, top + .15, D / 2 - .78); scene.add(startRing);
  const lampDot = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .02, 32), startLamp); lampDot.position.set(-W / 2 + .8, top + .155, D / 2 - .78); scene.add(lampDot);
  const speedMat = n => new THREE.MeshPhysicalMaterial({ color: 0x1c1c20, emissive: 0xff8a4c, emissiveIntensity: 0, roughness: .45, metalness: .5 });
  const speeds = {};
  [[33, 0], [45, 1]].forEach(([rpm, i]) => {
    const m = speedMat(); const b = new THREE.Mesh(new RoundedBoxGeometry(.46, .07, .26, 3, .04), m);
    b.position.set(W / 2 - 2.45 + i * .58, top + .04, D / 2 - .5); b.userData.act = 'rpm' + rpm; b.castShadow = true; scene.add(b); clickables.push(b); speeds[rpm] = m;
  });
  const led = new THREE.Mesh(new THREE.SphereGeometry(.035, 16, 8), new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0xff3030, emissiveIntensity: 2 })); led.position.set(-W / 2 + .35, top + .01, D / 2 - .3); scene.add(led);
  // printed text (brand on the front face, control legends on the top)
  function textPlane(w, h, draw, pos, flat) {
    const c = document.createElement('canvas'); c.width = 2048; c.height = Math.round(2048 * h / w);
    const x = c.getContext('2d'); x.textBaseline = 'middle'; draw(x, c.width, c.height);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false }));
    if (flat) m.rotation.x = -Math.PI / 2; m.position.copy(pos); scene.add(m); return m;
  }
  textPlane(2.4, .4, (x, w, h) => {
    x.fillStyle = '#e9b48a'; x.font = `400 ${h * .62}px Monoton, "Arial Black", sans-serif`; x.fillText('GriffTunes', 6, h * .52);
  }, new THREE.Vector3(-W / 2 + 1.5, Hh * .52, D / 2 + .004));
  textPlane(1.9, .18, (x, w, h) => {
    x.fillStyle = '#c07b4c'; x.font = `700 ${h * .62}px Bungee, Arial, sans-serif`; x.textAlign = 'right'; x.fillText('GT-1  DIRECT DRIVE', w - 6, h * .52);
  }, new THREE.Vector3(W / 2 - 1.2, Hh * .52, D / 2 + .004));
  const legend = (txt, X, Z, wd = .7) => textPlane(wd, .14, (x, w, h) => { x.fillStyle = 'rgba(217,184,154,.85)'; x.font = `700 ${h * .62}px Bungee, Arial, sans-serif`; x.textAlign = 'center'; x.fillText(txt, w / 2, h * .55) }, new THREE.Vector3(X, top + .003, Z), true);
  legend('START · STOP', -W / 2 + .8, D / 2 - .22, 1);
  legend('33', W / 2 - 2.45, D / 2 - .2, .4); legend('45', W / 2 - 1.87, D / 2 - .2, .4);
  legend('NEXT', W / 2 - .7, D / 2 - .28, .5);
  // speed dial on the right front
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(.22, .24, .12, 48), [knurlMat, darkMetal, darkMetal]); dial.position.set(W / 2 - .7, top + .06, D / 2 - .7); dial.castShadow = true; dial.userData.act = 'skip'; scene.add(dial); clickables.push(dial);

  // ---------- camera fit ----------
  const corners = [];
  for (const x of [-W / 2 - .1, W / 2 + .1]) for (const y of [-.1, top + .7]) for (const z of [-D / 2 - .1, D / 2 + .1]) corners.push(new THREE.Vector3(x, y, z));
  corners.push(new THREE.Vector3(AX - .9, top + .7, AZ - .5));
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const v = new THREE.Vector3();
    for (let dist = 6; dist < 40; dist += .1) {
      camera.position.set(.15, dist * .8, dist * .6); camera.lookAt(.1, .1, .25); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
      let ok = true; for (const c of corners) { v.copy(c).project(camera); if (Math.abs(v.x) > .9 || v.y > .86 || v.y < -.74) { ok = false; break } }
      if (ok) break;
    }
  }
  fit();

  // ---------- state ----------
  let ang = 0, speed = 0, armA = restA, lift = 0, rpm = 33, dragging = null, last = 0, curImg = null;
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const hit = e => { const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, camera); return ray; };
  const platterAngle = e => { const rr = hit(e); const pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(top + .24)); const p = new THREE.Vector3(); if (!rr.ray.intersectPlane(pl, p)) return null; return { a: Math.atan2(p.z - PZ, p.x - PX), r: Math.hypot(p.x - PX, p.z - PZ) }; };
  canvas.addEventListener('pointerdown', e => {
    const hits = hit(e).intersectObjects(clickables, false);
    if (hits.length) { const a = hits[0].object.userData.act; press(hits[0].object); if (a === 'start') hooks.onStart(); else if (a === 'skip') hooks.onSkip(); else { rpm = a === 'rpm45' ? 45 : 33; hooks.onRpm && hooks.onRpm(rpm) } return }
    const pa = platterAngle(e); if (pa && pa.r < RR) { canvas.setPointerCapture(e.pointerId); dragging = { a0: pa.a, ang0: ang, moved: 0 }; hooks.onScratch(); }
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) { const h = hit(e).intersectObjects(clickables, false); canvas.style.cursor = h.length ? 'pointer' : ''; return }
    const pa = platterAngle(e); if (!pa) return; let da = pa.a - dragging.a0; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
    ang = dragging.ang0 - da; dragging.moved += Math.abs(da); if (dragging.moved > 1.4) { hooks.onScratch(); dragging.a0 = pa.a; dragging.ang0 = ang; dragging.moved = 0 }
  });
  const up = () => { dragging = null }; canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  const pressed = new Map();
  function press(o) { pressed.set(o, performance.now()) }

  function setLabel(img, acc) {
    if (acc) accent = acc;
    if (!img) { curImg = null; grooveArt(grooveCanvas.getContext('2d'), 2048, null, accent); grooveTex.needsUpdate = true; return }
    if (img === curImg) return; curImg = img;
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { if (curImg !== img) return; grooveArt(grooveCanvas.getContext('2d'), 2048, im, accent); grooveTex.needsUpdate = true };
    im.onerror = () => { grooveArt(grooveCanvas.getContext('2d'), 2048, null, accent); grooveTex.needsUpdate = true };
    im.src = img;
  }
  function setAccent(a, b) { try { rim.color.set(a); rim2.color.set(b) } catch (e) { } }

  let running = false, raf = 0;
  function frame(t) {
    if (!running) return;
    const dt = Math.min(.25, (t - (last || t)) / 1000); last = t;
    // keep it smooth on modest GPUs: drop resolution if frames are slow
    if (dt > 0) { ema += (dt - ema) * .05; if (++emaN > 90 && ema > 1 / 36 && pr > .75) { pr = Math.max(.75, pr - .25); renderer.setPixelRatio(pr); fit(); emaN = 0 } }
    const s = hooks.state();
    const on = s.playing, full = (rpm / 60) * TAU;
    speed += ((on ? full : 0) - speed) * Math.min(1, dt * (on ? 2.4 : 1.3));
    if (!dragging) ang -= speed * dt;
    spin.rotation.y = ang;
    const f = s.dur ? Math.min(1, Math.max(0, s.pos / s.dur)) : 0;
    const tgt = s.has ? outerA + (innerA - outerA) * f : restA;
    const diff = tgt - armA, moving = Math.abs(diff) > .01;
    lift += ((moving ? 1 : 0) - lift) * Math.min(1, dt * (moving ? 5 : 2.2));
    if (lift > .6 || !moving) armA += diff * Math.min(1, dt * (moving ? 1.6 : 8));
    yaw.rotation.y = -armA; tilt.rotation.z = lift * .085;
    startLamp.emissiveIntensity += ((speed > .5 ? 3 : .05) - startLamp.emissiveIntensity) * Math.min(1, dt * 6);
    speeds[33].emissiveIntensity = rpm === 33 ? .25 : 0; speeds[45].emissiveIntensity = rpm === 45 ? .25 : 0;
    for (const [o, t0] of pressed) { const k = (performance.now() - t0) / 180; if (k >= 1) { o.position.y = o.userData.y0; pressed.delete(o) } else { o.userData.y0 ??= o.position.y; o.position.y = o.userData.y0 - Math.sin(k * Math.PI) * .03 } }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  return {
    start() { if (running) return; running = true; last = 0; fit(); raf = requestAnimationFrame(frame) },
    stop() { running = false; cancelAnimationFrame(raf) },
    resize: fit, setLabel, setAccent,
    get rpm() { return rpm }
  };
}
