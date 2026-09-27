// Drawing helpers. Most functions return SVG markup strings so scenes can
// be built with template literals, then brought to life with S.q() lookups.
const S = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const f1 = n => Math.round(n * 10) / 10;

  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Turn a markup string into a real SVG node (for adding pieces later)
  function frag(markup) {
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = markup;
    return g.childNodes.length === 1 ? g.firstChild : g;
  }

  // Small seeded random generator so drawings look the same every time
  function rng(seed = 1) {
    let a = seed * 9973 + 17;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  function hex(c) {
    c = c.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16));
  }
  // Blend two colours: t = 0 gives a, t = 1 gives b
  function mix(a, b, t) {
    const A = hex(a), B = hex(b);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, '0')).join('');
  }

  // Point and direction on a cubic Bézier curve
  function bez(p0, p1, p2, p3, t) {
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    };
  }
  function bezAngle(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
    const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  // ---------- Leaves ----------
  // Leaf outline pointing right from (0,0), length L and half-width W.
  function leafPath(shape, L, W) {
    switch (shape) {
      case 'round':
        return `M0 0 C${f1(L * .05)} ${f1(-W * 1.3)} ${f1(L * .95)} ${f1(-W * 1.3)} ${L} 0 C${f1(L * .95)} ${f1(W * 1.3)} ${f1(L * .05)} ${f1(W * 1.3)} 0 0Z`;
      case 'long':
        return `M0 0 C${f1(L * .3)} ${f1(-W * .7)} ${f1(L * .7)} ${f1(-W * .6)} ${L} 0 C${f1(L * .7)} ${f1(W * .6)} ${f1(L * .3)} ${f1(W * .7)} 0 0Z`;
      case 'heart':
        return `M0 0 C${f1(-L * .1)} ${f1(-W * 1.2)} ${f1(L * .45)} ${f1(-W * 1.3)} ${L} 0 C${f1(L * .45)} ${f1(W * 1.3)} ${f1(-L * .1)} ${f1(W * 1.2)} 0 0Z`;
      case 'oak': {
        // Wavy lobes along both sides
        const n = 4; let top = 'M0 0', bot = '';
        for (let i = 0; i < n; i++) {
          const x1 = L * (i + .5) / n, x2 = L * (i + 1) / n;
          const w = W * (1.15 - Math.abs(i - 1.6) * .18);
          top += ` Q${f1(x1 - L * .06)} ${f1(-w * 1.5)} ${f1(x1 + L * .05)} ${f1(-w * .9)} Q${f1(x2 - L * .04)} ${f1(-w * .35)} ${f1(i === n - 1 ? L : x2)} ${f1(i === n - 1 ? 0 : -w * .5)}`;
        }
        for (let i = n - 1; i >= 0; i--) {
          const x1 = L * (i + .5) / n, x0 = L * i / n;
          const w = W * (1.15 - Math.abs(i - 1.6) * .18);
          bot += ` Q${f1(x1 + L * .06)} ${f1(w * 1.5)} ${f1(x1 - L * .05)} ${f1(w * .9)} Q${f1(x0 + L * .04)} ${f1(w * .35)} ${f1(i === 0 ? 0 : x0)} ${f1(i === 0 ? 0 : w * .5)}`;
        }
        return top + bot + 'Z';
      }
      case 'toothed': {
        const n = 8; let d = 'M0 0';
        const edge = (x) => Math.sin(Math.PI * x / L) * W;
        for (let i = 1; i <= n; i++) {
          const x = L * i / n, xm = L * (i - .5) / n;
          d += ` L${f1(xm)} ${f1(-edge(xm) * 1.18)} L${f1(x)} ${f1(-edge(x) * .95)}`;
        }
        for (let i = n - 1; i >= 0; i--) {
          const x = L * i / n, xm = L * (i + .5) / n;
          d += ` L${f1(xm)} ${f1(edge(xm) * 1.18)} L${f1(x)} ${f1(edge(x) * .95)}`;
        }
        return d + 'Z';
      }
      case 'pointed':
      default:
        return `M0 0 C${f1(L * .2)} ${f1(-W * 1.1)} ${f1(L * .65)} ${f1(-W * 1.05)} ${L} 0 C${f1(L * .65)} ${f1(W * 1.05)} ${f1(L * .2)} ${f1(W * 1.1)} 0 0Z`;
    }
  }

  // One leaf (with stalk and midrib) at x,y rotated by angle degrees
  function leaf({ x = 0, y = 0, angle = 0, L = 50, W = 18, shape = 'pointed', color = '#4CAF50', vein = null, stalk = 6, veins = true, cls = 'leaf', attrs = '' } = {}) {
    const v = vein || mix(color, '#ffffff', .35);
    const dark = mix(color, '#000000', .18);
    let side = '';
    if (veins && L > 24) {
      for (let i = 1; i <= 3; i++) {
        const px = stalk + L * (.2 + i * .2);
        side += `M${f1(px)} 0 L${f1(px + L * .12)} ${f1(-W * .55)} M${f1(px)} 0 L${f1(px + L * .12)} ${f1(W * .55)} `;
      }
    }
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(angle)})" ${attrs}>
      ${stalk ? `<path d="M0 0 L${stalk} 0" stroke="${dark}" stroke-width="${Math.max(2, W * .16)}" stroke-linecap="round"/>` : ''}
      <path d="${leafPath(shape, L, W)}" transform="translate(${stalk} 0)" fill="${color}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round"/>
      ${veins ? `<path d="M${stalk} 0 L${f1(stalk + L * .92)} 0 ${side}" stroke="${v}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/>` : ''}
    </g>`;
  }

  // ---------- Flowers ----------
  function petalPath(shape, r, w) {
    switch (shape) {
      case 'pointed': return `M0 0 C${f1(-w)} ${f1(-r * .4)} ${f1(-w * .45)} ${f1(-r * .85)} 0 ${-r} C${f1(w * .45)} ${f1(-r * .85)} ${f1(w)} ${f1(-r * .4)} 0 0Z`;
      case 'heart': return `M0 0 C${f1(-w * 1.2)} ${f1(-r * .4)} ${f1(-w)} ${-r} ${f1(-w * .35)} ${-r} Q0 ${f1(-r * .88)} ${f1(w * .35)} ${-r} C${w} ${-r} ${f1(w * 1.2)} ${f1(-r * .4)} 0 0Z`;
      case 'long': return `M0 0 C${f1(-w * .6)} ${f1(-r * .3)} ${f1(-w * .6)} ${-r} 0 ${-r} C${f1(w * .6)} ${-r} ${f1(w * .6)} ${f1(-r * .3)} 0 0Z`;
      case 'wide': return `M0 0 C${f1(-w * 1.5)} ${f1(-r * .3)} ${f1(-w * 1.3)} ${-r} 0 ${-r} C${f1(w * 1.3)} ${-r} ${f1(w * 1.5)} ${f1(-r * .3)} 0 0Z`;
      case 'round':
      default: return `M0 0 C${f1(-w * 1.1)} ${f1(-r * .35)} ${f1(-w)} ${-r} 0 ${-r} C${w} ${-r} ${f1(w * 1.1)} ${f1(-r * .35)} 0 0Z`;
    }
  }

  function flower({ x = 0, y = 0, r = 30, petals = 8, color = '#FFD23F', center = '#8B5A2B', centerR = null, shape = 'round', petalW = null, rot = 0, open = 1, outline = null, layers = 1, cls = 'flower', attrs = '', seeds = false } = {}) {
    const w = petalW || Math.min(r * .55, (Math.PI * r) / petals * .75);
    const stroke = outline || mix(color, '#000000', .2);
    const cr = centerR == null ? r * .3 : centerR;
    let ps = '';
    for (let L = 0; L < layers; L++) {
      const off = L * (180 / petals);
      const rr = r * (1 - L * .18);
      const col = L ? mix(color, '#ffffff', .15) : color;
      for (let i = 0; i < petals; i++) {
        ps += `<path d="${petalPath(shape, rr * open, w * (0.4 + .6 * open))}" transform="rotate(${f1(rot + off + i * 360 / petals)})" fill="${col}" stroke="${stroke}" stroke-width="1.2"/>`;
      }
    }
    let dots = '';
    if (seeds && cr > 8) {
      for (let i = 0; i < 40; i++) {
        const a = i * 137.5 * Math.PI / 180, d = Math.sqrt(i / 40) * cr * .85;
        dots += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(cr * .06)}" fill="${mix(center, '#000000', .35)}"/>`;
      }
    }
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)})" ${attrs}>${ps}
      <circle r="${f1(cr * (0.6 + .4 * open))}" fill="${center}" stroke="${mix(center, '#000000', .25)}" stroke-width="1.2"/>${dots}</g>`;
  }

  function bud({ x = 0, y = 0, r = 10, color = '#F48FB1', angle = 0, cls = 'bud' } = {}) {
    return `<g class="${cls}" transform="translate(${f1(x)} ${f1(y)}) rotate(${angle})">
      <path d="M0 0 C${-r} ${-r * .6} ${-r * .6} ${-r * 1.9} 0 ${-r * 2.2} C${r * .6} ${-r * 1.9} ${r} ${-r * .6} 0 0Z" fill="${color}" stroke="${mix(color, '#000', .25)}" stroke-width="1.2"/>
      <path d="M0 0 C${-r * .9} ${-r * .3} ${-r * .8} ${-r * 1.1} ${-r * .3} ${-r * 1.4} L0 ${-r * .6} L${r * .3} ${-r * 1.4} C${r * .8} ${-r * 1.1} ${r * .9} ${-r * .3} 0 0Z" fill="#5DAE4B" stroke="#3E8B37" stroke-width="1"/>
    </g>`;
  }

  // ---------- Roots ----------
  // Branching roots going down from (x,y). Same seed = same shape at any size.
  function roots({ x = 0, y = 0, depth = 80, spread = 60, color = '#EBD9B4', w = 4, seed = 3, hairs = false, levels = 2, cls = 'roots' } = {}) {
    const r = rng(seed);
    let out = '';
    let hairOut = '';
    function branch(x0, y0, ang, len, width, lvl) {
      const segs = 4;
      let px = x0, py = y0, a = ang;
      let d = `M${f1(px)} ${f1(py)}`;
      const pts = [];
      for (let s = 0; s < segs; s++) {
        a += (r() - .5) * .55;
        // Keep roots heading downwards so they never poke above the soil
        a = clamp(a, .12, Math.PI - .12);
        const nx = px + Math.cos(a) * len / segs, ny = py + Math.sin(a) * len / segs;
        d += ` Q${f1(px + Math.cos(a) * len / segs * .5 + (r() - .5) * 4)} ${f1(py + Math.sin(a) * len / segs * .5)} ${f1(nx)} ${f1(ny)}`;
        pts.push({ x: nx, y: ny, a });
        px = nx; py = ny;
      }
      out += `<path d="${d}" stroke="${color}" stroke-width="${f1(width)}" fill="none" stroke-linecap="round"/>`;
      if (hairs) {
        pts.forEach(p => {
          for (let k = 0; k < 3; k++) {
            const hx = p.x + (r() - .5) * 6, hy = p.y + (r() - .5) * 6;
            const ha = p.a + (r() < .5 ? 1.4 : -1.4) + (r() - .5) * .6;
            const hl = 4 + r() * 5;
            hairOut += `M${f1(hx)} ${f1(hy)} l${f1(Math.cos(ha) * hl)} ${f1(Math.sin(ha) * hl)} `;
          }
        });
      }
      if (lvl < levels) {
        const kids = 2 + Math.floor(r() * 2);
        for (let k = 0; k < kids; k++) {
          const p = pts[Math.min(segs - 1, 1 + Math.floor(r() * (segs - 1)))];
          const side = k % 2 ? 1 : -1;
          branch(p.x, p.y, p.a + side * (.6 + r() * .6), len * (.45 + r() * .2), width * .6, lvl + 1);
        }
      }
    }
    branch(x, y, Math.PI / 2, depth, w, 0);
    const laterals = 4;
    for (let i = 0; i < laterals; i++) {
      const side = i % 2 ? 1 : -1;
      const ang = Math.PI / 2 + side * (.7 + r() * .6);
      branch(x, y + 2 + i * depth * .06, ang, Math.hypot(spread, depth * .4) * (.6 + r() * .35), w * .75, 1);
    }
    const hairPath = hairs ? `<path class="root-hairs" d="${hairOut}" stroke="${mix(color, '#ffffff', .3)}" stroke-width=".9" fill="none" stroke-linecap="round"/>` : '';
    return `<g class="${cls}">${out}${hairPath}</g>`;
  }

  // ---------- Whole plant ----------
  // A flexible plant: grows, bends towards light, wilts, flowers.
  function plant(opts = {}) {
    const o = Object.assign({
      x: 400, y: 400, h: 200, grow: 1, bend: 0, droop: 0,
      leaves: 6, leafL: 46, leafW: 17, leafShape: 'pointed', leafColor: '#4CAF50', leafStart: .3,
      stemColor: '#43A047', stemW: 7,
      flower: null, flowerColor: '#FFD23F', flowerCenter: '#8B5A2B', flowerR: 24, petals: 10, petalShape: 'round',
      roots: true, rootDepth: null, rootSpread: null, rootColor: '#EBD9B4', rootW: 4, hairs: false,
      fruit: 0, fruitColor: '#E53935', buds: 0, seed: 3, cls: 'plant', id: '',
    }, opts);
    const h = Math.max(4, o.h * o.grow);
    const dir = o.bend < 0 ? -1 : 1;
    const p0 = { x: o.x, y: o.y };
    const p1 = { x: o.x, y: o.y - h * .42 };
    const p2 = { x: o.x + o.bend * h * .22 + dir * o.droop * h * .42, y: o.y - h * (.86 - .08 * o.droop) };
    const p3 = { x: o.x + o.bend * h * .62 + dir * o.droop * h * .5, y: o.y - h * (1 - .1 * Math.abs(o.bend) - .55 * o.droop) };
    const stemD = `M${f1(p0.x)} ${f1(p0.y)} C${f1(p1.x)} ${f1(p1.y)} ${f1(p2.x)} ${f1(p2.y)} ${f1(p3.x)} ${f1(p3.y)}`;
    const sw = Math.max(2, o.stemW * Math.sqrt(o.grow));

    let rootsSvg = '';
    if (o.roots) {
      rootsSvg = roots({
        x: o.x, y: o.y + 1,
        depth: (o.rootDepth != null ? o.rootDepth : o.h * .45) * o.grow,
        spread: (o.rootSpread != null ? o.rootSpread : o.h * .32) * o.grow,
        color: o.rootColor, w: Math.max(1.5, o.rootW * Math.sqrt(o.grow)), seed: o.seed, hairs: o.hairs,
      });
    }

    let leavesSvg = '';
    const n = Math.round(o.leaves);
    const ls = Math.sqrt(Math.min(1.2, o.grow));
    for (let i = 0; i < n; i++) {
      const t = o.leafStart + (0.93 - o.leafStart) * (n === 1 ? .5 : i / (n - 1));
      const P = bez(p0, p1, p2, p3, t);
      const tan = bezAngle(p0, p1, p2, p3, t);
      const side = i % 2 ? -1 : 1;
      const spread = 58 - 12 * t;
      let a = tan + side * spread;
      // Wilting pulls leaves downwards
      a = side > 0 ? lerp(a, 70, o.droop * .85) : lerp(a, 110, o.droop * .85);
      const size = (1 - .35 * (i / Math.max(1, n))) * ls;
      leavesSvg += leaf({ x: P.x, y: P.y, angle: a, L: o.leafL * size, W: o.leafW * size, shape: o.leafShape, color: o.leafColor, stalk: 5 * size, cls: 'leaf leaf-' + i });
    }

    let fruitSvg = '';
    for (let i = 0; i < o.fruit; i++) {
      const t = .45 + .4 * (i / Math.max(1, o.fruit));
      const P = bez(p0, p1, p2, p3, t);
      const side = i % 2 ? 1 : -1;
      const fx = P.x + side * 16 * ls, fy = P.y + 14 * ls;
      fruitSvg += `<g class="fruit"><path d="M${f1(P.x)} ${f1(P.y)} Q${f1(P.x + side * 12 * ls)} ${f1(P.y)} ${f1(fx)} ${f1(fy - 8 * ls)}" stroke="#3E8B37" stroke-width="2" fill="none"/>
        <circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1(9 * ls)}" fill="${o.fruitColor}" stroke="${mix(o.fruitColor, '#000', .25)}" stroke-width="1.2"/>
        <circle cx="${f1(fx - 3 * ls)}" cy="${f1(fy - 3 * ls)}" r="${f1(2.5 * ls)}" fill="#fff" opacity=".6"/>
        <path d="M${f1(fx - 4 * ls)} ${f1(fy - 8 * ls)} l${f1(4 * ls)} ${f1(2 * ls)} l${f1(4 * ls)} ${f1(-2 * ls)}" stroke="#3E8B37" stroke-width="2" fill="none"/></g>`;
    }

    let budSvg = '';
    for (let i = 0; i < o.buds; i++) {
      const t = .62 + .3 * (i / Math.max(1, o.buds));
      const P = bez(p0, p1, p2, p3, t);
      const side = i % 2 ? 1 : -1;
      budSvg += bud({ x: P.x, y: P.y, r: 6 * ls, angle: side * 40, color: o.flowerColor });
    }

    let flowerSvg = '';
    if (o.flower && o.grow > .55) {
      const fo = clamp((o.grow - .55) / .45);
      if (o.flower === 'bud') flowerSvg = bud({ x: p3.x, y: p3.y, r: 9 * ls, angle: bezAngle(p0, p1, p2, p3, 1) + 90, color: o.flowerColor });
      else flowerSvg = flower({
        x: p3.x, y: p3.y, r: o.flowerR * ls, petals: o.petals, color: o.flowerColor, center: o.flowerCenter,
        shape: o.petalShape, open: fo, seeds: o.flower === 'sunflower', centerR: o.flower === 'sunflower' ? o.flowerR * ls * .45 : null,
      });
    }

    const light = mix(o.stemColor, '#ffffff', .35);
    return `<g class="${o.cls}" ${o.id ? `id="${o.id}"` : ''}>
      ${rootsSvg}
      <path class="stem" d="${stemD}" stroke="${mix(o.stemColor, '#000', .2)}" stroke-width="${f1(sw + 2)}" fill="none" stroke-linecap="round"/>
      <path class="stem-fill" d="${stemD}" stroke="${o.stemColor}" stroke-width="${f1(sw)}" fill="none" stroke-linecap="round"/>
      <path d="${stemD}" stroke="${light}" stroke-width="${f1(sw * .25)}" fill="none" stroke-linecap="round" opacity=".7" transform="translate(${f1(-sw * .2)} 0)"/>
      ${fruitSvg}${leavesSvg}${budSvg}${flowerSvg}
    </g>`;
  }
  // Where the tip of a plant ends up (for placing things)
  function plantTip(opts) {
    const o = Object.assign({ x: 400, y: 400, h: 200, grow: 1, bend: 0, droop: 0 }, opts);
    const h = o.h * o.grow, dir = o.bend < 0 ? -1 : 1;
    return { x: o.x + o.bend * h * .62 + dir * o.droop * h * .5, y: o.y - h * (1 - .1 * Math.abs(o.bend) - .55 * o.droop) };
  }
  function stemPath(opts) {
    const o = Object.assign({ x: 400, y: 400, h: 200, grow: 1, bend: 0, droop: 0 }, opts);
    const h = Math.max(4, o.h * o.grow), dir = o.bend < 0 ? -1 : 1;
    const p1 = { x: o.x, y: o.y - h * .42 };
    const p2 = { x: o.x + o.bend * h * .22 + dir * o.droop * h * .42, y: o.y - h * (.86 - .08 * o.droop) };
    const p3 = plantTip(o);
    return `M${f1(o.x)} ${f1(o.y)} C${f1(p1.x)} ${f1(p1.y)} ${f1(p2.x)} ${f1(p2.y)} ${f1(p3.x)} ${f1(p3.y)}`;
  }

  // ---------- Trees ----------
  function tree({ x = 400, y = 450, h = 300, trunkW = 30, canopy = 130, leafColor = '#3E9B4F', seed = 5, roots: showRoots = false, cls = 'tree', bark = true } = {}) {
    const r = rng(seed);
    const top = y - h * .55;
    let branches = '';
    const bl = [];
    for (let i = 0; i < 5; i++) {
      const side = i % 2 ? 1 : -1;
      const by = y - h * (.4 + i * .06);
      const ex = x + side * canopy * (.45 + r() * .4), ey = by - h * (.18 + r() * .2);
      bl.push({ ex, ey });
      branches += `<path d="M${x} ${f1(by)} Q${f1(x + side * canopy * .15)} ${f1(by - 20)} ${f1(ex)} ${f1(ey)}" stroke="url(#g-bark)" stroke-width="${f1(trunkW * (.35 - i * .04))}" fill="none" stroke-linecap="round"/>`;
    }
    const trunk = `<path d="M${x - trunkW * .7} ${y} C${x - trunkW * .45} ${y - h * .2} ${x - trunkW * .35} ${top + 30} ${x - trunkW * .2} ${top} L${x + trunkW * .2} ${top} C${x + trunkW * .35} ${top + 30} ${x + trunkW * .45} ${y - h * .2} ${x + trunkW * .7} ${y} Z" fill="url(#g-bark)"/>`;
    let barkLines = '';
    if (bark) for (let i = 0; i < 7; i++) {
      const bx = x + (r() - .5) * trunkW * .7, by = y - r() * h * .45;
      barkLines += `M${f1(bx)} ${f1(by)} q${f1((r() - .5) * 5)} -14 ${f1((r() - .5) * 4)} -28 `;
    }
    let blobs = '';
    const cy = y - h * .78;
    for (let i = 0; i < 16; i++) {
      const a = r() * Math.PI * 2, d = r() * canopy * .75;
      const bx = x + Math.cos(a) * d, by = cy + Math.sin(a) * d * .55;
      const br = canopy * (.28 + r() * .2);
      const col = mix(leafColor, i % 3 ? '#1B4D22' : '#ffffff', i % 3 ? .05 * (i % 3) : .1);
      blobs += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}" fill="${col}"/>`;
    }
    const rootsSvg = showRoots ? roots({ x, y, depth: h * .35, spread: canopy * .9, color: '#6D4C33', w: trunkW * .35, seed, levels: 2 }) : '';
    return `<g class="${cls}">${rootsSvg}${branches}${trunk}<path d="${barkLines}" stroke="#3E2515" stroke-width="2" fill="none" opacity=".5"/><g class="canopy">${blobs}</g></g>`;
  }

  // ---------- Scenery ----------
  function sky(w = 800, h = 520) { return `<rect width="${w}" height="${h}" fill="url(#g-sky)"/>`; }

  function ground({ y = 400, w = 800, h = 120, fill = 'url(#g-soil)', grass = true, seed = 2, stones = 14 } = {}) {
    const r = rng(seed);
    let bumps = `M0 ${y}`;
    for (let x = 0; x <= w; x += 40) bumps += ` Q${x + 20} ${f1(y - 4 - r() * 5)} ${x + 40} ${y}`;
    bumps += ` L${w} ${y + h} L0 ${y + h} Z`;
    let dots = '';
    for (let i = 0; i < stones; i++) dots += `<ellipse cx="${f1(r() * w)}" cy="${f1(y + 14 + r() * (h - 20))}" rx="${f1(2 + r() * 4)}" ry="${f1(1.5 + r() * 2.5)}" fill="#000" opacity=".15"/>`;
    let g = '';
    if (grass) {
      g = `<path d="`;
      for (let x = 4; x < w; x += 9 + r() * 10) g += `M${f1(x)} ${y + 2} q${f1(r() * 4 - 2)} -${f1(6 + r() * 8)} ${f1(r() * 6 - 1)} -${f1(10 + r() * 8)} `;
      g += `" stroke="#5BAA4E" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    }
    return `<g class="ground"><path d="${bumps}" fill="${fill}"/>${dots}${g}</g>`;
  }

  function sun({ x = 90, y = 80, r = 42, rays = true, cls = 'sun', attrs = '' } = {}) {
    let rs = '';
    if (rays) {
      rs = `<g class="spin-slow">`;
      for (let i = 0; i < 12; i++) {
        const a = i * 30 * Math.PI / 180;
        rs += `<path d="M${f1(Math.cos(a) * (r + 8))} ${f1(Math.sin(a) * (r + 8))} L${f1(Math.cos(a) * (r + 24))} ${f1(Math.sin(a) * (r + 24))}" stroke="#FFC93C" stroke-width="6" stroke-linecap="round"/>`;
      }
      rs += `</g>`;
    }
    return `<g class="${cls}" transform="translate(${x} ${y})" ${attrs}><circle r="${r * 1.9}" fill="url(#g-glow)"/>${rs}<circle r="${r}" fill="url(#g-sun)"/></g>`;
  }

  function cloud({ x = 0, y = 0, s = 1, color = '#FFFFFF', cls = 'cloud' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><g fill="${color}">
      <ellipse cx="0" cy="0" rx="46" ry="24"/><circle cx="-22" cy="-10" r="22"/><circle cx="12" cy="-18" r="27"/><circle cx="36" cy="-4" r="18"/></g></g>`;
  }

  function drop({ x = 0, y = 0, s = 1, color = '#3BA7E5', cls = 'drop', attrs = '' } = {}) {
    return `<path class="${cls}" ${attrs} transform="translate(${f1(x)} ${f1(y)}) scale(${s})" d="M0 -12 C5 -4 8 0 8 4 A8 8 0 0 1 -8 4 C-8 0 -5 -4 0 -12Z" fill="${color}" stroke="${mix(color, '#000', .2)}" stroke-width="1"/>`;
  }

  // Flower pot: x,y = centre of the rim top
  function pot({ x = 400, y = 400, w = 120, h = 100, color = null, label = '', soil = true, cls = 'pot', stripes = false } = {}) {
    const fill = color || 'url(#g-pot)';
    const bw = w * .72;
    const rimH = h * .16;
    const edge = color ? mix(color, '#000', .25) : '#9A4520';
    const stripe = stripes ? `<path d="M${x - w * .47} ${y + h * .4} L${x + w * .47} ${y + h * .4} L${x + w * .43} ${y + h * .58} L${x - w * .43} ${y + h * .58}Z" fill="#ffffff" opacity=".5"/>` : '';
    return `<g class="${cls}">
      <path d="M${x - w / 2} ${y + rimH} L${x - bw / 2} ${y + h} L${x + bw / 2} ${y + h} L${x + w / 2} ${y + rimH}Z" fill="${fill}" stroke="${edge}" stroke-width="2"/>
      ${stripe}
      <rect x="${x - w / 2 - 6}" y="${y}" width="${w + 12}" height="${rimH}" rx="4" fill="${fill}" stroke="${edge}" stroke-width="2"/>
      ${soil ? `<ellipse cx="${x}" cy="${y + 2}" rx="${w / 2}" ry="${rimH * .45}" fill="#5A3620"/>` : ''}
      ${label ? `<rect x="${x - 16}" y="${y + h * .42}" width="32" height="28" rx="4" fill="#fff" stroke="#333" stroke-width="1.5"/><text x="${x}" y="${y + h * .42 + 21}" text-anchor="middle" font-weight="800" font-size="18">${label}</text>` : ''}
    </g>`;
  }

  // A label box with a leader line, like the textbook diagrams
  function callout({ x, y, tx, ty, text, cls = 'callout', w = null, color = '#C8452F' } = {}) {
    const bw = w || text.length * 11 + 24;
    return `<g class="${cls}">
      <path d="M${x} ${y} L${tx} ${ty}" stroke="${color}" stroke-width="2.5"/>
      <circle cx="${x}" cy="${y}" r="4" fill="${color}"/>
      <rect x="${tx - bw / 2}" y="${ty - 17}" width="${bw}" height="34" rx="4" fill="#FDEBE1" stroke="#555" stroke-width="1.5"/>
      <text x="${tx}" y="${ty + 7}" text-anchor="middle" class="svg-label">${text}</text>
    </g>`;
  }

  function text(x, y, str, { size = 20, weight = 800, anchor = 'middle', fill = '#2B2A28', cls = '' } = {}) {
    return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" class="${cls}">${str}</text>`;
  }

  // Arrow from (x1,y1) to (x2,y2)
  function arrow(x1, y1, x2, y2, { color = '#3BA7E5', w = 5, head = 12, cls = 'arrow', dash = '' } = {}) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const hx = x2 - Math.cos(a) * head, hy = y2 - Math.sin(a) * head;
    const l = { x: hx + Math.cos(a + Math.PI / 2) * head * .6, y: hy + Math.sin(a + Math.PI / 2) * head * .6 };
    const rr = { x: hx + Math.cos(a - Math.PI / 2) * head * .6, y: hy + Math.sin(a - Math.PI / 2) * head * .6 };
    return `<g class="${cls}"><path d="M${f1(x1)} ${f1(y1)} L${f1(hx)} ${f1(hy)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>
      <path d="M${f1(x2)} ${f1(y2)} L${f1(l.x)} ${f1(l.y)} L${f1(rr.x)} ${f1(rr.y)}Z" fill="${color}"/></g>`;
  }

  // ---------- Characters and props ----------
  // Shelly the tortoise (viewBox 0 0 150 100)
  function tortoise() {
    return `<svg viewBox="0 0 150 100" xmlns="${NS}"><g class="m-bob">
      <ellipse cx="72" cy="94" rx="58" ry="5" fill="#000" opacity=".12"/>
      <g fill="#F08A2C" stroke="#B85E14" stroke-width="2">
        <rect x="26" y="70" width="18" height="22" rx="8"/><rect x="92" y="70" width="18" height="22" rx="8"/>
        <path d="M12 72 q-8 4 -6 10 q10 -2 14 -6z"/>
        <path d="M108 58 C118 48 116 30 126 26 C140 22 146 36 142 48 C138 58 126 62 114 66Z"/>
      </g>
      <circle cx="128" cy="38" r="7.5" fill="#fff" stroke="#6B3B10" stroke-width="1.5"/>
      <circle cx="130" cy="37" r="4" fill="#222"/><circle cx="131.5" cy="35.5" r="1.3" fill="#fff"/>
      <path class="m-lid" d="M120.5 38 a7.5 7.5 0 0 1 15 0z" fill="#F08A2C"/>
      <path class="m-mouth" d="M121 50 q5 5 12 1" stroke="#6B3B10" stroke-width="2.5" fill="#C0392B" stroke-linecap="round"/>
      <circle cx="137" cy="46" r="3" fill="#FF7A7A" opacity=".6"/>
      <path d="M14 76 C14 34 40 14 70 14 C102 14 122 36 120 76Z" fill="#6E9A2E" stroke="#44641A" stroke-width="2.5"/>
      <g fill="none" stroke="#44641A" stroke-width="2.2" stroke-linejoin="round">
        <path d="M52 30 L68 24 L84 30 L84 46 L68 52 L52 46Z"/>
        <path d="M52 46 L36 52 L32 70 M84 46 L100 52 L104 70 M68 52 L68 72 M52 30 L38 38 L36 52 M84 30 L98 38 L100 52"/>
      </g>
      <path d="M10 74 Q66 88 124 74 L122 80 Q66 94 12 80Z" fill="#D9B650" stroke="#9C7F24" stroke-width="2"/>
    </g></svg>`;
  }

  function bee({ x = 0, y = 0, s = 1, cls = 'bee', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})" ${attrs}>
      <ellipse cx="-4" cy="-14" rx="9" ry="12" fill="#E3F4FF" opacity=".85" stroke="#9CC" stroke-width="1" class="wing"/>
      <ellipse cx="8" cy="-14" rx="8" ry="11" fill="#E3F4FF" opacity=".85" stroke="#9CC" stroke-width="1" class="wing"/>
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="#FFC107" stroke="#6B4A00" stroke-width="1.5"/>
      <path d="M-6 -11 q-3 11 0 22 M4 -12 q-3 12 0 24" stroke="#2B2A28" stroke-width="5" fill="none"/>
      <circle cx="17" cy="-2" r="8" fill="#2B2A28"/><circle cx="20" cy="-4" r="2.2" fill="#fff"/>
      <path d="M-18 0 l-7 2 l7 3z" fill="#2B2A28"/>
      <path d="M20 -9 q3 -8 8 -9 M17 -9 q0 -8 3 -11" stroke="#2B2A28" stroke-width="1.5" fill="none"/>
    </g>`;
  }

  function butterfly({ x = 0, y = 0, s = 1, color = '#4FC3F7', color2 = '#6D3B1E', cls = 'butterfly', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})" ${attrs}>
      <g class="wing-l"><path d="M0 0 C-30 -40 -48 -18 -40 0 C-48 14 -26 30 0 4Z" fill="${color}" stroke="${color2}" stroke-width="3"/>
        <circle cx="-28" cy="-14" r="5" fill="#fff"/><circle cx="-24" cy="12" r="4" fill="#fff"/></g>
      <g class="wing-r"><path d="M0 0 C30 -40 48 -18 40 0 C48 14 26 30 0 4Z" fill="${color}" stroke="${color2}" stroke-width="3"/>
        <circle cx="28" cy="-14" r="5" fill="#fff"/><circle cx="24" cy="12" r="4" fill="#fff"/></g>
      <ellipse cx="0" cy="2" rx="4" ry="16" fill="#2B2A28"/>
      <path d="M-1 -12 q-6 -12 -12 -14 M1 -12 q6 -12 12 -14" stroke="#2B2A28" stroke-width="1.6" fill="none"/>
    </g>`;
  }

  function caterpillar({ x = 0, y = 0, s = 1, cls = 'caterpillar', attrs = '' } = {}) {
    let body = '';
    // Tail first so the head overlaps the body
    for (let i = 6; i >= 1; i--) body += `<circle class="seg" cx="${-i * 13}" cy="${i % 2 ? -3 : 0}" r="${10 - i * .4}" fill="${i % 2 ? '#7CB342' : '#8BC34A'}" stroke="#4E7D22" stroke-width="1.5"/>`;
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})" ${attrs}>${body}
      <circle cx="10" cy="-4" r="11" fill="#9CCC65" stroke="#4E7D22" stroke-width="1.5"/>
      <circle cx="14" cy="-7" r="3" fill="#222"/><circle cx="15" cy="-8" r="1" fill="#fff"/>
      <path d="M12 1 q4 3 8 0" stroke="#333" stroke-width="1.5" fill="none" class="c-mouth"/>
      <path d="M6 -14 q-2 -8 -6 -10 M12 -14 q2 -8 6 -9" stroke="#4E7D22" stroke-width="1.8" fill="none"/></g>`;
  }

  function wateringCan({ x = 0, y = 0, s = 1, color = '#4FA3E0', cls = 'can', attrs = '' } = {}) {
    const d = mix(color, '#000', .25);
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})" ${attrs}>
      <path d="M-30 -28 L30 -28 L26 20 L-26 20Z" fill="${color}" stroke="${d}" stroke-width="2"/>
      <path d="M26 -10 L70 -44 L74 -38 L30 6Z" fill="${color}" stroke="${d}" stroke-width="2"/>
      <ellipse cx="74" cy="-42" rx="6" ry="10" transform="rotate(40 74 -42)" fill="${d}"/>
      <path d="M-28 -24 C-56 -24 -56 12 -26 10" stroke="${d}" stroke-width="7" fill="none"/>
      <path d="M-20 -34 C-10 -50 14 -50 22 -34" stroke="${d}" stroke-width="6" fill="none"/>
      <rect x="-30" y="-12" width="56" height="8" fill="#fff" opacity=".35"/></g>`;
  }

  function sprayBottle({ x = 0, y = 0, s = 1, cls = 'spray', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})" ${attrs}>
      <rect x="-18" y="-10" width="36" height="60" rx="10" fill="#81D4FA" stroke="#3B8DB5" stroke-width="2" opacity=".9"/>
      <rect x="-18" y="18" width="36" height="32" rx="8" fill="#29B6F6" opacity=".6"/>
      <rect x="-9" y="-24" width="18" height="16" fill="#EF5350" stroke="#B53A36" stroke-width="2"/>
      <path d="M-9 -24 L-9 -34 L26 -34 L30 -28 L9 -28 L9 -24Z" fill="#EF5350" stroke="#B53A36" stroke-width="2"/>
      <path d="M6 -22 L14 -6" stroke="#B53A36" stroke-width="5" stroke-linecap="round"/></g>`;
  }

  function scissors({ x = 0, y = 0, s = 1, angle = 0, open = .3, cls = 'scissors', attrs = '' } = {}) {
    const a = open * 25;
    return `<g class="${cls}" transform="translate(${x} ${y}) rotate(${angle}) scale(${s})" ${attrs}>
      <g transform="rotate(${-a})"><path d="M0 0 L60 -4 L62 0 L0 4Z" fill="#CFD8DC" stroke="#78909C" stroke-width="1.5"/>
        <circle cx="-22" cy="-10" r="11" fill="none" stroke="#E53935" stroke-width="6"/><path d="M0 0 L-14 -6" stroke="#E53935" stroke-width="6"/></g>
      <g transform="rotate(${a})"><path d="M0 0 L60 4 L62 0 L0 -4Z" fill="#B0BEC5" stroke="#78909C" stroke-width="1.5"/>
        <circle cx="-22" cy="10" r="11" fill="none" stroke="#E53935" stroke-width="6"/><path d="M0 0 L-14 6" stroke="#E53935" stroke-width="6"/></g>
      <circle r="3" fill="#607D8B"/></g>`;
  }

  // Beaker: x,y = bottom centre. level 0..1
  function beaker({ x = 0, y = 0, w = 90, h = 120, level = .6, liquid = '#9ED8F7', cls = 'beaker', marks = true, id = '' } = {}) {
    const lh = h * .92 * level;
    let m = '';
    if (marks) for (let i = 1; i <= 3; i++) m += `<path d="M${x - w / 2} ${y - h * .23 * i} l12 0" stroke="#555" stroke-width="1.5"/>`;
    return `<g class="${cls}" ${id ? `id="${id}"` : ''}>
      <rect class="liquid" x="${x - w / 2 + 3}" y="${f1(y - lh)}" width="${w - 6}" height="${f1(lh)}" rx="6" fill="${liquid}"/>
      <path d="M${x - w / 2 - 6} ${y - h} L${x - w / 2} ${y - h + 6} L${x - w / 2} ${y - 8} Q${x - w / 2} ${y} ${x - w / 2 + 8} ${y} L${x + w / 2 - 8} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - 8} L${x + w / 2} ${y - h + 6} L${x + w / 2 + 6} ${y - h}" fill="url(#g-glass)" stroke="#6E8CA0" stroke-width="3" stroke-linejoin="round"/>
      ${m}</g>`;
  }

  function magnifier({ x = 0, y = 0, r = 50, cls = 'magnifier', attrs = '' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y})" ${attrs}>
      <path d="M${r * .7} ${r * .7} L${r * 1.5} ${r * 1.5}" stroke="#6D4C41" stroke-width="${r * .25}" stroke-linecap="round"/>
      <circle r="${r}" fill="#E3F2FD" fill-opacity=".25" stroke="#455A64" stroke-width="${r * .12}"/>
      <path d="M${-r * .6} ${-r * .3} A${r * .7} ${r * .7} 0 0 1 ${-r * .2} ${-r * .65}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  }

  function ruler({ x = 0, y = 0, h = 200, cm = 20, cls = 'ruler' } = {}) {
    let t = '';
    for (let i = 0; i <= cm; i++) {
      const yy = y - i * h / cm;
      t += `<path d="M${x} ${f1(yy)} l${i % 5 ? 8 : 14} 0" stroke="#1A3A5A" stroke-width="1.5"/>`;
      if (i % 5 === 0 && i) t += `<text x="${x + 17}" y="${f1(yy + 4)}" font-size="11" font-weight="700" fill="#1A3A5A">${i}</text>`;
    }
    return `<g class="${cls}"><rect x="${x - 2}" y="${y - h - 6}" width="34" height="${h + 12}" rx="3" fill="#8FD0F5" stroke="#3B8DB5" stroke-width="1.5"/>${t}</g>`;
  }

  // Simple child scientist (viewBox-free, drawn at x,y feet position)
  function kid({ x = 0, y = 0, s = 1, skin = '#8D5524', hair = '#2B1B10', shirt = '#7E57C2', coat = true, cls = 'kid' } = {}) {
    return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})">
      <rect x="-14" y="-60" width="10" height="60" rx="4" fill="#C62828"/><rect x="4" y="-60" width="10" height="60" rx="4" fill="#C62828"/>
      <ellipse cx="-9" cy="0" rx="10" ry="5" fill="#5C6BC0"/><ellipse cx="9" cy="0" rx="10" ry="5" fill="#5C6BC0"/>
      <path d="M-24 -130 L24 -130 L28 -58 L-28 -58Z" fill="${shirt}"/>
      ${coat ? `<path d="M-26 -132 L-6 -132 L-10 -50 L-32 -50Z M26 -132 L6 -132 L10 -50 L32 -50Z" fill="#fff" stroke="#B0BEC5" stroke-width="1.5"/>` : ''}
      <path d="M-26 -126 L-44 -84" stroke="${coat ? '#fff' : shirt}" stroke-width="12" stroke-linecap="round"/><path d="M26 -126 L44 -84" stroke="${coat ? '#fff' : shirt}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="-45" cy="-80" r="6" fill="${skin}"/><circle cx="45" cy="-80" r="6" fill="${skin}"/>
      <rect x="-6" y="-142" width="12" height="14" fill="${skin}"/>
      <circle cx="0" cy="-165" r="26" fill="${skin}"/>
      <path d="M-27 -168 C-28 -196 28 -198 27 -168 C18 -182 -10 -186 -27 -168Z" fill="${hair}"/>
      <circle cx="-9" cy="-166" r="6" fill="#fff"/><circle cx="9" cy="-166" r="6" fill="#fff"/>
      <circle cx="-8" cy="-165" r="3.2" fill="#222"/><circle cx="10" cy="-165" r="3.2" fill="#222"/>
      <path d="M-8 -152 q8 7 16 0" stroke="#5A2A10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  // Find an element inside a scene
  const q = (root, sel) => root.querySelector(sel);
  const qa = (root, sel) => Array.from(root.querySelectorAll(sel));

  return {
    NS, el, frag, rng, lerp, clamp, mix, bez, bezAngle, f1,
    leafPath, leaf, petalPath, flower, bud, roots, plant, plantTip, stemPath, tree,
    sky, ground, sun, cloud, drop, pot, callout, text, arrow,
    tortoise, bee, butterfly, caterpillar, wateringCan, sprayBottle, scissors, beaker, magnifier, ruler, kid,
    q, qa,
  };
})();
