# TechBridge — Website (Tasks 1 & 2)

Website for TechBridge by Baselink Services Limited, built for the TechBridge Web Development Internship.

## Structure
```
techbridge-task-2/
├── index.html
├── programs.html
├── style.css
└── images/
    └── techbridge-logo.png
```

`index.html` is the homepage (Task 1). `programs.html` is the dedicated Programs experience (Task 2), sharing the same `style.css` and navigation/footer for visual consistency.

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

## Notes on placeholder links
The application form and WhatsApp community links were not available at the time of
building this task, so both CTA buttons currently point to `#` and are marked with a
short "link to be added" note beneath them. Swap in the real links in `index.html` and
`programs.html`:
- Search for `Open the application form` / `Apply for TechBridge Internship` to update
  the application link.
- Search for `Join on WhatsApp` to update the community link.
