// Chapter 5: Elbows and knees
(() => {
  const { XRAY, bone } = L3;

  // Curved red arrow around (cx,cy) from angle a1 to a2 (degrees, 0 = right, clockwise)
  function arcArrow(cx, cy, r, a1, a2, color = '#E53935') {
    const P = a => ({ x: cx + Math.cos(a * Math.PI / 180) * r, y: cy + Math.sin(a * Math.PI / 180) * r });
    const p1 = P(a1), p2 = P(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 1 : 0;
    const t = P(a2 + (a2 > a1 ? -8 : 8));
    return `<path d="M${S.f1(p1.x)} ${S.f1(p1.y)} A${r} ${r} 0 ${large} ${sweep} ${S.f1(t.x)} ${S.f1(t.y)}" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${S.arrow(t.x, t.y, p2.x, p2.y, { color, w: 8, head: 20 })}`;
  }

  // Side view of a leg in X-ray colours. Knee at (kx,ky); bend swings the lower leg backwards (left).
  function kneeXray(kx, ky, bend, c = XRAY) {
    const a = bend * Math.PI / 180;
    const d = { x: -Math.sin(a), y: Math.cos(a) }, n = { x: Math.cos(a), y: Math.sin(a) };
    const F0 = { x: kx - 60, y: ky - 260 };
    const T1 = { x: kx + d.x * 250, y: ky + d.y * 250 };
    const cap = { x: kx + 34 + Math.sin(a) * 10, y: ky - 16 + bend * .25 };
    return `${bone(F0.x, F0.y, kx, ky - 14, 46, c, 'l3-elb-femur')}
      <g class="l3-elb-fib">${bone(kx - n.x * 20 + d.x * 30, ky - n.y * 20 + d.y * 30, T1.x - n.x * 18, T1.y - n.y * 18, 14, c)}</g>
      ${bone(kx + n.x * 6 + d.x * 16, ky + n.y * 6 + d.y * 16, T1.x + n.x * 6, T1.y + n.y * 6, 36, c, 'l3-elb-tibia')}
      <ellipse class="l3-elb-cap" cx="${S.f1(cap.x)}" cy="${S.f1(cap.y)}" rx="13" ry="20" fill="${c.fill}" stroke="${c.edge}" stroke-width="3" transform="rotate(${S.f1(-10 + bend * .3)} ${S.f1(cap.x)} ${S.f1(cap.y)})"/>`;
  }

  App.chapter({
    id: 'elbows',
    title: 'Elbows and knees',
    icon: '💪',
    group: 'Joints',
    keywords: [
      { w: 'straight', d: 'Not bent or curved at all.' },
      { w: 'range of movement', d: 'How far a joint lets part of your body move.' },
      { w: 'knee cap', d: 'The small, flat bone at the front of your knee.' },
      { w: 'hinge', d: 'A joint that lets a door swing open and shut one way.' },
    ],
    steps: [
      // ---------- a) Three bones at the elbow ----------
      {
        text: ['A joint is the place where bones meet.', 'These are the bones in the arm at the elbow joint.'],
        ask: 'Can you feel these three bones in your arm? Click each bone to count it.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            ${L3.lens('l3-elb1-lens', 330, 260, 240, `<g transform="translate(290 290) scale(2.1)">${L3.arm({ x: 0, y: -150, bend: 90, skin: false, scapula: false, biceps: false, xray: true })}</g>`, '#2BA3B8')}
            <g id="l3-elb1-arrow" opacity="0">${arcArrow(290, 290, 190, -80, -12)}</g>
            <g id="l3-elb1-tags"></g>
            <g transform="translate(700 70)"><circle r="46" fill="#7E57C2"/>${S.text(0, -2, '0', { size: 34, fill: '#fff' }).replace('>0<', ' id="l3-elb1-n">0<')}${S.text(0, 24, 'bones', { size: 16, fill: '#fff' })}</g>`);
          const names = { humerus: 'upper arm bone', ulna: 'lower arm bone', radius: 'lower arm bone' };
          // Label position, then the point on the bone it points to
          const tagAt = { humerus: [680, 120, 300, 150], radius: [680, 200, 530, 264], ulna: [680, 360, 530, 292] };
          const found = new Set();
          ['humerus', 'ulna', 'radius'].forEach(id => {
            const g = S.q(svg, `.l3-arm-${id}`);
            g.classList.add('hot');
            g.addEventListener('click', () => {
              if (found.has(id)) return;
              found.add(id);
              S.qa(g, 'line, circle').forEach(n => { if (n.getAttribute('fill') === XRAY.fill) n.setAttribute('fill', '#FFE082'); if (n.getAttribute('stroke') === XRAY.fill) n.setAttribute('stroke', '#FFE082'); });
              api.sfx('pop');
              S.q(svg, '#l3-elb1-n').textContent = found.size;
              const [x, y, bx, by] = tagAt[id];
              S.q(svg, '#l3-elb1-tags').insertAdjacentHTML('beforeend', `<g class="fade-in"><path d="M${x - 80} ${y} L${bx} ${by}" stroke="#7E57C2" stroke-width="3"/><circle cx="${bx}" cy="${by}" r="5" fill="#7E57C2"/>${L3.pill(x, y, names[id], { size: 17 })}</g>`);
              if (found.size < 3) api.say(id === 'humerus' ? 'This is the bone in the top of your arm.' : 'This is one of the two bones in the lower arm.');
              else {
                S.q(svg, '#l3-elb1-arrow').setAttribute('opacity', 1);
                api.star();
                api.praise('Three bones meet at the elbow joint: one in the top of your arm and two in the lower arm.');
              }
            });
          });
        },
      },

      // ---------- b) Move the elbow ----------
      {
        ask: [
          'Hold the top of your arm close to your body. Now move your hand up and down.',
          'How does your elbow move? Can you touch your shoulder? Can you make your arm **straight** when you move it down again?',
        ],
        activity: true,
        scene(stage, api) {
          const SX = 330, SY = 150;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            <path d="M250 520 L250 170 Q250 120 300 118 L360 118 Q400 120 400 170 L400 520Z" fill="#29B6F6" stroke="#0288D1" stroke-width="3"/>
            <rect x="312" y="96" width="30" height="30" fill="${L3.SKIN}"/>
            <g transform="translate(330 60)"><ellipse rx="44" ry="50" fill="${L3.SKIN}"/>
              <path d="M-46 -4 C-50 -60 40 -64 44 -16 C30 -34 -6 -38 -18 -22 C-28 -12 -34 -8 -46 -4Z" fill="#2B1B10"/>
              <circle cx="24" cy="0" r="5" fill="#2B1B10"/><path d="M20 26 Q32 30 38 20" stroke="#6B2E14" stroke-width="3" fill="none" stroke-linecap="round"/></g>
            <path d="M${SX} ${SY + 150} m-130 0 a130 130 0 0 1 130 -130" fill="none"/>
            <path id="l3-elb2-range" fill="none" stroke="#7E57C2" stroke-width="4" stroke-dasharray="8 8" opacity=".6"/>
            <g id="l3-elb2-arm"></g>
            <g id="l3-elb2-list" transform="translate(530 40)">
              <rect width="250" height="120" rx="18" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
              <text id="l3-elb2-t1" x="18" y="48" font-size="19" font-weight="800">⬜ Touch your shoulder</text>
              <text id="l3-elb2-t2" x="18" y="90" font-size="19" font-weight="800">⬜ Make it straight</text>
            </g>`);
          const armG = S.q(svg, '#l3-elb2-arm');
          // Dotted arc for how far the hand can go
          const g0 = L3.armGeom(SX, SY, 0), g1 = L3.armGeom(SX, SY, 160);
          S.q(svg, '#l3-elb2-range').setAttribute('d', `M${S.f1(g0.Wr.x)} ${S.f1(g0.Wr.y)} A140 140 0 0 0 ${S.f1(g1.Wr.x)} ${S.f1(g1.Wr.y)}`);
          let touched = false, done = false, ready = false;
          api.slider({
            label: '✋ Hand', min: 0, max: 160, step: 1, value: 0,
            format: v => v < 6 ? 'straight' : v > 150 ? 'at the shoulder!' : 'bending…',
            onInput: v => {
              armG.innerHTML = L3.arm({ x: SX, y: SY, bend: v, skin: 'solid', bones: false, biceps: false });
              if (!ready) return;
              if (v > 150 && !touched) {
                touched = true;
                S.q(svg, '#l3-elb2-t1').textContent = '✅ Touch your shoulder';
                api.sfx('success');
                api.say('You touched your shoulder! Now move your hand down again.');
              }
              if (touched && v < 6 && !done) {
                done = true;
                S.q(svg, '#l3-elb2-t2').textContent = '✅ Make it straight';
                api.star();
                api.praise('Your elbow bends up and goes back down until the arm is straight. It only moves one way.');
              }
            },
          });
          ready = true;
        },
      },

      // ---------- c) Knee ----------
      {
        text: [
          'Your knee joint has the same **range of movement** as your elbow joint.',
          'The tiny bone is not part of the joint. It is the **knee cap**. It protects the joint.',
        ],
        ask: ['Try this with your lower leg. Keep your hips and upper legs still.', 'Can you see three long bones at this knee joint too? Click the knee cap.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect x="20" y="20" width="240" height="480" rx="22" fill="#EAF4FB"/>
            <rect x="20" y="470" width="240" height="30" fill="#D9C4A3"/>
            <g id="l3-elb3-kid"></g>
            <clipPath id="l3-elb3-clip"><circle cx="530" cy="260" r="235"/></clipPath>
            <circle cx="530" cy="260" r="235" fill="#0E2A47"/>
            <g clip-path="url(#l3-elb3-clip)" id="l3-elb3-leg"></g>
            <circle cx="530" cy="260" r="235" fill="none" stroke="#2BA3B8" stroke-width="10"/>
            <g id="l3-elb3-tag"></g>`);
          const kid = S.q(svg, '#l3-elb3-kid'), legG = S.q(svg, '#l3-elb3-leg'), tag = S.q(svg, '#l3-elb3-tag');
          let bend = 0, capFound = false, bent = false, ready = false;
          const draw = () => {
            kid.innerHTML = L3.sideBody({ kneeF: bend, footF: -bend * .2 }, { style: 'body', x: 140, y: 270, s: .95, shirt: '#29B6F6', trousers: '#283593' }).svg;
            legG.innerHTML = kneeXray(520, 230, bend);
            const cap = S.q(legG, '.l3-elb-cap');
            cap.classList.add('hot');
            if (capFound) { cap.setAttribute('fill', '#FFE082'); cap.setAttribute('stroke', '#FFB300'); }
          };
          const check = () => {
            if (capFound && bent) {
              api.star();
              api.praise('Three long bones meet at the knee. The knee cap sits at the front and protects the joint.');
            }
          };
          legG.addEventListener('click', e => {
            if (!e.target.closest('.l3-elb-cap')) {
              if (!capFound) api.oops('That is a long leg bone. Look for the tiny bone at the front of the knee.');
              return;
            }
            if (capFound) return;
            capFound = true;
            api.sfx('pop');
            draw();
            tag.innerHTML = `<g class="pop-in">${L3.pill(680, 90, 'knee cap', { stroke: '#FFB300', color: '#7A5A00' })}</g>`;
            api.say('That is the knee cap. It is not part of the joint. It protects the joint.');
            check();
          });
          api.slider({
            label: '🦵 Lower leg', min: 0, max: 130, step: 1, value: 0,
            format: v => v < 6 ? 'straight' : v > 120 ? 'bent right up' : 'bending…',
            onInput: v => {
              bend = v; draw();
              if (ready && v > 120 && !bent) {
                bent = true;
                api.sfx('success');
                api.say('The knee bends just like the elbow. It only moves backwards and forwards.');
                check();
              }
            },
          });
          ready = true;
        },
      },

      // ---------- d) Like a hinge ----------
      {
        text: ['The elbow and knee move like the **hinge** on a door.'],
        ask: 'Slide to open the door. Watch the elbow. Then answer the question.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3E0"/>
            <rect y="470" width="800" height="50" fill="#D7B98E"/>
            <rect x="90" y="60" width="240" height="412" fill="#5D4037"/>
            <rect x="104" y="72" width="212" height="400" fill="#FFF8EC"/>
            <g id="l3-elb4-door"></g>
            <g id="l3-elb4-hinges"></g>
            <g id="l3-elb4-arm"></g>
            <path d="M620 330 L563 252" stroke="#7E57C2" stroke-width="3"/>${L3.pill(660, 340, 'elbow', {})}
            <g id="l3-elb4-tag"></g>`);
          const door = S.q(svg, '#l3-elb4-door'), armG = S.q(svg, '#l3-elb4-arm');
          const HX = 104;
          const hinge = y => `<rect x="${HX - 12}" y="${y}" width="24" height="56" rx="3" fill="#B0BEC5" stroke="#607D8B" stroke-width="2"/>
            <rect x="${HX - 3}" y="${y - 2}" width="6" height="60" rx="3" fill="#78909C"/>
            ${[10, 28, 46].map(d => `<circle cx="${HX - 6}" cy="${y + d}" r="2.5" fill="#607D8B"/><circle cx="${HX + 6}" cy="${y + d}" r="2.5" fill="#607D8B"/>`).join('')}`;
          S.q(svg, '#l3-elb4-hinges').innerHTML = hinge(110) + hinge(380);
          S.q(svg, '#l3-elb4-tag').innerHTML = S.callout({ x: HX, y: 140, tx: 200, ty: 30, text: 'hinge' });
          let asked = false, ready = false;
          const draw = k => {
            const a = k * 80 * Math.PI / 180, w = 212 * Math.cos(a), skew = Math.sin(a) * 40;
            door.innerHTML = `<path d="M${HX} 72 L${S.f1(HX + w)} ${S.f1(72 - skew * .5)} L${S.f1(HX + w)} ${S.f1(472 + skew * .5)} L${HX} 472Z" fill="${S.mix('#E07A4F', '#8D3B1F', k * .6)}" stroke="#8D3B1F" stroke-width="3"/>
              <rect x="${S.f1(HX + w * .1)}" y="100" width="${S.f1(w * .8)}" height="140" fill="none" stroke="#8D3B1F" stroke-width="3" opacity=".5"/>
              <rect x="${S.f1(HX + w * .1)}" y="280" width="${S.f1(w * .8)}" height="160" fill="none" stroke="#8D3B1F" stroke-width="3" opacity=".5"/>
              <circle cx="${S.f1(HX + w * .88)}" cy="280" r="9" fill="#FFC93C" stroke="#B5803F" stroke-width="2"/>`;
            armG.innerHTML = L3.arm({ x: 560, y: 100, bend: k * 150, skin: 'faint', biceps: false });
          };
          api.slider({
            label: '🚪 Open', min: 0, max: 1, step: .02, value: 0,
            format: v => v < .05 ? 'shut' : v > .95 ? 'open' : 'opening…',
            onInput: v => {
              draw(v);
              if (ready && v > .95 && !asked) {
                asked = true;
                api.sfx('knock');
                api.say('A hinge lets the door swing one way, open and shut. The elbow moves the same way.');
                api.choice({
                  q: 'How does a hinge move?',
                  options: ['One way, open and shut', 'Round in a circle', 'It does not move'],
                  correct: 0,
                  hints: { 1: 'A door cannot spin round in a circle. Watch it again.', 2: 'The door opened and shut, so the hinge does move.' },
                  explain: 'A hinge moves backwards and forwards. The elbow and knee move like a hinge.',
                  onRight: () => api.star(),
                });
              }
            },
          });
          ready = true;
        },
      },
    ],
  });
})();
