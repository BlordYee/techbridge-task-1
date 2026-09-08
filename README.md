# TechBridge — Website (Tasks 1, 2 & 3)

Website for TechBridge by Baselink Services Limited, built for the TechBridge Web Development Internship.

## Structure
```
techbridge-task-3/
├── index.html
├── programs.html
├── tasks.html
├── style.css
└── images/
    └── techbridge-logo.png
```

`index.html` is the homepage (Task 1). `programs.html` is the dedicated Programs experience (Task 2). `tasks.html` is the Internship Tasks experience (Task 3) — a timeline of all 8 internship tasks, their days, descriptions, difficulty, and status. All three share the same `style.css` and navigation/footer for visual consistency.

## Built with
HTML5 + CSS3 (no frameworks). Fonts: Space Grotesk (headings) and Inter (body) via Google Fonts.

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

## Notes on placeholder links
The application form and WhatsApp community links were not available at the time of
building these tasks, so all CTA buttons currently point to `#` and are marked with a
short "link to be added" note beneath them. Swap in the real links across `index.html`,
`programs.html`, and `tasks.html`:
- Search for `Open the application form` / `Apply for TechBridge Internship` /
  `Apply for this program` to update the application link.
- Search for `Join on WhatsApp` to update the community link.
