// Chapter 10: States of water
(() => {
  const f = S.f1;

  App.chapter({
    id: 'water',
    title: 'States of water',
    icon: '💧',
    group: 'Changing state',
    keywords: [
      { w: 'ice', d: 'Water that has frozen into a solid.' },
      { w: 'melts', d: 'Changes from a solid into a liquid when it gets warmer.' },
      { w: 'melting', d: 'The change of state from a solid to a liquid.' },
      { w: 'water vapour', d: 'Water as a gas. It is in the air, but we cannot see it.' },
      { w: 'evaporation', d: 'The change of state from a liquid to a gas.' },
      { w: 'condensation', d: 'The change of state from a gas to a liquid, like drops on a cold window.' },
      { w: 'frozen', d: 'Turned into a solid because it got very cold.' },
      { w: 'freezing', d: 'The change of state from a liquid to a solid.' },
    ],
    steps: [
      // ---------- a) Heating ice ----------
      {
        text: [
          'Water can be in three different states: solid, liquid and gas.',
          'If we heat water, it can change state.',
        ],
        ask: 'Light the burner and watch the thermometer. What happens to the ice?',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 690, y: 70, h: 330, min: -20, max: 110, major: 20, minor: 5, value: -10, id: 'l4-wat1', font: 16 });
          const svg = api.svg(`
            <clipPath id="l4-wat1-clip"><rect x="244" y="120" width="152" height="196"/></clipPath>
            <rect width="800" height="520" fill="#F3F7FB"/>
            <rect y="448" width="800" height="72" fill="#DCE6EE"/>
            <g id="l4-wat1-vap"></g>
            <g clip-path="url(#l4-wat1-clip)"><g id="l4-wat1-in"></g></g>
            ${L4.beaker({ x: 320, y: 322, w: 160, h: 200, level: 0 })}
            <path d="M372 140 L344 300" stroke="#C62828" stroke-width="6" stroke-linecap="round"/><circle cx="344" cy="302" r="7" fill="#C62828"/>
            ${L4.burner({ x: 320, y: 448, flame: 0, id: 'l4-wat1-flame' })}
            ${th.svg}
            <g id="l4-wat1-tags"></g>
            <text id="l4-wat1-t" x="712" y="470" text-anchor="middle" font-size="22" font-weight="800" fill="#C62828">−10 °C</text>`);
          const inG = S.q(svg, '#l4-wat1-in'), vap = S.q(svg, '#l4-wat1-vap'), flame = S.q(svg, '#l4-wat1-flame'), tags = S.q(svg, '#l4-wat1-tags'), tT = S.q(svg, '#l4-wat1-t');
          const cubes = [[268, 312, 6], [312, 312, -8], [356, 312, 4], [290, 270, 14], [336, 272, -12], [312, 232, 3]];
          let T = -10, ice = 1, water = 0, on = false, stage2 = 0, speed = 1;
          const tag = (x, y, text, col) => tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L4.pill(x, y, text, { size: 18, fill: col })}</g>`);
          api.loop((dt, t) => {
            dt *= speed;
            if (on) {
              // Temperature stops at 0 °C while ice melts, and at 100 °C while water boils away
              if (T < 0) T += dt * 6;
              else if (ice > 0) { T = 0; ice = Math.max(0, ice - dt * .1); water = 1 - ice; }
              else if (T < 100) T = Math.min(100, T + dt * 14);
              else water = Math.max(.15, water - dt * .06);
            }
            th.set(svg, T);
            tT.textContent = `${Math.round(T).toString().replace('-', '−')} °C`;
            const lvl = 314 - water * 110;
            inG.innerHTML = `${water > 0 ? `<rect x="244" y="${f(lvl)}" width="152" height="${f(320 - lvl)}" fill="#4FC3F7" opacity=".7"/>` : ''}
              ${cubes.map(([x, y, r], i) => { const s = S.clamp(ice * 1.2 - i * .04); return s > .02 ? `<g transform="translate(${x} ${f(Math.min(y, lvl + 30))}) scale(${f(s)})">${L4.ice({ x: 0, y: 0, e: 38, rot: r })}</g>` : ''; }).join('')}
              ${T >= 100 ? [...Array(8)].map((_, i) => `<circle cx="${250 + (i * 23) % 140}" cy="${f(314 - ((t * 90 + i * 37) % 100))}" r="${3 + i % 4}" fill="#fff" opacity=".8"/>`).join('') : ''}`;
            vap.innerHTML = T >= 100 ? [0, 1, 2, 3].map(i => `<path d="${L4.wisp(270 + i * 34, 120, 90, t * 1.5 + i, 10)}" stroke="#CFD8DC" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>`).join('') : '';
            if (stage2 === 0 && ice < .98 && on) { stage2 = 1; tag(120, 300, 'ice: solid', '#E3F4FF'); api.say('The ice is melting. Look, the thermometer stays at zero degrees while it melts.'); }
            if (stage2 === 1 && ice <= 0) { stage2 = 2; tag(120, 240, 'water: liquid', '#B3E5FC'); api.say('All the ice has melted. It is liquid water now.'); }
            if (stage2 === 2 && T >= 100) { stage2 = 3; tag(320, 60, 'water vapour: gas', '#ECEFF1'); api.say('The water is boiling. It is changing into water vapour, a gas.'); }
            if (stage2 === 3 && water < .6) {
              stage2 = 4;
              api.star();
              api.praise('Heating changed the ice into liquid water, and then into water vapour.');
            }
          });
          const light = api.button('🔥 Light the burner', async () => {
            on = true; light.disabled = true;
            api.sfx('whoosh');
            await api.tween(500, k => flame.setAttribute('transform', `translate(320 398) scale(${f(k)})`), W.ease.back);
          }, { cls: 'primary pulse', sound: null });
          api.button('⏩ Faster', b => { b.disabled = true; speed = 3; });
        },
      },

      // ---------- b) Melting ----------
      {
        text: ['When **ice** **melts** it changes to become liquid water.', 'This change of state is **melting**.'],
        ask: 'Slide the time-lapse to watch an ice cube on a warm plate.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect y="400" width="800" height="120" fill="#E9CFA6"/>
            <ellipse cx="400" cy="400" rx="260" ry="40" fill="#fff" stroke="#BDBDBD" stroke-width="4"/>
            <g id="l4-wat2-art"></g>
            <g transform="translate(640 90)"><circle r="60" fill="#fff" stroke="#3B3F6B" stroke-width="5"/>
              <path id="l4-wat2-hand" d="M0 0 L0 -44" stroke="#C62828" stroke-width="5" stroke-linecap="round"/><path d="M0 0 L0 -30" stroke="#3B3F6B" stroke-width="7" stroke-linecap="round"/>
              <circle r="5" fill="#3B3F6B"/></g>
            <g id="l4-wat2-tags"></g>`);
          const art = S.q(svg, '#l4-wat2-art'), hand = S.q(svg, '#l4-wat2-hand'), tags = S.q(svg, '#l4-wat2-tags');
          const draw = m => {
            const s = 1 - m;
            art.innerHTML = `${m > 0 ? `<path d="${L4.blob(400, 400, 40 + m * 170, 8 + m * 18, 5, 10, .12)}" fill="#81D4FA" opacity=".85" stroke="#4FC3F7" stroke-width="2"/>
                <ellipse cx="${f(380 - m * 60)}" cy="${f(396 - m * 4)}" rx="${f(10 + m * 30)}" ry="${f(2 + m * 3)}" fill="#fff" opacity=".6"/>` : ''}
              ${s > .02 ? `<g transform="translate(400 ${f(396 + m * 6)}) scale(${f(.4 + s * .6)} ${f(.25 + s * .75)})">${L4.ice({ x: 0, y: 0, e: 150, rot: 0 })}</g>` : ''}`;
            hand.setAttribute('transform', `rotate(${f(m * 360)})`);
          };
          draw(0);
          let ready = false, done = false, half = false;
          api.slider({
            label: '⏱ Time', min: 0, max: 60, value: 0, format: v => `${v} min`,
            onInput: v => {
              draw(v / 60);
              if (!ready) { ready = true; return; }
              if (v > 20 && !half) { half = true; api.sfx('drip'); api.say('The ice is melting. It is changing into liquid water.'); }
              if (v === 60 && !done) {
                done = true;
                tags.innerHTML = `<g class="pop-in">${L4.pill(250, 120, 'ice cube', { fill: '#E3F4FF' })}</g>${S.arrow(310, 120, 420, 120, { color: '#3B3F6B', w: 4 })}
                  <g class="pop-in">${L4.pill(480, 120, 'water', { fill: '#B3E5FC' })}</g>${S.text(365, 100, 'melting', { size: 18 })}`;
                api.star();
                api.praise('The ice melted. It changed from a solid into liquid water. This is melting.');
              }
            },
          });
        },
      },

      // ---------- c) Evaporation ----------
      {
        text: [
          'As the water gets hotter and hotter, it leaves and goes into the air. It is now a gas called **water vapour**.',
          'This change of state is **evaporation**.',
        ],
        ask: 'Drag the Sun across the sky. What happens to the puddle?',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            ${S.sky()}
            ${S.ground({ y: 360, w: 800, h: 160, fill: '#B0A898', grass: false, stones: 30 })}
            <path id="l4-wat3-pud" d="" fill="#4FC3F7" opacity=".8"/>
            <g id="l4-wat3-vap"></g>
            <path d="M80 330 Q400 -20 720 330" stroke="#FFE082" stroke-width="3" fill="none" stroke-dasharray="8 10"/>
            <g id="l4-wat3-sun" transform="translate(110 290)" class="hot">${S.sun({ x: 0, y: 0, r: 34 })}<circle r="60" fill="#fff" opacity="0"/></g>
            <text id="l4-wat3-hint" x="110" y="356" text-anchor="middle" font-size="18" font-weight="800" fill="#B26A00" class="blink-hint">👆 Drag me</text>
            <g transform="translate(20 20)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              <text x="115" y="29" text-anchor="middle" font-size="19" font-weight="800">💧 Puddle: <tspan id="l4-wat3-p">100</tspan>%</text></g>`);
          const pud = S.q(svg, '#l4-wat3-pud'), vap = S.q(svg, '#l4-wat3-vap'), sun = S.q(svg, '#l4-wat3-sun');
          let water = 1, heat = 0, sx = 110, done = false;
          // Keep the Sun on its arc
          const arcY = x => { const u = (x - 80) / 640; return 330 - 4 * u * (1 - u) * 340 * .87; };
          let grab = null;
          W.pointerDrag(sun, {
            onStart: e => { grab = api.point(svg, e).x - sx; api.sfx('pick'); const h = S.q(svg, '#l4-wat3-hint'); if (h) h.remove(); },
            onMove: e => { sx = S.clamp(api.point(svg, e).x - grab, 90, 710); sun.setAttribute('transform', `translate(${f(sx)} ${f(arcY(sx))})`); },
          });
          api.loop((dt, t) => {
            heat = S.clamp((330 - arcY(sx)) / 260);
            if (water > 0) water = Math.max(0, water - dt * heat * .12);
            S.q(svg, '#l4-wat3-p').textContent = Math.round(water * 100);
            pud.setAttribute('d', water > .01 ? L4.blob(400, 430, 220 * Math.sqrt(water), 36 * Math.sqrt(water), 7, 11, .18) : '');
            vap.innerHTML = water > .01 && heat > .3 ? [0, 1, 2, 3, 4].map(i => `<path d="${L4.wisp(300 + i * 50, 420, 120 * heat, t * 1.4 + i * 1.3, 10)}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f(.5 * heat)}"/>`).join('') : '';
            if (water <= 0 && !done) {
              done = true;
              api.star();
              api.praise('The Sun warmed the water. It changed into water vapour and went into the air. This is evaporation.');
            }
          });
        },
      },

      // ---------- d) Condensation ----------
      {
        text: [
          'Water vapour in the air changes to liquid water on a cold surface. This change of state is **condensation**.',
          'Water often condenses on windows. Look at the condensation on this cold can.',
        ],
        ask: 'Take the can out of the fridge. Then breathe on the cold window and draw in it!',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <mask id="l4-wat4-mask"><rect x="440" y="40" width="320" height="300" fill="#fff"/><g id="l4-wat4-draw"></g></mask>
            <rect width="800" height="520" fill="#FFF3E0"/>
            <rect y="420" width="800" height="100" fill="#D7B98E"/>
            <rect x="40" y="60" width="180" height="360" rx="12" fill="#ECEFF1" stroke="#90A4AE" stroke-width="4"/>
            <rect x="52" y="180" width="156" height="226" rx="6" fill="#E1F5FE"/>
            <path d="M52 300 L208 300" stroke="#B0BEC5" stroke-width="4"/>
            <rect x="196" y="100" width="8" height="60" rx="4" fill="#90A4AE"/>
            ${S.text(130, 140, '❄️ fridge', { size: 20, fill: '#546E7A' })}
            <rect x="440" y="40" width="320" height="300" fill="#90CAF9"/>
            ${S.cloud({ x: 540, y: 120, s: 1 })}${S.cloud({ x: 680, y: 200, s: .8 })}
            <rect x="440" y="40" width="320" height="300" fill="#ECEFF1" mask="url(#l4-wat4-mask)" id="l4-wat4-mist" opacity="0"/>
            <rect x="440" y="40" width="320" height="300" fill="none" stroke="#8D6E63" stroke-width="10"/>
            <path d="M600 40 L600 340" stroke="#8D6E63" stroke-width="6"/>
            <rect id="l4-wat4-hit" x="440" y="40" width="320" height="300" fill="#fff" opacity="0"/>
            <g id="l4-wat4-can" transform="translate(130 360)" class="hot">
              <rect x="-34" y="-110" width="68" height="110" rx="10" fill="#E53935" stroke="#8E1B1B" stroke-width="3"/>
              <rect x="-34" y="-80" width="68" height="40" fill="#fff" opacity=".85"/>${S.text(0, -54, 'FIZZ', { size: 16, fill: '#C62828' })}
              <ellipse cx="0" cy="-110" rx="34" ry="8" fill="#CFD8DC" stroke="#8E1B1B" stroke-width="2"/>
              <g id="l4-wat4-drops"></g>
            </g>`);
          const can = S.q(svg, '#l4-wat4-can'), dropsG = S.q(svg, '#l4-wat4-drops'), mist = S.q(svg, '#l4-wat4-mist'), drawG = S.q(svg, '#l4-wat4-draw');
          const r = S.rng(4);
          const spots = [...Array(40)].map(() => ({ x: -30 + r() * 60, y: -105 + r() * 100, s: .5 + r() * .8 }));
          let out = false, wet = 0, fog = 0, breathing = false, drawn = 0, canDone = false, winDone = false;
          const check = () => {
            if (canDone && winDone) { api.star(); api.praise('Water vapour from the air turned into liquid water on the cold can and the cold window. This is condensation.'); }
          };
          api.draggable(svg, can, {
            bounds: { x1: 80, y1: 200, x2: 400, y2: 420 },
            onStart: () => api.sfx('pick'),
            onDrop: p => { if (p.x > 240 && !out) { out = true; api.say('The can is very cold. Watch the outside of the can.'); } return true; },
          });
          api.loop(dt => {
            if (out && wet < 1) {
              wet = Math.min(1, wet + dt * .15);
              const n = Math.floor(wet * spots.length);
              dropsG.innerHTML = spots.slice(0, n).map(s => `<ellipse cx="${f(s.x)}" cy="${f(s.y)}" rx="${f(3 * s.s)}" ry="${f(4 * s.s)}" fill="#fff" opacity=".85"/>`).join('');
              if (wet >= 1 && !canDone) { canDone = true; api.sfx('drip'); api.say('Look! Drops of water on the can. Now breathe on the window.'); check(); }
            }
            if (breathing) fog = Math.min(1, fog + dt * .7);
            mist.setAttribute('opacity', f(fog * .85));
          });
          L4.hold(api, '😮‍💨 Hold to breathe on the window', { onDown: () => { breathing = true; api.sfx('wind'); }, onUp: () => { breathing = false; if (fog > .6) api.say('The window is misty. Draw on it with your finger!'); } });
          let last = null;
          W.pointerDrag(S.q(svg, '#l4-wat4-hit'), {
            onStart: e => { last = api.point(svg, e); },
            onMove: e => {
              if (fog < .5) return;
              const p = api.point(svg, e);
              S.el('line', { x1: f(last.x), y1: f(last.y), x2: f(p.x), y2: f(p.y), stroke: '#000', 'stroke-width': 18, 'stroke-linecap': 'round' }, drawG);
              drawn += Math.hypot(p.x - last.x, p.y - last.y);
              last = p;
              if (drawn > 400 && !winDone) { winDone = true; api.sfx('magic'); if (!canDone) api.say('Great drawing! Now take the can out of the fridge.'); check(); }
            },
          });
        },
      },

      // ---------- e) Freezing ----------
      {
        text: [
          'If liquid water is cooled more it will change state to become a solid.',
          'The water on this tap has **frozen**. This change of state is **freezing**.',
        ],
        ask: 'Make it colder outside. What happens to the dripping water?',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 690, y: 90, h: 280, min: -10, max: 15, major: 5, minor: 1, value: 10, id: 'l4-wat5', font: 16 });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#0F3A44"/>
            <rect id="l4-wat5-cold" width="800" height="520" fill="#BBDEFB" opacity="0"/>
            <rect x="0" y="0" width="60" height="520" fill="#5D4037"/>
            <path d="M60 220 L300 220 Q340 220 340 260 L340 300" stroke="#8D6E63" stroke-width="40" fill="none"/>
            <rect x="316" y="296" width="48" height="20" rx="4" fill="#6D4C41"/>
            <path d="M320 180 L320 200 M300 170 L340 170" stroke="#8D6E63" stroke-width="14" stroke-linecap="round"/>
            <g id="l4-wat5-ice"></g><g id="l4-wat5-drip"></g>
            ${th.svg}
            <text id="l4-wat5-t" x="712" y="470" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">10 °C</text>`);
          const iceG = S.q(svg, '#l4-wat5-ice'), drip = S.q(svg, '#l4-wat5-drip'), cold = S.q(svg, '#l4-wat5-cold');
          const ICES = [[120, 240, 70], [170, 240, 110], [220, 240, 60], [270, 240, 130], [326, 316, 150], [352, 316, 90]];
          let T = 10, grow = 0, dy = 0, done = false, said = false;
          api.loop((dt, t) => {
            if (T < 0) grow = Math.min(1, grow + dt * .15 * (-T / 5 + .4));
            iceG.innerHTML = ICES.map(([x, y, L], i) => {
              const l = L * S.clamp(grow * 1.3 - i * .06);
              return l > 2 ? `<path d="M${x - 9} ${y} L${x + 9} ${y} L${x + 1} ${f(y + l)} Z" fill="#E3F2FD" stroke="#90CAF9" stroke-width="2" opacity=".95"/>` : '';
            }).join('');
            if (T > 0 || grow < .6) {
              dy = (dy + dt * 260) % 180;
              drip.innerHTML = `<g transform="translate(340 ${f(320 + dy)})">${T > 0 ? S.drop({ x: 0, y: 0, s: 1.3 }) : `<rect x="-5" y="-6" width="10" height="12" fill="#E3F2FD"/>`}</g>`;
            } else drip.innerHTML = '';
            cold.setAttribute('opacity', f(S.clamp((5 - T) / 20)));
            if (grow > .2 && !said) { said = true; api.sfx('magic'); api.say('Brr! The water is freezing. Icicles are growing!'); }
            if (grow >= 1 && !done) {
              done = true;
              api.star();
              api.praise('The water cooled below zero degrees and changed into solid ice. It has frozen. This is freezing.');
            }
          });
          api.slider({
            label: '🌡️ Temperature', min: -10, max: 15, value: 10, format: v => `${String(v).replace('-', '−')} °C`,
            onInput: v => { T = v; th.set(svg, v); S.q(svg, '#l4-wat5-t').textContent = `${String(v).replace('-', '−')} °C`; },
          });
        },
      },
    ],
  });
})();
