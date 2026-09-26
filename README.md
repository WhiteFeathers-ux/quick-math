# Quick Math

A small personal math practice game, from basic arithmetic through selected Algebra 2 topics. No accounts, analytics, backend, or external dependencies.

## Play
Open index.html directly, or use the GitHub Pages site. Pick a level, arithmetic focus, and timed or untimed round. Answers check automatically after 1.1 seconds without typing. Correct answers advance after 0.7 seconds. Incorrect answers stay visible with an explanation and a Next button. On phones, use the built-in number pad; it keeps the operating-system keyboard from covering the game.

## Progress
Progress saves after every answer in this browser. Overview shows accuracy, correct-answer speed, practice days, and recent accuracy. By level shows practice status; History is paginated. Comparisons require six rounds at the same difficulty, focus, and timer. Level guidance is a practice heuristic, not a mastery assessment. Skips count as misses. Speed includes time entering an answer and the automatic submission delay.

Phone, Mac, offline-file, and hosted-site histories are separate. Save backup downloads the local records as JSON. There is no account sync. Clearing browser storage removes that browser's progress. Existing v1 records remain readable.

## Build
Run `python3 build.py` to inline template.html, style.css, engine.js, app.js, and progress.js into index.html and a local Downloads copy. Only index.html needs hosting. Algebra 2 drills cover quadratic roots, factoring, exponentials, logarithms, polynomial evaluation, and rational equations, not a full course.
