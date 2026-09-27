// Chapter 1: Growing plants (introduction)
App.chapter({
  id: 'intro',
  title: 'Growing plants',
  icon: '🌿',
  group: 'Getting started',
  keywords: [
    { w: 'living things', d: 'Things that are alive. They need water and food, and they grow.' },
    { w: 'group', d: 'To put things together because they are alike in some way.' },
    { w: 'evidence', d: 'Something you can see or measure that shows an idea is true.' },
  ],
  steps: [
    {
      text: [
        'Plants differ in many ways, but they all need certain things to grow well. Let\'s find out more about growing plants.',
        'Plants can be tall, like trees, or very small.',
      ],
      ask: 'Click each plant to find out about it.',
      activity: true,
      scene(stage, api) {
        const items = [
          { id: 'tree', say: 'This oak tree is very tall. It can grow taller than a house!', tag: 'very tall' },
          { id: 'sun', say: 'This sunflower is taller than you!', tag: 'tall' },
          { id: 'daisy', say: 'This daisy is small. It is only as tall as your hand.', tag: 'small' },
          { id: 'moss', say: 'This moss is very, very small. It grows close to the ground.', tag: 'very small' },
        ];
        const svg = api.svg(`
          ${S.sky()}
          ${S.sun({ x: 700, y: 70, r: 34 })}
          <g class="float">${S.cloud({ x: 480, y: 80, s: .9 })}</g>
          ${S.ground({ y: 440, h: 80, fill: 'url(#g-grass)' })}
          <g class="hot" data-id="tree"><g class="sway">${S.tree({ x: 170, y: 445, h: 400, trunkW: 34, canopy: 125 })}</g></g>
          <g class="hot" data-id="sun"><g class="sway" style="animation-delay:.6s">${S.plant({ x: 430, y: 445, h: 230, leaves: 6, leafL: 44, leafW: 20, leafShape: 'heart', flower: 'sunflower', flowerColor: '#FFC400', flowerCenter: '#6D4C1E', flowerR: 30, petals: 16, roots: false })}</g></g>
          <g class="hot" data-id="daisy"><g class="sway" style="animation-delay:1.2s">${S.plant({ x: 570, y: 445, h: 70, leaves: 2, leafL: 22, leafW: 8, flower: 'daisy', flowerColor: '#FFFFFF', flowerCenter: '#FFB300', flowerR: 12, petals: 14, petalShape: 'long', roots: false, stemW: 3 })}</g></g>
          <g class="hot" data-id="moss">${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${676 + i * 9}" cy="${440 - (i % 2) * 4}" r="${7 + (i % 3)}" fill="${S.mix('#6FAE3A', '#3C7A22', (i % 3) / 2)}"/>`).join('')}</g>
          <g id="tags"></g>
        `);
        const found = new Set();
        const tagPos = { tree: [170, 30], sun: [430, 175], daisy: [570, 350], moss: [705, 400] };
        svg.querySelectorAll('.hot').forEach(g => {
          g.addEventListener('click', () => {
            const it = items.find(i => i.id === g.dataset.id);
            api.sfx('pop');
            api.say(it.say);
            if (!found.has(it.id)) {
              found.add(it.id);
              const [x, y] = tagPos[it.id];
              S.q(svg, '#tags').insertAdjacentHTML('beforeend',
                `<g class="pop-in"><rect x="${x - 55}" y="${y - 18}" width="110" height="34" rx="17" fill="#fff" stroke="#C8452F" stroke-width="2.5"/>${S.text(x, y + 6, it.tag, { size: 18, fill: '#9A3222' })}</g>`);
              if (found.size === items.length) {
                api.star();
                api.timeout(() => api.praise('You found them all. Plants can be tall or very small.'), 2600);
              }
            }
          });
        });
      },
    },
    {
      text: [
        'We can **group** plants in many ways just by looking at their leaves or flowers.',
      ],
      ask: 'Press a button to sort the plants into groups.',
      activity: true,
      scene(stage, api) {
        const plants = [
          { leaf: 'round', color: '#FFD23F', name: 'yellow' },
          { leaf: 'pointed', color: '#F06292', name: 'pink' },
          { leaf: 'long', color: '#BA68C8', name: 'purple' },
          { leaf: 'round', color: '#F06292', name: 'pink' },
          { leaf: 'long', color: '#FFD23F', name: 'yellow' },
          { leaf: 'pointed', color: '#BA68C8', name: 'purple' },
        ];
        const svg = api.svg(`
          <rect width="800" height="520" fill="#FFF8EC"/>
          <rect x="0" y="440" width="800" height="80" fill="#E9CFA6"/>
          <rect x="0" y="436" width="800" height="8" fill="#C9A77C"/>
          <g id="heads"></g>
          ${plants.map((p, i) => `<g class="gp" data-i="${i}" transform="translate(${80 + i * 128} 0)">
            ${S.pot({ x: 0, y: 380, w: 70, h: 58 })}
            ${S.plant({ x: 0, y: 382, h: 150, leaves: 6, leafShape: p.leaf, leafL: p.leaf === 'long' ? 50 : 34, leafW: p.leaf === 'long' ? 9 : 15, flower: 'daisy', flowerColor: p.color, flowerCenter: '#FFB300', flowerR: 20, petals: 8, roots: false, seed: i })}
          </g>`).join('')}
        `);
        const gs = S.qa(svg, '.gp');
        const pos = gs.map((g, i) => ({ x: 80 + i * 128 }));
        const moveTo = targets => {
          const from = pos.map(p => p.x);
          return api.tween(900, k => gs.forEach((g, i) => {
            pos[i].x = from[i] + (targets[i] - from[i]) * k;
            g.setAttribute('transform', `translate(${pos[i].x} 0)`);
          }), W.ease.back);
        };
        const heads = S.q(svg, '#heads');
        const done = new Set();
        const groupBy = (key, labels, order) => {
          api.sfx('whoosh');
          const cols = { [order[0]]: 150, [order[1]]: 400, [order[2]]: 650 };
          const count = {};
          const targets = plants.map(p => {
            const k = p[key];
            count[k] = (count[k] || 0) + 1;
            return cols[k] + (count[k] === 1 ? -50 : 50);
          });
          heads.innerHTML = order.map(o => `<g class="pop-in"><rect x="${cols[o] - 95}" y="40" width="190" height="44" rx="22" fill="#fff" stroke="#3E9B4F" stroke-width="3"/>${S.text(cols[o], 70, labels[o], { size: 20, fill: '#2A7439' })}</g>`).join('')
            + `<path d="M275 100 L275 430 M525 100 L525 430" stroke="#C9A77C" stroke-width="3" stroke-dasharray="8 8"/>`;
          moveTo(targets).then(ok => {
            if (!ok) return;
            done.add(key);
            api.say(key === 'leaf' ? 'These plants are grouped by the shape of their leaves: round, pointed and long.' : 'Now the same plants are grouped by the colour of their flowers.');
            if (done.size === 2) { api.star(); api.timeout(() => api.praise('The same plants can be grouped in different ways!'), 4200); }
          });
        };
        api.row();
        api.button('🍃 Group by leaves', () => groupBy('leaf', { round: 'Round leaves', pointed: 'Pointed leaves', long: 'Long leaves' }, ['round', 'pointed', 'long']), { cls: 'primary' });
        api.button('🌸 Group by flowers', () => groupBy('name', { yellow: 'Yellow flowers', pink: 'Pink flowers', purple: 'Purple flowers' }, ['yellow', 'pink', 'purple']), { cls: 'primary' });
        api.button('↺ Mix up', () => { heads.innerHTML = ''; api.sfx('swoosh'); moveTo(plants.map((_, i) => 80 + ((i * 4) % 6) * 128)); });
      },
    },
    {
      text: [
        'Plants are **living things**, so they need water to stay alive.',
        'The picture shows some leaves in glasses of coloured water.',
      ],
      ask: 'How do you know they are taking up the coloured water? What **evidence** can you see?',
      activity: true,
      scene(stage, api) {
        const dyes = ['#3F3D6B', '#1E88E5', '#2E9D4F', '#FF9800', '#FF5722', '#E53935'];
        // A tall cabbage leaf, drawn standing up from (0,0)
        const leafD = 'M0 0 C-30 -30 -48 -110 -34 -170 C-26 -205 -6 -222 6 -214 C26 -226 44 -196 40 -160 C50 -110 30 -30 0 0Z';
        const veins = 'M0 0 L2 -205 M1 -40 L-22 -70 M1 -40 L24 -72 M1 -80 L-26 -112 M1 -80 L28 -114 M2 -120 L-24 -150 M2 -120 L26 -152 M2 -160 L-16 -186 M2 -160 L18 -188';
        const glass = (d, i) => {
          const x = 85 + i * 126;
          return `<g transform="translate(${x} 0)">
            <clipPath id="lc${i}"><path d="${leafD}" transform="translate(0 360)"/></clipPath>
            <path d="${leafD}" transform="translate(0 360)" fill="#F4F7EC" stroke="#C7D3B5" stroke-width="2"/>
            <rect class="dye" data-i="${i}" x="-60" y="360" width="120" height="240" fill="${d}" opacity=".78" clip-path="url(#lc${i})"/>
            <path d="${veins}" transform="translate(0 360)" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>
            <rect class="water" x="-44" y="360" width="88" height="80" rx="3" fill="${d}" opacity=".9"/>
            <path d="M-50 250 L-46 444 Q-46 452 -38 452 L38 452 Q46 452 46 444 L50 250" fill="url(#g-glass)" stroke="#9FB3C0" stroke-width="3"/>
          </g>`;
        };
        const svg = api.svg(`
          <rect width="800" height="520" fill="#2D4A2B"/>
          ${[...Array(18)].map((_, i) => `<circle cx="${(i * 97) % 800}" cy="${40 + (i * 53) % 260}" r="${18 + (i % 4) * 10}" fill="${['#F2C14E', '#8BC34A', '#CDDC39', '#FFB74D'][i % 4]}" opacity=".25"/>`).join('')}
          <rect x="0" y="452" width="800" height="68" fill="#B7C6CC"/><rect x="0" y="452" width="800" height="6" fill="#DCE6EA"/>
          ${dyes.map(glass).join('')}
          <g id="clock" transform="translate(720 50)" opacity="0"><circle r="30" fill="#fff" stroke="#333" stroke-width="3"/><path id="hand" d="M0 0 L0 -22" stroke="#C8452F" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="#333"/></g>
        `);
        const dyeRects = S.qa(svg, '.dye');
        const waters = S.qa(svg, '.water');
        let t = 0;
        const draw = () => {
          dyeRects.forEach(r => r.setAttribute('y', 360 - t * 225));
          waters.forEach(w => { w.setAttribute('y', 360 + t * 40); w.setAttribute('height', 80 - t * 40); });
        };
        draw();
        let running = false, asked = false;
        const btn = api.button('⏩ Wait one day', async () => {
          if (running) return;
          running = true; btn.disabled = true;
          api.sfx('bubble');
          const clock = S.q(svg, '#clock'), hand = S.q(svg, '#hand');
          clock.setAttribute('opacity', 1);
          const from = t;
          await api.tween(3500, k => {
            t = from + (1 - from) * k;
            hand.setAttribute('transform', `rotate(${k * 720})`);
            draw();
          });
          if (!api.alive()) return;
          api.say('Look! The leaves have changed colour, and there is less water in the glasses.');
          if (!asked) {
            asked = true;
            api.choice({
              q: 'What evidence shows the leaves took up the coloured water?',
              options: ['The leaves are the same colour as the water', 'The glasses got bigger', 'The leaves fell over'],
              correct: 0,
              explain: 'The coloured water went up inside the leaves. And the water level went down.',
              hints: { 1: 'Look at the leaves, not the glasses.', 2: 'The leaves are still standing. Look at their colour.' },
              onRight: () => api.star(),
            });
          }
        }, { cls: 'primary pulse' });
        api.button('↺ Start again', () => { t = 0; draw(); btn.disabled = false; running = false; S.q(svg, '#clock').setAttribute('opacity', 0); });
      },
    },
  ],
});
