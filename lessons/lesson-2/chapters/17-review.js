// Chapter 17: Review, quiz and certificate
(() => {
  const FONT = "'Baloo 2', 'Comic Sans MS', 'Segoe UI', sans-serif";
  const COLS = ['#3E9B4F', '#1E88E5', '#8E24AA', '#E65100', '#C62828', '#00897B', '#6D4C41', '#3949AB'];

  function injectStyle() {
    if (document.getElementById('rev-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="rev-style">
      .rev-gl { columns: 2; column-gap: 14px; }
      .rev-sec { break-inside: avoid; background:#fff; border:2.5px solid #EADFCB; border-radius:14px; padding:6px 10px 8px; margin-bottom:10px; }
      .rev-sec h4 { margin:0 0 6px; font-family: var(--font-head); font-size:17px; display:flex; align-items:center; gap:6px; }
      .rev-words { display:flex; flex-wrap:wrap; gap:5px; }
      .rev-word { border:0; border-radius:999px; padding:3px 12px; font-weight:800; font-size:15px; color:#fff; cursor:pointer; box-shadow: inset 0 -2px 0 rgba(0,0,0,.2); transition: transform .12s; }
      .rev-word:hover { transform: translateY(-2px) scale(1.05); }
      .rev-word.say { animation: rev-say .6s; }
      @keyframes rev-say { 50% { transform: scale(1.2); background:#FFC93C; color:#2B2A28; } }
      .rev-head { text-align:center; font-weight:800; margin-bottom:8px; font-size:18px; }
      .rev-over { position:absolute; inset:0; background:rgba(255,248,236,.97); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:20px; z-index:4; animation: fadein .3s; }
      .rev-def { background:#fff; border:3px solid #3B3F6B; border-radius:8px 8px 22px 8px; padding:16px 22px; font-size:22px; font-weight:700; max-width:560px; text-align:center; box-shadow:4px 4px 0 rgba(59,63,107,.15); }
      .rev-opts { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
      .rev-opt { border:3px solid #EADFCB; background:#fff; border-radius:16px; padding:10px 22px; font-size:20px; font-weight:800; cursor:pointer; transition: all .15s; }
      .rev-opt:hover { border-color:#3E9B4F; transform: translateY(-2px); }
      .rev-opt.right { background:#3E9B4F; border-color:#3E9B4F; color:#fff; }
      .rev-opt.wrong { background:#FBE0D2; border-color:#E8833A; animation: shake .4s; }
      .rev-opt:disabled { cursor:default; transform:none; }
      .rev-round { font-weight:800; color:#6E665A; }
      .rev-dots { display:flex; gap:6px; }
      .rev-dots span { width:16px; height:16px; border-radius:50%; background:#EADFCB; }
      .rev-dots span.ok { background:#3E9B4F; } .rev-dots span.no { background:#E8833A; }
      /* quiz */
      .rev-quiz { display:flex; flex-direction:column; gap:10px; height:100%; }
      .rev-top { display:flex; align-items:center; gap:12px; font-weight:800; }
      .rev-bar { flex:1; height:14px; border-radius:99px; background:#EADFCB; overflow:hidden; }
      .rev-bar div { height:100%; width:0; background:linear-gradient(90deg,#3E9B4F,#8BC34A); border-radius:99px; transition: width .5s; }
      .rev-score { background:#FFE56B; border-radius:99px; padding:2px 12px; }
      .rev-body { display:grid; grid-template-columns: 42% 1fr; gap:14px; align-items:center; flex:1; min-height:0; }
      .rev-pic svg { width:100%; display:block; border-radius:16px; }
      .rev-q { font-size:21px; font-weight:800; margin-bottom:10px; line-height:1.3; }
      .rev-qopts { display:flex; flex-direction:column; gap:8px; }
      .rev-qopts .rev-opt { font-size:17px; padding:8px 14px; text-align:left; }
      .rev-exp { background:#E3F4DE; border:2.5px solid #3E9B4F; border-radius:14px; padding:8px 14px; font-weight:700; display:flex; align-items:center; gap:12px; animation: fadein .4s; }
      .rev-exp.no { background:#FDEBE1; border-color:#E07A4F; }
      .rev-exp p { margin:0; flex:1; }
      .rev-end { text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; height:100%; }
      .rev-big { font-family: var(--font-head); font-size:54px; font-weight:800; color:#9A3222; line-height:1; }
      @media print {
        body * { visibility: hidden !important; }
        #stage .rev-cert, #stage .rev-cert * { visibility: visible !important; }
        #stage .rev-cert { position: fixed; left: 0; top: 0; width: 100vw !important; height: auto !important; }
        #fx, #feedback { display: none !important; }
        @page { size: landscape; margin: 8mm; }
      }
    </style>`);
  }

  // Turn an SVG element into a PNG download (uses only defs inside the svg)
  function savePng(svgEl, fileName, width, api) {
    const vb = svgEl.viewBox.baseVal;
    const height = Math.round(width * vb.height / vb.width);
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', S.NS);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);
    clone.querySelectorAll('[class]').forEach(n => n.removeAttribute('class'));
    const data = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        c.toBlob(b => download(URL.createObjectURL(b), fileName), 'image/png');
      } catch (e) {
        download(URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' })), fileName.replace(/\.png$/, '.svg'));
      }
    };
    img.onerror = () => api.oops('Sorry, the picture could not be saved.');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  }
  function download(url, name) {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // All key words from the other chapters, in order
  const allWords = () => {
    const out = [];
    App.chapters.forEach(c => (c.keywords || []).forEach(k => out.push({ w: k.w, d: k.d, ch: c })));
    return out;
  };

  // ---------- Quiz questions (each has a small picture, viewBox 300x220) ----------
  const sky = `<rect width="300" height="220" fill="#DFF3FF"/>`;
  const soil = y => `<path d="M0 ${y} Q150 ${y - 6} 300 ${y} L300 220 L0 220Z" fill="#8A5A34"/>`;
  const QUIZ = [
    {
      q: 'What are the two functions of roots?',
      o: ['To make food and attract insects', 'To hold the plant in the ground and take in water and minerals', 'To make flowers and seeds'],
      c: 1, e: 'Roots hold the plant in the ground. They take in water and minerals from the soil.',
      pic: () => `${sky}${soil(110)}${S.plant({ x: 150, y: 110, h: 90, leaves: 4, leafL: 30, leafW: 12, rootDepth: 90, rootSpread: 90, hairs: true, rootColor: '#F3E6C8', seed: 7 })}
        ${[0, 1, 2, 3, 4].map(i => S.drop({ x: 60 + i * 45, y: 175 + (i % 2) * 18, s: .7 })).join('')}`,
    },
    {
      q: 'What is a cutting?',
      o: ['A piece cut off a bigger plant that can grow into a new plant', 'A kind of seed', 'A dead leaf'],
      c: 0, e: 'A cutting is a piece that you cut off a bigger plant. It will make a new plant.',
      pic: () => `${sky}${S.plant({ x: 110, y: 200, h: 170, leaves: 6, leafL: 34, leafW: 13, roots: false, seed: 3 })}
        ${S.scissors({ x: 170, y: 120, s: .9, angle: 200, open: .5 })}
        <path d="M200 60 L240 40" stroke="#C8452F" stroke-width="3" stroke-dasharray="6 5"/>`,
    },
    {
      q: 'What does a stem or a tree trunk do?',
      o: ['It makes the plant smell nice', 'It takes in sunlight', 'It holds the plant up and carries water from the roots'],
      c: 2, e: 'The stem holds up the leaves and flowers and carries water. A big tree needs a strong trunk so it does not fall over.',
      pic: () => `${sky}${S.ground({ y: 190, w: 300, h: 30, fill: 'url(#g-grass)' })}${S.tree({ x: 90, y: 192, h: 175, trunkW: 22, canopy: 64 })}
        ${S.plant({ x: 225, y: 192, h: 110, leaves: 5, leafL: 26, leafW: 10, roots: false, fruit: 2, seed: 5 })}`,
    },
    {
      q: 'Leaves use sunlight, air and water to make food. What does this make plants?',
      o: ['Herbivores', 'Producers', 'Botanists'],
      c: 1, e: 'Plants are producers. They make their own food, which is then eaten by herbivores, like caterpillars.',
      pic: () => `${sky}<g transform="translate(55 50)"><circle r="26" fill="#FFD43B"/><circle r="36" fill="#FFE56B" opacity=".4"/></g>
        ${S.leaf({ x: 90, y: 150, angle: -20, L: 150, W: 48, color: '#4CAF50', stalk: 12 })}
        ${S.caterpillar({ x: 190, y: 150, s: .9 })}
        ${[0, 1, 2].map(i => `<path d="M${75 + i * 12} ${80 + i * 10} L${105 + i * 12} ${120 + i * 10}" stroke="#FFC93C" stroke-width="3" stroke-dasharray="4 4"/>`).join('')}`,
    },
    {
      q: 'Why do many flowers have bright colours?',
      o: ['To attract insects', 'To keep warm', 'To scare away animals'],
      c: 0, e: 'Bright flowers look attractive to insects, like bees and butterflies.',
      pic: () => `${sky}${S.ground({ y: 200, w: 300, h: 20, fill: 'url(#g-grass)' })}
        ${S.plant({ x: 110, y: 202, h: 150, leaves: 4, leafL: 26, leafW: 10, flower: 'daisy', flowerColor: '#FF7043', flowerCenter: '#FFD23F', flowerR: 30, petals: 12, roots: false })}
        ${S.bee({ x: 210, y: 70, s: 1.1 })}${S.butterfly({ x: 230, y: 150, s: .6, color: '#BA68C8' })}`,
    },
    {
      q: 'A flower key asks questions. What kind of answers do they have?',
      o: ['A number', 'Yes or no', 'A colour'],
      c: 1, e: 'A key asks questions that have yes or no as the answer. Each answer leads you to the next question.',
      pic: () => `<rect width="300" height="220" fill="#FFF8EC"/>
        <rect x="70" y="16" width="160" height="34" rx="8" fill="#F2C99A" stroke="#B5803F" stroke-width="2"/>${S.text(150, 39, 'Five petals?', { size: 17 })}
        <path d="M110 50 L70 100 M190 50 L230 100" stroke="#B5803F" stroke-width="5"/>
        <rect x="30" y="100" width="80" height="30" rx="8" fill="#C8E6C9" stroke="#3E9B4F" stroke-width="2"/>${S.text(70, 121, 'yes', { size: 17, fill: '#2A7439' })}
        <rect x="190" y="100" width="80" height="30" rx="8" fill="#FFCDD2" stroke="#C62828" stroke-width="2"/>${S.text(230, 121, 'no', { size: 17, fill: '#9A3222' })}
        ${S.flower({ x: 70, y: 175, r: 26, petals: 5, color: '#F06292', center: '#FFEB3B', shape: 'heart' })}
        ${S.flower({ x: 230, y: 175, r: 26, petals: 8, color: '#BA68C8', center: '#FFB300', shape: 'pointed' })}`,
    },
    {
      q: 'Is colour a helpful feature for classifying flowers?',
      o: ['Yes, colour is the best feature', 'No. Scientists look at petals and how flowers grow on the stem', 'Only for red flowers'],
      c: 1, e: 'Colour is not a helpful feature. These flowers are all purple but differ in many other ways.',
      pic: () => `<rect width="300" height="220" fill="#F3EEFA"/>
        ${S.flower({ x: 60, y: 80, r: 34, petals: 5, color: '#7E57C2', center: '#FFEB3B', shape: 'heart' })}
        ${S.flower({ x: 150, y: 80, r: 34, petals: 20, color: '#8E24AA', center: '#6A1B9A', shape: 'long', layers: 2 })}
        ${S.flower({ x: 240, y: 80, r: 34, petals: 6, color: '#9575CD', center: '#FFF59D', shape: 'pointed' })}
        ${S.flower({ x: 100, y: 170, r: 30, petals: 4, color: '#AB47BC', center: '#fff', shape: 'wide' })}
        ${S.flower({ x: 200, y: 170, r: 30, petals: 3, color: '#7B1FA2', center: '#FFB300', shape: 'round' })}`,
    },
    {
      q: 'A white flower stands in pink water. After a day the petals turn pink. What does this show?',
      o: ['Water moves up the stem into the flower', 'The flower is sick', 'Someone painted the petals'],
      c: 0, e: 'This is evidence that water moves inside the plant, up through the stem to the petals.',
      pic: () => `<rect width="300" height="220" fill="#EEF7FB"/>
        <path d="M150 200 Q146 130 150 70" stroke="#43A047" stroke-width="5" fill="none"/>
        ${S.beaker({ x: 150, y: 210, w: 90, h: 100, level: .6, liquid: '#F06292' })}
        ${S.flower({ x: 150, y: 60, r: 40, petals: 18, color: '#F8BBD0', center: '#EC407A', shape: 'round', layers: 2 })}
        <path d="M150 160 L150 110" stroke="#E91E63" stroke-width="3" stroke-dasharray="6 5" class="flow"/>`,
    },
    {
      q: 'A plastic bag is tied over a plant. Soon there are drops of water inside the bag. Why?',
      o: ['It rained inside the bag', 'Water evaporated from the leaves and condensed on the bag', 'The soil leaked'],
      c: 1, e: 'Water evaporates from the leaves into the air. It condenses into drops on the inside of the bag.',
      pic: () => `<rect width="300" height="220" fill="#EEF7FB"/>
        ${S.plant({ x: 150, y: 150, h: 110, leaves: 6, leafL: 32, leafW: 13, leafShape: 'round', roots: false, seed: 9 })}
        ${S.pot({ x: 150, y: 150, w: 90, h: 60, color: '#D9743C' })}
        <path d="M100 152 C80 110 90 30 150 24 C210 30 220 110 200 152 Z" fill="#E3F2FD" fill-opacity=".45" stroke="#90A4AE" stroke-width="2.5"/>
        <path d="M100 152 L200 152" stroke="#C8452F" stroke-width="4"/>
        ${[[112, 70], [130, 45], [185, 60], [192, 100], [108, 110], [165, 38]].map(([x, y]) => S.drop({ x, y, s: .6 })).join('')}`,
    },
    {
      q: 'This plant has drooped and wilted. What does it need?',
      o: ['To be put in the dark', 'The correct amount of water, soon', 'To be cut down'],
      c: 1, e: 'A wilted plant will go back to its first shape if it is watered soon. Plants need the correct amount of water.',
      pic: () => `<rect width="300" height="220" fill="#FFF8EC"/>
        ${S.plant({ x: 120, y: 150, h: 110, droop: .85, leaves: 5, leafL: 30, leafW: 12, leafColor: '#9CB84A', roots: false, seed: 4 })}
        ${S.pot({ x: 120, y: 150, w: 90, h: 60, color: '#D9743C' })}
        ${S.wateringCan({ x: 230, y: 90, s: .7 })}`,
    },
    {
      q: 'Plants on a windowsill all lean the same way. Why?',
      o: ['The wind blows them', 'They are tired', 'They grow towards the light'],
      c: 2, e: 'Plants grow in the direction that lets them absorb as much light as they can.',
      pic: () => `<rect width="300" height="220" fill="#FFF3E0"/>
        <rect x="200" y="20" width="90" height="140" rx="6" fill="#BFE6FF" stroke="#fff" stroke-width="6"/><circle cx="260" cy="55" r="18" fill="#FFD43B"/>
        ${[0, 1, 2].map(i => S.plant({ x: 45 + i * 55, y: 175, h: 110, bend: .7, leaves: 4, leafL: 22, leafW: 9, roots: false, seed: i }) + S.pot({ x: 45 + i * 55, y: 175, w: 44, h: 36, color: '#D9743C' })).join('')}
        ${[0, 1, 2].map(i => `<path d="M${215} ${60 + i * 25} L${165} ${80 + i * 30}" stroke="#FFC93C" stroke-width="3" stroke-dasharray="5 5"/>`).join('')}`,
    },
    {
      q: 'In the fertiliser investigation, what is the only factor we change?',
      o: ['The water', 'The fertiliser', 'The type of plant'],
      c: 1, e: 'We only change the fertiliser. Fertiliser gives plants extra minerals. Everything else stays the same.',
      pic: () => `<rect width="300" height="220" fill="#EAF6FF"/>
        ${[0, 1].map(i => S.plant({ x: 90 + i * 120, y: 150, h: i ? 70 : 115, leaves: i ? 4 : 6, leafL: 22, leafW: 10, leafShape: 'round', leafColor: i ? '#9CC24F' : '#43A047', roots: false, seed: 5 })
          + S.pot({ x: 90 + i * 120, y: 150, w: 70, h: 50, color: '#3E8ED0', stripes: true })).join('')}
        <g transform="translate(20 20)"><path d="M0 0 L40 0 L36 44 L4 44Z" fill="#7CB342" stroke="#33691E" stroke-width="2"/>${S.text(20, 28, '🧪', { size: 18 })}</g>
        <path d="M60 40 Q80 60 88 80" stroke="#33691E" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>`,
    },
  ];

  App.chapter({
    id: 'review',
    title: 'Review and quiz',
    icon: '🏆',
    group: 'Be a botanist',
    steps: [
      // ---------- a) Key word glossary ----------
      {
        title: 'Key words',
        text: ['Here are all the key words from this topic. Click a word to hear what it means.'],
        ask: 'Then press <b>Word match</b> and pick the right word for each meaning.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const secs = App.chapters.filter(c => c.keywords && c.keywords.length);
          const wrap = api.html(`<div class="rev-head">📚 ${allWords().length} key words from Growing Plants</div>
            <div class="rev-gl">${secs.map((c, ci) => `<div class="rev-sec"><h4><span>${c.icon || '🌱'}</span>${c.title}</h4><div class="rev-words">
              ${c.keywords.map(k => `<button class="rev-word" style="background:${COLS[ci % COLS.length]}" data-w="${k.w.replace(/"/g, '&quot;')}">${k.w}</button>`).join('')}</div></div>`).join('')}</div>`);
          wrap.querySelectorAll('.rev-word').forEach(b => b.addEventListener('click', () => App.sayWord(b.dataset.w, b)));

          // Word match mini-game: 5 rounds, 3 choices each
          const game = () => {
            if (stage.querySelector('.rev-over')) return;
            const words = allWords();
            if (words.length < 3) { api.info('There are not enough key words yet.'); return; }
            const rounds = shuffle(words).slice(0, 5);
            let r = 0, score = 0;
            const over = W.h('div', { class: 'rev-over' });
            stage.append(over);
            const show = () => {
              const t = rounds[r];
              const others = shuffle(words.filter(w => w.w.toLowerCase() !== t.w.toLowerCase() && w.d !== t.d)).slice(0, 2);
              const opts = shuffle([t, ...others]);
              over.innerHTML = `<div class="rev-round">🔀 Word match — round ${r + 1} of ${rounds.length}</div>
                <div class="rev-dots">${rounds.map((_, i) => `<span class="${i < r ? (rounds[i]._ok ? 'ok' : 'no') : ''}"></span>`).join('')}</div>
                <div class="rev-def">${t.d}</div>
                <div class="rev-opts">${opts.map((o, i) => `<button class="rev-opt" data-i="${i}">${o.w}</button>`).join('')}</div>
                <button class="btn small rev-close">✖ Close</button>`;
              api.say(`Which word means: ${t.d}`);
              let tries = 0;
              over.querySelectorAll('.rev-opt').forEach(b => b.addEventListener('click', () => {
                const o = opts[+b.dataset.i];
                if (o === t) {
                  b.classList.add('right');
                  over.querySelectorAll('.rev-opt').forEach(x => x.disabled = true);
                  if (!tries) { score++; t._ok = true; }
                  api.sfx('success');
                  api.say(`Yes! ${t.w}.`);
                  api.timeout(() => { r++; if (r < rounds.length) { api.sfx('page'); show(); } else end(); }, 1600);
                } else {
                  tries++;
                  b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
                  api.sfx('oops');
                  api.say(`${o.w} means: ${o.d} Try again!`);
                }
              }));
              over.querySelector('.rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
            };
            const end = () => {
              over.innerHTML = `<div class="rev-big">${score} / ${rounds.length}</div>
                <div class="rev-dots">${rounds.map(t => `<span class="${t._ok ? 'ok' : 'no'}"></span>`).join('')}</div>
                <div class="rev-def">You matched ${score} word${score === 1 ? '' : 's'} first time!</div>
                <div class="rev-opts"><button class="btn primary rev-again">🔀 Play again</button><button class="btn rev-close">📚 Back to the words</button></div>`;
              api.star();
              api.praise(`You matched ${score} out of ${rounds.length} words first time.`);
              over.querySelector('.rev-again').addEventListener('click', () => { api.sfx('click'); over.remove(); game(); });
              over.querySelector('.rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
            };
            api.sfx('whoosh');
            show();
          };
          api.button('🔀 Word match', game, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- b) Big quiz ----------
      {
        title: 'Big quiz',
        text: ['Time for the big quiz! There are 12 questions about the whole topic.'],
        tip: 'Read each question carefully. You can click the picture to hear the question again.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const box = api.html('<div class="rev-quiz"></div>').firstChild;
          let i = 0, score = 0;
          const qs = QUIZ;
          const show = () => {
            // Shuffle the answers so the right one is not always in the same place
            const base = qs[i], order = shuffle([0, 1, 2]);
            const Q = Object.assign({}, base, { o: order.map(k => base.o[k]), c: order.indexOf(base.c) });
            box.innerHTML = `<div class="rev-top"><span>Question ${i + 1} of ${qs.length}</span>
                <div class="rev-bar"><div style="width:${i / qs.length * 100}%"></div></div>
                <span class="rev-score">⭐ ${score}</span></div>
              <div class="rev-body">
                <div class="rev-pic hot" title="Hear the question again"><svg viewBox="0 0 300 220" xmlns="${S.NS}">${Q.pic()}</svg></div>
                <div><div class="rev-q">${Q.q}</div>
                  <div class="rev-qopts">${Q.o.map((o, k) => `<button class="rev-opt" data-k="${k}">${'ABC'[k]}. ${o}</button>`).join('')}</div></div>
              </div>
              <div class="rev-expw"></div>`;
            box.querySelector('.rev-pic').classList.add('pop-in');
            api.say(`${Q.q} ${Q.o.map((o, k) => `${'ABC'[k]}: ${o}.`).join(' ')}`);
            box.querySelector('.rev-pic').addEventListener('click', () => { api.sfx('pop'); api.say(Q.q); });
            box.querySelectorAll('.rev-opt').forEach(b => b.addEventListener('click', () => {
              const k = +b.dataset.k, ok = k === Q.c;
              box.querySelectorAll('.rev-opt').forEach(x => { x.disabled = true; });
              box.querySelector(`.rev-opt[data-k="${Q.c}"]`).classList.add('right');
              if (ok) {
                score++;
                api.sfx('success');
                const r = b.getBoundingClientRect();
                W.confetti({ x: r.left + r.width / 2, y: r.top, n: 25 });
              } else {
                b.classList.add('wrong');
                api.sfx('oops');
              }
              box.querySelector('.rev-score').textContent = `⭐ ${score}`;
              box.querySelector('.rev-bar div').style.width = `${(i + 1) / qs.length * 100}%`;
              const last = i === qs.length - 1;
              box.querySelector('.rev-expw').innerHTML = `<div class="rev-exp ${ok ? '' : 'no'}"><span style="font-size:28px">${ok ? '✅' : '💡'}</span>
                <p>${ok ? 'Correct! ' : `The answer is ${'ABC'[Q.c]}. `}${Q.e}</p>
                <button class="btn primary rev-next">${last ? '🏁 Finish' : 'Next ▶'}</button></div>`;
              api.say((ok ? 'Correct! ' : 'Not quite. ') + Q.e);
              box.querySelector('.rev-next').addEventListener('click', () => {
                api.sfx('page');
                i++;
                if (i < qs.length) show(); else finish();
              });
            }));
          };
          const finish = () => {
            const best = Math.max(score, App.saved.quizScore || 0);
            App.saved.quizScore = best;
            App.saved.quizLast = score;
            App.save();
            const msg = score >= 10 ? 'Amazing! You are a real plant scientist!' : score >= 7 ? 'Great work! You know a lot about plants.' : 'Good try! Look back at the chapters and try again.';
            box.innerHTML = `<div class="rev-end">
              <div style="font-size:60px" class="pop-in">🏆</div>
              <div class="rev-big">${score} / ${qs.length}</div>
              <div style="font-size:30px;letter-spacing:2px">${'⭐'.repeat(Math.round(score / qs.length * 5))}${'☆'.repeat(5 - Math.round(score / qs.length * 5))}</div>
              <div class="rev-def">${msg}</div>
              ${best > score ? `<div style="font-weight:800;color:#6E665A">Your best score: ${best} / ${qs.length}</div>` : ''}
              <button class="btn rev-again">↺ Try the quiz again</button></div>`;
            api.sfx('fanfare');
            api.star();
            if (score >= 7) api.praise(`You scored ${score} out of ${qs.length}. ${msg}`);
            else { api.feedback('🌱 Good try!', 'info'); api.say(`You scored ${score} out of ${qs.length}. ${msg}`); }
            box.querySelector('.rev-again').addEventListener('click', () => { api.sfx('click'); i = 0; score = 0; show(); });
          };
          show();
        },
      },

      // ---------- c) Certificate ----------
      {
        title: 'Certificate',
        text: ['Well done! You have finished Growing Plants.'],
        ask: 'Click the gold seal to stamp your certificate. Then print it or save it as a picture.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const name = (api.name || '').trim() || 'Plant Scientist';
          const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
          let total = 0;
          App.chapters.forEach(c => c.steps.forEach(s => { if (s.activity) total++; }));
          const stars = () => Object.values(App.saved.stars || {}).filter(Boolean).length;
          const score = App.saved.quizScore;
          const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          const corner = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
            ${S.plant({ x: 0, y: 0, h: 120, leaves: 5, leafL: 26, leafW: 10, flower: 'daisy', flowerColor: '#F06292', flowerCenter: '#FFD23F', flowerR: 18, petals: 8, roots: false, seed: 2 })}
            ${S.plant({ x: 34, y: 0, h: 80, leaves: 4, leafL: 20, leafW: 8, flower: 'daisy', flowerColor: '#FFD23F', flowerCenter: '#E65100', flowerR: 13, petals: 10, roots: false, seed: 6 })}
            ${S.plant({ x: -26, y: 0, h: 60, leaves: 3, leafL: 18, leafW: 8, leafShape: 'round', roots: false, seed: 8 })}</g>`;
          // Zig-zag edge of the gold seal
          const sealD = [...Array(24)].map((_, k) => {
            const a = k * 15 * Math.PI / 180, r = k % 2 ? 46 : 40;
            return `${k ? 'L' : 'M'}${S.f1(Math.cos(a) * r)} ${S.f1(Math.sin(a) * r)}`;
          }).join(' ') + 'Z';
          const svg = api.svg(`
            <defs>
              <linearGradient id="rev-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#F9D976"/><stop offset=".5" stop-color="#E0A526"/><stop offset="1" stop-color="#F9D976"/>
              </linearGradient>
              <radialGradient id="rev-paper" cx=".5" cy=".45" r=".7">
                <stop offset="0" stop-color="#FFFEF6"/><stop offset="1" stop-color="#FBF0D2"/>
              </radialGradient>
              <radialGradient id="rev-seal" cx=".4" cy=".35" r=".7">
                <stop offset="0" stop-color="#FFE9A0"/><stop offset=".6" stop-color="#F2B92C"/><stop offset="1" stop-color="#C98A12"/>
              </radialGradient>
            </defs>
            <rect width="800" height="520" fill="#3E9B4F"/>
            <rect x="12" y="12" width="776" height="496" rx="18" fill="url(#rev-gold)"/>
            <rect x="26" y="26" width="748" height="468" rx="12" fill="url(#rev-paper)"/>
            <rect x="40" y="40" width="720" height="440" rx="8" fill="none" stroke="#C98A12" stroke-width="2" stroke-dasharray="3 6"/>
            ${corner(80, 470, false)}${corner(720, 470, true)}
            ${S.bee({ x: 690, y: 90, s: .8 })}${S.butterfly({ x: 110, y: 96, s: .55, color: '#4FC3F7' })}
            <text x="400" y="96" text-anchor="middle" font-size="46" font-weight="800" fill="#9A3222" font-family="${FONT}">Certificate</text>
            <text x="400" y="128" text-anchor="middle" font-size="20" font-weight="700" fill="#6E665A" font-family="${FONT}">This is to certify that</text>
            <text x="400" y="190" text-anchor="middle" font-size="${name.length > 16 ? 42 : 52}" font-weight="800" fill="#2A7439" font-family="${FONT}">${esc(name)}</text>
            <path d="M200 206 L600 206" stroke="#C98A12" stroke-width="2.5"/>
            <text x="400" y="240" text-anchor="middle" font-size="22" font-weight="700" fill="#2B2A28" font-family="${FONT}">has finished the topic</text>
            <text x="400" y="282" text-anchor="middle" font-size="36" font-weight="800" fill="#C8452F" font-family="${FONT}">Growing Plants</text>
            <g font-family="${FONT}" font-weight="800">
              <rect x="190" y="306" width="200" height="60" rx="14" fill="#E3F4DE" stroke="#3E9B4F" stroke-width="2"/>
              <text x="290" y="330" text-anchor="middle" font-size="16" fill="#2A7439">Quiz score</text>
              <text x="290" y="356" text-anchor="middle" font-size="22" fill="#2A7439">${score == null ? 'not tried yet' : `${score} / ${QUIZ.length}`}</text>
              <rect x="410" y="306" width="200" height="60" rx="14" fill="#FFF3C4" stroke="#E0A526" stroke-width="2"/>
              <text x="510" y="330" text-anchor="middle" font-size="16" fill="#9A6B00">Stars earned</text>
              <text x="510" y="356" text-anchor="middle" font-size="22" fill="#9A6B00"><tspan fill="#E0A526">★</tspan> <tspan id="rev-stars">${stars()}</tspan> of ${total}</text>
            </g>
            <text x="300" y="424" text-anchor="middle" font-size="18" font-weight="700" fill="#2B2A28" font-family="${FONT}">${date}</text>
            <path d="M220 432 L380 432" stroke="#6E665A" stroke-width="1.5"/>
            <text x="300" y="452" text-anchor="middle" font-size="16" font-weight="700" fill="#6E665A" font-family="${FONT}">date</text>
            <!-- seal -->
            <g id="rev-sealspot" class="hot" transform="translate(540 420)">
              <circle r="46" fill="#fff" fill-opacity=".6" stroke="#C98A12" stroke-width="3" stroke-dasharray="7 6" class="target-ring"/>
              <text id="rev-sealhint" y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#9A6B00" class="blink-hint">click me!</text>
              <g id="rev-sealg" opacity="0">
                <path d="M-22 30 L-34 78 L-16 68 L-6 84 L2 34Z M22 30 L34 78 L16 68 L6 84 L-2 34Z" fill="#C8452F"/>
                <path d="${sealD}" fill="url(#rev-seal)" stroke="#B07A10" stroke-width="2"/>
                <circle r="30" fill="none" stroke="#B07A10" stroke-width="2"/>
                <text y="-4" text-anchor="middle" font-size="24" fill="#8A5A00">★</text>
                <text y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#8A5A00" font-family="${FONT}" textLength="46" lengthAdjust="spacingAndGlyphs">WELL DONE</text>
              </g>
            </g>
          `);
          svg.classList.add('rev-cert');
          const spot = S.q(svg, '#rev-sealspot'), seal = S.q(svg, '#rev-sealg');
          let stamped = false;
          const stamp = async () => {
            if (stamped) return;
            stamped = true;
            spot.classList.remove('hot');
            S.q(spot, '.target-ring').remove();
            S.q(svg, '#rev-sealhint').remove();
            api.sfx('whoosh');
            seal.setAttribute('opacity', 1);
            await api.tween(500, k => seal.setAttribute('transform', `scale(${S.f1(2.4 - 1.4 * k)}) rotate(${S.f1(-30 * (1 - k))})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('thud');
            api.timeout(() => api.sfx('fanfare'), 200);
            api.star();
            S.q(svg, '#rev-stars').textContent = stars();
            const r = svg.getBoundingClientRect();
            W.confetti({ x: r.left + r.width / 2, y: r.top + r.height / 3, n: 90 });
            api.timeout(() => W.confetti({ x: r.left + r.width * .2, y: r.top + r.height / 2, n: 50 }), 500);
            api.timeout(() => W.confetti({ x: r.left + r.width * .8, y: r.top + r.height / 2, n: 50 }), 900);
            api.say(`Well done, ${name}! You have finished Growing Plants. You are a real plant scientist!`);
          };
          spot.addEventListener('click', stamp);
          api.button('🖨 Print', () => { window.print(); }, { cls: 'primary' });
          api.button('💾 Save as picture', () => {
            savePng(svg, `Growing-Plants-certificate-${name.replace(/[^\w-]+/g, '-')}.png`, 1600, api);
            api.sfx('shutter');
            api.info('Your certificate picture is saved.');
          }, { cls: 'primary', sound: null });
        },
      },
    ],
  });
})();
