# AGENTS.md

Instructions for coding agents working on **Science Explorer**, a set of interactive science
lessons for children aged about 7–9. Each lesson turns one textbook unit into an animated,
narrated web app. Lesson 2 ("Growing plants", from `Growing plants.pdf`) is complete. Use it as
the model for new lessons.

## Hard constraints
- **Static, no build.** Plain HTML, CSS and JavaScript loaded with classic `<script>` tags. No
  bundler, no npm packages, and no ES modules (`import` does not work from `file://`).
- **Two ways to run, both must work:** double-clicking `index.html` (`file://`) and
  `python -m http.server 8000`. Never use `fetch()` or XHR for local files; they fail on `file://`.
- **No external runtime dependencies** except the Google Fonts link. Sound is synthesised in
  `js/core/audio.js`, speech uses the browser's Web Speech API, and illustrations are inline SVG.
- **British spelling** in all learner-facing text (colour, fertiliser, centre), matching the textbooks.
- **Save files as UTF-8 without BOM.** Don't round-trip files through PowerShell
  `Get-Content`/`Set-Content`; Windows PowerShell 5.1 corrupts the emoji used in labels.
- **Comments:** short and plain. Only add them where they help a person read the code at a glance.

## Layout
```
index.html               app shell, start screen with lesson picker, shared SVG gradients
css/style.css            all shared styles
js/core/audio.js         Sfx: synthesised sound effects
js/core/speech.js        Voice: read-aloud with word highlighting
js/core/svg.js           S: drawing helpers (plants, flowers, roots, trees, props, characters)
js/core/widgets.js       W: tween, drag and drop, quiz choice, slider, sort game, confetti
js/core/app.js           App: lesson registry and loader, navigation, progress, scene API
lessons/lessons.js       the lesson list shown on the start screen
lessons/lesson-2/chapters/NN-name.js   one file per chapter (topic)
tools/shot.ps1           headless screenshot and console-error check for one page
```

## Adding a lesson

### 1. Read the source material
The textbooks are scanned PDFs with no text layer. The Read tool's PDF support needs `pdftoppm`
(poppler), which may not be installed. If it fails, render the pages to images: install PyMuPDF
into a scratch folder outside the project, or pull out the page images with a small script.
Then read the images. Note every sentence, question box, speech bubble and **Key words** list;
the chapters use them almost word for word.

### 2. Plan the chapters
- One chapter for each textbook section heading (Roots, Leaves and so on). Give each 3–5 steps
  (pages).
- Almost every step needs a real interaction: click to explore, drag labels, a time-lapse button,
  a slider, a sorting game or a quiz, with animation and sound. Mark those steps
  `activity: true` and award a star when the child finishes.
- End the lesson with a review chapter. Copy `lessons/lesson-2/chapters/17-review.js`, which has a
  glossary, word match, quiz and certificate, and change the lesson-specific text ("Growing Plants")
  and the quiz questions.

### 3. Create the files
```
lessons/lesson-N/chapters/01-intro.js
lessons/lesson-N/chapters/02-....js
```
Then register the lesson in `lessons/lessons.js`. Lesson 1 is already there as an empty
"Coming soon" placeholder; fill it in rather than adding a second entry.
```js
App.addLesson({
  id: 'lesson-1',            // folder name; also the key for saved progress, so never rename it
  number: 1,                 // sets the order on the start screen
  title: 'Materials',
  subtitle: 'One line shown on the lesson card',
  icon: '🧱',
  color: '#3B7DD8',          // card and badge colour
  path: 'lessons/lesson-1/',
  pages: 48,                 // total steps across all chapters (card progress bar before loading)
  chapters: ['chapters/01-intro.js', 'chapters/02-....js'],   // display order
});
```
Do not add chapter `<script>` tags to `index.html`. `App` loads a lesson's files when the lesson is
opened. A lesson with an empty `chapters` list shows as "Coming soon".

### 4. Keep lessons from clashing
All lessons share one page, and a lesson's scripts stay loaded after the child switches to
another lesson. So:
- Wrap every chapter file in an IIFE `(() => { ... })();` if it declares any top-level names.
- Prefix everything that is global in the document with a unique chapter prefix, such as `l1-mag-`:
  SVG ids (`clipPath`, `mask`, `linearGradient`, since `url(#id)` lookups are page-wide), injected
  `<style id="...">` ids, and CSS class names.
- Chapter `id`s only need to be unique within their lesson.
- Don't edit `js/core/*`, `css/style.css` or `index.html` to suit one lesson. Put helpers in the
  chapter file and inject extra CSS once from it (guard with the style id). Change core only for a
  real bug or a feature every lesson needs, and then re-test Lesson 2.

## Chapter format
```js
(() => {
  App.chapter({
    id: 'roots', title: 'Roots', icon: '🥕', group: 'Parts of a plant',   // group = sidebar heading
    keywords: [{ w: 'roots', d: 'The parts of a plant that grow under the soil.' }],
    steps: [{
      title: 'optional sub-heading',
      text: ['First card.', 'More facts. **roots** marks a clickable key word.'],
      ask: 'Question or instruction card (orange, like the book\'s question boxes).',
      tip: 'Speech bubble from Shelly the tortoise (optional).',
      activity: true,
      scene(stage, api) { /* build the picture and controls; may return a cleanup function */ },
    }],
  });
})();
```
- **Key words:** use exactly the book's list for that section. Give each a one-sentence,
  child-friendly definition, which is spoken when the word is clicked. Avoid repeating words
  already defined in an earlier chapter of the same lesson.
- **Cards:** `text`, `ask` and `tip` are read aloud in order with word highlighting. Keep them short.
  Simple HTML (`<ol><li>`) is fine.

## Scene API (`scene(stage, api)`)
- **Drawing:** `api.svg(markup, viewBox = '0 0 800 520')` returns the SVG element. Design every
  scene for 800×520. `api.html(markup)` gives an HTML area instead, for tables and sort games.
  `api.q(sel)` and `api.qa(sel)` query inside the stage.
- **Feedback:** `api.sfx(name)`; `api.say(text)` (interrupts); `api.sayAfter(text)` (queues);
  `api.praise(msg?)`; `api.oops(hint)`; `api.feedback(html, 'ok'|'oops'|'info')`; `api.info(msg)`;
  `api.star()` (safe to call more than once).
- **Controls under the stage:** `api.row()`, `api.button(html, fn, {cls, sound, parent})`,
  `api.label(html)`, `api.slider({label, min, max, step, value, format, onInput})`,
  `api.choice({q, options, correct, hints, explain, onRight})`,
  `api.dragLabels(svg, [{id, label, x, y, lx, ly}], {onDone})`,
  `api.sortGame(el, {bins, items, cols, onDone, onDrop, check})`,
  `api.draggable(svg, node, {onMove, onDrop, bounds})` (the node needs a `transform="translate(x y)"`).
- **Timing:** always use these, never raw `setTimeout` or `requestAnimationFrame`, because they
  stop automatically when the page changes: `api.timeout`, `api.interval`, `await api.wait(ms)`,
  `await api.tween(ms, (k, raw) => {}, W.ease.out)`, `api.loop((dt, t) => {})`. After any `await`,
  add `if (!api.alive()) return;`.
- **Other:** `api.name` is the learner's name (may be empty). `App.saved` is the open lesson's
  progress (`seen`, `stars`, plus any extra fields a lesson stores, such as `quizScore`), saved
  with `App.save()`. `App.chapters` lists the open lesson's chapters.

Sound names: `click tick pop pick drop success star oops drip water pour spray snip whoosh wind grow
shrink thud page buzz flutter shutter chirp rain pluck sprinkle bubble swoosh magic fanfare knock`.

Drawing helpers (`S.*`, all return markup strings): `plant` (with `grow`, `bend` towards light,
`droop` to wilt, `flower`, `fruit`, `roots`), `leaf`, `leafPath`, `flower`, `bud`, `roots`, `tree`,
`stemPath`, `plantTip`, `sky`, `ground`, `sun`, `cloud`, `drop`, `pot`, `beaker`, `wateringCan`,
`sprayBottle`, `scissors`, `magnifier`, `ruler`, `bee`, `butterfly`, `caterpillar`, `kid`,
`tortoise`, `callout` (textbook-style label), `arrow`, `text`, `mix` (blend colours), `rng`
(seeded random), `frag`. Shared gradients defined in `index.html`: `url(#g-sky)`, `#g-soil`,
`#g-darksoil`, `#g-grass`, `#g-pot`, `#g-glass`, `#g-bark`, `#g-sun`, `#g-glow`, and the filter
`#f-soft`. Animation classes: `.sway .float .spin-slow .flow .pop-in .grow-in .fade-in .wiggle
.blink-hint .hot .target-ring`.

## Known gotchas
- `api.slider`'s `onInput` fires once when the slider is created. Don't speak on that first
  call; use a `ready` flag, as in `02-roots.js`.
- The `.pop-in`, `.wiggle` and `.grow-in` animations replace an element's own `transform`, so put them
  on a wrapper `<g>`.
- Answer text in `api.choice` that wraps onto several lines can crowd the controls on a
  1366×800 screen. Keep options short.
- Text inside SVG should be at least 16px.

## Testing (every step of every new chapter)
```
node --check lessons\lesson-N\chapters\<file>.js
powershell -ExecutionPolicy Bypass -File tools\shot.ps1 lesson-N:<chapterId> <stepIndex> <outDir>
```
`shot.ps1` opens `index.html#go=lesson-N:<chapterId>,<step>` in headless Chrome at 1366×800,
silently. It saves `shot-*.png` and prints console errors. Look at every PNG: nothing overlapping,
cut off or unreadable. It only captures the page's first moments, because virtual time stops
animations. To check states after a click or drag, drive Chrome through the DevTools protocol
(`--remote-debugging-port`) from a Node script kept outside the project. Before finishing:
- Screenshot every page of the new lesson (and of Lesson 2 if you changed core) and confirm there
  are no errors.
- Click through the start screen: pick the lesson, go 🏠 home, and reopen it.
- Serve the app with `python -m http.server 8000` and load it once.
- Update the Lessons table in `README.md`.
