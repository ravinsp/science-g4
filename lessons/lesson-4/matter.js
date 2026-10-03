// Lesson 4 drawing helpers: thermometers, ice, glasses, burners, labels and blobs.
// Loaded before the chapter files (see lessons/lessons.js). All return SVG markup.
const L4 = (() => {
  const f1 = S.f1;

  // Smooth closed path through points (Catmull-Rom)
  function smooth(pts) {
    const n = pts.length;
    let d = `M${f1(pts[0].x)} ${f1(pts[0].y)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f1(p1.x + (p2.x - p0.x) / 6)} ${f1(p1.y + (p2.y - p0.y) / 6)} ${f1(p2.x - (p3.x - p1.x) / 6)} ${f1(p2.y - (p3.y - p1.y) / 6)} ${f1(p2.x)} ${f1(p2.y)}`;
    }
    return d + 'Z';
  }

  // Wobbly round shape, for pools and splashes
  function blob(cx, cy, rx, ry, seed = 1, n = 9, wob = .2) {
    const r = S.rng(seed);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * 2 * wob;
      pts.push({ x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k });
    }
    return smooth(pts);
  }

  // Text label in a box, like the book's labels
  function pill(x, y, text, { size = 18, fill = '#FDEBE1', stroke = '#6E665A', color = '#2B2A28', w = null, cls = '' } = {}) {
    const bw = w || text.length * size * .56 + 22;
    return `<g class="${cls}"><rect x="${f1(x - bw / 2)}" y="${f1(y - size * .95)}" width="${f1(bw)}" height="${f1(size * 1.9)}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <text x="${f1(x)}" y="${f1(y + size * .35)}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${color}">${text}</text></g>`;
  }

  // Thermometer. x = tube centre, y = top of tube, h = tube length.
  // Returns { svg, yOf(v), set(root, v) }. The liquid is tagged data-th="id".
  function thermo(o = {}) {
    o = Object.assign({ x: 400, y: 60, h: 300, min: 0, max: 100, major: 10, minor: null, value: 20, w: 16, id: 'th', face: true, labels: true, unit: true, font: 16, liquid: '#E53935', faceW: null }, o);
    const { x, y, h, min, max, major, w, id } = o;
    const minor = o.minor || major / 5;
    const bulb = w * 1.25, bulbY = y + h + bulb * .7;
    const pad = 12;
    const yOf = v => y + h - pad - (S.clamp((v - min) / (max - min), -0.06, 1.03)) * (h - pad * 2);
    let ticks = '';
    for (let v = min, i = 0; v <= max + 1e-6; v = min + (++i) * minor) {
      const big = Math.abs(v / major - Math.round(v / major)) < 1e-6;
      const yy = f1(yOf(v));
      ticks += `<path d="M${f1(x + w / 2 + 2)} ${yy} l${big ? 16 : 8} 0" stroke="#3B3F6B" stroke-width="${big ? 2 : 1.3}"/>`;
      if (big && o.labels) ticks += `<text x="${f1(x + w / 2 + 22)}" y="${f1(+yy + o.font * .35)}" font-size="${o.font}" font-weight="700" fill="#3B3F6B">${String(Math.round(v)).replace('-', '−')}</text>`;
    }
    const fw = o.faceW || (w + 30 + o.font * 2.4 + 24);
    const face = o.face ? `<rect x="${f1(x - w / 2 - 22)}" y="${f1(y - (o.unit ? 40 : 18))}" width="${f1(fw)}" height="${f1(bulbY + bulb + 18 - y + (o.unit ? 40 : 18))}" rx="${f1(fw / 2.2)}" fill="#fff" stroke="#9AA3B5" stroke-width="2"/>` : '';
    const ly = yOf(o.value);
    const svg = `<g class="l4-thermo">${face}
      ${o.unit ? `<text x="${f1(x + w / 2 + 22)}" y="${f1(y - 12)}" font-size="${o.font}" font-weight="800" fill="#3B3F6B">°C</text>` : ''}
      <rect x="${f1(x - w / 2)}" y="${f1(y)}" width="${w}" height="${f1(h + 4)}" rx="${f1(w / 2)}" fill="#F4F8FB" stroke="#8C96A8" stroke-width="2"/>
      <circle cx="${x}" cy="${f1(bulbY)}" r="${f1(bulb + 2)}" fill="#8C96A8"/>
      <rect data-th="${id}" x="${f1(x - w / 2 + 3.5)}" y="${f1(ly)}" width="${f1(w - 7)}" height="${f1(bulbY - ly)}" rx="${f1((w - 7) / 2)}" fill="${o.liquid}"/>
      <circle cx="${x}" cy="${f1(bulbY)}" r="${f1(bulb)}" fill="${o.liquid}"/>
      <circle cx="${f1(x - bulb * .35)}" cy="${f1(bulbY - bulb * .35)}" r="${f1(bulb * .25)}" fill="#fff" opacity=".5"/>
      ${ticks}</g>`;
    const set = (root, v) => {
      const r = root.querySelector(`[data-th="${id}"]`);
      if (!r) return;
      const yy = yOf(v);
      r.setAttribute('y', f1(yy));
      r.setAttribute('height', f1(Math.max(0, bulbY - yy)));
    };
    return { svg, yOf, set, bulbY, bulb };
  }

  // Ice cube. x,y = bottom centre of the front face, e = edge length
  function ice({ x = 0, y = 0, e = 40, rot = 0, cls = 'l4-ice', op = 1 } = {}) {
    const d = e * .35, L = x - e / 2, R = x + e / 2, T = y - e;
    return `<g class="${cls}" transform="rotate(${rot} ${x} ${f1(y - e / 2)})" opacity="${op}">
      <path d="M${f1(L)} ${f1(T)} L${f1(L + d)} ${f1(T - d)} L${f1(R + d)} ${f1(T - d)} L${f1(R)} ${f1(T)}Z" fill="#F2FBFF" stroke="#6FB6DA" stroke-width="2" stroke-linejoin="round"/>
      <path d="M${f1(R)} ${f1(T)} L${f1(R + d)} ${f1(T - d)} L${f1(R + d)} ${f1(y - d)} L${f1(R)} ${f1(y)}Z" fill="#A9DDF5" stroke="#6FB6DA" stroke-width="2" stroke-linejoin="round"/>
      <rect x="${f1(L)}" y="${f1(T)}" width="${e}" height="${e}" rx="${f1(e * .1)}" fill="#CFEFFF" stroke="#6FB6DA" stroke-width="2"/>
      <path d="M${f1(L + e * .18)} ${f1(T + e * .7)} L${f1(L + e * .18)} ${f1(T + e * .2)} L${f1(L + e * .6)} ${f1(T + e * .2)}" stroke="#fff" stroke-width="${f1(e * .07)}" fill="none" stroke-linecap="round" opacity=".9"/>
    </g>`;
  }

  // Tapered drinking glass. x,y = bottom centre. level 0..1
  function glassShape(x, y, w, h) {
    const bw = w * .8;
    return { top: y - h, at: t => ({ l: x - (bw + (w - bw) * t) / 2, r: x + (bw + (w - bw) * t) / 2 }) };
  }
  function glass({ x = 0, y = 0, w = 80, h = 130, level = .75, liquid = '#9ED8F7', id = '', cls = 'l4-glass', foam = false } = {}) {
    const g = glassShape(x, y, w, h), b = g.at(0), t = g.at(1);
    return `<g class="${cls}">
      <path ${id ? `data-liq="${id}"` : ''} d="${glassLiquidD(x, y, w, h, level)}" fill="${liquid}"/>
      ${foam && level > .05 ? `<rect x="${f1(g.at(level * .94).l + 3)}" y="${f1(y - h * level * .94 - 2)}" width="${f1(g.at(level * .94).r - g.at(level * .94).l - 6)}" height="6" rx="3" fill="#fff" opacity=".7"/>` : ''}
      <path d="M${f1(t.l)} ${f1(g.top)} L${f1(b.l)} ${f1(y - 6)} Q${f1(b.l)} ${y} ${f1(b.l + 8)} ${y} L${f1(b.r - 8)} ${y} Q${f1(b.r)} ${y} ${f1(b.r)} ${f1(y - 6)} L${f1(t.r)} ${f1(g.top)}" fill="url(#g-glass)" stroke="#7A93A6" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="${x}" cy="${f1(g.top)}" rx="${f1(w / 2)}" ry="5" fill="none" stroke="#7A93A6" stroke-width="2"/>
      <path d="M${f1(t.l + 10)} ${f1(g.top + 14)} L${f1(b.l + 9)} ${f1(y - 16)}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    </g>`;
  }
  function glassLiquidD(x, y, w, h, level) {
    if (level <= 0) return 'M0 0Z';
    const g = glassShape(x, y, w, h), lv = Math.min(level, 1) * .94, b = g.at(0), t = g.at(lv);
    const ty = y - h * lv;
    return `M${f1(t.l + 2)} ${f1(ty)} L${f1(b.l + 2)} ${f1(y - 7)} Q${f1(b.l + 2)} ${y - 2} ${f1(b.l + 9)} ${y - 2} L${f1(b.r - 9)} ${y - 2} Q${f1(b.r - 2)} ${y - 2} ${f1(b.r - 2)} ${f1(y - 7)} L${f1(t.r - 2)} ${f1(ty)}Z`;
  }

  // Spirit burner under a tripod. x,y = centre on the bench
  function burner({ x = 0, y = 0, flame = 1, id = '' } = {}) {
    return `<g class="l4-burner">
      <path d="M${x - 70} ${y} L${x - 52} ${y - 118} M${x + 70} ${y} L${x + 52} ${y - 118} M${x} ${y - 6} L${x} ${y - 118}" stroke="#4A4A55" stroke-width="7" stroke-linecap="round" opacity=".85"/>
      <rect x="${x - 66}" y="${y - 126}" width="132" height="10" rx="5" fill="#4A4A55"/>
      <path d="M${x - 26} ${y} L${x - 22} ${y - 34} Q${x} ${y - 44} ${x + 22} ${y - 34} L${x + 26} ${y}Z" fill="#7E57C2" stroke="#4A2D8A" stroke-width="2.5"/>
      <rect x="${x - 7}" y="${y - 50}" width="14" height="12" rx="3" fill="#B0BEC5" stroke="#607D8B" stroke-width="2"/>
      <g ${id ? `id="${id}"` : ''} transform="translate(${x} ${y - 50}) scale(${flame})">
        <path d="M0 0 C-14 -10 -10 -30 0 -48 C10 -30 14 -10 0 0Z" fill="#FF9800"/>
        <path d="M0 -2 C-7 -8 -5 -20 0 -30 C5 -20 7 -8 0 -2Z" fill="#FFEB3B"/>
      </g>
    </g>`;
  }

  // Lab beaker with a spout. x,y = bottom centre. Liquid tagged data-bk="id"
  function beaker({ x = 0, y = 0, w = 120, h = 150, level = .5, liquid = '#9ED8F7', id = '' } = {}) {
    const lh = (h - 10) * level;
    return `<g class="l4-beaker">
      <rect ${id ? `data-bk="${id}"` : ''} x="${f1(x - w / 2 + 4)}" y="${f1(y - 4 - lh)}" width="${w - 8}" height="${f1(lh)}" rx="5" fill="${liquid}" opacity=".9"/>
      <path d="M${x - w / 2 - 8} ${y - h - 6} L${x - w / 2} ${y - h + 4} L${x - w / 2} ${y - 8} Q${x - w / 2} ${y} ${x - w / 2 + 8} ${y} L${x + w / 2 - 8} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - 8} L${x + w / 2} ${y - h}" fill="url(#g-glass)" stroke="#5E7C90" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${x - w / 2 + 12} ${y - h + 16} L${x - w / 2 + 12} ${y - 20}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/>
    </g>`;
  }

  // Water drops scattered over a box (condensation)
  function droplets(x, y, w, h, n = 30, seed = 3, rmax = 6, cls = 'l4-drop') {
    const r = S.rng(seed);
    let out = '';
    for (let i = 0; i < n; i++) {
      const rr = 2 + r() * (rmax - 2), cx = x + r() * w, cy = y + r() * h;
      out += `<g class="${cls}" data-d="${i}"><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rr * .85)}" ry="${f1(rr)}" fill="#E3F4FF" fill-opacity=".75" stroke="#7FB8D8" stroke-width="1"/>
        <circle cx="${f1(cx - rr * .3)}" cy="${f1(cy - rr * .35)}" r="${f1(rr * .28)}" fill="#fff"/></g>`;
    }
    return out;
  }

  // Party balloon. x,y = centre
  function balloon({ x = 0, y = 0, rx = 60, ry = 72, color = '#FF7043', string = 80 } = {}) {
    const dark = S.mix(color, '#000', .25);
    return `<g class="l4-balloon">
      ${string ? `<path d="M${x} ${y + ry + 8} q-12 ${string * .35} 4 ${string * .6} t-4 ${string * .4}" stroke="#9E9E9E" stroke-width="2" fill="none"/>` : ''}
      <path d="M${x - 7} ${y + ry + 10} L${x} ${y + ry - 2} L${x + 7} ${y + ry + 10}Z" fill="${dark}"/>
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}" stroke="${dark}" stroke-width="2.5"/>
      <ellipse cx="${f1(x - rx * .38)}" cy="${f1(y - ry * .42)}" rx="${f1(rx * .16)}" ry="${f1(ry * .24)}" fill="#fff" opacity=".45" transform="rotate(25 ${f1(x - rx * .38)} ${f1(y - ry * .42)})"/>
    </g>`;
  }

  // Small icons for the three states of matter
  function stateIcon(kind, x, y, s = 1) {
    const t = `translate(${x} ${y}) scale(${s})`;
    if (kind === 'solid') return `<g transform="${t}">${ice({ x: -12, y: 18, e: 22 })}${ice({ x: 14, y: 18, e: 22 })}${ice({ x: 2, y: -6, e: 22, rot: 12 })}</g>`;
    if (kind === 'liquid') return `<g transform="${t}"><path d="M0 -26 C10 -10 18 0 18 10 A18 18 0 0 1 -18 10 C-18 0 -10 -10 0 -26Z" fill="#4FC3F7" stroke="#1E88E5" stroke-width="2.5"/></g>`;
    return `<g transform="${t}"><path d="${blob(0, 0, 24, 20, 7, 7, .15)}" fill="#CFD8DC" stroke="#546E7A" stroke-width="2.5"/><circle cx="-10" cy="-4" r="7" fill="#ECEFF1"/></g>`;
  }

  // Wavy steam wisp rising from x,y; t moves it
  function wisp(x, y, h = 80, t = 0, amp = 8) {
    let d = `M${f1(x)} ${f1(y)}`;
    for (let i = 1; i <= 6; i++) d += ` L${f1(x + Math.sin(t * 3 + i * .9) * amp * i / 6)} ${f1(y - h * i / 6)}`;
    return d;
  }

  // Press-and-hold button under the stage. onDown/onUp fire when it is pressed and let go.
  function hold(api, label, { onDown, onUp, cls = 'primary' } = {}) {
    const b = api.button(label, () => {}, { cls, sound: null });
    let down = false;
    const up = () => { if (!down) return; down = false; b.classList.remove('on'); onUp && onUp(); };
    b.addEventListener('pointerdown', e => {
      if (b.disabled) return;
      down = true; b.classList.add('on');
      b.setPointerCapture && b.setPointerCapture(e.pointerId);
      onDown && onDown();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, up));
    api.onCleanup(up);
    return b;
  }

  return { smooth, blob, pill, thermo, ice, glass, glassLiquidD, burner, beaker, droplets, balloon, stateIcon, wisp, hold };
})();
