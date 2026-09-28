// Chapter 10: Review, quiz and certificate
(() => {
  const FONT = "'Baloo 2', 'Comic Sans MS', 'Segoe UI', sans-serif";
  const COLS = ['#3E9B4F', '#1E88E5', '#8E24AA', '#E65100', '#C62828', '#00897B', '#6D4C41', '#3949AB'];

  function injectStyle() {
    if (document.getElementById('l3-rev-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l3-rev-style">
      .l3-rev-gl { columns: 2; column-gap: 14px; }
      .l3-rev-sec { break-inside: avoid; background:#fff; border:2.5px solid #EADFCB; border-radius:14px; padding:6px 10px 8px; margin-bottom:10px; }
      .l3-rev-sec h4 { margin:0 0 6px; font-family: var(--font-head); font-size:17px; display:flex; align-items:center; gap:6px; }
      .l3-rev-words { display:flex; flex-wrap:wrap; gap:5px; }
      .l3-rev-word { border:0; border-radius:999px; padding:3px 12px; font-weight:800; font-size:15px; color:#fff; cursor:pointer; box-shadow: inset 0 -2px 0 rgba(0,0,0,.2); transition: transform .12s; }
      .l3-rev-word:hover { transform: translateY(-2px) scale(1.05); }
      .l3-rev-word.say { animation: l3-rev-say .6s; }
      @keyframes l3-rev-say { 50% { transform: scale(1.2); background:#FFC93C; color:#2B2A28; } }
      .l3-rev-head { text-align:center; font-weight:800; margin-bottom:8px; font-size:18px; }
      .l3-rev-over { position:absolute; inset:0; background:rgba(255,248,236,.97); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:20px; z-index:4; animation: fadein .3s; }
      .l3-rev-def { background:#fff; border:3px solid #3B3F6B; border-radius:8px 8px 22px 8px; padding:16px 22px; font-size:22px; font-weight:700; max-width:560px; text-align:center; box-shadow:4px 4px 0 rgba(59,63,107,.15); }
      .l3-rev-opts { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
      .l3-rev-opt { border:3px solid #EADFCB; background:#fff; border-radius:16px; padding:10px 22px; font-size:20px; font-weight:800; cursor:pointer; transition: all .15s; }
      .l3-rev-opt:hover { border-color:#3E9B4F; transform: translateY(-2px); }
      .l3-rev-opt.right { background:#3E9B4F; border-color:#3E9B4F; color:#fff; }
      .l3-rev-opt.wrong { background:#FBE0D2; border-color:#E8833A; animation: shake .4s; }
      .l3-rev-opt:disabled { cursor:default; transform:none; }
      .l3-rev-round { font-weight:800; color:#6E665A; }
      .l3-rev-dots { display:flex; gap:6px; }
      .l3-rev-dots span { width:16px; height:16px; border-radius:50%; background:#EADFCB; }
      .l3-rev-dots span.ok { background:#3E9B4F; } .l3-rev-dots span.no { background:#E8833A; }
      /* quiz */
      .l3-rev-quiz { display:flex; flex-direction:column; gap:10px; height:100%; }
      .l3-rev-top { display:flex; align-items:center; gap:12px; font-weight:800; }
      .l3-rev-bar { flex:1; height:14px; border-radius:99px; background:#EADFCB; overflow:hidden; }
      .l3-rev-bar div { height:100%; width:0; background:linear-gradient(90deg,#3E9B4F,#8BC34A); border-radius:99px; transition: width .5s; }
      .l3-rev-score { background:#FFE56B; border-radius:99px; padding:2px 12px; }
      .l3-rev-body { display:grid; grid-template-columns: 42% 1fr; gap:14px; align-items:center; flex:1; min-height:0; }
      .l3-rev-pic svg { width:100%; display:block; border-radius:16px; }
      .l3-rev-q { font-size:21px; font-weight:800; margin-bottom:10px; line-height:1.3; }
      .l3-rev-qopts { display:flex; flex-direction:column; gap:8px; }
      .l3-rev-qopts .l3-rev-opt { font-size:17px; padding:8px 14px; text-align:left; }
      .l3-rev-exp { background:#E3F4DE; border:2.5px solid #3E9B4F; border-radius:14px; padding:8px 14px; font-weight:700; display:flex; align-items:center; gap:12px; animation: fadein .4s; }
      .l3-rev-exp.no { background:#FDEBE1; border-color:#E07A4F; }
      .l3-rev-exp p { margin:0; flex:1; }
      .l3-rev-end { text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; height:100%; }
      .l3-rev-big { font-family: var(--font-head); font-size:54px; font-weight:800; color:#9A3222; line-height:1; }
      @media print {
        body * { visibility: hidden !important; }
        #stage .l3-rev-cert, #stage .l3-rev-cert * { visibility: visible !important; }
        #stage .l3-rev-cert { position: fixed; left: 0; top: 0; width: 100vw !important; height: auto !important; }
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
  const muscleIcon = (cx, cy, half, w) => L3.muscle(cx - half, cy, cx + half, cy, w, { tendon: 12 });
  const QUIZ = [
    {
      q: 'What do we call all the bones inside our body?',
      o: ['Our skeleton', 'Our muscles', 'Our organs'],
      c: 0, e: 'All the bones inside our body make our skeleton. It supports our body and keeps it in shape.',
      pic: () => `${bg('#F3EEFA')}${L3.skeleton({ x: 150, y: 8, s: .48 })}`,
    },
    {
      q: 'Which bones protect your heart and lungs?',
      o: ['The skull', 'The rib cage', 'The knee cap'],
      c: 1, e: 'The rib cage goes all round your heart and lungs. It protects them from damage.',
      pic: () => `${bg('#EEF7FB')}<g transform="translate(150 -250) scale(2.3)">${L3.lungs({ x: 0, y: 128, s: .9 })}${L3.heart({ x: 8, y: 138, s: .65 })}
        ${[30, 36, 40, 42, 42, 40, 35].map((w, i) => { const y0 = 92 + i * 10; const d = `M-5 ${y0} C-16 ${y0 - 8} ${-(w + 4)} ${y0 - 4} ${-w} ${y0 + 12} C${-(w - 2)} ${y0 + 18} ${-(w - 6)} ${y0 + 22} ${-(w - 10)} ${y0 + 24}`;
          return [1, -1].map(m => `<path transform="scale(${m} 1)" d="${d}" stroke="#A89878" stroke-width="5" fill="none" stroke-linecap="round"/><path transform="scale(${m} 1)" d="${d}" stroke="#F7EFDD" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join(''); }).join('')}
        <rect x="-5" y="88" width="10" height="58" rx="4" fill="#F7EFDD" stroke="#A89878"/></g>`,
    },
    {
      q: 'What does the hard skull protect?',
      o: ['The soft brain', 'The lungs', 'The stomach'],
      c: 0, e: 'Your soft brain is inside your hard skull. The skull protects it from damage.',
      pic: () => `${bg('#FFF8EC')}<g transform="translate(150 118) scale(.7)">${L3.sideSkull()}<g transform="translate(18 -34) scale(2.6)">${L3.brain()}</g></g>`,
    },
    {
      q: 'What is a joint?',
      o: ['A kind of muscle', 'A bone in your ear', 'A place where bones meet'],
      c: 2, e: 'A joint is the place where bones meet. Joints let our bones change position so we can move.',
      pic: () => `${bg('#0E2A47')}<g transform="translate(110 150) scale(.9)">${L3.arm({ x: 0, y: -150, bend: 90, skin: false, scapula: false, biceps: false, xray: true })}</g>
        <circle cx="110" cy="150" r="30" fill="#FFB300" opacity=".45"/>`,
    },
    {
      q: 'Which joint moves like the hinge on a door?',
      o: ['The elbow', 'The shoulder', 'The skull'],
      c: 0, e: 'The elbow and the knee move like a hinge on a door, backwards and forwards.',
      pic: () => `${bg('#FFF3E0')}<rect x="30" y="20" width="110" height="190" fill="#5D4037"/><path d="M40 28 L110 40 L110 200 L40 210Z" fill="#E07A4F" stroke="#8D3B1F" stroke-width="3"/>
        <rect x="34" y="50" width="12" height="30" rx="2" fill="#B0BEC5" stroke="#607D8B"/><rect x="34" y="150" width="12" height="30" rx="2" fill="#B0BEC5" stroke="#607D8B"/>
        <g transform="translate(200 40) scale(.55)">${L3.arm({ x: 0, y: 0, bend: 100, skin: 'faint', biceps: false })}</g>`,
    },
    {
      q: 'Which joint lets your arm move round in a big circle?',
      o: ['The elbow', 'The knee', 'The shoulder'],
      c: 2, e: 'The shoulder joint gives your arm a bigger range of movement. You can draw a big circle.',
      pic: () => `${bg('#EAF4FB')}<circle cx="172" cy="78" r="64" fill="none" stroke="#7E57C2" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>
        ${L3.person({ x: 150, y: 30, s: .44, shirt: '#FFB300', arms: { r: [150, 0] } })}`,
    },
    {
      q: 'The skull bones join together and do not move. What kind of joint is this?',
      o: ['A fixed joint', 'A hinge joint', 'A shoulder joint'],
      c: 0, e: 'Some joints do not move. The joints between the skull bones are fixed joints.',
      pic: () => `${bg('#3A2412')}<ellipse cx="150" cy="120" rx="130" ry="100" fill="#E0AE63"/>
        <path d="${L3.squiggle(30, 110, 150, 86, 10, 7, 3)} ${L3.squiggle(150, 86, 272, 104, 10, 7, 5).replace('M', 'M ')}" stroke="#6B3E14" stroke-width="3" fill="none"/>
        <path d="${L3.squiggle(150, 86, 154, 220, 11, 7, 8)}" stroke="#6B3E14" stroke-width="3" fill="none"/>`,
    },
    {
      q: 'What is the tiny bone at the front of your knee?',
      o: ['The rib', 'The knee cap', 'The thumb'],
      c: 1, e: 'The knee cap is not part of the joint. It protects the knee joint.',
      pic: () => `${bg('#0E2A47')}${L3.bone(110, 0, 140, 110, 34, L3.XRAY)}${L3.bone(140, 124, 138, 230, 28, L3.XRAY)}${L3.bone(118, 130, 116, 230, 10, L3.XRAY)}
        <ellipse cx="170" cy="104" rx="11" ry="17" fill="#FFE082" stroke="#FFB300" stroke-width="3"/>`,
    },
    {
      q: 'What happens to a muscle when it contracts?',
      o: ['It gets longer and thinner', 'It gets shorter and fatter', 'It turns into bone'],
      c: 1, e: 'When a muscle contracts it becomes shorter and fatter. When it relaxes it goes back to how it started.',
      pic: () => `${bg('#FFF3F0')}${muscleIcon(150, 70, 110, 18)}${muscleIcon(150, 160, 70, 34)}
        ${S.text(150, 112, 'relaxed', { size: 16, fill: '#6E665A' })}${S.text(150, 212, 'contracted', { size: 16, fill: '#6E665A' })}`,
    },
    {
      q: 'Why do we need a pair of muscles to move most bones?',
      o: ['Bones are too heavy', 'Muscles only move bones when they contract', 'One muscle is always asleep'],
      c: 1, e: 'Muscles can only pull by contracting. The biceps bends the arm and the triceps straightens it.',
      pic: () => `${bg('#EEF7FB')}<g transform="translate(120 20) scale(.62)">${L3.arm({ x: 0, y: 0, bend: 110, triceps: true })}</g>`,
    },
    {
      q: 'Which of these is a dairy food that helps to build growing bones?',
      o: ['Cheese', 'An apple', 'Bread'],
      c: 0, e: 'Dairy food, like milk, cheese and yoghurt, helps to build growing bones.',
      pic: () => `${bg('#A1887F')}<path d="M40 170 L150 170 L150 126 L50 100 Z" fill="#FFD54F" stroke="#E0A526" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="90" cy="150" r="8" fill="#F2B92C"/><circle cx="125" cy="140" r="6" fill="#F2B92C"/>
        <path d="M194 60 L202 36 L238 36 L246 60 L246 180 L194 180Z" fill="#FAFAFA" stroke="#B0BEC5" stroke-width="3"/><rect x="206" y="22" width="28" height="16" rx="4" fill="#1E88E5"/>
        <rect x="198" y="100" width="44" height="28" rx="4" fill="#90CAF9"/>${S.text(220, 120, 'MILK', { size: 13, fill: '#0D47A1' })}`,
    },
    {
      q: 'How does exercising outdoors in sunlight help our bones?',
      o: ['It helps us absorb what our bones need from food', 'It makes our bones soft', 'It makes our bones shorter'],
      c: 0, e: 'Sunlight helps us to absorb the things our bones need from our food. It keeps bones strong.',
      pic: () => `${S.sky(300, 220)}<circle cx="60" cy="52" r="30" fill="#FFD43B"/><circle cx="60" cy="52" r="42" fill="#FFE56B" opacity=".4"/>
        <rect y="180" width="300" height="40" fill="#8BD17C"/>
        ${L3.sideBody({ hipF: 40, kneeF: 20, shF: -20, shB: 25 }, { style: 'body', x: 170, y: 104, s: .38, shirt: '#E53935', trousers: '#1A237E' }).svg}
        <circle cx="222" cy="170" r="10" fill="#fff" stroke="#333" stroke-width="2"/>`,
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
          const wrap = api.html(`<div class="l3-rev-head">📚 ${allWords().length} key words from Skeleton and Muscles</div>
            <div class="l3-rev-gl">${secs.map((c, ci) => `<div class="l3-rev-sec"><h4><span>${c.icon || '🦴'}</span>${c.title}</h4><div class="l3-rev-words">
              ${c.keywords.map(k => `<button class="l3-rev-word" style="background:${COLS[ci % COLS.length]}" data-w="${k.w.replace(/"/g, '&quot;')}">${k.w}</button>`).join('')}</div></div>`).join('')}</div>`);
          wrap.querySelectorAll('.l3-rev-word').forEach(b => b.addEventListener('click', () => App.sayWord(b.dataset.w, b)));

          // Word match mini-game: 5 rounds, 3 choices each
          const game = () => {
            if (stage.querySelector('.l3-rev-over')) return;
            const words = allWords();
            if (words.length < 3) { api.info('There are not enough key words yet.'); return; }
            const rounds = shuffle(words).slice(0, 5);
            let r = 0, score = 0;
            const over = W.h('div', { class: 'l3-rev-over' });
            stage.append(over);
            const show = () => {
              const t = rounds[r];
              const others = shuffle(words.filter(w => w.w.toLowerCase() !== t.w.toLowerCase() && w.d !== t.d)).slice(0, 2);
              const opts = shuffle([t, ...others]);
              over.innerHTML = `<div class="l3-rev-round">🔀 Word match — round ${r + 1} of ${rounds.length}</div>
                <div class="l3-rev-dots">${rounds.map((_, i) => `<span class="${i < r ? (rounds[i]._ok ? 'ok' : 'no') : ''}"></span>`).join('')}</div>
                <div class="l3-rev-def">${t.d}</div>
                <div class="l3-rev-opts">${opts.map((o, i) => `<button class="l3-rev-opt" data-i="${i}">${o.w}</button>`).join('')}</div>
                <button class="btn small l3-rev-close">✖ Close</button>`;
              api.say(`Which word means: ${t.d}`);
              let tries = 0;
              over.querySelectorAll('.l3-rev-opt').forEach(b => b.addEventListener('click', () => {
                const o = opts[+b.dataset.i];
                if (o === t) {
                  b.classList.add('right');
                  over.querySelectorAll('.l3-rev-opt').forEach(x => x.disabled = true);
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
              over.querySelector('.l3-rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
            };
            const end = () => {
              over.innerHTML = `<div class="l3-rev-big">${score} / ${rounds.length}</div>
                <div class="l3-rev-dots">${rounds.map(t => `<span class="${t._ok ? 'ok' : 'no'}"></span>`).join('')}</div>
                <div class="l3-rev-def">You matched ${score} word${score === 1 ? '' : 's'} first time!</div>
                <div class="l3-rev-opts"><button class="btn primary l3-rev-again">🔀 Play again</button><button class="btn l3-rev-close">📚 Back to the words</button></div>`;
              api.star();
              api.praise(`You matched ${score} out of ${rounds.length} words first time.`);
              over.querySelector('.l3-rev-again').addEventListener('click', () => { api.sfx('click'); over.remove(); game(); });
              over.querySelector('.l3-rev-close').addEventListener('click', () => { api.sfx('click'); over.remove(); });
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
          const box = api.html('<div class="l3-rev-quiz"></div>').firstChild;
          let i = 0, score = 0;
          const qs = QUIZ;
          const show = () => {
            // Shuffle the answers so the right one is not always in the same place
            const base = qs[i], order = shuffle([0, 1, 2]);
            const Q = Object.assign({}, base, { o: order.map(k => base.o[k]), c: order.indexOf(base.c) });
            box.innerHTML = `<div class="l3-rev-top"><span>Question ${i + 1} of ${qs.length}</span>
                <div class="l3-rev-bar"><div style="width:${i / qs.length * 100}%"></div></div>
                <span class="l3-rev-score">⭐ ${score}</span></div>
              <div class="l3-rev-body">
                <div class="l3-rev-pic hot" title="Hear the question again"><svg viewBox="0 0 300 220" xmlns="${S.NS}">${Q.pic()}</svg></div>
                <div><div class="l3-rev-q">${Q.q}</div>
                  <div class="l3-rev-qopts">${Q.o.map((o, k) => `<button class="l3-rev-opt" data-k="${k}">${'ABC'[k]}. ${o}</button>`).join('')}</div></div>
              </div>
              <div class="l3-rev-expw"></div>`;
            box.querySelector('.l3-rev-pic').classList.add('pop-in');
            api.say(`${Q.q} ${Q.o.map((o, k) => `${'ABC'[k]}: ${o}.`).join(' ')}`);
            box.querySelector('.l3-rev-pic').addEventListener('click', () => { api.sfx('pop'); api.say(Q.q); });
            box.querySelectorAll('.l3-rev-opt').forEach(b => b.addEventListener('click', () => {
              const k = +b.dataset.k, ok = k === Q.c;
              box.querySelectorAll('.l3-rev-opt').forEach(x => { x.disabled = true; });
              box.querySelector(`.l3-rev-opt[data-k="${Q.c}"]`).classList.add('right');
              if (ok) {
                score++;
                api.sfx('success');
                const r = b.getBoundingClientRect();
                W.confetti({ x: r.left + r.width / 2, y: r.top, n: 25 });
              } else {
                b.classList.add('wrong');
                api.sfx('oops');
              }
              box.querySelector('.l3-rev-score').textContent = `⭐ ${score}`;
              box.querySelector('.l3-rev-bar div').style.width = `${(i + 1) / qs.length * 100}%`;
              const last = i === qs.length - 1;
              box.querySelector('.l3-rev-expw').innerHTML = `<div class="l3-rev-exp ${ok ? '' : 'no'}"><span style="font-size:28px">${ok ? '✅' : '💡'}</span>
                <p>${ok ? 'Correct! ' : `The answer is ${'ABC'[Q.c]}. `}${Q.e}</p>
                <button class="btn primary l3-rev-next">${last ? '🏁 Finish' : 'Next ▶'}</button></div>`;
              api.say((ok ? 'Correct! ' : 'Not quite. ') + Q.e);
              box.querySelector('.l3-rev-next').addEventListener('click', () => {
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
            const msg = score >= 10 ? 'Amazing! You are a real body scientist!' : score >= 7 ? 'Great work! You know a lot about bones and muscles.' : 'Good try! Look back at the chapters and try again.';
            box.innerHTML = `<div class="l3-rev-end">
              <div style="font-size:60px" class="pop-in">🏆</div>
              <div class="l3-rev-big">${score} / ${qs.length}</div>
              <div style="font-size:30px;letter-spacing:2px">${'⭐'.repeat(Math.round(score / qs.length * 5))}${'☆'.repeat(5 - Math.round(score / qs.length * 5))}</div>
              <div class="l3-rev-def">${msg}</div>
              ${best > score ? `<div style="font-weight:800;color:#6E665A">Your best score: ${best} / ${qs.length}</div>` : ''}
              <button class="btn l3-rev-again">↺ Try the quiz again</button></div>`;
            api.sfx('fanfare');
            api.star();
            if (score >= 7) api.praise(`You scored ${score} out of ${qs.length}. ${msg}`);
            else { api.feedback('🦴 Good try!', 'info'); api.say(`You scored ${score} out of ${qs.length}. ${msg}`); }
            box.querySelector('.l3-rev-again').addEventListener('click', () => { api.sfx('click'); i = 0; score = 0; show(); });
          };
          show();
        },
      },

      // ---------- c) Certificate ----------
      {
        title: 'Certificate',
        text: ['Well done! You have finished Skeleton and Muscles.'],
        ask: 'Click the gold seal to stamp your certificate. Then print it or save it as a picture.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const name = (api.name || '').trim() || 'Body Scientist';
          const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
          let total = 0;
          App.chapters.forEach(c => c.steps.forEach(s => { if (s.activity) total++; }));
          const stars = () => Object.values(App.saved.stars || {}).filter(Boolean).length;
          const score = App.saved.quizScore;
          const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          // Crossed bones in each corner
          const corner = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
            ${L3.bone(-30, -30, 30, 30, 14)}${L3.bone(-30, 30, 30, -30, 14)}</g>`;
          // Zig-zag edge of the gold seal
          const sealD = [...Array(24)].map((_, k) => {
            const a = k * 15 * Math.PI / 180, r = k % 2 ? 46 : 40;
            return `${k ? 'L' : 'M'}${S.f1(Math.cos(a) * r)} ${S.f1(Math.sin(a) * r)}`;
          }).join(' ') + 'Z';
          const svg = api.svg(`
            <defs>
              <linearGradient id="l3-rev-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#F9D976"/><stop offset=".5" stop-color="#E0A526"/><stop offset="1" stop-color="#F9D976"/>
              </linearGradient>
              <radialGradient id="l3-rev-paper" cx=".5" cy=".45" r=".7">
                <stop offset="0" stop-color="#FFFEF6"/><stop offset="1" stop-color="#FBF0D2"/>
              </radialGradient>
              <radialGradient id="l3-rev-seal" cx=".4" cy=".35" r=".7">
                <stop offset="0" stop-color="#FFE9A0"/><stop offset=".6" stop-color="#F2B92C"/><stop offset="1" stop-color="#C98A12"/>
              </radialGradient>
            </defs>
            <rect width="800" height="520" fill="#7E57C2"/>
            <rect x="12" y="12" width="776" height="496" rx="18" fill="url(#l3-rev-gold)"/>
            <rect x="26" y="26" width="748" height="468" rx="12" fill="url(#l3-rev-paper)"/>
            <rect x="40" y="40" width="720" height="440" rx="8" fill="none" stroke="#C98A12" stroke-width="2" stroke-dasharray="3 6"/>
            ${corner(95, 440, false)}${corner(705, 440, true)}
            <g transform="translate(690 88)">${L3.heart({ s: 1.1 })}</g><g transform="translate(110 92)">${L3.brain({ s: .9 })}</g>
            <text x="400" y="96" text-anchor="middle" font-size="46" font-weight="800" fill="#9A3222" font-family="${FONT}">Certificate</text>
            <text x="400" y="128" text-anchor="middle" font-size="20" font-weight="700" fill="#6E665A" font-family="${FONT}">This is to certify that</text>
            <text x="400" y="190" text-anchor="middle" font-size="${name.length > 16 ? 42 : 52}" font-weight="800" fill="#4A2D8A" font-family="${FONT}">${esc(name)}</text>
            <path d="M200 206 L600 206" stroke="#C98A12" stroke-width="2.5"/>
            <text x="400" y="240" text-anchor="middle" font-size="22" font-weight="700" fill="#2B2A28" font-family="${FONT}">has finished the topic</text>
            <text x="400" y="282" text-anchor="middle" font-size="36" font-weight="800" fill="#C8452F" font-family="${FONT}">Skeleton and Muscles</text>
            <g font-family="${FONT}" font-weight="800">
              <rect x="190" y="306" width="200" height="60" rx="14" fill="#E3F4DE" stroke="#3E9B4F" stroke-width="2"/>
              <text x="290" y="330" text-anchor="middle" font-size="16" fill="#2A7439">Quiz score</text>
              <text x="290" y="356" text-anchor="middle" font-size="22" fill="#2A7439">${score == null ? 'not tried yet' : `${score} / ${QUIZ.length}`}</text>
              <rect x="410" y="306" width="200" height="60" rx="14" fill="#FFF3C4" stroke="#E0A526" stroke-width="2"/>
              <text x="510" y="330" text-anchor="middle" font-size="16" fill="#9A6B00">Stars earned</text>
              <text x="510" y="356" text-anchor="middle" font-size="22" fill="#9A6B00"><tspan fill="#E0A526">★</tspan> <tspan id="l3-rev-stars">${stars()}</tspan> of ${total}</text>
            </g>
            <text x="300" y="424" text-anchor="middle" font-size="18" font-weight="700" fill="#2B2A28" font-family="${FONT}">${date}</text>
            <path d="M220 432 L380 432" stroke="#6E665A" stroke-width="1.5"/>
            <text x="300" y="452" text-anchor="middle" font-size="16" font-weight="700" fill="#6E665A" font-family="${FONT}">date</text>
            <!-- seal -->
            <g id="l3-rev-sealspot" class="hot" transform="translate(540 420)">
              <circle r="46" fill="#fff" fill-opacity=".6" stroke="#C98A12" stroke-width="3" stroke-dasharray="7 6" class="target-ring"/>
              <text id="l3-rev-sealhint" y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#9A6B00" class="blink-hint">click me!</text>
              <g id="l3-rev-sealg" opacity="0">
                <path d="M-22 30 L-34 78 L-16 68 L-6 84 L2 34Z M22 30 L34 78 L16 68 L6 84 L-2 34Z" fill="#C8452F"/>
                <path d="${sealD}" fill="url(#l3-rev-seal)" stroke="#B07A10" stroke-width="2"/>
                <circle r="30" fill="none" stroke="#B07A10" stroke-width="2"/>
                <text y="-4" text-anchor="middle" font-size="24" fill="#8A5A00">★</text>
                <text y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#8A5A00" font-family="${FONT}" textLength="46" lengthAdjust="spacingAndGlyphs">WELL DONE</text>
              </g>
            </g>
          `);
          svg.classList.add('l3-rev-cert');
          const spot = S.q(svg, '#l3-rev-sealspot'), seal = S.q(svg, '#l3-rev-sealg');
          let stamped = false;
          const stamp = async () => {
            if (stamped) return;
            stamped = true;
            spot.classList.remove('hot');
            S.q(spot, '.target-ring').remove();
            S.q(svg, '#l3-rev-sealhint').remove();
            api.sfx('whoosh');
            seal.setAttribute('opacity', 1);
            await api.tween(500, k => seal.setAttribute('transform', `scale(${S.f1(2.4 - 1.4 * k)}) rotate(${S.f1(-30 * (1 - k))})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('thud');
            api.timeout(() => api.sfx('fanfare'), 200);
            api.star();
            S.q(svg, '#l3-rev-stars').textContent = stars();
            const r = svg.getBoundingClientRect();
            W.confetti({ x: r.left + r.width / 2, y: r.top + r.height / 3, n: 90 });
            api.timeout(() => W.confetti({ x: r.left + r.width * .2, y: r.top + r.height / 2, n: 50 }), 500);
            api.timeout(() => W.confetti({ x: r.left + r.width * .8, y: r.top + r.height / 2, n: 50 }), 900);
            api.say(`Well done, ${name}! You have finished Skeleton and Muscles. You know all about your skeleton and muscles!`);
          };
          spot.addEventListener('click', stamp);
          api.button('🖨 Print', () => { window.print(); }, { cls: 'primary' });
          api.button('💾 Save as picture', () => {
            savePng(svg, `Skeleton-and-Muscles-certificate-${name.replace(/[^\w-]+/g, '-')}.png`, 1600, api);
            api.sfx('shutter');
            api.info('Your certificate picture is saved.');
          }, { cls: 'primary', sound: null });
        },
      },
    ],
  });
})();
