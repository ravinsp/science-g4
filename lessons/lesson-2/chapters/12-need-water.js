// Chapter 12: Plants need water
(() => {
  const GREEN = '#43A047', YELLOW = '#D9C84A', BROWN = '#9A7045', DEAD = '#8A6A48';

  // Leaf colour from health: wet = too much water (yellow), dry = too little (brown)
  const leafCol = (wet, dry) => S.mix(S.mix(GREEN, YELLOW, wet), BROWN, dry);

  App.chapter({
    id: 'needwater',
    title: 'Plants need water',
    icon: '🚿',
    group: 'What plants need',
    keywords: [
      { w: 'correct amount', d: 'Just the right amount. Not too much and not too little.' },
      { w: 'enough', d: 'As much as is needed.' },
      { w: 'wilted', d: 'When a plant droops and goes floppy because it does not have enough water.' },
      { w: 'watered', d: 'Given water.' },
      { w: 'soon', d: 'In a short time from now.' },
      { w: 'dead', d: 'No longer alive.' },
      { w: 'compare', d: 'To look at things to see how they are the same and how they are different.' },
      { w: 'observations', d: 'The things you notice when you look carefully. You can draw or write them down.' },
    ],
    steps: [
      // ---------- 1. Ways plants get water ----------
      {
        text: ['Plants need the **correct amount** of water to grow well. Think of some ways that plants can get water.'],
        ask: 'Click each picture to see how the plants get water. How do plants in the wild get water?',
        activity: true,
        scene(stage, api) {
          const P = [20, 280, 540], PY = 40, PW = 240, PH = 300;
          const frame = (i, inner) => `<clipPath id="nw-c${i}"><rect x="${P[i]}" y="${PY}" width="${PW}" height="${PH}" rx="16"/></clipPath>
            <g class="hot nw-panel" data-i="${i}"><g clip-path="url(#nw-c${i})">${inner}<g class="nw-fx"></g></g>
            <rect x="${P[i]}" y="${PY}" width="${PW}" height="${PH}" rx="16" fill="none" stroke="#E07A4F" stroke-width="5"/></g>`;
          const x0 = P[0], x1 = P[1], x2 = P[2];
          // Garden with a hose
          const hose = `<rect x="${x0}" y="${PY}" width="${PW}" height="${PH}" fill="url(#g-sky)"/>
            ${[0, 1, 2, 3, 4].map(k => `<circle cx="${x0 + 10 + k * 34}" cy="${PY + 170 - (k % 2) * 16}" r="${40 + (k % 3) * 8}" fill="${['#4E9A3A', '#5DAE4B', '#3F8B32'][k % 3]}"/>`).join('')}
            ${[0, 1, 2, 3, 4, 5].map(k => `<circle cx="${x0 + 18 + k * 24}" cy="${PY + 150 + (k % 3) * 22}" r="7" fill="${['#FFD23F', '#F06292', '#FF8A65'][k % 3]}"/>`).join('')}
            <rect x="${x0}" y="${PY + 240}" width="${PW}" height="60" fill="url(#g-grass)"/>
            <path d="M${x0 + 150} ${PY + 186} C${x0 + 175} ${PY + 230} ${x0 + 200} ${PY + 290} ${x0 + 240} ${PY + 280}" stroke="#2E7D32" stroke-width="7" fill="none"/>
            ${S.kid({ x: x0 + 195, y: PY + 292, s: .78, coat: false, shirt: '#F5F5F5', skin: '#E0AC69', hair: '#2B1B10' })}
            <rect x="${x0 + 140}" y="${PY + 180}" width="22" height="12" rx="4" fill="#FFB300" stroke="#B37D00" stroke-width="1.5"/>`;
          // Park with sprinklers
          let beds = '';
          for (let k = 0; k < 9; k++) beds += `<circle cx="${x1 + 20 + k * 26}" cy="${PY + 200 + (k % 2) * 8}" r="11" fill="${['#FFB300', '#E53935', '#AB47BC', '#FF7043'][k % 4]}"/>`;
          const park = `<rect x="${x1}" y="${PY}" width="${PW}" height="${PH}" fill="url(#g-sky)"/>
            ${S.tree({ x: x1 + 50, y: PY + 190, h: 170, trunkW: 14, canopy: 55, seed: 3, bark: false })}
            ${S.tree({ x: x1 + 190, y: PY + 185, h: 150, trunkW: 12, canopy: 50, seed: 8, leafColor: '#5BAA4E', bark: false })}
            <rect x="${x1}" y="${PY + 190}" width="${PW}" height="110" fill="url(#g-grass)"/>${beds}
            <path d="M${x1 + 90} ${PY + 300} L${x1 + 130} ${PY + 215} L${x1 + 150} ${PY + 215} L${x1 + 160} ${PY + 300}Z" fill="#D7B98E"/>
            <g><rect x="${x1 + 52}" y="${PY + 250}" width="8" height="16" fill="#607D8B"/><circle cx="${x1 + 56}" cy="${PY + 248}" r="6" fill="#90A4AE"/></g>
            <g><rect x="${x1 + 192}" y="${PY + 256}" width="8" height="16" fill="#607D8B"/><circle cx="${x1 + 196}" cy="${PY + 254}" r="6" fill="#90A4AE"/></g>`;
          // Forest in the rain
          let forest = '';
          for (let k = 0; k < 7; k++) {
            const tx = x2 + 10 + k * 38, th = 70 + (k % 3) * 25;
            forest += `<path d="M${tx} ${PY + 240} L${tx + 22} ${PY + 240 - th} L${tx + 44} ${PY + 240}Z" fill="${['#2E6B3A', '#3B7F45', '#27583A'][k % 3]}"/>`;
          }
          const rainScene = `<rect x="${x2}" y="${PY}" width="${PW}" height="${PH}" fill="#9FB4C2" class="nw-rsky"/>
            <path d="M${x2} ${PY + 190} Q${x2 + 70} ${PY + 130} ${x2 + 140} ${PY + 170} T${x2 + 240} ${PY + 150} L${x2 + 240} ${PY + 300} L${x2} ${PY + 300}Z" fill="#6E8B6E"/>
            ${forest}
            <rect x="${x2}" y="${PY + 238}" width="${PW}" height="62" fill="#5BAA4E"/>
            ${S.cloud({ x: x2 + 70, y: PY + 50, s: 1.1, color: '#7D8A95' })}${S.cloud({ x: x2 + 180, y: PY + 40, s: 1, color: '#8C99A3' })}`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            ${frame(0, hose)}${frame(1, park)}${frame(2, rainScene)}
            ${['a hose in a garden', 'sprinklers in a park', 'rain on a forest'].map((t, i) => `<g class="nw-cap" data-i="${i}">
              <rect x="${P[i] + 20}" y="${PY + PH + 18}" width="${PW - 40}" height="36" rx="18" fill="#fff" stroke="#E07A4F" stroke-width="2.5"/>
              ${S.text(P[i] + PW / 2, PY + PH + 43, t, { size: 17, fill: '#9A3222' })}
              <text class="nw-tick" x="${P[i] + PW - 16}" y="${PY + 30}" font-size="26" opacity="0">✅</text></g>`).join('')}
            ${S.text(400, 470, '👆 Click each picture', { size: 20, fill: '#6E665A', cls: 'blink-hint' })}
          `);
          const panels = S.qa(svg, '.nw-panel');
          const until = [0, 0, 0];
          const seen = new Set();
          const says = [
            'People can water plants with a hose. Splash!',
            'In a park, sprinklers spray water onto the grass and flowers.',
            'Rain falls on the forest. Plants in the wild get water from the rain.',
          ];
          const sounds = ['spray', 'sprinkle', 'rain'];
          let asked = false;
          panels.forEach(pn => pn.addEventListener('click', () => {
            const i = +pn.dataset.i;
            until[i] = performance.now() + 3200;
            api.sfx(sounds[i]);
            if (i === 0) api.timeout(() => api.sfx('water'), 300);
            if (i === 1) { api.timeout(() => api.sfx('sprinkle'), 900); api.timeout(() => api.sfx('sprinkle'), 1800); }
            api.say(says[i]);
            if (!seen.has(i)) {
              seen.add(i);
              S.qa(svg, '.nw-tick')[i].setAttribute('opacity', 1);
              api.sfx('pop');
              if (seen.size === 3 && !asked) { asked = true; api.timeout(ask, 3400); }
            }
          }));
          // Water drops for each little scene
          const parts = [];
          const fx = panels.map(p => S.q(p, '.nw-fx'));
          api.loop((dt, el) => {
            const now = performance.now();
            if (now < until[0]) for (let k = 0; k < 3; k++) {
              const n = S.el('circle', { r: 2.6, fill: '#4FC3F7' }, fx[0]);
              parts.push({ n, x: x0 + 140, y: PY + 186, vx: -140 - Math.random() * 60, vy: -80 + Math.random() * 60, g: 300, life: 1.2 });
            }
            if (now < until[1]) [[x1 + 56, PY + 246], [x1 + 196, PY + 252]].forEach(([sx, sy], j) => {
              const a = Math.PI / 2 + Math.sin(el * 2.4 + j * 2) * 1.1;
              for (let k = 0; k < 2; k++) {
                const n = S.el('circle', { r: 2.2, fill: '#81D4FA' }, fx[1]);
                parts.push({ n, x: sx, y: sy, vx: Math.cos(a) * (90 + Math.random() * 40), vy: -Math.sin(a) * (150 + Math.random() * 40), g: 300, life: 1.2 });
              }
            });
            const rsky = S.q(svg, '.nw-rsky');
            rsky.setAttribute('fill', now < until[2] ? '#8497A5' : '#9FB4C2');
            if (now < until[2]) for (let k = 0; k < 4; k++) {
              const n = S.el('path', { d: 'M0 0 l-3 14', stroke: '#D6EEFB', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, fx[2]);
              parts.push({ n, x: x2 + Math.random() * 260, y: PY + 60, vx: -40, vy: 420, g: 0, life: .8 });
            }
            for (let i = parts.length - 1; i >= 0; i--) {
              const p = parts[i];
              p.life -= dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
              if (p.life <= 0) { p.n.remove(); parts.splice(i, 1); continue; }
              p.n.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
            }
          });
          function ask() {
            api.choice({
              q: 'How do plants in the wild get water?',
              options: ['🌧️ From the rain', '🧑‍🌾 From a hose', '💦 From sprinklers', '🪣 From a watering can'],
              correct: 0,
              hints: { 1: 'Nobody waters a forest with a hose! What falls from the clouds?', 2: 'There are no sprinklers in the wild. Look at the forest picture.', 3: 'Nobody carries a watering can to a forest. What falls from the sky?' },
              explain: 'Plants in the wild get water from the rain.',
              onRight: () => api.star(),
            });
          }
        },
      },

      // ---------- 2. Keep it just right ----------
      {
        title: 'Too little, too much',
        text: [
          'This plant has the correct amount of water. A plant that does not have **enough** water has **wilted**.',
          'The wilted plant will go back to its first shape if it is **watered** **soon**. If it is not watered when it wilted, it will be **dead**.',
          'Plants that are watered too much will also die.',
        ],
        ask: 'Watch the days go by. Water the plant to keep the soil water just right for a whole week!',
        activity: true,
        scene(stage, api) {
          const X = 300, RIM = 290, SOIL = RIM + 4, TT = 420;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F7EEDB"/>
            <rect y="440" width="800" height="80" fill="#E4CFA8"/>
            <g id="nw2-win">
              <clipPath id="nw2-wclip"><rect x="30" y="30" width="170" height="130" rx="6"/></clipPath>
              <g clip-path="url(#nw2-wclip)"><rect id="nw2-sky" x="30" y="30" width="170" height="130" fill="#8FD0F5"/>
                <g id="nw2-sun">${S.sun({ x: 0, y: 0, r: 18, rays: false })}</g>
                <g id="nw2-moon"><circle r="15" fill="#FFF6C9"/><circle cx="7" cy="-5" r="12" fill="#23305E"/></g></g>
              <rect x="30" y="30" width="170" height="130" rx="6" fill="none" stroke="#fff" stroke-width="10"/>
            </g>
            <g transform="translate(115 192)"><rect x="-62" y="-20" width="124" height="38" rx="19" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              <text id="nw2-day" y="8" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B">Day 1</text></g>
            <!-- round table -->
            <path d="M${X - 18} ${TT + 12} L${X - 12} 490 L${X + 12} 490 L${X + 18} ${TT + 12}Z" fill="#8D6E63"/>
            <path d="M${X - 60} 500 L${X + 60} 500" stroke="#6D4C41" stroke-width="10" stroke-linecap="round"/>
            <ellipse cx="${X}" cy="${TT + 6}" rx="210" ry="22" fill="#D9A45B"/><ellipse cx="${X}" cy="${TT}" rx="210" ry="22" fill="#F3C878" stroke="#C48A3A" stroke-width="2"/>
            <g id="nw2-puddle"></g>
            <g id="nw2-plant"></g>
            <g id="nw2-potG">${S.pot({ x: X, y: RIM, w: 150, h: 125 })}</g>
            <ellipse id="nw2-soil" cx="${X}" cy="${RIM + 2}" rx="75" ry="9" fill="#5A3620"/>
            <!-- moisture probe and meter -->
            <path d="M${X + 45} ${SOIL + 30} L${X + 45} ${SOIL - 40}" stroke="#9E9E9E" stroke-width="6" stroke-linecap="round"/>
            <path d="M${X + 45} ${SOIL - 40} C${X + 90} ${SOIL - 140} 560 120 610 150" stroke="#455A64" stroke-width="3" fill="none"/>
            <g transform="translate(600 90)">
              <rect x="-20" y="-40" width="190" height="370" rx="18" fill="#fff" stroke="#3B3F6B" stroke-width="3"/>
              ${S.text(75, -12, 'Soil water', { size: 19, fill: '#3B3F6B' })}
              <rect x="0" y="10" width="44" height="90" fill="#64B5F6"/><rect x="0" y="100" width="44" height="130" fill="#81C784"/><rect x="0" y="230" width="44" height="80" fill="#FFB74D"/>
              <rect x="0" y="10" width="44" height="300" rx="4" fill="none" stroke="#3B3F6B" stroke-width="2.5"/>
              ${S.text(52, 60, 'too much', { size: 16, anchor: 'start', fill: '#1565C0' })}
              ${S.text(52, 170, 'just right', { size: 16, anchor: 'start', fill: '#2E7D32' })}
              ${S.text(52, 275, 'too little', { size: 16, anchor: 'start', fill: '#E65100' })}
              <g id="nw2-needle"><path d="M-16 -9 L0 0 L-16 9Z" fill="#C8452F"/><path d="M0 0 L44 0" stroke="#C8452F" stroke-width="3"/></g>
            </g>
            <g transform="translate(560 452)">
              ${S.text(75, 7, 'Just right days:', { size: 18, fill: '#3B3F6B' })}
              ${[...Array(7)].map((_, i) => `<circle class="nw2-dot" cx="${-3 + i * 26}" cy="32" r="10" fill="#fff" stroke="#81C784" stroke-width="3"/>`).join('')}
            </g>
            <g id="nw2-can" transform="translate(${X + 150} ${RIM - 120}) scale(-.9 .9) rotate(40)" opacity="0">${S.wateringCan({})}</g>
            <g id="nw2-drops"></g>
          `);
          const plantG = S.q(svg, '#nw2-plant'), needle = S.q(svg, '#nw2-needle');
          const dots = S.qa(svg, '.nw2-dot');
          let M, t, day, droop, wet, dry, dryDays, wetDays, streak, dead, paused, won, puddle;
          const init = () => { M = .55; t = .3; day = 1; droop = 0; wet = 0; dry = 0; dryDays = 0; wetDays = 0; streak = 0; dead = false; paused = false; puddle = 0; };
          init();
          const zone = () => M < .25 ? 'dry' : M > .82 ? 'wet' : 'good';
          const drawPlant = () => {
            const col = dead ? DEAD : leafCol(wet, dry);
            plantG.innerHTML = S.plant({ x: X, y: SOIL, h: 165, leaves: 7, leafL: 62, leafW: 25, leafStart: .22, leafColor: col, stemColor: dead ? '#7A5A3A' : S.mix('#43A047', '#A89A45', Math.max(wet, dry) * .8), droop: dead ? 1 : droop, roots: false, seed: 9 });
            S.q(svg, '#nw2-soil').setAttribute('fill', S.mix('#B08452', '#3A2213', S.clamp(M / 1.1)));
            needle.setAttribute('transform', `translate(0 ${S.f1(310 - S.clamp(M / 1.2) * 300)})`);
            dots.forEach((d, i) => d.setAttribute('fill', i < streak ? '#66BB6A' : '#fff'));
            const pu = S.q(svg, '#nw2-puddle');
            pu.innerHTML = puddle > 0 ? `<path d="M${X - 80} ${RIM + 8} C${X - 84} ${RIM + 40} ${X - 70} ${RIM + 80} ${X - 64} ${TT - 2}" stroke="#6EC6F0" stroke-width="${S.f1(4 + puddle * 5)}" fill="none" stroke-linecap="round" opacity=".85" class="flow"/><path d="M${X - 70} ${TT - 4} Q${X - 140} ${TT + 2} ${X - 150 - puddle * 40} ${TT + 8} Q${X - 120} ${TT + 22} ${X - 40} ${TT + 14} Q${X + 60} ${TT + 22} ${X + 80} ${TT + 6} Q${X + 50} ${TT - 6} ${X - 70} ${TT - 4}Z" fill="#6EC6F0" opacity="${S.f1(.4 + puddle * .4)}"/>
              ${puddle > .5 ? `<path d="M${X - 188} ${TT + 10} q-4 12 0 24" stroke="#6EC6F0" stroke-width="5" stroke-linecap="round" fill="none" class="flow"/>` : ''}` : '';
          };
          const setSky = () => {
            const f = t % 1, a = f * Math.PI * 2;
            // Sun is up for the first 60% of each day
            const sunUp = f < .6, k = sunUp ? f / .6 : (f - .6) / .4;
            const px = 30 + 170 * k, py = 145 - Math.sin(k * Math.PI) * 95;
            S.q(svg, '#nw2-sun').setAttribute('transform', `translate(${S.f1(px)} ${S.f1(py)})`);
            S.q(svg, '#nw2-sun').setAttribute('opacity', sunUp ? 1 : 0);
            S.q(svg, '#nw2-moon').setAttribute('transform', `translate(${S.f1(px)} ${S.f1(py)})`);
            S.q(svg, '#nw2-moon').setAttribute('opacity', sunUp ? 0 : 1);
            S.q(svg, '#nw2-sky').setAttribute('fill', sunUp ? '#8FD0F5' : '#23305E');
            return a;
          };
          drawPlant(); setSky();
          // One day passes
          const newDay = () => {
            day++;
            S.q(svg, '#nw2-day').textContent = 'Day ' + day;
            api.sfx('tick');
            M = Math.max(0, M - .14);
            puddle = Math.max(0, puddle - .35);
            const z = zone();
            if (z === 'dry') { dryDays++; } else dryDays = 0;
            if (z === 'wet') wetDays++; else wetDays = Math.max(0, wetDays - 1);
            if (z === 'dry') {
              const was = droop;
              droop = Math.min(1, .4 + (dryDays - 1) * .3);
              dry = Math.min(.8, dry + .12);
              if (was < .3) { api.sfx('shrink'); api.say('Oh no! The plant does not have enough water. It has wilted. Water it soon!'); }
            }
            if (z === 'wet') {
              wet = Math.min(1, wet + .28);
              if (wetDays === 1) api.say('Too much water! The leaves are turning yellow.');
            } else wet = Math.max(0, wet - .1);
            if (z === 'good' && droop < .2 && wet < .5) streak++;
            else streak = 0;
            if (dryDays >= 4 || wetDays >= 4) die(dryDays >= 4 ? 'dry' : 'wet');
            drawPlant();
            if (streak >= 7 && !won) {
              won = true;
              api.star();
              api.praise('You kept the water just right for a whole week!');
            }
          };
          const die = why => {
            dead = true;
            api.sfx('oops');
            api.say(why === 'dry' ? 'This plant was not watered when it wilted. Now it is dead.' : 'This plant was watered too much. Now it is dead.');
            api.feedback(why === 'dry' ? '🥀 Not watered soon enough' : '🥀 Too much water', 'oops', 4000);
            restartBtn.classList.add('pulse');
          };
          api.loop(dt => {
            if (paused || dead) return;
            const before = Math.floor(t);
            t += dt / 3;
            setSky();
            if (Math.floor(t) > before) newDay();
          });
          // Watering: the can tips, drops fall, soil gets wetter
          let pouring = 0;
          const water = async () => {
            if (dead) { api.oops('This plant is dead. Press Start again.'); return; }
            api.sfx('pour');
            const can = S.q(svg, '#nw2-can');
            can.setAttribute('opacity', 1);
            pouring++;
            const dropsG = S.q(svg, '#nw2-drops');
            for (let i = 0; i < 8; i++) {
              const d = S.frag(S.drop({ x: 0, y: 0, s: .55 }));
              dropsG.appendChild(d);
              const sx = X + 72 + Math.random() * 6, sy = RIM - 104, dx = 20 + Math.random() * 80;
              api.tween(450, k => d.setAttribute('transform', `translate(${S.f1(sx - k * dx)} ${S.f1(sy + k * 104)}) scale(.55)`), q => q).then(() => d.remove());
            }
            await api.wait(500);
            if (!api.alive()) return;
            if (--pouring === 0) can.setAttribute('opacity', 0);
            const wasWilted = droop > .3;
            M += .3;
            if (M > 1.0) {
              puddle = Math.min(1, puddle + .5);
              api.sfx('drip');
              if (M > 1.12) api.say('Too much! The water is spilling out of the pot onto the table.');
              M = Math.min(M, 1.2);
            }
            if (wasWilted && zone() !== 'dry') {
              dryDays = 0;
              api.sfx('grow');
              await api.tween(900, k => { droop = S.lerp(droop, 0, k * .5); drawPlant(); });
              droop = 0; dry = Math.max(0, dry - .3);
              api.say('The wilted plant went back to its first shape because it was watered soon!');
            }
            drawPlant();
          };
          S.q(svg, '#nw2-potG').classList.add('hot');
          S.q(svg, '#nw2-potG').addEventListener('click', water);
          api.row();
          api.button('🚿 Water the plant', water, { cls: 'primary', sound: null });
          const pauseBtn = api.button('⏸ Pause', () => {
            paused = !paused;
            pauseBtn.innerHTML = paused ? '▶ Play' : '⏸ Pause';
          }, { cls: 'small' });
          const restartBtn = api.button('↺ Start again', () => {
            init(); won = won || false;
            restartBtn.classList.remove('pulse');
            S.q(svg, '#nw2-day').textContent = 'Day 1';
            api.sfx('grow');
            drawPlant();
          }, { cls: 'small' });
        },
      },

      // ---------- 3. The fair test with A, B and C ----------
      {
        title: 'Compare three plants',
        text: [
          'Label three of the same size plants A, B and C. Make sure they have the same number of leaves.',
          'Water plant A every day. Water plant B on two days each week. Do not water plant C.',
        ],
        ask: '**Compare** the plants to see how well they are growing. Draw the plants at the start, after one week and again after two weeks. These are your **observations**.',
        activity: true,
        scene(stage, api) {
          const PX = [85, 235, 385], RIM = 285, PW = 100, PH = 84;
          const B_DAYS = [1, 4, 8, 11];
          const watered = (p, d) => p === 0 ? d >= 1 : p === 1 ? B_DAYS.includes(d) : false;
          // How each plant looks on day d
          const look = (p, d) => {
            if (p === 0) {
              const wet = S.clamp((d - 3) / 10) * .75;
              return { grow: 1 + .06 * Math.min(d, 4) / 4, leaves: d > 11 ? 5 : 6, color: leafCol(wet, 0), stem: S.mix('#43A047', '#A89A45', wet), droop: S.clamp((d - 6) / 8) * .3, puddle: d >= 2 };
            }
            if (p === 1) return { grow: 1 + .3 * d / 14, leaves: 6 + Math.floor(d / 6), color: GREEN, stem: '#43A047', droop: 0 };
            const droop = S.clamp((d - 3) / 5), deadK = S.clamp((d - 8) / 3);
            return { grow: 1 - deadK * .08, leaves: d > 10 ? 4 : 6, color: S.mix(leafCol(0, S.clamp((d - 4) / 5) * .6), DEAD, deadK), stem: S.mix('#43A047', '#7A5A3A', deadK), droop };
          };
          const plantSvg = (p, d, x, y) => {
            const L = look(p, d);
            return `${L.puddle ? `<ellipse cx="${x}" cy="${y + PH - 2}" rx="${PW * .55}" ry="7" fill="#6EC6F0" opacity=".8"/>` : ''}
              ${S.plant({ x, y: y + 4, h: 130, grow: L.grow, leaves: L.leaves, leafL: 40, leafW: 17, leafShape: 'heart', leafColor: L.color, stemColor: L.stem, droop: L.droop, roots: false, seed: 6 })}
              ${S.pot({ x, y, w: PW, h: PH, label: 'ABC'[p] })}
              <ellipse cx="${x}" cy="${y + 2}" rx="${PW / 2}" ry="6" fill="${S.mix('#B08452', '#3A2213', p === 0 ? 1 : p === 1 ? .6 : Math.max(0, .6 - d * .1))}"/>`;
          };
          // Observation table on the right
          const TX = 482, TY = 20, CW = 92, RH = 150;
          let table = `<rect x="${TX}" y="${TY}" width="${40 + CW * 3}" height="${40 + RH * 3}" rx="10" fill="#fff" stroke="#3B3F6B" stroke-width="3"/>`;
          ['start', 'week 1', 'week 2'].forEach((h, c) => { table += S.text(TX + 40 + CW * c + CW / 2, TY + 27, h, { size: 17, fill: '#3B3F6B' }); });
          for (let r = 0; r < 3; r++) table += S.text(TX + 20, TY + 40 + RH * r + RH / 2 + 7, 'ABC'[r], { size: 22, fill: '#9A3222' });
          for (let c = 0; c <= 2; c++) table += `<path d="M${TX + 40 + CW * c} ${TY} L${TX + 40 + CW * c} ${TY + 40 + RH * 3}" stroke="#3B3F6B" stroke-width="2"/>`;
          for (let r = 0; r <= 2; r++) table += `<path d="M${TX} ${TY + 40 + RH * r} L${TX + 40 + CW * 3} ${TY + 40 + RH * r}" stroke="#3B3F6B" stroke-width="2"/>`;
          const cal = p => {
            let s = '';
            for (let d = 1; d <= 14; d++) {
              const cx = PX[p] - 66 + ((d - 1) % 7) * 19, cy = 395 + Math.floor((d - 1) / 7) * 21;
              s += `<g class="nw3-cal" data-p="${p}" data-d="${d}"><rect x="${cx}" y="${cy}" width="17" height="18" rx="3" fill="#fff" stroke="#C9B897" stroke-width="1.5"/>
                <path class="nw3-drop" d="M${cx + 8.5} ${cy + 3} C${cx + 12} ${cy + 8} ${cx + 13} ${cy + 10} ${cx + 13} ${cy + 12} A4.5 4.5 0 0 1 ${cx + 4} ${cy + 12} C${cx + 4} ${cy + 10} ${cx + 5} ${cy + 8} ${cx + 8.5} ${cy + 3}Z" fill="#3BA7E5" opacity="0"/></g>`;
            }
            return s;
          };
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect x="0" y="${RIM + PH}" width="470" height="12" rx="4" fill="#C9955E"/>
            <g id="nw3-plants"></g>
            ${[0, 1, 2].map(cal).join('')}
            ${['every day', '2 days a week', 'no water'].map((t, i) => S.text(PX[i], 460, t, { size: 16, fill: '#3B3F6B' })).join('')}
            <g transform="translate(235 30)"><rect x="-90" y="-20" width="180" height="40" rx="20" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              <text id="nw3-day" y="8" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B">📅 Day 0</text></g>
            <g id="nw3-cans"></g>
            ${table}
            <g id="nw3-obs"></g>
            <rect id="nw3-flash" width="800" height="520" fill="#fff" opacity="0" pointer-events="none"/>
          `);
          let day = 0, busy = false;
          const drawn = new Set();
          const plantsG = S.q(svg, '#nw3-plants');
          const draw = () => { plantsG.innerHTML = [0, 1, 2].map(p => plantSvg(p, day, PX[p], RIM)).join(''); };
          draw();
          const needDraw = () => (day === 0 || day === 7 || day === 14) && !drawn.has(day);
          const refresh = () => {
            S.q(svg, '#nw3-day').textContent = `📅 Day ${day}`;
            S.qa(svg, '.nw3-cal').forEach(g => {
              const p = +g.dataset.p, d = +g.dataset.d;
              S.q(g, 'rect').setAttribute('fill', d === day ? '#FFF3B0' : d < day ? '#F4F1EA' : '#fff');
              S.q(g, '.nw3-drop').setAttribute('opacity', d <= day && watered(p, d) ? 1 : 0);
            });
            nextBtn.disabled = busy || needDraw() || day >= 14;
            drawBtn.disabled = busy || !needDraw();
            drawBtn.classList.toggle('pulse', needDraw());
            nextBtn.classList.toggle('pulse', !needDraw() && day < 14);
          };
          const nextDay = async () => {
            if (busy || needDraw() || day >= 14) return;
            busy = true; refresh();
            day++;
            api.sfx('tick');
            // Little watering cans pour on the plants that get water today
            const cans = S.q(svg, '#nw3-cans');
            const today = [0, 1, 2].filter(p => watered(p, day));
            if (today.length) {
              api.sfx('pour');
              cans.innerHTML = today.map(p => `<g transform="translate(${PX[p] + 70} ${RIM - 110}) scale(-.5 .5) rotate(40)">${S.wateringCan({})}</g>`).join('');
              const dropsHtml = today.map(p => [0, 1, 2, 3].map(k => `<circle class="nw3-d" data-x="${PX[p] + 28 + k * 2}" cx="0" cy="0" r="3" fill="#4FC3F7"/>`).join('')).join('');
              cans.insertAdjacentHTML('beforeend', dropsHtml);
              const ds = S.qa(cans, '.nw3-d');
              await api.tween(600, k => ds.forEach((d, i) => {
                const kk = (k + (i % 4) * .2) % 1;
                d.setAttribute('cx', S.f1(+d.dataset.x - kk * (10 + (i % 4) * 8))); d.setAttribute('cy', S.f1(RIM - 102 + kk * 100));
              }), W.ease.linear);
              cans.innerHTML = '';
            } else await api.wait(400);
            if (!api.alive()) return;
            draw();
            busy = false;
            refresh();
            if (day === 3) api.say('Plant C is starting to wilt. It has had no water.');
            if (day === 6) api.say('Look at plant A. Its leaves are turning yellow. It has too much water.');
            if (day === 7) api.say('One week! Time to draw the plants again.');
            if (day === 10) api.say('Plant C was never watered. Now it is dead.');
            if (day === 14) api.say('Two weeks! Draw the plants one last time.');
          };
          const snapshot = () => {
            if (!needDraw() || busy) return;
            const col = day === 0 ? 0 : day === 7 ? 1 : 2;
            drawn.add(day);
            api.sfx('shutter');
            const fl = S.q(svg, '#nw3-flash');
            api.tween(400, k => fl.setAttribute('opacity', S.f1(.7 * (1 - k))));
            let s = '';
            for (let p = 0; p < 3; p++) {
              const cx = TX + 40 + CW * col, cy = TY + 40 + RH * p;
              s += `<svg class="pop-in" x="${cx + 4}" y="${cy + 4}" width="${CW - 8}" height="${RH - 8}" viewBox="-80 -205 160 300">
                <rect x="-80" y="-205" width="160" height="300" fill="#FFFDF5"/>${plantSvg(p, day, 0, 0)}</svg>`;
            }
            S.q(svg, '#nw3-obs').insertAdjacentHTML('beforeend', s);
            api.timeout(() => api.sfx('pop'), 250);
            refresh();
            if (day === 0) api.say('Here are the plants at the start. They are all the same. Now press next day.');
            else if (day === 7) api.say('These are your observations after one week.');
            else { api.say('These are your observations after two weeks. Now compare the plants.'); api.timeout(askBest, 3500); }
          };
          function askBest() {
            const c = api.choice({
              q: 'Which plant grew best?',
              options: ['Plant A', 'Plant B', 'Plant C'],
              correct: 1,
              hints: { 0: 'Plant A got too much water. Look at its yellow leaves.', 2: 'Plant C got no water. It wilted and died.' },
              explain: 'Plant B had the correct amount of water.',
              onRight: () => api.timeout(() => { c.parentNode.remove(); askFair(); }, 2600),
            });
          }
          function askFair() {
            api.choice({
              q: 'Why did we use the same size plants with the same number of leaves?',
              options: ['To make it a fair test', 'Because they look nice', 'So they grow faster'],
              correct: 0,
              hints: { 1: 'Scientists have a better reason than that!', 2: 'The size does not make them grow faster. Think about what we changed.' },
              explain: 'We only changed the water. Everything else was the same, so it was a fair test.',
              onRight: () => api.star(),
            });
          }
          api.row();
          const drawBtn = api.button('✏️ Draw the plants', snapshot, { cls: 'primary', sound: null });
          const nextBtn = api.button('☀️ Next day ▶', nextDay, { cls: 'primary', sound: 'click' });
          api.button('↺ Start again', () => {
            if (busy) return;
            day = 0; drawn.clear(); S.q(svg, '#nw3-obs').innerHTML = ''; draw(); refresh(); api.sfx('swoosh');
          }, { cls: 'small' });
          refresh();
        },
      },
    ],
  });
})();
