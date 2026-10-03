# Science Explorer: interactive lessons

**This is an AI-generated project**

Live page: https://ravinsp.github.io/science-g4/

Animated, narrated versions of textbook science lessons for children aged about 7–9. Everything
runs in the browser, with no installs.

## Open it
Chrome or Edge works best (Edge has the most natural voices).

- **Open the file:** double-click `index.html`.
- **Or run a local server** (if your browser blocks local files; needs Python 3):
  ```
  python -m http.server 8000
  ```
  Then open <http://localhost:8000>. On some systems the command is `python3` or `py`.

Type a name, then click a lesson card.

## Using it
- Shelly the tortoise reads each page aloud. Click a card to hear it again, or a green key word
  to hear what it means.
- 🏠 goes back to the lesson list. ← and → change page, and **R** reads the page aloud.
- Stars and progress are saved in the browser for each lesson. Opening `index.html` directly and
  using `localhost:8000` keep separate progress.

## Lessons
| Lesson | Title | Status |
|---|---|---|
| 1 | — | Unavailable (placeholder) |
| 2 | Growing plants | 17 topics, 62 pages |
| 3 | Skeleton and muscles | 10 topics, 40 pages |
| 4 | Solids, liquids and gases | 13 topics, 61 pages |

Each lesson ends with a review: a word game, a 12-question quiz and a printable certificate.

## Developers
Plain HTML, CSS and JavaScript with no build step. Lessons live in `lessons/`, shared code in
`js/core/`. See [AGENTS.md](AGENTS.md) for how lessons are built and tested.
