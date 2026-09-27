// The list of lessons shown on the start screen.
//
// To add a lesson:
//   1. Make a folder, e.g. lessons/lesson-1/chapters/
//   2. Put chapter files in it. Each one calls App.chapter({ id, title, icon, group, keywords, steps })
//      (copy one from lessons/lesson-2/chapters/ to start).
//   3. Fill in its entry below: list the chapter files in the order they should appear.
// A lesson with no chapter files shows as "Coming soon".

App.addLesson({
  id: 'lesson-1',
  number: 1,
  title: 'Lesson 1',
  icon: '📘',
  color: '#3B7DD8',
  path: 'lessons/lesson-1/',
  chapters: [],             // add chapter files here when Lesson 1 is written
});

App.addLesson({
  id: 'lesson-2',
  number: 2,
  title: 'Growing plants',
  subtitle: 'Roots, stems, leaves, flowers and what plants need',
  icon: '🌱',
  color: '#C8452F',
  path: 'lessons/lesson-2/',
  pages: 62,                // total pages, for the progress bar before the lesson loads
  chapters: [
    'chapters/01-intro.js',
    'chapters/02-roots.js',
    'chapters/03-cuttings.js',
    'chapters/04-stems.js',
    'chapters/05-leaves.js',
    'chapters/06-flowers.js',
    'chapters/07-flower-key.js',
    'chapters/08-grouping-leaves.js',
    'chapters/09-grouping-flowers.js',
    'chapters/10-transport.js',
    'chapters/11-water-pathway.js',
    'chapters/12-need-water.js',
    'chapters/13-need-light.js',
    'chapters/14-minerals.js',
    'chapters/15-fertiliser.js',
    'chapters/16-botanists.js',
    'chapters/17-review.js',
  ],
});
