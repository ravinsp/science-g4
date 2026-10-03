// Chapter 13: Review, quiz and certificate
(() => {
  const FONT = "'Baloo 2', 'Comic Sans MS', 'Segoe UI', sans-serif";
  const COLS = ['#3E9B4F', '#1E88E5', '#8E24AA', '#E65100', '#C62828', '#00897B', '#6D4C41', '#3949AB'];

  function injectStyle() {
    if (document.getElementById('l4-rev-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l4-rev-style">
      .l4-rev-gl { columns: 2; column-gap: 14px; }
      .l4-rev-sec { break-inside: avoid; background:#fff; border:2.5px solid #EADFCB; border-radius:14px; padding:6px 10px 8px; margin-bottom:10px; }
      .l4-rev-sec h4 { margin:0 0 6px; font-family: var(--font-head); font-size:17px; display:flex; align-items:center; gap:6px; }
      .l4-rev-words { display:flex; flex-wrap:wrap; gap:5px; }
      .l4-rev-word { border:0; border-radius:999px; padding:3px 12px; font-weight:800; font-size:15px; color:#fff; cursor:pointer; box-shadow: inset 0 -2px 0 rgba(0,0,0,.2); transition: transform .12s; }
      .l4-rev-word:hover { transform: translateY(-2px) scale(1.05); }
      .l4-rev-word.say { animation: l4-rev-say .6s; }
      @keyframes l4-rev-say { 50% { transform: scale(1.2); background:#FFC93C; color:#2B2A28; } }
      .l4-rev-head { text-align:center; font-weight:800; margin-bottom:8px; font-size:18px; }
      .l4-rev-over { position:absolute; inset:0; background:rgba(255,248,236,.97); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:20px; z-index:4; animation: fadein .3s; }
      .l4-rev-def { background:#fff; border:3px solid #3B3F6B; border-radius:8px 8px 22px 8px; padding:16px 22px; font-size:22px; font-weight:700; max-width:560px; text-align:center; box-shadow:4px 4px 0 rgba(59,63,107,.15); }
      .l4-rev-opts { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
      .l4-rev-opt { border:3px solid #EADFCB; background:#fff; border-radius:16px; padding:10px 22px; font-size:20px; font-weight:800; cursor:pointer; transition: all .15s; }
      .l4-rev-opt:hover { border-color:#3E9B4F; transform: translateY(-2px); }
      .l4-rev-opt.right { background:#3E9B4F; border-color:#3E9B4F; color:#fff; }
      .l4-rev-opt.wrong { background:#FBE0D2; border-color:#E8833A; animation: shake .4s; }
      .l4-rev-opt:disabled { cursor:default; transform:none; }
      .l4-rev-round { font-weight:800; color:#6E665A; }
      .l4-rev-dots { display:flex; gap:6px; }
      .l4-rev-dots span { width:16px; height:16px; border-radius:50%; background:#EADFCB; }
      .l4-rev-dots span.ok { background:#3E9B4F; } .l4-rev-dots span.no { background:#E8833A; }
      /* quiz */
      .l4-rev-quiz { display:flex; flex-direction:column; gap:10px; height:100%; }
      .l4-rev-top { display:flex; align-items:center; gap:12px; font-weight:800; }
      .l4-rev-bar { flex:1; height:14px; border-radius:99px; background:#EADFCB; overflow:hidden; }
      .l4-rev-bar div { height:100%; width:0; background:linear-gradient(90deg,#3E9B4F,#8BC34A); border-radius:99px; transition: width .5s; }
      .l4-rev-score { background:#FFE56B; border-radius:99px; padding:2px 12px; }
      .l4-rev-body { display:grid; grid-template-columns: 42% 1fr; gap:14px; align-items:center; flex:1; min-height:0; }
      .l4-rev-pic svg { width:100%; display:block; border-radius:16px; }
      .l4-rev-q { font-size:21px; font-weight:800; margin-bottom:10px; line-height:1.3; }
      .l4-rev-qopts { display:flex; flex-direction:column; gap:8px; }
      .l4-rev-qopts .l4-rev-opt { font-size:17px; padding:8px 14px; text-align:left; }
      .l4-rev-exp { background:#E3F4DE; border:2.5px solid #3E9B4F; border-radius:14px; padding:8px 14px; font-weight:700; display:flex; align-items:center; gap:12px; animation: fadein .4s; }
      .l4-rev-exp.no { background:#FDEBE1; border-color:#E07A4F; }
      .l4-rev-exp p { margin:0; flex:1; }
      .l4-rev-end { text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; height:100%; }
      .l4-rev-big { font-family: var(--font-head); font-size:54px; font-weight:800; color:#9A3222; line-height:1; }
      @media print {
        body * { visibility: hidden !important; }
        #stage .l4-rev-cert, #stage .l4-rev-cert * { visibility: visible !important; }
        #stage .l4-rev-cert { position: fixed; left: 0; top: 0; width: 100vw !important; height: auto !important; }
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
  const bg = c => `<rect width="300" height="220" fill="${c}"/>`;
  const QUIZ = [
    {
      q: 'Which of these is a solid?',
      o: ['A brick', 'Milk', 'Air'],
      c: 0, e: 'A brick is a solid. It has a fixed shape and keeps its shape.',
      pic: () => `${bg('#FDF8EF')}<g transform="translate(150 110) scale(1.2)"><path d="M-90 -14 L-60 -44 L96 -44 L66 -14Z" fill="#D9603B" stroke="#8D2F17" stroke-width="2"/>
        <path d="M66 -14 L96 -44 L96 20 L66 50Z" fill="#A8401F" stroke="#8D2F17" stroke-width="2"/><rect x="-90" y="-14" width="156" height="64" fill="#C9502C" stroke="#8D2F17" stroke-width="2"/></g>`,
    },
    {
      q: 'What happens when you pour a liquid into a different container?',
      o: ['It keeps its old shape', 'It takes the shape of the new container', 'It turns into a gas'],
      c: 1, e: 'Liquids change their shape. They take the shape of their containers.',
      pic: () => `${bg('#FFF6EC')}${L4.glass({ x: 90, y: 200, w: 80, h: 150, level: .7, liquid: '#FF9800' })}${L4.glass({ x: 220, y: 200, w: 130, h: 80, level: .75, liquid: '#FF9800' })}`,
    },
    {
      q: 'Which one can be compressed easily?',
      o: ['A solid', 'A liquid', 'A gas'],
      c: 2, e: 'A gas can be compressed. Solids cannot be compressed, and liquids cannot be compressed easily.',
      pic: () => `${bg('#F5F5F5')}<ellipse cx="150" cy="150" rx="120" ry="50" fill="#FF7043" stroke="#D84315" stroke-width="3"/>
        <path d="M60 96 Q150 70 250 92 L250 110 L60 110Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3"/>`,
    },
    {
      q: 'What are the bubbles in a fizzy drink full of?',
      o: ['Sand', 'Gas', 'Juice'],
      c: 1, e: 'Fizzy liquids have bubbles of gas in them.',
      pic: () => `${bg('#EAF6FF')}${L4.glass({ x: 150, y: 210, w: 120, h: 180, level: .8, liquid: '#FFB74D' })}
        ${[[120, 150], [160, 120], [140, 90], [180, 170], [130, 60]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${5 + i % 3 * 2}" fill="#fff" opacity=".85"/>`).join('')}`,
    },
    {
      q: 'Why is sand not a liquid?',
      o: ['It is made of tiny solid grains', 'It is wet', 'It is hot'],
      c: 0, e: 'Each grain of sand is a tiny solid. Sand makes a pile, but liquids make a pool.',
      pic: () => `${bg('#FFFDF5')}<path d="M40 200 Q150 60 260 200Z" fill="#D9A55B" stroke="#A0702E" stroke-width="3"/>
        ${[...Array(40)].map((_, i) => `<circle cx="${70 + (i * 37) % 160}" cy="${150 + (i * 23) % 45}" r="2.5" fill="#A0702E"/>`).join('')}`,
    },
    {
      q: 'What does viscous mean?',
      o: ['Very cold', 'Thick, so it flows slowly', 'Full of bubbles'],
      c: 1, e: 'Viscous liquids, like honey and syrup, are thick and flow very slowly.',
      pic: () => `${bg('#FFF8E7')}<path d="M110 40 L250 -10" stroke="#C47A3D" stroke-width="14" stroke-linecap="round"/>
        <ellipse cx="110" cy="44" rx="34" ry="14" fill="#F2A922" stroke="#B5652B" stroke-width="3"/><path d="M108 56 Q104 120 110 190" stroke="#F2A922" stroke-width="7" fill="none"/>
        <ellipse cx="110" cy="196" rx="70" ry="12" fill="#F2A922"/>`,
    },
    {
      q: 'What do we use to measure temperature?',
      o: ['A ruler', 'A thermometer', 'A clock'],
      c: 1, e: 'We measure temperature using a thermometer.',
      pic: () => `${bg('#F3F7FB')}${L4.thermo({ x: 140, y: 50, h: 120, min: 0, max: 50, major: 10, minor: 5, value: 30, id: 'l4-rev-q7', font: 16 }).svg}`,
    },
    {
      q: 'What is the unit for measuring temperature?',
      o: ['Degrees Celsius (°C)', 'Centimetres (cm)', 'Kilograms (kg)'],
      c: 0, e: 'We measure temperature in degrees Celsius. We write it °C.',
      pic: () => `${bg('#F7F4FB')}<text x="150" y="150" text-anchor="middle" font-size="120" font-weight="800" fill="#4A2D8A">°C</text>`,
    },
    {
      q: 'What temperature does this thermometer show?',
      o: ['10 °C', '15 °C', '20 °C'],
      c: 1, e: 'The top of the red liquid is at 15, so it shows 15 °C.',
      pic: () => `${bg('#F3F7FB')}${L4.thermo({ x: 130, y: 44, h: 136, min: 0, max: 25, major: 5, minor: 1, value: 15, id: 'l4-rev-q9', font: 16 }).svg}`,
    },
    {
      q: 'What do we call it when ice changes into liquid water?',
      o: ['Freezing', 'Condensation', 'Melting'],
      c: 2, e: 'When ice melts it changes into liquid water. This change of state is melting.',
      pic: () => `${bg('#FFF8EC')}${L4.ice({ x: 80, y: 170, e: 80 })}${S.arrow(140, 140, 190, 140, { color: '#3B3F6B', w: 4 })}<path d="${L4.blob(240, 170, 50, 12, 3)}" fill="#81D4FA"/>`,
    },
    {
      q: 'Where do the drops of water on a cold can come from?',
      o: ['Water vapour in the air', 'Inside the can', 'The can is melting'],
      c: 0, e: 'Water vapour in the air changes to liquid water on the cold can. This is condensation.',
      pic: () => `${bg('#FFF3E0')}<rect x="110" y="40" width="80" height="150" rx="12" fill="#E53935" stroke="#8E1B1B" stroke-width="3"/>
        ${[...Array(24)].map((_, i) => `<ellipse cx="${118 + (i * 29) % 64}" cy="${52 + (i * 41) % 130}" rx="3" ry="4" fill="#fff" opacity=".9"/>`).join('')}`,
    },
    {
      q: 'At what temperature does water boil?',
      o: ['0 °C', '37 °C', '100 °C'],
      c: 2, e: 'Water boils at 100 °C. Ice melts and water freezes at 0 °C.',
      pic: () => `${bg('#F3F7FB')}${L4.beaker({ x: 150, y: 200, w: 140, h: 150, level: .6, liquid: '#4FC3F7' })}
        ${[...Array(8)].map((_, i) => `<circle cx="${95 + (i * 31) % 110}" cy="${190 - (i * 17) % 70}" r="${4 + i % 3}" fill="#fff"/>`).join('')}
        <path d="M120 40 q-10 -14 0 -28 M150 40 q-10 -14 0 -28 M180 40 q-10 -14 0 -28" stroke="#B0BEC5" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    },
  ];

  App.chapter({
    id: 'review',
    title: 'Review and quiz',
    icon: '🏆',
    group: 'Review',
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
          const wrap = api.html(`<div class="l4-rev-head">📚 ${allWords().length} key words from Solids, liquids and gases</div>
            <div class="l4-rev-gl">${secs.map((c, ci) => `<div class="l4-rev-sec"><h4><span>${c.icon || '🧊'}</span>${c.title}</h4><div class="l4-rev-words">
              ${c.keywords.map(k => `<button class="l4-rev-word" style="background:${COLS[ci % COLS.length]}" data-w="${k.w.replace(/"/g, '&quot;')}">${k.w}</button>`).join('')}</div></div>`).join('')}</div>`);
          wrap.querySelectorAll('.l4-rev-word').forEach(b => b.addEventListener('click', () => App.sayWord(b.dataset.w, b)));

          // Word match mini-game: 5 rounds, 3 choices each
          const game = () => {
            if (stage.querySelector('.l4-rev-over')) return;
            const words = allWords();
            if (words.length < 3) { api.info('There are not enough key words yet.'); return; }
            const rounds = shuffle(words).slice(0, 5);
            let r = 0, score = 0;
            const over = W.h('div', { class: 'l4-rev-over' });
            stage.append(over);
            const show = () => {
              const t = rounds[r];
              const others = shuffle(words.filter(w => w.w.toLowerCase() !== t.w.toLowerCase() && w.d !== t.d)).slice(0, 2);
              const opts = shuffle([t, ...others]);
              over.innerHTML = `<div class="l4-rev-round">🔀 Word match — round ${r + 1} of ${rounds.length}</div>
                <div class="l4-rev-dots">${rounds.map((_, i) => `<span class="${i < r ? (rounds[i]._ok ? 'ok' : 'no') : ''}"></span>`).join('')}</div>
                <div class="l4-rev-def">${t.d}</div>
                <div class="l4-rev-opts">${opts.map((o, i) => `<button class="l4-rev-opt" data-i="${i}">${o.w}</button>`).join('')}</div>
                <button class="btn small l4-rev-close">✖ Close</button>`;
              api.say(`Which word means: ${t.d}`);
              let tries = 0;
              over.querySelectorAll('.l4-rev-opt').forEach(b => b.addEventListener('click', () => {
                const o = opts[+b.dataset.i];
                if (o === t) {
                  b.classList.add('right');
                  over.querySelectorAll('.l4-rev-opt').forEach(x => x.disabled = true);
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
              over.querySelector('.l4-rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
            };
            const end = () => {
              over.innerHTML = `<div class="l4-rev-big">${score} / ${rounds.length}</div>
                <div class="l4-rev-dots">${rounds.map(t => `<span class="${t._ok ? 'ok' : 'no'}"></span>`).join('')}</div>
                <div class="l4-rev-def">You matched ${score} word${score === 1 ? '' : 's'} first time!</div>
                <div class="l4-rev-opts"><button class="btn primary l4-rev-again">🔀 Play again</button><button class="btn l4-rev-close">📚 Back to the words</button></div>`;
              api.star();
              api.praise(`You matched ${score} out of ${rounds.length} words first time.`);
              over.querySelector('.l4-rev-again').addEventListener('click', () => { api.sfx('click'); over.remove(); game(); });
              over.querySelector('.l4-rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
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
          const box = api.html('<div class="l4-rev-quiz"></div>').firstChild;
          let i = 0, score = 0;
          const qs = QUIZ;
          const show = () => {
            // Shuffle the answers so the right one is not always in the same place
            const base = qs[i], order = shuffle([0, 1, 2]);
            const Q = Object.assign({}, base, { o: order.map(k => base.o[k]), c: order.indexOf(base.c) });
            box.innerHTML = `<div class="l4-rev-top"><span>Question ${i + 1} of ${qs.length}</span>
                <div class="l4-rev-bar"><div style="width:${i / qs.length * 100}%"></div></div>
                <span class="l4-rev-score">⭐ ${score}</span></div>
              <div class="l4-rev-body">
                <div class="l4-rev-pic hot" title="Hear the question again"><svg viewBox="0 0 300 220" xmlns="${S.NS}">${Q.pic()}</svg></div>
                <div><div class="l4-rev-q">${Q.q}</div>
                  <div class="l4-rev-qopts">${Q.o.map((o, k) => `<button class="l4-rev-opt" data-k="${k}">${'ABC'[k]}. ${o}</button>`).join('')}</div></div>
              </div>
              <div class="l4-rev-expw"></div>`;
            box.querySelector('.l4-rev-pic').classList.add('pop-in');
            api.say(`${Q.q} ${Q.o.map((o, k) => `${'ABC'[k]}: ${o}.`).join(' ')}`);
            box.querySelector('.l4-rev-pic').addEventListener('click', () => { api.sfx('pop'); api.say(Q.q); });
            box.querySelectorAll('.l4-rev-opt').forEach(b => b.addEventListener('click', () => {
              const k = +b.dataset.k, ok = k === Q.c;
              box.querySelectorAll('.l4-rev-opt').forEach(x => { x.disabled = true; });
              box.querySelector(`.l4-rev-opt[data-k="${Q.c}"]`).classList.add('right');
              if (ok) {
                score++;
                api.sfx('success');
                const r = b.getBoundingClientRect();
                W.confetti({ x: r.left + r.width / 2, y: r.top, n: 25 });
              } else {
                b.classList.add('wrong');
                api.sfx('oops');
              }
              box.querySelector('.l4-rev-score').textContent = `⭐ ${score}`;
              box.querySelector('.l4-rev-bar div').style.width = `${(i + 1) / qs.length * 100}%`;
              const last = i === qs.length - 1;
              box.querySelector('.l4-rev-expw').innerHTML = `<div class="l4-rev-exp ${ok ? '' : 'no'}"><span style="font-size:28px">${ok ? '✅' : '💡'}</span>
                <p>${ok ? 'Correct! ' : `The answer is ${'ABC'[Q.c]}. `}${Q.e}</p>
                <button class="btn primary l4-rev-next">${last ? '🏁 Finish' : 'Next ▶'}</button></div>`;
              api.say((ok ? 'Correct! ' : 'Not quite. ') + Q.e);
              box.querySelector('.l4-rev-next').addEventListener('click', () => {
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
            const msg = score >= 10 ? 'Amazing! You are a real matter scientist!' : score >= 7 ? 'Great work! You know a lot about solids, liquids and gases.' : 'Good try! Look back at the chapters and try again.';
            box.innerHTML = `<div class="l4-rev-end">
              <div style="font-size:60px" class="pop-in">🏆</div>
              <div class="l4-rev-big">${score} / ${qs.length}</div>
              <div style="font-size:30px;letter-spacing:2px">${'⭐'.repeat(Math.round(score / qs.length * 5))}${'☆'.repeat(5 - Math.round(score / qs.length * 5))}</div>
              <div class="l4-rev-def">${msg}</div>
              ${best > score ? `<div style="font-weight:800;color:#6E665A">Your best score: ${best} / ${qs.length}</div>` : ''}
              <button class="btn l4-rev-again">↺ Try the quiz again</button></div>`;
            api.sfx('fanfare');
            api.star();
            if (score >= 7) api.praise(`You scored ${score} out of ${qs.length}. ${msg}`);
            else { api.feedback('🧊 Good try!', 'info'); api.say(`You scored ${score} out of ${qs.length}. ${msg}`); }
            box.querySelector('.l4-rev-again').addEventListener('click', () => { api.sfx('click'); i = 0; score = 0; show(); });
          };
          show();
        },
      },

      // ---------- c) Certificate ----------
      {
        title: 'Certificate',
        text: ['Well done! You have finished Solids, liquids and gases.'],
        ask: 'Click the gold seal to stamp your certificate. Then print it or save it as a picture.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const name = (api.name || '').trim() || 'Matter Scientist';
          const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
          let total = 0;
          App.chapters.forEach(c => c.steps.forEach(s => { if (s.activity) total++; }));
          const stars = () => Object.values(App.saved.stars || {}).filter(Boolean).length;
          const score = App.saved.quizScore;
          const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          // Solid, liquid and gas in the corners
          const corner = (x, y, flip) => `<g transform="translate(${x} ${y})">${flip
            ? L4.stateIcon('gas', 18, -4, 1.3) + L4.stateIcon('liquid', -26, 6, 1)
            : L4.ice({ x: -14, y: 26, e: 40, rot: -8 }) + L4.stateIcon('liquid', 30, 8, .9)}</g>`;
          // Zig-zag edge of the gold seal
          const sealD = [...Array(24)].map((_, k) => {
            const a = k * 15 * Math.PI / 180, r = k % 2 ? 46 : 40;
            return `${k ? 'L' : 'M'}${S.f1(Math.cos(a) * r)} ${S.f1(Math.sin(a) * r)}`;
          }).join(' ') + 'Z';
          const svg = api.svg(`
            <defs>
              <linearGradient id="l4-rev-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#F9D976"/><stop offset=".5" stop-color="#E0A526"/><stop offset="1" stop-color="#F9D976"/>
              </linearGradient>
              <radialGradient id="l4-rev-paper" cx=".5" cy=".45" r=".7">
                <stop offset="0" stop-color="#FFFEF6"/><stop offset="1" stop-color="#FBF0D2"/>
              </radialGradient>
              <radialGradient id="l4-rev-seal" cx=".4" cy=".35" r=".7">
                <stop offset="0" stop-color="#FFE9A0"/><stop offset=".6" stop-color="#F2B92C"/><stop offset="1" stop-color="#C98A12"/>
              </radialGradient>
            </defs>
            <rect width="800" height="520" fill="#1E88E5"/>
            <rect x="12" y="12" width="776" height="496" rx="18" fill="url(#l4-rev-gold)"/>
            <rect x="26" y="26" width="748" height="468" rx="12" fill="url(#l4-rev-paper)"/>
            <rect x="40" y="40" width="720" height="440" rx="8" fill="none" stroke="#C98A12" stroke-width="2" stroke-dasharray="3 6"/>
            ${corner(95, 440, false)}${corner(705, 440, true)}
            ${L4.thermo({ x: 96, y: 52, h: 66, min: 0, max: 50, major: 50, minor: 10, value: 35, id: 'l4-rev-cth', w: 12, face: false, unit: false, labels: false }).svg}
            <g transform="translate(690 92)">${L4.balloon({ x: 0, y: 0, rx: 26, ry: 32, color: '#FF7043', string: 30 })}</g>
            <text x="400" y="96" text-anchor="middle" font-size="46" font-weight="800" fill="#9A3222" font-family="${FONT}">Certificate</text>
            <text x="400" y="128" text-anchor="middle" font-size="20" font-weight="700" fill="#6E665A" font-family="${FONT}">This is to certify that</text>
            <text x="400" y="190" text-anchor="middle" font-size="${name.length > 16 ? 42 : 52}" font-weight="800" fill="#0D47A1" font-family="${FONT}">${esc(name)}</text>
            <path d="M200 206 L600 206" stroke="#C98A12" stroke-width="2.5"/>
            <text x="400" y="240" text-anchor="middle" font-size="22" font-weight="700" fill="#2B2A28" font-family="${FONT}">has finished the topic</text>
            <text x="400" y="282" text-anchor="middle" font-size="36" font-weight="800" fill="#C8452F" font-family="${FONT}">Solids, Liquids and Gases</text>
            <g font-family="${FONT}" font-weight="800">
              <rect x="190" y="306" width="200" height="60" rx="14" fill="#E3F4DE" stroke="#3E9B4F" stroke-width="2"/>
              <text x="290" y="330" text-anchor="middle" font-size="16" fill="#2A7439">Quiz score</text>
              <text x="290" y="356" text-anchor="middle" font-size="22" fill="#2A7439">${score == null ? 'not tried yet' : `${score} / ${QUIZ.length}`}</text>
              <rect x="410" y="306" width="200" height="60" rx="14" fill="#FFF3C4" stroke="#E0A526" stroke-width="2"/>
              <text x="510" y="330" text-anchor="middle" font-size="16" fill="#9A6B00">Stars earned</text>
              <text x="510" y="356" text-anchor="middle" font-size="22" fill="#9A6B00"><tspan fill="#E0A526">★</tspan> <tspan id="l4-rev-stars">${stars()}</tspan> of ${total}</text>
            </g>
            <text x="300" y="424" text-anchor="middle" font-size="18" font-weight="700" fill="#2B2A28" font-family="${FONT}">${date}</text>
            <path d="M220 432 L380 432" stroke="#6E665A" stroke-width="1.5"/>
            <text x="300" y="452" text-anchor="middle" font-size="16" font-weight="700" fill="#6E665A" font-family="${FONT}">date</text>
            <!-- seal -->
            <g id="l4-rev-sealspot" class="hot" transform="translate(540 420)">
              <circle r="46" fill="#fff" fill-opacity=".6" stroke="#C98A12" stroke-width="3" stroke-dasharray="7 6" class="target-ring"/>
              <text id="l4-rev-sealhint" y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#9A6B00" class="blink-hint">click me!</text>
              <g id="l4-rev-sealg" opacity="0">
                <path d="M-22 30 L-34 78 L-16 68 L-6 84 L2 34Z M22 30 L34 78 L16 68 L6 84 L-2 34Z" fill="#C8452F"/>
                <path d="${sealD}" fill="url(#l4-rev-seal)" stroke="#B07A10" stroke-width="2"/>
                <circle r="30" fill="none" stroke="#B07A10" stroke-width="2"/>
                <text y="-4" text-anchor="middle" font-size="24" fill="#8A5A00">★</text>
                <text y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#8A5A00" font-family="${FONT}" textLength="46" lengthAdjust="spacingAndGlyphs">WELL DONE</text>
              </g>
            </g>
          `);
          svg.classList.add('l4-rev-cert');
          const spot = S.q(svg, '#l4-rev-sealspot'), seal = S.q(svg, '#l4-rev-sealg');
          let stamped = false;
          const stamp = async () => {
            if (stamped) return;
            stamped = true;
            spot.classList.remove('hot');
            S.q(spot, '.target-ring').remove();
            S.q(svg, '#l4-rev-sealhint').remove();
            api.sfx('whoosh');
            seal.setAttribute('opacity', 1);
            await api.tween(500, k => seal.setAttribute('transform', `scale(${S.f1(2.4 - 1.4 * k)}) rotate(${S.f1(-30 * (1 - k))})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('thud');
            api.timeout(() => api.sfx('fanfare'), 200);
            api.star();
            S.q(svg, '#l4-rev-stars').textContent = stars();
            const r = svg.getBoundingClientRect();
            W.confetti({ x: r.left + r.width / 2, y: r.top + r.height / 3, n: 90 });
            api.timeout(() => W.confetti({ x: r.left + r.width * .2, y: r.top + r.height / 2, n: 50 }), 500);
            api.timeout(() => W.confetti({ x: r.left + r.width * .8, y: r.top + r.height / 2, n: 50 }), 900);
            api.say(`Well done, ${name}! You have finished Solids, liquids and gases. You know all about states of matter!`);
          };
          spot.addEventListener('click', stamp);
          api.button('🖨 Print', () => { window.print(); }, { cls: 'primary' });
          api.button('💾 Save as picture', () => {
            savePng(svg, `Solids-Liquids-and-Gases-certificate-${name.replace(/[^\w-]+/g, '-')}.png`, 1600, api);
            api.sfx('shutter');
            api.info('Your certificate picture is saved.');
          }, { cls: 'primary', sound: null });
        },
      },
    ],
  });
})();
