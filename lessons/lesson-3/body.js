// Lesson 3 drawing helpers: skeleton, body, organs, muscles and arms.
// Loaded before the chapter files (see lessons/lessons.js). All return SVG markup.
const L3 = (() => {
  const f1 = S.f1;
  const BONE = { fill: '#F7EFDD', edge: '#A89878', dark: '#6B5A45' };
  const XRAY = { fill: '#E4F6FF', edge: '#5FB8E8', dark: '#0E2A47' };
  const SKIN = '#C98B5E';

  // A long bone from (x1,y1) to (x2,y2) with knobbly ends
  function bone(x1, y1, x2, y2, w = 10, c = BONE, cls = '') {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const nx = -Math.sin(a), ny = Math.cos(a);
    const r = w * .5, o = w * .36;
    const knobs = [[x1, y1], [x2, y2]].flatMap(([x, y]) => [[x + nx * o, y + ny * o], [x - nx * o, y - ny * o]]);
    const layer = (col, extra) =>
      `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${col}" stroke-width="${f1(w + extra * 2)}"/>` +
      knobs.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + extra)}" fill="${col}"/>`).join('');
    return `<g class="${cls}">${layer(c.edge, 1.5)}${layer(c.fill, 0)}</g>`;
  }

  // Small bone, like a finger bone: a thick rounded line with an outline
  function little(x1, y1, x2, y2, w, c) {
    return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c.edge}" stroke-width="${f1(w + 2.4)}" stroke-linecap="round"/>
      <line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c.fill}" stroke-width="${f1(w)}" stroke-linecap="round"/>`;
  }

  // Hand bones hanging down from the wrist (wx,wy). side -1 = viewer's left.
  function handBones(wx, wy, side, c, k = 1) {
    let out = `<g class="l3-sk-hand">`;
    for (let i = 0; i < 4; i++) out += `<circle cx="${f1(wx + side * (i - 1.5) * 3.6 * k)}" cy="${f1(wy + (4 + (i % 2) * 3) * k)}" r="${f1(2.6 * k)}" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.2"/>`;
    const fingers = [[3.5, 22], [.8, 25], [-2, 23], [-4.8, 18]];
    fingers.forEach(([dx, len]) => {
      const x0 = wx + side * dx * .8 * k, y0 = wy + 10 * k, x1 = wx + side * dx * 1.25 * k, y1 = wy + 21 * k;
      out += little(x0, y0, x1, y1, 2.6 * k, c);
      const seg = len * k / 3;
      for (let s = 0; s < 3; s++) out += little(x1 + side * dx * .08 * s * k, y1 + 2 * k + s * seg, x1 + side * dx * .08 * (s + 1) * k, y1 + (s + 1) * seg, 2.3 * k, c);
    });
    out += little(wx + side * 5 * k, wy + 8 * k, wx + side * 10 * k, wy + 16 * k, 2.8 * k, c);
    out += little(wx + side * 11 * k, wy + 18 * k, wx + side * 14 * k, wy + 25 * k, 2.4 * k, c);
    out += little(wx + side * 14.6 * k, wy + 27 * k, wx + side * 16 * k, wy + 32 * k, 2.2 * k, c);
    return out + `</g>`;
  }

  // Front view skeleton. Local frame: top of skull at y=0, feet at y=426, centre x=0.
  // arms: { l: [raise, bend], r: [raise, bend] } in degrees (raise lifts the arm out to the side).
  function skeleton(o = {}) {
    o = Object.assign({ x: 0, y: 0, s: 1, xray: false, arms: {}, cls: '' }, o);
    const c = o.xray ? XRAY : BONE;
    const arms = Object.assign({ l: [0, 0], r: [0, 0] }, o.arms);
    let spine = '';
    for (let i = 0; i < 3; i++) spine += `<rect class="l3-sk-vert l3-sk-neckbone" x="-6" y="${66 + i * 6}" width="12" height="5" rx="2" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.3"/>`;
    for (let i = 0; i < 15; i++) spine += `<rect class="l3-sk-vert" x="-7" y="${f1(85 + i * 9.4)}" width="14" height="7" rx="2.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.3"/>`;
    const widths = [30, 36, 40, 42, 42, 40, 35];
    let ribs = '';
    widths.forEach((w, i) => {
      const y0 = 92 + i * 10;
      const d = `M-5 ${y0} C-16 ${y0 - 8} ${-(w + 4)} ${y0 - 4} ${-w} ${y0 + 12} C${-(w - 2)} ${y0 + 18} ${-(w - 6)} ${y0 + 22} ${-(w - 10)} ${y0 + 24}`;
      [1, -1].forEach(m => {
        ribs += `<g class="l3-sk-rib" transform="scale(${m} 1)"><path d="${d}" stroke="${c.edge}" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c.fill}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
      });
    });
    const arm = (side, [a, b]) => {
      const sx = side * 48, sy = 88, ex = side * 54, ey = 166, wx = side * 58, wy = 240;
      return `<g class="l3-sk-arm" transform="rotate(${f1(-side * a)} ${sx} ${sy})">
        ${bone(sx, sy, ex, ey, 9, c, 'l3-sk-humerus')}
        <g transform="rotate(${f1(-side * b)} ${ex} ${ey})">
          ${bone(ex - side * 3, ey + 4, wx - side * 3, wy - 4, 5, c)}${bone(ex + side * 4, ey + 4, wx + side * 4, wy - 5, 5, c)}
          ${handBones(wx, wy - 2, side, c)}
        </g></g>`;
    };
    const leg = side => {
      const hx = side * 30;
      return `<g class="l3-sk-leg">
        ${bone(hx, 254, side * 25, 336, 11, c, 'l3-sk-femur')}
        ${bone(side * 31, 350, side * 30, 404, 4, c)}
        ${bone(side * 23, 344, side * 22, 406, 9, c)}
        <circle class="l3-sk-kneecap" cx="${side * 25}" cy="338" r="6.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.5"/>
        <ellipse cx="${side * 23}" cy="413" rx="10" ry="5.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.5"/>
        ${[0, 1, 2, 3, 4].map(t => little(side * (16 + t * 3.4), 416, side * (13 + t * 5.4), 424, 2.6, c)).join('')}
      </g>`;
    };
    return `<g class="${o.cls}" transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${o.s})">
      <g class="l3-sk-spine">${spine}</g>
      <path class="l3-sk-pelvis" d="M0 228 C-20 214 -46 214 -48 232 C-48 250 -34 262 -18 266 L-8 254 C-4 262 4 262 8 254 L18 266 C34 262 48 250 48 232 C46 214 20 214 0 228Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>
      <ellipse cx="-17" cy="248" rx="6" ry="5" fill="${c.edge}" opacity=".45"/><ellipse cx="17" cy="248" rx="6" ry="5" fill="${c.edge}" opacity=".45"/>
      ${leg(-1)}${leg(1)}
      <g class="l3-sk-ribcage">${ribs}<rect x="-5" y="88" width="10" height="58" rx="4" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.5"/></g>
      ${bone(-6, 84, -46, 84, 5, c)}${bone(6, 84, 46, 84, 5, c)}
      ${arm(-1, arms.l)}${arm(1, arms.r)}
      <g class="l3-sk-skull">
        <path d="M-22 30 C-24 6 -12 -1 0 -1 C12 -1 24 6 22 30 C21 40 17 44 15 48 L15 56 C12 62 6 64 0 64 C-6 64 -12 62 -15 56 L-15 48 C-17 44 -21 40 -22 30Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>
        <ellipse cx="-9" cy="31" rx="6.5" ry="7" fill="${c.dark}"/><ellipse cx="9" cy="31" rx="6.5" ry="7" fill="${c.dark}"/>
        <path d="M0 38 L-4 46 L4 46Z" fill="${c.dark}"/>
        <rect x="-10" y="50" width="20" height="7" rx="2" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.2"/>
        <path d="M-5 50 L-5 57 M0 50 L0 57 M5 50 L5 57" stroke="${c.edge}" stroke-width="1"/>
      </g>
    </g>`;
  }

  // A child in the same frame as skeleton(), so an X-ray lines up with the body
  function person(o = {}) {
    o = Object.assign({ x: 0, y: 0, s: 1, skin: SKIN, hair: '#2B1B10', shirt: '#29B6F6', shorts: '#3949AB', shoe: '#E53935', arms: {}, face: true, cls: '' }, o);
    const arms = Object.assign({ l: [0, 0], r: [0, 0] }, o.arms);
    const dk = S.mix(o.skin, '#000', .2);
    const limb = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${dk}" stroke-width="${w + 3}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.skin}" stroke-width="${w}" stroke-linecap="round"/>`;
    const arm = (side, [a, b]) => {
      const sx = side * 48, sy = 92, ex = side * 54, ey = 166, wx = side * 58, wy = 238;
      return `<g transform="rotate(${f1(-side * a)} ${sx} 88)">${limb(sx, sy, ex, ey, 22)}
        <g transform="rotate(${f1(-side * b)} ${ex} ${ey})">${limb(ex, ey, wx, wy, 19)}<circle cx="${wx}" cy="${wy + 14}" r="12" fill="${o.skin}" stroke="${dk}" stroke-width="1.5"/></g></g>`;
    };
    return `<g class="${o.cls}" transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${o.s})">
      ${limb(-26, 250, -23, 404, 26)}${limb(26, 250, 23, 404, 26)}
      <ellipse cx="-26" cy="416" rx="17" ry="9" fill="${o.shoe}"/><ellipse cx="26" cy="416" rx="17" ry="9" fill="${o.shoe}"/>
      <path d="M-47 220 L47 220 L52 300 L6 300 L0 268 L-6 300 L-52 300Z" fill="${o.shorts}" stroke="${S.mix(o.shorts, '#000', .25)}" stroke-width="2"/>
      ${arm(-1, arms.l)}${arm(1, arms.r)}
      <path d="M-40 80 Q0 92 40 80 L58 92 L66 128 L46 134 L47 232 L-47 232 L-46 134 L-66 128 L-58 92Z" fill="${o.shirt}" stroke="${S.mix(o.shirt, '#000', .25)}" stroke-width="2"/>
      <rect x="-9" y="56" width="18" height="28" fill="${o.skin}"/>
      <path d="M-14 81 Q0 96 14 81" fill="${o.skin}" stroke="${dk}" stroke-width="1.5"/>
      <circle cx="-28" cy="34" r="7" fill="${o.skin}"/><circle cx="28" cy="34" r="7" fill="${o.skin}"/>
      <ellipse cx="0" cy="30" rx="28" ry="32" fill="${o.skin}" stroke="${dk}" stroke-width="1.5"/>
      <path d="M-29 28 C-34 -8 34 -8 29 28 C24 10 12 4 0 6 C-12 4 -24 10 -29 28Z" fill="${o.hair}"/>
      ${o.face ? `<circle cx="-10" cy="32" r="4" fill="#2B1B10"/><circle cx="10" cy="32" r="4" fill="#2B1B10"/>
      <circle cx="-9" cy="31" r="1.3" fill="#fff"/><circle cx="11" cy="31" r="1.3" fill="#fff"/>
      <path d="M-9 46 Q0 54 9 46" stroke="#6B2E14" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : ''}
    </g>`;
  }

  // ---------- Organs (x,y = centre) ----------
  function heart({ x = 0, y = 0, s = 1, cls = 'l3-heart', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)}) scale(${s})" ${attrs}><g transform="rotate(-12)">
      <path d="M-4 -12 C-6 -28 10 -32 14 -20" stroke="#8E1B1B" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M-4 -12 C-6 -28 10 -32 14 -20" stroke="#E53935" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-12 -14 L-12 -26" stroke="#1E63B8" stroke-width="7" stroke-linecap="round"/>
      <path d="M0 -6 C-6 -20 -26 -16 -24 0 C-22 14 -8 22 2 30 C12 20 26 10 24 -4 C22 -18 6 -20 0 -6Z" fill="#D32F2F" stroke="#8E1B1B" stroke-width="2"/>
      <path d="M2 -4 C4 6 2 16 2 26" stroke="#8E1B1B" stroke-width="1.5" fill="none" opacity=".6"/>
      <ellipse cx="-11" cy="-4" rx="6" ry="3.5" fill="#fff" opacity=".35"/></g></g>`;
  }
  function lungs({ x = 0, y = 0, s = 1, cls = 'l3-lungs', attrs = '' } = {}) {
    const lobe = 'M-8 -30 C-26 -28 -36 -4 -34 24 C-33 38 -20 40 -8 34 C-4 20 -3 -8 -8 -30Z';
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)}) scale(${s})" ${attrs}>
      <rect x="-4" y="-54" width="8" height="26" rx="3" fill="#F2C4C8" stroke="#A7707A" stroke-width="1.5"/>
      <path d="M0 -30 L-10 -20 M0 -30 L10 -20" stroke="#F2C4C8" stroke-width="6" stroke-linecap="round"/>
      <path d="${lobe}" fill="#B86BA0" stroke="#6F3160" stroke-width="2"/>
      <path d="${lobe}" transform="scale(-1 1)" fill="#B86BA0" stroke="#6F3160" stroke-width="2"/>
      <path d="M-24 0 Q-18 6 -12 2 M-26 18 Q-18 22 -12 16 M24 0 Q18 6 12 2 M26 18 Q18 22 12 16" stroke="#8C4478" stroke-width="1.5" fill="none"/>
      <ellipse cx="-22" cy="-10" rx="4" ry="8" fill="#fff" opacity=".25"/></g>`;
  }
  function brain({ x = 0, y = 0, s = 1, cls = 'l3-brain', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)}) scale(${s})" ${attrs}>
      <path d="M6 16 Q10 30 4 38" stroke="#C0707F" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M-30 4 C-34 -16 -18 -30 0 -30 C20 -32 34 -18 32 0 C34 14 22 22 8 20 C2 26 -8 24 -12 20 C-26 22 -32 14 -30 4Z" fill="#F4A7B9" stroke="#B85C77" stroke-width="2"/>
      <path d="M-22 -8 q6 -8 12 -2 q6 -8 12 0 q6 -6 12 2 M-24 6 q6 -6 12 0 q6 -8 12 -2 q8 -4 14 4 M-8 14 q6 -6 12 0 M2 -24 q-2 8 4 12 M-14 -20 q4 6 0 12" stroke="#C9708A" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  // ---------- Muscles ----------
  // A striped muscle between tendon ends A and B. w = half-width of the belly.
  function muscle(ax, ay, bx, by, w, { tendon = 12, color = '#D8342C', cls = 'l3-muscle', attrs = '' } = {}) {
    const L = Math.hypot(bx - ax, by - ay) || 1;
    const ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux;
    const t = Math.min(tendon, L * .3);
    const A = { x: ax + ux * t, y: ay + uy * t }, B = { x: bx - ux * t, y: by - uy * t };
    const l = L - 2 * t;
    const side = k => {
      const c1 = { x: A.x + ux * l * .2 + nx * w * k * 1.33, y: A.y + uy * l * .2 + ny * w * k * 1.33 };
      const c2 = { x: B.x - ux * l * .2 + nx * w * k * 1.33, y: B.y - uy * l * .2 + ny * w * k * 1.33 };
      return `C${f1(c1.x)} ${f1(c1.y)} ${f1(c2.x)} ${f1(c2.y)} ${f1(B.x)} ${f1(B.y)}`;
    };
    const back = k => {
      const c2 = { x: A.x + ux * l * .2 + nx * w * k * 1.33, y: A.y + uy * l * .2 + ny * w * k * 1.33 };
      const c1 = { x: B.x - ux * l * .2 + nx * w * k * 1.33, y: B.y - uy * l * .2 + ny * w * k * 1.33 };
      return `C${f1(c1.x)} ${f1(c1.y)} ${f1(c2.x)} ${f1(c2.y)} ${f1(A.x)} ${f1(A.y)}`;
    };
    const start = `M${f1(A.x)} ${f1(A.y)}`;
    const dark = S.mix(color, '#000', .3), light = S.mix(color, '#fff', .3);
    return `<g class="${cls}" ${attrs}>
      <path d="M${f1(ax)} ${f1(ay)} L${f1(A.x)} ${f1(A.y)} M${f1(B.x)} ${f1(B.y)} L${f1(bx)} ${f1(by)}" stroke="#A89C8C" stroke-width="7" stroke-linecap="round"/>
      <path d="M${f1(ax)} ${f1(ay)} L${f1(A.x)} ${f1(A.y)} M${f1(B.x)} ${f1(B.y)} L${f1(bx)} ${f1(by)}" stroke="#F1ECE4" stroke-width="4.5" stroke-linecap="round"/>
      <path d="${start} ${side(1)} ${back(-1)}Z" fill="${color}" stroke="${dark}" stroke-width="2"/>
      <path d="${start} ${side(.55)} M${f1(A.x)} ${f1(A.y)} ${side(-.55)} M${f1(A.x)} ${f1(A.y)} ${side(0)}" stroke="${dark}" stroke-width="1.3" fill="none" opacity=".55"/>
      <path d="${start} ${side(.8)}" stroke="${light}" stroke-width="2" fill="none" opacity=".6"/>
    </g>`;
  }

  // ---------- Side view arm ----------
  // Shoulder at (x,y). Upper arm hangs down; bend (degrees) swings the forearm forward (to the right).
  // 0 = straight down, 150 = hand up by the shoulder.
  function armGeom(x, y, bend, L1 = 150, L2 = 140) {
    const b = bend * Math.PI / 180;
    const d = { x: Math.sin(b), y: Math.cos(b) }, n = { x: Math.cos(b), y: -Math.sin(b) };
    const E = { x, y: y + L1 };
    const Wr = { x: E.x + d.x * L2, y: E.y + d.y * L2 };
    const bic = { a: { x: x + 13, y: y + 26 }, b: { x: E.x + d.x * 30 + n.x * 7, y: E.y + d.y * 30 + n.y * 7 } };
    const tri = { a: { x: x - 14, y: y + 24 }, b: { x: E.x - d.x * 13 - n.x * 3, y: E.y - d.y * 13 - n.y * 3 } };
    return { d, n, E, Wr, bic, tri, L1, L2 };
  }
  // How fat a muscle looks: shorter means fatter
  const fat = (m, rest, w0) => S.clamp(w0 * rest / Math.hypot(m.b.x - m.a.x, m.b.y - m.a.y), w0 * .6, w0 * 2.1);
  function arm(o = {}) {
    o = Object.assign({ x: 200, y: 100, bend: 0, skin: 'faint', bones: true, scapula: true, biceps: true, triceps: false, xray: false, skinColor: SKIN, cls: '' }, o);
    const g = armGeom(o.x, o.y, o.bend);
    const c = o.xray ? XRAY : BONE;
    const H = { x: g.Wr.x + g.d.x * 26, y: g.Wr.y + g.d.y * 26 };
    const skinLayer = op => `<g opacity="${op}">
      <circle cx="${o.x}" cy="${o.y + 6}" r="40" fill="${o.skinColor}"/>
      <line x1="${o.x}" y1="${o.y}" x2="${g.E.x}" y2="${g.E.y}" stroke="${o.skinColor}" stroke-width="66" stroke-linecap="round"/>
      <line x1="${g.E.x}" y1="${g.E.y}" x2="${g.Wr.x}" y2="${g.Wr.y}" stroke="${o.skinColor}" stroke-width="54" stroke-linecap="round"/>
      <circle cx="${f1(H.x)}" cy="${f1(H.y)}" r="27" fill="${o.skinColor}"/>
      <circle cx="${f1(H.x + g.n.x * 18)}" cy="${f1(H.y + g.n.y * 18)}" r="10" fill="${o.skinColor}"/></g>`;
    let out = `<g class="${o.cls}">`;
    if (o.skin === 'solid') out += skinLayer(1);
    else if (o.skin === 'faint') out += skinLayer(.28) + `<g fill="none" stroke="${S.mix(o.skinColor, '#000', .25)}" stroke-width="2" opacity=".5">
      <path d="M${o.x - 33} ${o.y + 10} L${g.E.x - 33} ${g.E.y}"/></g>`;
    if (o.bones) {
      if (o.scapula) out += `<path d="M${o.x - 10} ${o.y - 20} L${o.x - 48} ${o.y + 30} L${o.x - 30} ${o.y + 90} Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2" stroke-linejoin="round" opacity=".9"/>`;
      out += bone(o.x, o.y + 4, g.E.x, g.E.y - 4, 16, c, 'l3-arm-humerus');
      out += `<circle cx="${o.x}" cy="${o.y}" r="15" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>`;
      const u0 = { x: g.E.x - g.d.x * 12, y: g.E.y - g.d.y * 12 };
      out += bone(u0.x, u0.y, g.Wr.x - g.n.x * 3, g.Wr.y - g.n.y * 3, 8, c, 'l3-arm-ulna');
      out += bone(g.E.x + g.n.x * 12 + g.d.x * 6, g.E.y + g.n.y * 12 + g.d.y * 6, g.Wr.x + g.n.x * 9, g.Wr.y + g.n.y * 9, 8, c, 'l3-arm-radius');
      // Hand bones as a small fist
      for (let i = 0; i < 4; i++) {
        const px = g.Wr.x + g.d.x * (12 + i * 3) + g.n.x * (-8 + i * 5), py = g.Wr.y + g.d.y * (12 + i * 3) + g.n.y * (-8 + i * 5);
        out += little(g.Wr.x + g.d.x * 4, g.Wr.y + g.d.y * 4, px, py, 4, c);
        out += little(px, py, px + g.d.x * 10 - g.n.x * 8, py + g.d.y * 10 - g.n.y * 8, 3.4, c);
      }
    }
    if (o.triceps) out += muscle(g.tri.a.x, g.tri.a.y, g.tri.b.x, g.tri.b.y, fat(g.tri, 128, 13), { cls: 'l3-triceps', color: '#C62828' });
    if (o.biceps) out += muscle(g.bic.a.x, g.bic.a.y, g.bic.b.x, g.bic.b.y, fat(g.bic, 150, 13), { cls: 'l3-biceps' });
    return out + `</g>`;
  }

  // Round X-ray window with a thick ring, like the textbook close-ups
  function lens(id, cx, cy, r, inner, ring = '#2BA3B8') {
    return `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0E2A47"/>
      <g clip-path="url(#${id})">${inner}</g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring}" stroke-width="10"/>`;
  }

  // A rounded label pill for scenes
  function pill(x, y, text, { w = null, fill = '#fff', stroke = '#7E57C2', color = '#4A2D8A', size = 18, cls = '' } = {}) {
    const bw = w || text.length * size * .56 + 26;
    return `<g class="${cls}"><rect x="${f1(x - bw / 2)}" y="${y - size}" width="${f1(bw)}" height="${size * 2}" rx="${size}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
      ${S.text(x, y + size * .36, text, { size, fill: color })}</g>`;
  }

  // Side view skull, facing left, centre of the head at (0,0), about 260 wide
  function sideSkull(c = BONE) {
    return `<path d="M-96 34 C-128 -20 -96 -120 10 -122 C96 -124 140 -60 128 10 C122 50 96 70 70 80 L64 118 C40 126 10 124 -10 118 L-30 124 L-66 122 C-84 118 -96 104 -100 90 C-112 84 -116 70 -104 60 C-110 50 -106 42 -96 34Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="3"/>
      <ellipse cx="-58" cy="12" rx="22" ry="20" fill="${c.dark}"/>
      <path d="M-96 44 L-110 60 L-94 62Z" fill="${c.dark}"/>
      <path d="M-86 92 L-20 96 M-80 92 L-80 104 M-66 93 L-66 106 M-52 94 L-52 106 M-38 95 L-38 106" stroke="${c.edge}" stroke-width="2.5" fill="none"/>
      <ellipse cx="44" cy="40" rx="12" ry="9" fill="${c.dark}" opacity=".7"/>`;
  }

  // ---------- Big hand skeleton, palm towards us, wrist at the bottom (about x 250-560, y 150-520) ----------
  const FINGERS = [
    { id: 'thumb', name: 'thumb', base: [352, 402], dir: -38, lens: [62, 44, 36], w: 17 },
    { id: 'index', name: 'pointing finger', base: [372, 388], dir: -12, lens: [86, 52, 34, 26], w: 15 },
    { id: 'middle', name: 'middle finger', base: [402, 384], dir: -2, lens: [90, 58, 38, 28], w: 15 },
    { id: 'ring', name: 'ring finger', base: [430, 388], dir: 9, lens: [84, 52, 34, 26], w: 14 },
    { id: 'little', name: 'little finger', base: [454, 396], dir: 20, lens: [72, 40, 26, 22], w: 13 },
  ];
  // lit: { fingerId: true | 'new' }. curl 0..1 folds the fingers down over the palm.
  // Returns the markup and where each joint is.
  function bigHand({ lit = {}, curl = 0, xray = false, newCls = '' } = {}) {
    const c = xray ? XRAY : BONE, on = { fill: '#FFD54F', edge: '#C79A00' };
    let out = `${bone(372, 520, 380, 456, 26, c)}${bone(430, 520, 424, 456, 22, c)}`;
    const carp = [[372, 440], [398, 436], [424, 440], [446, 446], [360, 418], [386, 414], [412, 414], [438, 420]];
    carp.forEach(([x, y]) => { out += `<ellipse cx="${x}" cy="${y}" rx="13" ry="11" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>`; });
    const joints = [{ id: 'wrist', x: 400, y: 452 }];
    FINGERS.forEach(f => {
      const col = lit[f.id] ? on : c;
      let [x, y] = f.base, a = f.dir * Math.PI / 180;
      let g = '';
      f.lens.forEach((L, i) => {
        // Seen from the front, a bent finger bone looks shorter, then folds back down
        const bend = i ? curl * i * (f.id === 'thumb' ? 40 : 58) * Math.PI / 180 : 0;
        const k = Math.cos(bend);
        const ux = Math.sin(a), uy = -Math.cos(a);
        const x2 = x + ux * L * k, y2 = y + uy * L * k;
        const b = bone(x, y, x2, y2, f.w - i * 1.5, col);
        g += k < 0 ? `<g opacity=".8">${b}</g>` : b;
        const gap = 6 * (k < 0 ? -1 : 1);
        if (i < f.lens.length - 1) joints.push({ id: `${f.id}-${i}`, f: f.id, x: x2 + ux * gap / 2, y: y2 + uy * gap / 2 });
        x = x2 + ux * gap; y = y2 + uy * gap;
        a += (f.id === 'thumb' ? 8 : 1.5) * Math.PI / 180;
      });
      out += `<g class="hot" data-f="${f.id}"><g class="${lit[f.id] === 'new' ? newCls : ''}">${g}</g></g>`;
    });
    return { svg: out, joints };
  }

  // ---------- Side view body, facing right ----------
  // Hip at (x,y). Pose angles in degrees: hipF/hipB swing the thighs forward, kneeF/kneeB bend the knees,
  // footF/footB lift the toes, shF/shB swing the upper arms forward, elF/elB bend the elbows, lean tips the body forward.
  // style 'bones' draws a skeleton; 'body' draws a person (o.dark makes a silhouette).
  function sideBody(pose = {}, o = {}) {
    const p = Object.assign({ hipF: 0, kneeF: 0, footF: 0, hipB: 0, kneeB: 0, footB: 0, shF: 0, elF: 10, shB: 0, elB: 10, lean: 0, headTurn: 0 }, pose);
    o = Object.assign({ x: 400, y: 280, s: 1, style: 'bones', skin: SKIN, shirt: '#29B6F6', trousers: '#3949AB', hair: '#2B1B10', shoe: '#E53935', dark: null }, o);
    const R = d => d * Math.PI / 180;
    const T = (px, py) => ({ x: o.x + px * o.s, y: o.y + py * o.s });
    const up = (px, py) => { const a = R(p.lean); return { x: px * Math.cos(a) - py * Math.sin(a), y: px * Math.sin(a) + py * Math.cos(a) }; };
    const hip = { x: 0, y: 0 }, neck = up(2, -150), sh = up(6, -136), head = up(10, -192);
    const leg = (a1, kn, ff) => {
      const K = { x: Math.sin(R(a1)) * 95, y: Math.cos(R(a1)) * 95 };
      const a2 = a1 - kn;
      const A = { x: K.x + Math.sin(R(a2)) * 92, y: K.y + Math.cos(R(a2)) * 92 };
      const Tt = { x: A.x + Math.cos(R(a2 + ff)) * 38, y: A.y - Math.sin(R(a2 + ff)) * 38 };
      return { K, A, T: Tt };
    };
    const arm = (b1, el) => {
      const E = { x: sh.x + Math.sin(R(b1)) * 74, y: sh.y + Math.cos(R(b1)) * 74 };
      const b2 = b1 + el;
      const Wr = { x: E.x + Math.sin(R(b2)) * 68, y: E.y + Math.cos(R(b2)) * 68 };
      const H = { x: Wr.x + Math.sin(R(b2)) * 16, y: Wr.y + Math.cos(R(b2)) * 16 };
      return { E, W: Wr, H };
    };
    const LF = leg(p.hipF, p.kneeF, p.footF), LB = leg(p.hipB, p.kneeB, p.footB);
    const AF = arm(p.shF, p.elF), AB = arm(p.shB, p.elB);
    const Q = pt => T(pt.x, pt.y);
    const pts = {
      hip: Q(hip), shoulder: Q(sh), head: Q(head),
      kneeF: Q(LF.K), ankleF: Q(LF.A), toeF: Q(LF.T), kneeB: Q(LB.K), ankleB: Q(LB.A), toeB: Q(LB.T),
      elbowF: Q(AF.E), wristF: Q(AF.W), handF: Q(AF.H), elbowB: Q(AB.E), wristB: Q(AB.W), handB: Q(AB.H),
    };
    const line = (a, b, w, col) => `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
    let out = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${o.s})">`;
    if (o.style === 'bones') {
      const c = BONE, far = { fill: '#E3D8C0', edge: '#A89878' };
      const legB = (L, cc) => bone(0, 4, L.K.x, L.K.y, 12, cc) + bone(L.K.x, L.K.y + 2, L.A.x, L.A.y, 9, cc) + little(L.A.x, L.A.y, L.T.x, L.T.y, 9, cc);
      const armB = (A, cc) => bone(sh.x, sh.y, A.E.x, A.E.y, 9, cc) + bone(A.E.x, A.E.y, A.W.x, A.W.y, 7, cc) + little(A.W.x, A.W.y, A.H.x, A.H.y, 8, cc);
      out += armB(AB, far) + legB(LB, far);
      for (let i = 0; i < 16; i++) {
        const t = i / 15, q = up(-6 - Math.sin(t * Math.PI) * 8, -8 - t * 142);
        out += `<rect x="${f1(q.x - 6)}" y="${f1(q.y - 4)}" width="12" height="8" rx="2.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.3" transform="rotate(${f1(p.lean)} ${f1(q.x)} ${f1(q.y)})"/>`;
      }
      for (let i = 0; i < 8; i++) {
        const a = up(-10, -128 + i * 11), b = up(34 - Math.abs(i - 3) * 3, -118 + i * 12), d = up(8, -116 + i * 12);
        const dd = `M${f1(a.x)} ${f1(a.y)} Q${f1(b.x)} ${f1(b.y - 14)} ${f1(b.x)} ${f1(b.y)} Q${f1(b.x - 4)} ${f1(b.y + 8)} ${f1(d.x + 14)} ${f1(d.y + 10)}`;
        out += `<path d="${dd}" stroke="${c.edge}" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="${dd}" stroke="${c.fill}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      }
      out += `<path d="M-26 -16 C-30 -40 10 -44 22 -24 C26 -12 18 6 6 12 C-8 16 -22 6 -26 -16Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>`;
      out += legB(LF, c);
      out += `<g transform="translate(${f1(head.x)} ${f1(head.y)}) rotate(${f1(p.lean + p.headTurn)}) scale(-.3 .3)">${sideSkull(c)}</g>`;
      out += armB(AF, c);
    } else {
      const dk = o.dark;
      const skin = dk || o.skin, shirt = dk || o.shirt, tr = dk || o.trousers, shoe = dk || o.shoe;
      const back = dk || S.mix(skin, '#000', .15), trB = dk || S.mix(tr, '#000', .15);
      const legD = (L, col, sh2) => line(hip, L.K, 30, col) + line(L.K, L.A, 25, col) + line(L.A, L.T, 16, sh2);
      const armD = (A, col, sl) => line(sh, A.E, 20, sl) + line(A.E, A.W, 17, col) + `<circle cx="${f1(A.H.x)}" cy="${f1(A.H.y)}" r="11" fill="${col}"/>`;
      out += armD(AB, back, dk || S.mix(shirt, '#000', .15)) + legD(LB, trB, dk || S.mix(shoe, '#000', .2));
      const c1 = up(-30, -2), c2 = up(28, -2), c3 = up(32, -140), c4 = up(-28, -146);
      out += `<path d="M${f1(c1.x)} ${f1(c1.y)} L${f1(c2.x)} ${f1(c2.y)} L${f1(c3.x)} ${f1(c3.y)} Q${f1(neck.x)} ${f1(neck.y - 10)} ${f1(c4.x)} ${f1(c4.y)}Z" fill="${shirt}" stroke="${dk || S.mix(shirt, '#000', .25)}" stroke-width="2" stroke-linejoin="round"/>`;
      out += line(neck, head, 16, skin);
      out += legD(LF, tr, shoe);
      const face = dk ? '' : `<path d="M-30 -4 C-34 -40 26 -44 28 -12 C18 -24 -4 -26 -12 -14 C-18 -8 -22 -6 -30 -4Z" fill="${o.hair}"/>
        <circle cx="-4" cy="4" r="7" fill="${S.mix(skin, '#000', .1)}"/>
        <circle cx="14" cy="-2" r="3.5" fill="#2B1B10"/><path d="M12 16 Q20 18 24 12" stroke="#6B2E14" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
      out += `<g transform="translate(${f1(head.x)} ${f1(head.y)}) rotate(${f1(p.lean + p.headTurn)})"><ellipse rx="28" ry="31" fill="${skin}"/>${face}</g>`;
      out += armD(AF, skin, dk || shirt);
    }
    return { svg: out + '</g>', pts };
  }

  // A wiggly line from (x1,y1) to (x2,y2), like the joins between skull bones
  function squiggle(x1, y1, x2, y2, n, amp, seed) {
    const r = S.rng(seed);
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    let d = `M${x1} ${y1}`;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, side = i % 2 ? 1 : -1;
      const a = amp * (.3 + r() * 1.4);
      const mx = x1 + (x2 - x1) * (t0 + t1) / 2 - uy * side * a, my = y1 + (y2 - y1) * (t0 + t1) / 2 + ux * side * a;
      d += ` Q${f1(mx)} ${f1(my)} ${f1(x1 + (x2 - x1) * t1)} ${f1(y1 + (y2 - y1) * t1)}`;
    }
    return d;
  }

  // Turn point (px,py) around (cx,cy) by deg degrees
  const rot = (px, py, cx, cy, deg) => {
    const a = deg * Math.PI / 180, dx = px - cx, dy = py - cy;
    return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
  };

  return { BONE, XRAY, SKIN, FINGERS, squiggle, rot, sideSkull, bigHand, sideBody, bone, little, handBones, skeleton, person, heart, lungs, brain, muscle, armGeom, fat, arm, lens, pill };
})();
