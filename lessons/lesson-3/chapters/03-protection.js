// Chapter 3: The human skeleton: protection
(() => {
  const { BONE, XRAY } = L3;

  const sideSkull = L3.sideSkull;

  App.chapter({
    id: 'protection',
    title: 'The skeleton: protection',
    icon: '🫀',
    group: 'The human skeleton',
    keywords: [
      { w: 'organs', d: 'Parts of the body that each have their own job to do.' },
      { w: 'heart', d: 'The organ in your chest that pumps blood all around your body.' },
      { w: 'beating', d: 'Moving again and again with a steady thump.' },
      { w: 'protected', d: 'Kept safe from harm.' },
      { w: 'damage', d: 'Harm that breaks or hurts something.' },
      { w: 'lungs', d: 'The two organs in your chest that fill with air when you breathe.' },
      { w: 'breathe', d: 'To take air into your body and let it out again.' },
      { w: 'brain', d: 'The organ inside your head that helps you think and do things.' },
      { w: 'rib cage', d: 'The bones round your chest that protect your heart and lungs.' },
      { w: 'rib', d: 'One of the curved bones that make up the rib cage.' },
      { w: 'skull', d: 'The hard bones of your head that protect your brain.' },
    ],
    steps: [
      // ---------- a) Organs ----------
      {
        text: [
          'The human body contains many **organs**.',
          'An organ is part of the body that has its own job to do. Organs have different functions.',
        ],
        ask: 'Drag each organ to its place in the body.',
        activity: true,
        scene(stage, api) {
          const X = 280, Y = 40, K = 1.1;
          const P = (x, y) => ({ x: X + x * K, y: Y + y * K });
          const organs = [
            { id: 'brain', draw: () => L3.brain({ s: .8 }), home: { x: 640, y: 110 }, to: P(0, 26), name: 'brain', job: 'The brain is inside your head. It helps you think and do things.' },
            { id: 'lungs', draw: () => L3.lungs({ s: 1.05 }), home: { x: 640, y: 270 }, to: P(0, 128), name: 'lungs', job: 'The lungs are in your chest. They help you to breathe.' },
            { id: 'heart', draw: () => L3.heart({ s: .8 }), home: { x: 640, y: 430 }, to: P(9, 136), name: 'heart', job: 'The heart is in your chest, between your lungs. It keeps you alive.' },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EEF7FB"/>
            <rect x="520" y="20" width="250" height="480" rx="24" fill="#fff" stroke="#C9E3F0" stroke-width="3"/>
            <g opacity=".55">${L3.person({ x: X, y: Y, s: K, shirt: '#90CAF9', shorts: '#9FA8DA' })}</g>
            <g fill="none" stroke="#7E57C2" stroke-width="3" stroke-dasharray="8 6">
              <ellipse cx="${organs[0].to.x}" cy="${organs[0].to.y}" rx="28" ry="24"/>
              <ellipse cx="${organs[1].to.x}" cy="${organs[1].to.y}" rx="42" ry="46"/>
            </g>
            <g id="l3-pro1-organs">${organs.map(o => `<g data-o="${o.id}" transform="translate(${o.home.x} ${o.home.y})">
              <circle r="62" fill="#fff" opacity="0"/>${o.draw()}</g>`).join('')}</g>
            <g id="l3-pro1-tags"></g>`);
          // Keep the lungs under the heart when both are in place
          const layer = S.q(svg, '#l3-pro1-organs');
          const placed = new Set();
          organs.forEach(o => {
            const node = S.q(svg, `[data-o="${o.id}"]`);
            const drag = api.draggable(svg, node, {
              bounds: { x1: 40, y1: 40, x2: 760, y2: 480 },
              onStart: () => { api.sfx('pick'); api.say(o.name); },
              onDrop: p => {
                if (placed.has(o.id)) return false;
                const d = Math.hypot(p.x - o.to.x, p.y - o.to.y);
                if (d < 55) {
                  placed.add(o.id);
                  drag.animateTo(o.to.x, o.to.y, 250);
                  S.q(node, 'circle').setAttribute('r', 0);
                  node.style.cursor = 'default';
                  if (o.id === 'lungs') layer.insertBefore(node, layer.firstChild);
                  api.sfx('drop');
                  if (placed.size === organs.length) {
                    api.star();
                    api.praise(`${o.job} Every organ has its own job.`);
                  } else api.say(o.job);
                  return true;
                }
                if (p.x < 500) api.oops(o.id === 'brain' ? 'The brain goes inside the head.' : `The ${o.name} ${o.id === 'lungs' ? 'go' : 'goes'} inside the chest.`);
                return false;
              },
            });
          });
        },
      },

      // ---------- b) Heart ----------
      {
        text: ['Your **heart** is an organ. It keeps you alive.'],
        ask: ['Put your hand on your chest. Can you feel your heart **beating**?', 'Press Run to see what happens to your heart.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3F0"/>
            <g id="l3-pro2-kid"></g>
            <g transform="translate(520 200)"><circle r="150" fill="#FFE3E0"/><g id="l3-pro2-heart">${L3.heart({ s: 3.2 })}</g></g>
            <g transform="translate(520 420)"><rect x="-160" y="-30" width="320" height="60" rx="30" fill="#fff" stroke="#E57373" stroke-width="3"/>
              ${S.text(0, 10, '', { size: 28, fill: '#C62828' }).replace('></text>', ' id="l3-pro2-bpm">80 beats a minute</text>')}</g>
            <rect x="40" y="440" width="300" height="60" rx="12" fill="#1B2A3A"/>
            <polyline id="l3-pro2-ecg" fill="none" stroke="#69F0AE" stroke-width="3" stroke-linejoin="round"/>`);
          const kid = S.q(svg, '#l3-pro2-kid'), heart = S.q(svg, '#l3-pro2-heart'), bpmT = S.q(svg, '#l3-pro2-bpm'), ecg = S.q(svg, '#l3-pro2-ecg');
          let bpm = 80, target = 80, running = false, phase = 0, pulse = 0, listen = false, starred = false, runTime = 0;
          const trace = Array(100).fill(0);
          api.loop((dt, t) => {
            bpm += (target - bpm) * Math.min(1, dt * .8);
            const before = phase;
            phase += dt * bpm / 60;
            if (Math.floor(phase) !== Math.floor(before)) {
              pulse = 1;
              if (listen) api.sfx('knock');
            }
            pulse = Math.max(0, pulse - dt * 4);
            const sc = 1 + pulse * .14;
            heart.setAttribute('transform', `scale(${S.f1(sc * 100) / 100})`);
            const f = phase % 1;
            trace.shift();
            trace.push(f < .06 ? -22 : f < .1 ? 14 : f < .14 ? -4 : 0);
            ecg.setAttribute('points', trace.map((v, i) => `${50 + i * 2.8},${S.f1(470 + v)}`).join(' '));
            bpmT.textContent = `${Math.round(bpm)} beats a minute`;
            // Jog on the spot (side view)
            const a = t * 9, bob = running ? Math.abs(Math.sin(a)) * 12 : 0;
            const pose = running ? {
              hipF: 30 * Math.max(0, Math.sin(a)), kneeF: 70 * Math.max(0, Math.sin(a)), hipB: 30 * Math.max(0, -Math.sin(a)), kneeB: 70 * Math.max(0, -Math.sin(a)),
              shF: -30 * Math.sin(a), elF: 85, shB: 30 * Math.sin(a), elB: 85,
            } : {};
            kid.innerHTML = L3.sideBody(pose, { style: 'body', x: 190, y: 250 - bob, s: .95, shirt: '#EF5350' }).svg;
            if (running) {
              runTime += dt;
              if (runTime > 3 && !starred) {
                starred = true;
                api.star();
                api.praise('When you run, your heart beats faster! It pumps blood all around your body.');
              }
            }
          });
          api.button('🏃 Run on the spot', b => {
            running = !running;
            target = running ? 140 : 80;
            b.innerHTML = running ? '🪑 Stop and rest' : '🏃 Run on the spot';
            api.sfx(running ? 'whoosh' : 'drop');
            if (!running) api.say('Now you are resting. Your heart slows down again.');
          }, { cls: 'primary pulse', sound: null });
          api.button('🩺 Listen', b => { listen = !listen; b.classList.toggle('primary', listen); b.innerHTML = listen ? '🔇 Stop listening' : '🩺 Listen'; });
        },
      },

      // ---------- c) Lungs and brain ----------
      {
        text: [
          'Your **lungs** are also organs. They help you to **breathe**.',
          'Your **brain** is another organ. It is inside your head. It helps you think and do things.',
        ],
        ask: 'Press the button to breathe. Then click the brain to make it think.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3EEFA"/>
            <rect x="30" y="30" width="360" height="460" rx="26" fill="#fff" stroke="#D1C4E9" stroke-width="3"/>
            <rect x="410" y="30" width="360" height="460" rx="26" fill="#fff" stroke="#D1C4E9" stroke-width="3"/>
            ${S.text(210, 76, 'Lungs', { size: 28, fill: '#6F3160' })}${S.text(590, 76, 'Brain', { size: 28, fill: '#B85C77' })}
            <g id="l3-pro3-air"></g>
            <g transform="translate(210 290)"><g id="l3-pro3-lungs">${L3.lungs({ s: 3 })}</g></g>
            <g id="l3-pro3-brainhit" class="hot" transform="translate(590 290)"><circle r="120" fill="#fff" opacity="0"/><g id="l3-pro3-brain">${L3.brain({ s: 3 })}</g></g>
            <g id="l3-pro3-spark"></g>
            <g id="l3-pro3-think"></g>`);
          const lungsG = S.q(svg, '#l3-pro3-lungs'), air = S.q(svg, '#l3-pro3-air'), spark = S.q(svg, '#l3-pro3-spark'), think = S.q(svg, '#l3-pro3-think');
          let breaths = 0, thoughts = 0, busy = false, starred = false;
          const check = () => {
            if (!starred && breaths >= 1 && thoughts >= 1) {
              starred = true; api.star();
              api.timeout(() => api.praise('Your lungs help you breathe, and your brain helps you think.'), 2500);
            }
          };
          const breathe = async () => {
            if (busy) return;
            busy = true;
            api.sfx('wind');
            const dots = [...Array(10)].map((_, i) => S.el('circle', { r: 6, fill: '#81D4FA', opacity: .8 }, air));
            await api.tween(1600, k => {
              lungsG.setAttribute('transform', `scale(${S.f1((1 + k * .16) * 100) / 100} ${S.f1((1 + k * .1) * 100) / 100})`);
              dots.forEach((d, i) => {
                const kk = S.clamp(k * 1.5 - i * .05);
                d.setAttribute('cx', 210 + Math.sin(i * 2) * 8 * (1 - kk) + (i % 2 ? 1 : -1) * kk * 50);
                d.setAttribute('cy', 90 + kk * 230);
                d.setAttribute('opacity', S.f1(.9 - kk * .5));
              });
            }, W.ease.inOut);
            if (!api.alive()) return;
            api.say('Breathe in. Your lungs fill up with air.');
            await api.wait(900);
            api.sfx('whoosh');
            await api.tween(1600, k => {
              lungsG.setAttribute('transform', `scale(${S.f1((1.16 - k * .16) * 100) / 100} ${S.f1((1.1 - k * .1) * 100) / 100})`);
              dots.forEach((d, i) => {
                const kk = S.clamp(k * 1.5 - i * .05);
                d.setAttribute('cx', 210 + (i % 2 ? 1 : -1) * (1 - kk) * 50);
                d.setAttribute('cy', 320 - kk * 280);
              });
            }, W.ease.inOut);
            if (!api.alive()) return;
            air.innerHTML = '';
            api.say('Breathe out. The air goes out again.');
            breaths++; busy = false; check();
          };
          const ideas = ['2 + 2 = 4', 'Kick the ball!', 'I love reading', 'What is my name?', 'Time for lunch!', 'Let\'s draw a cat'];
          S.q(svg, '#l3-pro3-brainhit').addEventListener('click', async () => {
            api.sfx('magic');
            const idea = ideas[thoughts % ideas.length];
            thoughts++;
            spark.innerHTML = [...Array(8)].map((_, i) => {
              const a = i * Math.PI / 4;
              return `<g class="pop-in" style="animation-delay:${i * .05}s"><path d="M${S.f1(590 + Math.cos(a) * 110)} ${S.f1(290 + Math.sin(a) * 90)} l${S.f1(Math.cos(a) * 22)} ${S.f1(Math.sin(a) * 22)}" stroke="#FFC93C" stroke-width="6" stroke-linecap="round"/></g>`;
            }).join('');
            think.innerHTML = `<g class="pop-in"><rect x="470" y="400" width="240" height="56" rx="28" fill="#FFF8D6" stroke="#E0A526" stroke-width="3"/>
              ${S.text(590, 437, '💭 ' + idea, { size: 22, fill: '#7A5A00' })}</g>`;
            api.say(idea === '2 + 2 = 4' ? 'Two plus two is four! Your brain helps you think.' : idea);
            check();
          });
          api.button('🌬️ Breathe in and out', breathe, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- d) Rib cage ----------
      {
        text: [
          'Organs are much softer than bone, so they need to be **protected** from **damage**.',
          'Your **rib cage** protects your heart and lungs. Each of the bones across it is a **rib**.',
        ],
        ask: 'Click the dotted lines to put the ribs back. Then test the rib cage.',
        activity: true,
        scene(stage, api) {
          const c = BONE;
          const widths = [30, 36, 40, 42, 42, 40, 35];
          const ribD = (w, y0) => `M-5 ${y0} C-16 ${y0 - 8} ${-(w + 4)} ${y0 - 4} ${-w} ${y0 + 12} C${-(w - 2)} ${y0 + 18} ${-(w - 6)} ${y0 + 22} ${-(w - 10)} ${y0 + 24}`;
          let spine = '';
          for (let i = 0; i < 12; i++) spine += `<rect x="-7" y="${84 + i * 9.4}" width="14" height="7" rx="2.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1"/>`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EEF7FB"/>
            <g transform="translate(400 -140) scale(3.2)">
              ${spine}
              <g id="l3-pro4-org">${L3.lungs({ x: 0, y: 128, s: .92 })}${L3.heart({ x: 8, y: 138, s: .7 })}</g>
              <g id="l3-pro4-ribs">${widths.map((w, i) => `<g data-r="${i}" class="hot">
                ${[1, -1].map(m => `<g transform="scale(${m} 1)"><path d="${ribD(w, 92 + i * 10)}" stroke="#7E57C2" stroke-width="1.2" stroke-dasharray="2.5 2" fill="none"/>
                  <path class="l3-pro4-solid" d="${ribD(w, 92 + i * 10)}" stroke="${c.edge}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0"/>
                  <path class="l3-pro4-solid" d="${ribD(w, 92 + i * 10)}" stroke="${c.fill}" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0"/>
                  <path d="${ribD(w, 92 + i * 10)}" stroke="#fff" stroke-opacity="0" stroke-width="7" fill="none"/></g>`).join('')}</g>`).join('')}</g>
              <rect id="l3-pro4-sternum" x="-5" y="88" width="10" height="58" rx="4" fill="${c.fill}" stroke="${c.edge}" stroke-width="1" opacity=".25"/>
            </g>
            <g transform="translate(20 20)"><rect width="200" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(100, 29, '🦴 Ribs: ', { size: 19 }).replace('</text>', '<tspan id="l3-pro4-n">0</tspan> of 7</text>')}</g>
            <g id="l3-pro4-ball" transform="translate(-60 470)" opacity="0"><circle r="30" fill="#FF7043" stroke="#BF360C" stroke-width="3"/>
              <path d="M-30 0 Q0 -14 30 0 M0 -30 Q-12 0 0 30" stroke="#BF360C" stroke-width="3" fill="none"/></g>`);
          let n = 0, busy = false;
          S.q(svg, '#l3-pro4-ribs').addEventListener('click', e => {
            const g = e.target.closest('[data-r]');
            if (!g || g.dataset.done) return;
            g.dataset.done = 1;
            g.classList.remove('hot');
            S.qa(g, '.l3-pro4-solid').forEach(p => p.setAttribute('opacity', 1));
            n++;
            api.sfx('pop');
            S.q(svg, '#l3-pro4-n').textContent = n;
            S.q(svg, '#l3-pro4-sternum').setAttribute('opacity', S.f1(.25 + n / 7 * .75));
            if (n === 7) {
              api.say('The rib cage is finished! Now test it.');
              test.disabled = false;
              test.classList.add('pulse');
            }
          });
          const ball = S.q(svg, '#l3-pro4-ball'), org = S.q(svg, '#l3-pro4-org');
          const test = api.button('⚽ Throw a ball at the chest', async () => {
            if (busy) return;
            busy = true;
            api.sfx('swoosh');
            ball.setAttribute('opacity', 1);
            await api.tween(600, k => ball.setAttribute('transform', `translate(${S.f1(-60 + k * 420)} ${S.f1(470 - k * 200 - Math.sin(k * Math.PI) * 60)}) rotate(${k * 360})`), W.ease.linear);
            if (!api.alive()) return;
            api.sfx('thud');
            await api.tween(800, k => {
              ball.setAttribute('transform', `translate(${S.f1(360 - k * 360)} ${S.f1(270 - Math.sin(k * Math.PI) * 120 + k * 200)}) rotate(${-k * 360})`);
              org.setAttribute('transform', `translate(${S.f1(Math.sin(k * 30) * (1 - k) * 1.2)} 0)`);
            }, W.ease.out);
            if (!api.alive()) return;
            ball.setAttribute('opacity', 0);
            api.star();
            api.praise('The ball bounced off! The hard rib cage protects the soft heart and lungs from damage.');
            busy = false;
          }, { cls: 'primary', sound: null });
          test.disabled = true;
        },
      },

      // ---------- e) Label the skeleton and skull ----------
      {
        text: [
          'Look at this skeleton. The heart is drawn inside the rib cage to show you where it is.',
          'Now look at the **skull**. Your soft brain is inside your hard skull. The hard skull protects it from damage.',
        ],
        ask: 'Drag the labels to the right places.',
        activity: true,
        scene(stage, api) {
          const K = 1.55, X = 210, Y = 34;
          const P = (x, y) => ({ x: X + x * K, y: Y + y * K });
          const svg = api.svg(`
            <clipPath id="l3-pro5-clip"><rect x="20" y="20" width="380" height="480" rx="22"/></clipPath>
            <clipPath id="l3-pro5-head"><path d="M-96 34 C-128 -20 -96 -120 10 -122 C96 -124 140 -60 128 10 C122 50 96 70 70 80 L20 70 L-96 34Z"/></clipPath>
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect x="20" y="20" width="380" height="480" rx="22" fill="#0B1726"/>
            <g clip-path="url(#l3-pro5-clip)">
              ${L3.skeleton({ x: X, y: Y, s: K, xray: true })}
              ${L3.heart({ x: P(9, 134).x, y: P(9, 134).y, s: .7 * K })}
            </g>
            <rect x="420" y="20" width="360" height="480" rx="22" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
            <g transform="translate(600 290) scale(1.15)">
              ${sideSkull()}
              <g clip-path="url(#l3-pro5-head)"><g transform="translate(18 -30) scale(3.2)">${L3.brain()}</g></g>
              <path d="M-96 34 C-128 -20 -96 -120 10 -122 C96 -124 140 -60 128 10" fill="none" stroke="${BONE.edge}" stroke-width="14" opacity=".9"/>
              <path d="M-96 34 C-128 -20 -96 -120 10 -122 C96 -124 140 -60 128 10" fill="none" stroke="${BONE.fill}" stroke-width="10"/>
            </g>`);
          const rib = P(-39, 128);
          api.dragLabels(svg, [
            { id: 'skull', label: 'skull', x: P(-14, 14).x, y: P(-14, 14).y, lx: 80, ly: 60 },
            { id: 'heart', label: 'heart', x: P(9, 134).x, y: P(9, 134).y, lx: 330, ly: 280 },
            { id: 'rib', label: 'rib', x: rib.x, y: rib.y, lx: 70, ly: 300 },
            { id: 'brain', label: 'brain', x: 620, y: 220, lx: 700, ly: 70 },
          ], {
            onDone: () => {
              api.star();
              api.sayAfter('The rib cage protects the heart, and the hard skull protects the soft brain.');
            },
          });
        },
      },
    ],
  });
})();
