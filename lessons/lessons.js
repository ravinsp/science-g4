// The list of lessons shown on the start screen.
//
// To add a lesson:
//   1. Make a folder, e.g. lessons/lesson-1/chapters/
//   2. Put chapter files in it. Each one calls App.chapter({ id, title, icon, group, keywords, steps })
//      (copy one from lessons/lesson-2/chapters/ to start).
//   3. Fill in its entry below: list the chapter files in the order they should appear.
// A lesson with no chapter files shows as "Unavailable".

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

App.addLesson({
  id: 'lesson-3',
  number: 3,
  title: 'Skeleton and muscles',
  subtitle: 'Bones, joints, muscles and keeping them healthy',
  icon: '🦴',
  color: '#7E57C2',
  path: 'lessons/lesson-3/',
  pages: 40,                // total pages, for the progress bar before the lesson loads
  chapters: [
    'body.js',              // shared drawings (skeleton, organs, muscles), not a chapter
    'chapters/01-intro.js',
    'chapters/02-support.js',
    'chapters/03-protection.js',
    'chapters/04-movement.js',
    'chapters/05-elbows-knees.js',
    'chapters/06-more-joints.js',
    'chapters/07-muscles.js',
    'chapters/08-contracting.js',
    'chapters/09-healthy.js',
    'chapters/10-review.js',
  ],
});

App.addLesson({
  id: 'lesson-4',
  number: 4,
  title: 'Solids, liquids and gases',
  subtitle: 'States of matter, temperature and changing state',
  icon: '🧊',
  color: '#1E88E5',
  path: 'lessons/lesson-4/',
  pages: 61,                // total pages, for the progress bar before the lesson loads
  chapters: [
    'matter.js',            // shared drawings (thermometers, ice, glasses), not a chapter
    'chapters/01-intro.js',
    'chapters/02-solids.js',
    'chapters/03-liquids.js',
    'chapters/04-gases.js',
    'chapters/05-solid-liquid-gas.js',
    'chapters/06-comparing-liquids.js',
    'chapters/07-temperature.js',
    'chapters/08-using-thermometer.js',
    'chapters/09-changing-state.js',
    'chapters/10-states-of-water.js',
    'chapters/11-more-water.js',
    'chapters/12-accurate.js',
    'chapters/13-review.js',
  ],
});
