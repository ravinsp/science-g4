# AGENTS.md

**Science Explorer**: interactive science lessons for children aged 7–9. Each lesson turns one
textbook unit (a scanned PDF) into an animated, narrated web app. Lessons 2 ("Growing plants") and
3 ("Skeleton and muscles") are complete; use them as models.

## Hard constraints
- **Static, no build.** Plain HTML/CSS/JS via classic `<script>` tags. No bundler, npm or ES modules.
- **Must run from `file://` and from `python -m http.server 8000`.** Never `fetch()`/XHR local files.
- **No external runtime dependencies** except the Google Fonts link. Sound is synthesised
  (`js/core/audio.js`), speech uses Web Speech API, pictures are inline SVG.
- **British spelling** in learner-facing text (colour, fertiliser, centre).
- **UTF-8 without BOM.** Never round-trip files through PowerShell `Get-Content`/`Set-Content`
  (it corrupts emoji).
- **Comments:** short and plain, only where they help.

## Layout
```
index.html               app shell, start screen, shared SVG gradients
css/style.css            shared styles
js/core/audio.js         Sfx: sound effects
js/core/speech.js        Voice: read-aloud with word highlighting
js/core/svg.js           S: drawing helpers
js/core/widgets.js       W: tween, drag and drop, choice, slider, sort game, confetti
js/core/app.js           App: lesson registry/loader, navigation, progress, scene API
lessons/lessons.js       lesson list (App.addLesson)
lessons/lesson-N/chapters/NN-name.js   one file per chapter
lessons/lesson-3/body.js               L3: shared drawings (not a chapter)
tools/shot.ps1           headless screenshot + console-error check
```

## Building a lesson

### 1. Read the textbook
The PDFs have no text layer. If the Read tool's PDF support fails (needs poppler), render pages
with PyMuPDF installed to a scratch folder outside the project:
```
python -m pip install --no-user --target <scratch>\pylib pymupdf
set PYTHONPATH=<scratch>\pylib
python -c "import fitz; [p.get_pixmap(dpi=100).save(f'p{i+1:02d}.png') for i, p in enumerate(fitz.open(r'<book>.pdf'))]"
```
(`--no-user` is needed on Microsoft Store Python.) Note every sentence, question box, speech bubble
and **Key words** list; chapters use them almost word for word.

### 2. Plan chapters
- One chapter per textbook section heading, 3–5 steps each.
- Almost every step needs a real interaction (explore by clicking, drag labels, time-lapse, slider,
  sort game, quiz) with animation and sound. Mark it `activity: true` and call `api.star()` on finish.
- Sparse book pages: base the activity on the book's pictures. Invent short, child-friendly facts
  only where a page would otherwise be empty.
- End with a review chapter copied from `lessons/lesson-3/chapters/10-review.js`. Change the lesson
  name, certificate file name, default learner name ("Body Scientist"), certificate decorations,
  the 12 quiz questions, and the `l3-rev-` prefix everywhere. The glossary builds itself.

### 3. Register and create files
Fill in the existing Lesson 1 placeholder in `lessons/lessons.js` (don't add a second entry).
Register as soon as the first chapter exists and add each chapter as you write it, so you can
screenshot as you go.
```js
App.addLesson({
  id: 'lesson-1',            // folder name and progress key; never rename
  number: 1,                 // order on start screen
  title: 'Materials',
  subtitle: 'One line on the lesson card',
  icon: '🧱',
  color: '#3B7DD8',
  path: 'lessons/lesson-1/',
  pages: 48,                 // total steps (excluding helper files)
  chapters: ['helpers.js', 'chapters/01-intro.js', ...],   // load and display order
});
```
Never add chapter `<script>` tags to `index.html`; `App` loads them when the lesson opens. An
empty `chapters` list shows "Unavailable".

### 4. Lesson-wide drawing helpers
If several chapters draw the same things, put them in one helper file listed **first** in
`chapters`. It defines one global object named after the lesson, built by an IIFE (see `L3` in
`lessons/lesson-3/body.js`). It adds no chapter since it never calls `App.chapter`.
- Return markup strings like `S.*`; return `{svg, pts}` when chapters need positions (`L3.sideBody`).
- Share a local frame between related drawings so they overlay exactly (`L3.person`/`L3.skeleton`).
- Drive poses with a few angles and redraw each tween frame.

`L3` already has front/side body and skeleton, arms with muscles, hand, organs, `muscle()`,
X-ray `lens()` and label `pill()`. Reuse them for human-body topics.

### 5. Avoid clashes between lessons
All lessons share one page and stay loaded after switching.
- Wrap every chapter file in `(() => { ... })();`.
- Prefix every document-global name with a unique chapter prefix (e.g. `l1-mag-`): SVG ids
  (`clipPath`, `mask`, gradients), injected `<style id>`s, CSS classes.
- Chapter `id`s need only be unique within the lesson.
- Don't edit `js/core/*`, `css/style.css` or `index.html` for one lesson. Inject lesson CSS once
  from the chapter/helper file (guarded by style id). Change core only for real bugs or features
  every lesson needs, then re-test Lesson 2.

## Chapter format
```js
(() => {
  App.chapter({
    id: 'roots', title: 'Roots', icon: '🥕', group: 'Parts of a plant',   // group = sidebar heading
    keywords: [{ w: 'roots', d: 'The parts of a plant that grow under the soil.' }],
    steps: [{
      title: 'optional sub-heading',
      text: ['First card.', '**roots** marks a clickable key word.'],
      ask: 'Orange question card (string or array of two).',
      tip: 'Speech bubble from Shelly the tortoise.',
      activity: true,
      scene(stage, api) { /* build scene; may return a cleanup function */ },
    }],
  });
})();
```
- **Key words:** exactly the book's list for that section, each with a one-sentence child-friendly
  definition. Don't redefine words from earlier chapters of the lesson.
- **Cards** (`text`, `ask`, `tip`) are read aloud in order. Keep them short. `<ol>`/`<ul>` is fine.

## Scene API
- **Drawing:** `api.svg(markup, viewBox = '0 0 800 520')` (design for 800×520), `api.html(markup)`
  for tables and card/sort games, `api.q(sel)`, `api.qa(sel)`.
- **Feedback:** `api.sfx(name)`, `api.say(text)` (interrupts), `api.sayAfter(text)` (queues),
  `api.praise(msg?)`, `api.oops(hint)`, `api.feedback(html, 'ok'|'oops'|'info')`, `api.info(msg)`,
  `api.star()` (idempotent).
- **Controls:** `api.row()`, `api.button(html, fn, {cls, sound, parent})`, `api.label(html)`,
  `api.slider({label, min, max, step, value, format, onInput})`,
  `api.choice({q, options, correct, hints, explain, onRight})`,
  `api.dragLabels(svg, [{id, label, x, y, lx, ly}], {onDone, radius})`,
  `api.sortGame(el, {bins, items, cols, onDone, onDrop, check})`,
  `api.draggable(svg, node, {onStart, onMove, onDrop, bounds})` (node needs
  `transform="translate(x y)"`; `onDrop` returning `false` snaps back; result has `animateTo(x, y, ms)`).
- **Free pointer input:** `W.pointerDrag(el, {onStart, onMove, onEnd})` with `api.point(svg, e)`
  (scene coords). For press-and-hold or dragging along a path.
- **Timing** (auto-stops on page change; never raw `setTimeout`/`requestAnimationFrame`):
  `api.timeout`, `api.interval`, `await api.wait(ms)`, `await api.tween(ms, (k, raw) => {}, W.ease.out)`,
  `api.loop((dt, t) => {})`, `api.onCleanup(fn)`. After every `await`: `if (!api.alive()) return;`.
- **State:** `api.name` (learner name, may be empty), `App.saved` (open lesson's `seen`, `stars`,
  plus custom fields like `quizScore`; persist with `App.save()`), `App.chapters`.

**Sounds:** `click tick pop pick drop success star oops drip water pour spray snip whoosh wind grow
shrink thud page buzz flutter shutter chirp rain pluck sprinkle bubble swoosh magic fanfare knock`.

**`S.*` helpers** (return markup): `plant` (`grow`, `bend`, `droop`, `flower`, `fruit`, `roots`),
`leaf`, `leafPath`, `flower`, `bud`, `roots`, `tree`, `stemPath`, `plantTip`, `sky`, `ground`, `sun`,
`cloud`, `drop`, `pot`, `beaker`, `wateringCan`, `sprayBottle`, `scissors`, `magnifier`, `ruler`,
`bee`, `butterfly`, `caterpillar`, `kid`, `tortoise`, `callout`, `arrow`, `text`, `mix`, `rng`,
`frag`, `el`, `f1`, `clamp`, `lerp`.

**Shared defs:** gradients `#g-sky #g-soil #g-darksoil #g-grass #g-pot #g-glass #g-bark #g-sun
#g-glow`, filter `#f-soft`. **Animation classes:** `.sway .float .spin-slow .flow .pop-in .grow-in
.fade-in .wiggle .blink-hint .hot .target-ring`.

## Gotchas
- `api.slider`'s `onInput` fires once on creation; skip speech on that call with a `ready` flag
  (see Lesson 2 `02-roots.js`).
- `.pop-in`, `.wiggle`, `.grow-in` override `transform`; put them on a wrapper `<g>`.
- Keep `api.choice` options to a few words, or they crowd the controls at 1366×800.
- SVG text ≥ 16px.
- Give thin/small clickables an invisible hit area: a path copy with `stroke="#fff"
  stroke-opacity="0" stroke-width="30"`, or `<circle fill="#fff" opacity="0">`. `fill="none"`
  doesn't catch clicks.
- `api.dragLabels` accepts drops within `radius` (default 60) of the hotspot or label box; keep
  targets well apart.
- Redrawing with `innerHTML` drops listeners; delegate clicks from a stable parent with
  `e.target.closest('[data-...]')`.
- Check the most extreme animation frame stays inside 800×520.
- Screenshots may catch right-side cards mid slide-in (faded). That's normal.

## Testing (every step of every new chapter)
```
node --check lessons\lesson-N\chapters\<file>.js
powershell -ExecutionPolicy Bypass -File tools\shot.ps1 lesson-N:<chapterId> <stepIndex> <outDir>
```
`shot.ps1` opens `index.html#go=lesson-N:<chapterId>,<step>` in headless Chrome at 1366×800,
saves `shot-*.png` and prints console errors. It captures only the first moments. Inspect every PNG
for overlap, clipping and legibility.

For states after clicks/drags, drive Chrome via DevTools protocol from a Node 22 script kept
outside the project (built-in `fetch`/`WebSocket`, no npm):
- Launch Chrome `--headless=new --remote-debugging-port=<port> --user-data-dir=<temp>
  --window-size=1366,800 --mute-audio about:blank`; get `webSocketDebuggerUrl` from
  `http://127.0.0.1:<port>/json`.
- Enable `Runtime` and `Page`; collect `Runtime.exceptionThrown` and console errors.
- Navigate to `file:///.../index.html?r=<n>#go=lesson-N:<chapter>,<step>`, changing `?r=` each
  time (hash-only changes don't reload).
- Use `Input.dispatchMouseEvent` (moved, pressed, several moves, released). Map scene to screen
  coords with `svg.createSVGPoint().matrixTransform(svg.getScreenCTM())`. Set sliders by assigning
  `input[type=range]` value and dispatching `input`.
- `Page.captureScreenshot` for shots. Finally print `Object.keys(App.saved.stars)` to prove every
  activity awards its star.

Tile many screenshots into contact sheets (PyMuPDF `show_pdf_page` with `clip`) for review.

**Before finishing:**
- Screenshot every page of the new lesson (and Lesson 2 if core changed); no errors.
- Start screen: open the lesson, 🏠 home, open another lesson, reopen it.
- Load once via `python -m http.server 8000`.
- Update the Lessons table in `README.md`.
