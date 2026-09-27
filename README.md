# Science Explorer: interactive lessons

**This is an AI-generated project**

Live page: https://ravinsp.github.io/science-g4/

Interactive versions of textbook science lessons for children aged about 7–9.
Everything runs in the browser. It doesn't need a server or any installs, though a simple local server is an option (see below).

## Open it
Chrome or Edge works best; Edge has the most natural voices.

**Option 1: open the file.** Double-click `index.html`.

**Option 2: run a local web server.** Use this if your browser blocks files opened straight from
the disk. It needs Python 3. In a terminal, go to this folder and run:
```
python -m http.server 8000
```
Then open <http://localhost:8000> in your browser. Press **Ctrl+C** in the terminal to stop the server.
On some systems the command is `python3` or `py` instead of `python`.

Type a name, then click a lesson card. Browsers only allow sound after a click.

Progress is saved separately for each way of opening the app. Opening `index.html` directly and
using `localhost:8000` each keep their own stars and progress.

## Lessons
| Lesson | Title | Status |
|---|---|---|
| 1 | — | Coming soon (placeholder) |
| 2 | Growing plants | 17 topics, 62 pages |

Lesson 2 follows the textbook unit "Growing plants": roots, cuttings, stems and trunks,
leaves, flowers, the flower key, grouping leaves and flowers, transport and the pathway of water,
what plants need (water, light, minerals), the fertiliser investigation, botanists and herbarium,
and a review with a word game, a 12-question quiz and a printable certificate.

- **Read aloud:** Shelly the tortoise reads every page and highlights each word as she says it.
  Click any card to hear it again, or click a green key word to hear what it means.
- **Sounds:** made in the browser; there are no audio files.
- **Stars and progress:** saved in this browser, separately for each lesson. The lesson card shows
  how far the child has got, and the lesson reopens where they stopped.
- **Getting around:** 🏠 in the top bar goes back to the lesson list. ← and → change page,
  and **R** reads the page aloud.

## Folder layout
```
index.html              start screen, lesson list and app shell
css/style.css
js/core/                shared code: sound, speech, drawing, widgets, app shell
lessons/lessons.js      the list of lessons shown on the start screen
lessons/lesson-2/chapters/01-intro.js … 17-review.js
tools/shot.ps1          developer helper for headless screenshots
```

## Adding a lesson
1. Create a folder such as `lessons/lesson-1/chapters/`.
2. Add chapter files. Each one calls `App.chapter({ id, title, icon, group, keywords, steps })`.
   Copy one from `lessons/lesson-2/chapters/` to start.
3. In `lessons/lessons.js`, fill in the lesson's `title`, `subtitle`, `icon`, `color`, and its
   `chapters` list in display order. A lesson with an empty `chapters` list shows as "Coming soon".

A lesson's chapter files load only when that lesson is opened. Chapter ids only need to be unique
within their own lesson.

## Testing
- `index.html#go=lesson-2:roots,2` opens a page directly, silently. `#go=roots,2` uses the first
  lesson that has chapters.
- `powershell -File tools\shot.ps1 lesson-2:roots 2` saves a screenshot of that page and prints any
  console errors.

The fonts (Baloo 2 and Nunito) load from Google Fonts when online. Offline, the app uses system
fonts instead and still works.
