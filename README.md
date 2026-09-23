# TechBridge — Website (Tasks 1–6)

Website for TechBridge by Baselink Services Limited, built for the TechBridge Web Development Internship.

## Structure
```
techbridge-task-6/
├── index.html
├── programs.html
├── tasks.html
├── challenges.html
├── dashboard.html
├── style.css
├── script.js
├── challenges.js
├── dashboard.js
└── images/
    └── techbridge-logo.png
```

`index.html` is the homepage (Task 1). `programs.html` is the dedicated Programs experience (Task 2). `tasks.html` is the interactive Internship Roadmap (Tasks 3 & 4) — pick a track and JavaScript renders that track's 8-task timeline without a page reload. `challenges.html` is the Challenge Hub (Task 5) — 8 practice challenges filterable by track and difficulty, with a detail modal. `dashboard.html` is the Intern Dashboard (Task 6) — a live progress tracker, a filterable 8-task tracker with a detail modal, a link to the Challenge Hub, and an interactive "Modern Web Technologies" explorer. All pages share the same `style.css` and navigation/footer for visual consistency.

## Navigation, consolidated in Task 6
The header nav had grown to 8 links by Task 5. Rather than let it keep growing with
every task, I trimmed it to the core pages — About, Programs, Roadmap, Challenges,
Dashboard, Contact, plus the Apply CTA — and moved "Internship" and "Community"
(both homepage anchors) into the footer only, which now lists every section on the
site. This keeps the header usable long-term as more pages get added in later tasks.

## Built with
HTML5 + CSS3 + JavaScript (no frameworks). Fonts: Space Grotesk (headings) and Inter (body) via Google Fonts.

## Developer note — Task 1 (Homepage)
I designed this around the idea of TechBridge as a "bridge" — the hero uses two
connected lines echoing the circuit mark in the logo, in the brand's navy and green,
instead of a generic hero image. I built out navigation, hero, about, programs,
internship details with a 3-step process, an application CTA, a community section,
contact, and a responsive footer, all in plain HTML/CSS with a mobile nav toggle. I
learned how much a page's personality comes from just two or three consistent visual
motifs (the connector lines, the left-accent program cards) reused instead of adding
new decoration per section. The main challenge was avoiding generic "AI template"
patterns — I kept revisiting the layout to cut anything that felt like a default
rounded-card-with-shadow treatment and replaced it with something tied to the brand.

## Developer note — Task 2 (Programs experience)
For Task 2 I built a dedicated `programs.html` rather than expanding the homepage
section, so each program could get real room to breathe. I gave Data Analytics and
Web Development each their own full section with a one-line differentiator, a skills
list as tag-style pills, and a small illustrative graphic (a bar/trend chart for Data
Analytics, a browser window for Web Development) — color-coded navy vs. green so the
two are easy to tell apart at a glance, plus a short "not sure which one fits" section
for anyone undecided. I reused the exact nav, buttons, type scale, and footer from
Task 1 so it reads as one site, not two. I learned that consistency is mostly about
reusing the same handful of CSS variables and component classes rather than
introducing new ones. The main challenge was differentiating two programs visually
without adding new brand colors — I solved it by using navy and green as the two
"identity" colors instead of introducing a third.

## Developer note — Task 3 (Internship Tasks experience)
I presented the 8 tasks as a vertical timeline rather than a plain grid, since the
brief's core ask was communicating a *sequence* (day 1 through day 26) and a
progression in difficulty — a timeline makes both of those visible at a glance in a
way a grid of equal-sized cards wouldn't. Each task card shows its day, title,
description, a status pill (Completed / In progress / Upcoming, reflecting where the
internship actually stands right now), and a difficulty tag that shifts from green
(beginner) to navy (advanced) as you scroll down, reinforcing the progression
visually as well as in text. I reused the same nav, cards, and pill/tag patterns
already established on the Programs page so it reads as the same site. I learned
that a timeline's connecting line does a lot of communication work on its own, before
any text is read. The main challenge was keeping 8 items from feeling repetitive —
the status and difficulty variation across cards is what keeps each one visually
distinct despite sharing one layout.

## Developer note — Task 4 (Interactive two-track roadmap)
I structured the two tracks as plain JavaScript objects — `webDevelopmentTasks` and
`dataAnalyticsTasks` — each an array of 8 task objects with number, title, day,
description, and difficulty, grouped under a `tracks` object keyed by
`webDevelopment` / `dataAnalytics` so the rest of the code never needs to know the
track names directly. A `currentTrack` variable holds the active selection, and a
single `renderTrack(trackKey)` function clears the timeline and rebuilds it with
`createElement`/`appendChild` DOM calls, so switching tracks is really just "run the
same render function with a different array." The two track buttons each have a
click event listener that calls `renderTrack` with their `data-track` value, and
conditional logic maps each difficulty string and status to the right CSS class.
Web Development also carries a `status` field (done/current/upcoming) reflecting
real progress through the internship, while Data Analytics tasks simply omit that
field — an `if (task.status)` check means the status pill only renders when one
exists, so the same card-building function works for both tracks without branching
on which track it is. The trickiest part was actually a compatibility bug, not a
design one: I initially called `.forEach` directly on the `NodeList` from
`querySelectorAll`, which works in current browsers but isn't guaranteed everywhere;
wrapping it in `Array.from(...)` first fixed it and made the code more portable. I
tested by checking the data arrays independently (all 8 tasks, correct days,
correct difficulty order for both tracks) before wiring up the UI, which made it
easy to trust the rendering logic once the data was verified correct.

## Developer note — Task 5 (Challenge Hub)
I built the Challenge Hub as its own page with 8 challenges — 4 per track — each one
an array of plain objects (name, track, difficulty, description, outcome, plus
modal-only fields like objective/skills/tools/time). Filtering uses two independent
state variables, `currentTrackFilter` and `currentDifficultyFilter`; a single
`matchesFilters()` function checks a challenge against both with simple AND logic,
so "Data Analytics + Advanced" narrows to exactly the cards matching both, not just
one. Clicking "View Challenge" calls `openModal(id)`, which looks the challenge up
with `Array.prototype.find` and fills in a single reusable modal — no per-challenge
markup duplicated in the HTML. The modal closes via its own button, a click on the
dark overlay (but not the modal itself), or Escape. I learned that filtering two
independent dimensions is really just "render whatever currently passes both
checks" — the UI never needs to know it's combining two filters, it just re-renders
from the same source array every time either one changes. The trickiest problem
wasn't the filtering logic at all: I found two real cross-browser bugs while
testing rather than just eyeballing the code. First, `const modalOverlay =
document.getElementById("modalOverlay")` (and several others like it) is a genuine
Safari/WebKit SyntaxError — declaring a `const`/`let` with the same name as an
element's `id` throws "Can't create duplicate variable that shadows a global
property" in Safari, because elements with an `id` are auto-exposed as global
`window` properties. I fixed it by suffixing every DOM reference variable with `El`
(`modalOverlayEl`, `challengeGridEl`, etc.) across every page, including the nav
toggle script that's been on every page since Task 1. Second, the modal used the
CSS `inset: 0` shorthand, which isn't supported in Safari before version 14.1 —
without it, the overlay had no defined position and never actually appeared even
though the JavaScript correctly removed its `hidden` attribute. I replaced it with
explicit `top/right/bottom/left: 0`. Both were confirmed as real, documented browser
issues, not just my own test setup being outdated — worth fixing given how many
visitors (and possibly graders) use Safari or an iPhone.

## Developer note — Task 6 (Intern Dashboard)
The dashboard is built around one array, `internTasks` — 8 objects with number,
title, description, and status (`completed` / `in-progress` / `not-started`). Every
other part of the page reads from this same array: `updateProgress()` counts
completed tasks and writes the count, remaining count, percentage, and progress-bar
width in one pass; `renderTasks()` filters the array by the active status filter and
rebuilds the task grid; the "View Task" modal looks a task up by number with
`Array.prototype.find`. Marking a task complete just sets `task.status =
"completed"` on that one object, then calls `updateProgress()` and `renderTasks()`
again — the UI has no separate "completed count" variable to keep in sync, so it
can't drift out of sync with the underlying data. The technology explorer
(Next.js / Vue.js / Angular / Backend) works the same way against a second object,
`techData`, keyed by technology, with the backend entry carrying an extra `items`
array so its panel can list Node.js, Express.js, Django, and Laravel without special-
casing that one button. Tasks 7 and 8 are shown as "To be announced" rather than
guessed titles, since the two most recent briefs have both renamed and reordered
tasks from the originally-announced list, so inventing specific titles for unrevealed
tasks would likely just be wrong. I found two real bugs by testing interactions
directly rather than only reading the code back. First, the technology buttons used
a `data-tech` attribute while the shared active-button helper checked
`dataset.value` — the content still switched correctly, but no button ever visually
looked selected, since the two attribute names never matched. I renamed the
buttons to use `data-value` like every other filter group on the site, so one
helper function now works for all of them. Second, and more subtle: the task
modal's "Mark as Completed" button stayed visible even when I set its `hidden`
property to `true` on a completed task. It turned out `.btn`'s own `display:
inline-block` rule was silently beating the browser's default `[hidden] {
display: none }` styling, because normal author-stylesheet rules always outrank
normal user-agent rules in the CSS cascade, regardless of selector specificity — a
real, reproducible browser behavior I confirmed with an isolated test page, not
just a guess. I fixed the immediate case and then added one global rule,
`[hidden] { display: none !important; }`, so this exact class of bug can't recur on
any future element regardless of what other classes it has.

## Sample dashboard content
The dashboard shows a sample intern ("Uche", Web Development track) since the brief
allows a placeholder name here — edit the `welcomeName` and `welcomeTrack` elements
near the top of `dashboard.html` to change it.

## Notes on placeholder links
The application form and WhatsApp community links were not available at the time of
building these tasks, so all CTA buttons currently point to `#` and are marked with a
short "link to be added" note beneath them. Swap in the real links across `index.html`,
`programs.html`, `tasks.html`, and `challenges.html`:
- Search for `Open the application form` / `Apply for TechBridge Internship` /
  `Apply for this program` to update the application link.
- Search for `Join on WhatsApp` to update the community link.
