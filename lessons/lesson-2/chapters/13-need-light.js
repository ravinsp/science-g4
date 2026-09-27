// Chapter 13: Plants need light
(() => {

  // Where the stem and leaves of S.plant end up (same maths as S.plant)
  function plantGeo(opts) {
    const o = Object.assign({ x: 400, y: 400, h: 200, grow: 1, bend: 0, droop: 0, leaves: 6, leafL: 46, leafStart: .3 }, opts);
    const h = Math.max(4, o.h * o.grow), dir = o.bend < 0 ? -1 : 1;
    const P = [{ x: o.x, y: o.y }, { x: o.x, y: o.y - h * .42 },
      { x: o.x + o.bend * h * .22 + dir * o.droop * h * .42, y: o.y - h * (.86 - .08 * o.droop) },
      { x: o.x + o.bend * h * .62 + dir * o.droop * h * .5, y: o.y - h * (1 - .1 * Math.abs(o.bend) - .55 * o.droop) }];
    const at = t => S.bez(P[0], P[1], P[2], P[3], t);
    const n = Math.round(o.leaves), ls = Math.sqrt(Math.min(1.2, o.grow));
    const leaves = [];
    for (let i = 0; i < n; i++) {
      const t = o.leafStart + (0.93 - o.leafStart) * (n === 1 ? .5 : i / (n - 1));
      const base = at(t), tan = S.bezAngle(P[0], P[1], P[2], P[3], t);
      const side = i % 2 ? -1 : 1;
      const a = tan + side * (58 - 12 * t), r = a * Math.PI / 180;
      const len = (5 + o.leafL) * (1 - .35 * (i / Math.max(1, n))) * ls;
      leaves.push({ base, mid: { x: base.x + Math.cos(r) * len * .55, y: base.y + Math.sin(r) * len * .55 } });
    }
    return { at, leaves, tip: P[3] };
  }

  App.chapter({
    id: 'needlight',
    title: 'Plants need light',
    icon: '💡',
    group: 'What plants need',
    keywords: [
      { w: 'direction', d: 'The way something is pointing or moving.' },
      { w: 'towards', d: 'Moving or pointing to get closer to something.' },
      { w: 'factor', d: 'One thing that can be changed in an investigation.' },
    ],
    steps: [
      // ---------- 1. Two ways to get light ----------
      {
        text: [
          'Plants need the correct amount of light to grow well. There are two main ways that a plant can get light.',
          'Plants need light to make their food.',
        ],
        ask: 'Look at both ways a plant can get light. Click the leaves to see them make food.',
        activity: true,
        scene(stage, api) {
          const r = S.rng(9);
          // Looking up at the sun through leaves
          let canopy = '';
          const branchesD = 'M-20 120 Q120 150 250 110 M-20 380 Q100 330 220 360 M820 90 Q690 150 560 120 M820 420 Q700 360 590 390 M300 -20 Q330 60 290 130';
          const spots = [];
          for (let i = 0; i < 90; i++) {
            const side = i % 5;
            let x, y;
            if (side === 0) { x = r() * 260; y = 60 + r() * 120; }
            else if (side === 1) { x = r() * 240; y = 300 + r() * 120; }
            else if (side === 2) { x = 540 + r() * 280; y = 40 + r() * 140; }
            else if (side === 3) { x = 560 + r() * 260; y = 320 + r() * 130; }
            else { x = 250 + r() * 90; y = r() * 140; }
            if (i % 6 === 0) spots.push({ x, y });
            const lit = Math.hypot(x - 400, y - 230) < 260;
            canopy += S.leaf({ x, y, angle: r() * 360, L: 46 + r() * 20, W: 18 + r() * 6, shape: 'pointed', color: lit ? ['#8BD34E', '#A6E05A', '#6FC03F'][i % 3] : ['#3E8E3E', '#2E7A34', '#4CA64A'][i % 3], stalk: 6, cls: 'leaf nl-leaf' });
          }
          const beams = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const a = (i * 45 + 20) * Math.PI / 180;
            return `<path class="nl-beam" d="M400 230 L${S.f1(400 + Math.cos(a - .07) * 600)} ${S.f1(230 + Math.sin(a - .07) * 600)} L${S.f1(400 + Math.cos(a + .07) * 600)} ${S.f1(230 + Math.sin(a + .07) * 600)}Z" fill="#FFF7C2" opacity=".25"/>`;
          }).join('');
          const sunScene = `<g id="nl-sunScene">
            <radialGradient id="nl-skyglow" cx=".5" cy=".44" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".25" stop-color="#FFF6CC"/><stop offset="1" stop-color="#9FD7F5"/></radialGradient>
            <rect width="800" height="520" fill="url(#nl-skyglow)"/>
            ${beams}
            ${S.sun({ x: 400, y: 230, r: 50 })}
            <path d="${branchesD}" stroke="#5B3A22" stroke-width="12" fill="none" stroke-linecap="round"/>
            <g class="sway">${canopy}</g>
            <g id="nl-food"></g>
            <g transform="translate(650 470)"><rect x="-80" y="-22" width="160" height="42" rx="6" fill="#FDEBE1" stroke="#555" stroke-width="2"/>${S.text(0, 7, 'sunlight', { size: 22 })}</g>
          </g>`;
          // A greenhouse lit by electric lamps
          let frame = '', lamps = '', rows = '';
          for (let i = 0; i <= 8; i++) frame += `<path d="M${400 + (i - 4) * 30} 250 L${400 + (i - 4) * 140} -10" stroke="#B0BEC5" stroke-width="4"/>`;
          for (let j = 0; j < 4; j++) frame += `<path d="M${-40} ${40 + j * 55} L840 ${40 + j * 55}" stroke="#B0BEC5" stroke-width="${3 + j}" opacity=".8"/>`;
          const lampPos = [];
          for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
            const x = 400 + (i - 2) * (90 + j * 70), y = 80 + j * 70;
            lampPos.push({ x, y, s: .6 + j * .25 });
          }
          lampPos.forEach((l, k) => {
            lamps += `<g class="nl-lamp" transform="translate(${S.f1(l.x)} ${l.y}) scale(${S.f1(l.s)})">
              <path d="M0 -60 L0 -14" stroke="#607D8B" stroke-width="2"/>
              <circle class="nl-halo" r="44" fill="url(#g-glow)" opacity="0"/>
              <path d="M-14 -14 L14 -14 L10 0 L-10 0Z" fill="#546E7A"/>
              <circle class="nl-bulb" cy="4" r="8" fill="#9E9E9E"/></g>`;
          });
          for (let j = 0; j < 3; j++) {
            const y = 330 + j * 65, n = 7 + j * 2;
            rows += `<rect x="-20" y="${y + 8}" width="840" height="${16 + j * 6}" fill="#4E342E"/>`;
            for (let i = 0; i < n; i++) rows += S.plant({ x: 20 + i * (780 / (n - 1)) - 10, y: y + 10, h: 40 + j * 22, leaves: 4, leafL: 14 + j * 7, leafW: 6 + j * 3, leafShape: 'round', roots: false, stemW: 2 + j, seed: i + j * 10 });
          }
          const lampScene = `<g id="nl-lampScene" style="display:none">
            <rect width="800" height="520" fill="#2C3E66"/>
            <rect y="250" width="800" height="270" fill="#3E2C22"/>
            ${frame}${lamps}${rows}
            <rect id="nl-warm" width="800" height="520" fill="#FFD27A" opacity="0" pointer-events="none"/>
            <g transform="translate(650 470)"><rect x="-90" y="-22" width="180" height="42" rx="6" fill="#FDEBE1" stroke="#555" stroke-width="2"/>${S.text(0, 7, 'electric light', { size: 22 })}</g>
          </g>`;
          const svg = api.svg(sunScene + lampScene);
          const seen = new Set();
          let lampsOn = false;
          const check = () => { if (seen.size === 2) { api.star(); api.timeout(() => api.praise('Plants can get light from the sun or from electric lamps.'), 2500); } };
          const show = async which => {
            S.q(svg, '#nl-sunScene').style.display = which === 'sun' ? '' : 'none';
            S.q(svg, '#nl-lampScene').style.display = which === 'lamp' ? '' : 'none';
            sunBtn.classList.toggle('primary', which === 'sun');
            lampBtn.classList.toggle('primary', which === 'lamp');
            api.sfx('whoosh');
            if (which === 'sun') api.say('Sunlight. The sun shines through the leaves.');
            else {
              api.say('Electric light. In a greenhouse, lamps can give plants light, even at night.');
              if (!lampsOn) {
                lampsOn = true;
                const ls = S.qa(svg, '.nl-lamp');
                for (let k = 0; k < ls.length; k++) {
                  if (!await api.wait(140)) return;
                  api.sfx('click');
                  S.q(ls[k], '.nl-bulb').setAttribute('fill', '#FFF3A0');
                  S.q(ls[k], '.nl-halo').setAttribute('opacity', 1);
                  S.q(svg, '#nl-warm').setAttribute('opacity', S.f1((k + 1) / ls.length * .18));
                }
              }
            }
            seen.add(which);
            check();
          };
          // Beams shimmer
          const beamEls = S.qa(svg, '.nl-beam');
          api.loop((dt, el) => beamEls.forEach((b, i) => b.setAttribute('opacity', (.18 + .14 * Math.sin(el * 1.5 + i * 1.3)).toFixed(2))));
          // Leaves make food (little sugar sparkles)
          const foodG = S.q(svg, '#nl-food');
          S.qa(svg, '.nl-leaf').forEach(l => l.addEventListener('click', e => {
            const p = api.point(svg, e);
            api.sfx('magic');
            for (let k = 0; k < 6; k++) {
              const n = S.frag(`<text x="0" y="0" font-size="20" text-anchor="middle">✨</text>`);
              foodG.appendChild(n);
              const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 30;
              api.tween(900, kk => { n.setAttribute('transform', `translate(${S.f1(p.x + Math.cos(a) * d * kk)} ${S.f1(p.y + Math.sin(a) * d * kk)}) scale(${S.f1(.5 + kk)})`); n.setAttribute('opacity', S.f1(1 - kk)); }).then(() => n.remove());
            }
            api.say('The leaf uses light to make food for the plant.');
          }));
          api.row();
          const sunBtn = api.button('☀️ Sunlight', () => show('sun'), { cls: 'primary', sound: 'click' });
          const lampBtn = api.button('💡 Electric light', () => show('lamp'), { sound: 'click', cls: 'pulse' });
          seen.add('sun');
        },
      },

      // ---------- 2. Growing towards the light ----------
      {
        title: 'Towards the light',
        text: [
          'Plants grow in the **direction** that allows them to absorb as much light as they can.',
          'These plants are growing **towards** sunlight coming in through the window.',
        ],
        ask: ['Drag the window to move the light. Then let the days pass.', 'Predict what will happen if someone turns the tray of plants around.'],
        activity: true,
        scene(stage, api) {
          const TY = 392, N = 11;
          const r = S.rng(3);
          const seeds = [...Array(N)].map((_, i) => ({ x: 200 + i * 40, h: 105 + r() * 25, leaves: 4 + (i % 2), seed: i + 2 }));
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F4E9D8"/>
            <rect y="${TY + 30}" width="800" height="110" fill="#D8C3A0"/>
            <rect y="${TY + 22}" width="800" height="14" fill="#BFA27A"/>
            <g id="nl2-beam"></g>
            <g id="nl2-win" transform="translate(620 -20)">
              <rect x="-95" y="40" width="190" height="220" rx="8" fill="#fff"/>
              <rect x="-85" y="50" width="170" height="200" fill="#8FD3FF"/>
              ${S.sun({ x: 30, y: 105, r: 24, rays: false })}
              ${S.cloud({ x: -30, y: 190, s: .6 })}
              <path d="M0 50 L0 250 M-85 150 L85 150" stroke="#fff" stroke-width="8"/>
              <rect x="-105" y="256" width="210" height="14" rx="4" fill="#fff" stroke="#DDD" stroke-width="2"/>
              <g class="blink-hint" id="nl2-hint">${S.text(0, 296, '⟵ drag me ⟶', { size: 18, fill: '#9A3222' })}</g>
            </g>
            <g id="nl2-tray">
              <g id="nl2-plants"></g>
              <path d="M175 ${TY - 8} L625 ${TY - 8} L612 ${TY + 22} L188 ${TY + 22}Z" fill="#263238" stroke="#111" stroke-width="2"/>
              <path d="M175 ${TY - 8} L625 ${TY - 8}" stroke="#4E3524" stroke-width="6"/>
              <text id="nl2-mark" x="194" y="${TY + 14}" font-size="16" font-weight="800" fill="#FFD23F">★</text>
            </g>
            <g transform="translate(110 70)"><rect x="-70" y="-22" width="140" height="42" rx="21" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              <text id="nl2-day" y="7" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B">Day 0</text></g>
          `);
          const win = S.q(svg, '#nl2-win'), plantsG = S.q(svg, '#nl2-plants'), tray = S.q(svg, '#nl2-tray');
          let wx = 620, grow = .45, bend = 0, day = 0, busy = false, flipped = 0, predicted = null, turned = false, done = false, grownOnce = false;
          const target = () => S.clamp((wx - 400) / 200, -1, 1);
          const drawPlants = () => {
            plantsG.innerHTML = seeds.map((s, i) => S.plant({ x: s.x, y: TY - 6, h: s.h, grow, bend: bend * (.85 + (i % 3) * .08), leaves: s.leaves, leafShape: 'long', leafL: 32, leafW: 8, leafColor: '#6DBE45', stemColor: '#8BC34A', stemW: 4, roots: false, seed: s.seed })).join('');
          };
          const drawBeam = () => {
            const bx = 400 - (wx - 400) * .3;
            S.q(svg, '#nl2-beam').innerHTML = `<path d="M${wx - 85} 230 L${wx + 85} 230 L${bx + 190} ${TY + 22} L${bx - 190} ${TY + 22}Z" fill="#FFF3A0" opacity=".45"/>`;
          };
          drawPlants(); drawBeam();
          api.draggable(svg, win, {
            bounds: { x1: 110, y1: -20, x2: 690, y2: -20 },
            onStart: () => { api.sfx('pick'); S.q(svg, '#nl2-hint').style.display = 'none'; },
            onMove: p => { wx = p.x; drawBeam(); },
            onDrop: p => { wx = p.x; drawBeam(); api.sfx('drop'); api.say(wx > 400 ? 'Now the light comes from the right.' : 'Now the light comes from the left.'); return true; },
          });
          // Let two days pass: plants grow and bend towards the light
          const passDays = async () => {
            if (busy) return;
            busy = true; timeBtn.disabled = true;
            api.sfx('grow');
            const b0 = bend, g0 = grow, tg = target();
            const b1 = b0 + (tg - b0) * .65, g1 = Math.min(1, g0 + .12);
            if (!await api.tween(1600, k => { bend = S.lerp(b0, b1, k); grow = S.lerp(g0, g1, k); drawPlants(); })) return;
            day += 2;
            S.q(svg, '#nl2-day').textContent = 'Day ' + day;
            busy = false; timeBtn.disabled = false;
            const towards = Math.sign(bend) === Math.sign(tg) && Math.abs(bend) > .25;
            if (!grownOnce && towards) {
              grownOnce = true;
              api.say('Look! The plants are growing towards the light from the window.');
              api.timeout(showPredict, 3000);
            } else if (turned && towards && !done) {
              done = true;
              api.star();
              api.praise(predicted === 0 ? 'Your prediction was correct! The plants grew back towards the light.' : 'The plants grew back towards the light!');
            } else if (turned && !done) api.say('Keep going. What are the plants doing?');
            else api.say(towards ? 'The plants lean towards the light.' : 'The plants are turning towards the light.');
          };
          function showPredict() {
            const row = api.row();
            api.label('🤔 Predict:', row);
            const opts = ['They will lean away from the light, then grow back towards it', 'They will keep leaning the same way', 'They will fall out of the tray'];
            const btns = opts.map((o, i) => api.button(o, () => {
              predicted = i;
              btns.forEach(b => { b.disabled = true; b.classList.toggle('primary', b === btns[i]); });
              api.sfx('pop');
              api.say('Good prediction. Let\'s test it! Turn the tray around.');
              turnBtn.style.display = '';
              turnBtn.classList.add('pulse');
            }, { parent: row, cls: 'small', sound: null }));
            api.say('Predict what will happen if someone turns the tray of plants around.');
          }
          // Spin the tray half a turn: the plants now lean away from the light
          const turnTray = async () => {
            if (busy || turned) return;
            busy = true; turnBtn.disabled = true; turnBtn.classList.remove('pulse');
            api.sfx('swoosh');
            if (!await api.tween(1200, k => {
              const sx = Math.cos(k * Math.PI);
              tray.setAttribute('transform', `translate(400 0) scale(${sx.toFixed(3)} 1) translate(-400 0)`);
            })) return;
            tray.setAttribute('transform', '');
            bend = -bend; flipped++;
            seeds.reverse().forEach((s, i) => { s.x = 200 + i * 40; });
            S.q(svg, '#nl2-mark').setAttribute('x', flipped % 2 ? 592 : 194);
            drawPlants();
            api.sfx('thud');
            turned = true; busy = false;
            api.say('The tray is turned around. Now the plants lean away from the light. Let the days pass and watch.');
            timeBtn.classList.add('pulse');
          };
          api.row();
          const timeBtn = api.button('⏩ Let 2 days pass', passDays, { cls: 'primary pulse', sound: 'click' });
          const turnBtn = api.button('🔄 Turn the tray around', turnTray, { cls: 'primary' });
          turnBtn.style.display = 'none';
        },
      },

      // ---------- 3. Light and dark ----------
      {
        title: 'Light or dark?',
        text: [
          'These two pots of bean plants are the same type of bean and the same age. They were given the same soil and the same volume of water.',
          'Pot A was kept in a light place. Pot B was kept in a dark cupboard.',
        ],
        ask: ['Slide the days along. Look at how tall and thin plant B is. Can you see any other differences? Click them!', 'What is the only **factor** that was changed in this investigation?'],
        tip: 'Remember that in a scientific investigation, you change one factor and keep everything else the same.',
        activity: true,
        scene(stage, api) {
          const AX = 200, BX = 600, RIM = 372, CL = 420, CR = 780;
          const offs = [-20, 2, 22];
          const optsA = (g, i) => ({ x: AX + offs[i], y: RIM + 4, h: [150, 175, 140][i], grow: .25 + .75 * g, bend: [-.25, .05, .3][i], leaves: 2 + Math.round(g * [4, 5, 3][i]), leafShape: 'heart', leafL: 16 + 22 * g, leafW: 9 + 9 * g, leafColor: '#3E8E3E', stemColor: '#5BA848', stemW: 5, roots: false, seed: 20 + i });
          const optsB = (g, i) => ({ x: BX + offs[i], y: RIM + 4, h: [300, 320, 285][i], grow: .15 + .85 * g, bend: [-.12, .04, .14][i], leaves: 2 + Math.round(g * [2, 2, 1][i]), leafShape: 'heart', leafL: 14 + 3 * g, leafW: 7 + g, leafColor: S.mix('#6FB84A', '#EDE08A', g), stemColor: S.mix('#6FB84A', '#F1ECC4', g), stemW: 5 - 2.6 * g, roots: false, seed: 30 + i });
          const pot = (x, label) => `<path d="M${x - 55} ${RIM} L${x - 46} ${RIM + 92} L${x + 46} ${RIM + 92} L${x + 55} ${RIM}Z" fill="#37474F" stroke="#1C262B" stroke-width="2"/>
            <rect x="${x - 58}" y="${RIM - 6}" width="116" height="12" rx="3" fill="#455A64"/>
            <ellipse cx="${x}" cy="${RIM}" rx="52" ry="6" fill="#4A3426"/>
            <rect x="${x - 18}" y="${RIM + 30}" width="36" height="32" rx="4" fill="#fff"/>${S.text(x, RIM + 54, label, { size: 20 })}`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF6DA"/>
            <rect x="30" y="40" width="160" height="150" rx="6" fill="#8FD3FF" stroke="#fff" stroke-width="10"/>
            ${S.sun({ x: 110, y: 100, r: 26, rays: true })}
            <path d="M30 190 L290 ${RIM} L400 ${RIM} L190 190Z" fill="#FFF3A0" opacity=".5"/>
            <rect x="0" y="${RIM + 92}" width="800" height="70" fill="#C9955E"/>
            <!-- cupboard -->
            <rect x="${CL - 12}" y="24" width="${CR - CL + 24}" height="${RIM + 92 - 24}" rx="8" fill="#8D6E63"/>
            <rect x="${CL}" y="36" width="${CR - CL}" height="${RIM + 92 - 36}" fill="#1E1714"/>
            <g id="nl3-A"></g>
            <g id="nl3-B"></g>
            ${pot(AX, 'A')}${pot(BX, 'B')}
            <g id="nl3-door" transform="translate(${CR} 0) scale(.06 1) translate(${-CR} 0)">
              <rect x="${CL}" y="36" width="${CR - CL}" height="${RIM + 92 - 36}" fill="#A1887F" stroke="#6D4C41" stroke-width="4"/>
              <rect x="${CL + 30}" y="66" width="${CR - CL - 60}" height="${RIM + 92 - 96}" rx="6" fill="none" stroke="#6D4C41" stroke-width="4"/>
              <circle cx="${CL + 26}" cy="260" r="10" fill="#FFD54F" stroke="#B28704" stroke-width="2"/>
            </g>
            <g id="nl3-found"></g>
            <g id="nl3-rings" style="display:none"></g>
            <g transform="translate(${AX} 492)"><rect x="-100" y="-20" width="200" height="36" rx="6" fill="#fff" stroke="#555" stroke-width="2"/>${S.text(0, 5, 'kept in a light place', { size: 17 })}</g>
            <g transform="translate(${BX} 492)"><rect x="-100" y="-20" width="200" height="36" rx="6" fill="#fff" stroke="#555" stroke-width="2"/>${S.text(0, 5, 'kept in a dark place', { size: 17 })}</g>
          `);
          const gA = S.q(svg, '#nl3-A'), gB = S.q(svg, '#nl3-B'), door = S.q(svg, '#nl3-door');
          let g = 0;
          const draw = () => {
            gA.innerHTML = [0, 1, 2].map(i => S.plant(optsA(g, i))).join('');
            gB.innerHTML = [0, 1, 2].map(i => S.plant(optsB(g, i))).join('');
          };
          draw();
          // The door closes while time passes, then opens so we can look
          let doorK = .06, doorT = null, closedOnce = false, doorAnim = 0;
          const setDoor = k => { doorK = k; door.setAttribute('transform', `translate(${CR} 0) scale(${k.toFixed(3)} 1) translate(${-CR} 0)`); };
          const moveDoor = async to => {
            const id = ++doorAnim, from = doorK;
            await api.tween(450, k => { if (id === doorAnim) setDoor(S.lerp(from, to, k)); });
          };
          const closeDoor = () => { if (doorK < .9) { api.sfx('knock'); moveDoor(1); } };
          const openDoor = () => { api.sfx('whoosh'); moveDoor(.06); if (g >= 1) showRings(); };
          let ready = false, ringsShown = false, lastSaid = -1;
          api.slider({
            label: '📅 Days', min: 0, max: 14, step: 1, value: 0,
            format: v => `Day ${v}`,
            onInput: v => {
              g = v / 14;
              draw();
              if (!ready) return;
              if (!closedOnce) { closedOnce = true; api.say('The cupboard door is closed, so plant B is in the dark.'); }
              closeDoor();
              clearTimeout(doorT);
              doorT = api.timeout(openDoor, 900);
              const m = v >= 14 ? 2 : v >= 7 ? 1 : 0;
              if (m > lastSaid && m > 0) {
                lastSaid = m;
                api.sfx('grow');
                api.sayAfter(m === 1 ? 'One week. Plant B is getting tall and thin.' : 'Two weeks! Open the cupboard and look at plant B. Can you see any other differences?');
              }
            },
          });
          ready = true;
          // Differences to find on plant B
          const geoB = plantGeo(optsB(1, 1)), geoB2 = plantGeo(optsB(1, 2));
          const diffs = [
            { id: 'colour', p: geoB.at(.55), text: 'pale yellow colour', say: 'Plant B is pale yellow, not green. Plant A is dark green.' },
            { id: 'leaves', p: geoB2.leaves[geoB2.leaves.length - 1].mid, text: 'tiny leaves', say: 'Plant B has tiny leaves. Plant A has big leaves.' },
            { id: 'stem', p: geoB.at(.18), text: 'thin, weak stems', say: 'Plant B has thin, weak stems. Plant A has strong stems.' },
          ];
          const found = new Set();
          const rings = S.q(svg, '#nl3-rings');
          rings.innerHTML = diffs.map((d, i) => `<g class="hot nl3-ring" data-i="${i}"><circle cx="${S.f1(d.p.x)}" cy="${S.f1(d.p.y)}" r="26" fill="transparent"/><circle cx="${S.f1(d.p.x)}" cy="${S.f1(d.p.y)}" r="20" class="target-ring"/></g>`).join('');
          function showRings() {
            if (ringsShown) return;
            ringsShown = true;
            rings.style.display = '';
            api.info('Click the rings on plant B to find the differences.', false);
          }
          const tagY = [110, 200, 300];
          S.qa(svg, '.nl3-ring').forEach(el => el.addEventListener('click', () => {
            const i = +el.dataset.i, d = diffs[i];
            api.sfx('pop');
            api.say(d.say);
            if (found.has(i)) return;
            found.add(i);
            el.style.display = 'none';
            S.q(svg, '#nl3-found').insertAdjacentHTML('beforeend', `<g class="pop-in">${S.callout({ x: S.f1(d.p.x), y: S.f1(d.p.y), tx: 500, ty: tagY[i], text: d.text })}</g>`);
            if (found.size === 3) api.timeout(askFactor, 3200);
          }));
          function askFactor() {
            api.choice({
              q: 'What is the only factor that was changed in this investigation?',
              options: ['💡 light', '💧 water', '🟫 soil', '🫘 type of bean'],
              correct: 0,
              hints: { 1: 'They were given the same volume of water.', 2: 'They were given the same soil.', 3: 'They are the same type of bean.' },
              explain: 'Only the light was changed. Pot A was in the light and pot B was in the dark.',
              onRight: () => api.star(),
            });
          }
        },
      },
    ],
  });
})();
