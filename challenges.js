/* =========================================================
   TechBridge — Challenge Hub
   Task 5: track + difficulty filtering, and a detail modal,
   all driven by JavaScript (no page reloads).
   ========================================================= */

// ---------- 1. DATA: an array of challenge objects ----------

const challenges = [
  {
    id: "da-sales-dashboard",
    name: "Sales Performance Dashboard",
    track: "dataAnalytics",
    trackLabel: "Data Analytics",
    difficulty: "Beginner",
    description: "Build a simple dashboard that summarizes a company's monthly sales using spreadsheet tools.",
    outcome: "A dashboard that highlights top products, top regions, and the overall monthly sales trend.",
    objective: "Turn a raw sales spreadsheet into a clear, decision-ready summary.",
    skills: "Spreadsheet formulas, pivot tables, basic charting.",
    tools: "Google Sheets or Excel.",
    time: "3–4 hours"
  },
  {
    id: "da-customer-cleanup",
    name: "Customer Data Cleanup",
    track: "dataAnalytics",
    trackLabel: "Data Analytics",
    difficulty: "Beginner",
    description: "Clean a messy customer contact list — duplicate rows, blank fields, and inconsistent formatting.",
    outcome: "A de-duplicated, consistently formatted customer list that's ready for further analysis.",
    objective: "Practice the unglamorous but essential first step of any real analysis: cleaning the data.",
    skills: "Data cleaning, validation, consistent formatting.",
    tools: "Google Sheets or Excel.",
    time: "2–3 hours"
  },
  {
    id: "da-expense-sql",
    name: "Expense Analysis with SQL",
    track: "dataAnalytics",
    trackLabel: "Data Analytics",
    difficulty: "Intermediate",
    description: "Use SQL queries to break down a company's expenses by category and by month.",
    outcome: "A short written report identifying the top spending categories and how spend changed month to month.",
    objective: "Practice extracting business insight directly from a database using SQL.",
    skills: "SQL SELECT, WHERE, GROUP BY, basic aggregation.",
    tools: "SQL (SQLite or a browser-based SQL sandbox).",
    time: "3–4 hours"
  },
  {
    id: "da-churn-analysis",
    name: "Customer Churn Mini-Analysis",
    track: "dataAnalytics",
    trackLabel: "Data Analytics",
    difficulty: "Advanced",
    description: "Combine data from two related tables to look for patterns behind customer churn.",
    outcome: "A short write-up naming the top 3 indicators associated with churn, backed by real numbers.",
    objective: "Practice joining and reasoning across multiple related datasets, not just one table.",
    skills: "SQL joins, aggregation, analytical reasoning.",
    tools: "SQL, spreadsheet for supporting calculations.",
    time: "4–5 hours"
  },
  {
    id: "wd-portfolio-page",
    name: "Personal Portfolio Page",
    track: "webDevelopment",
    trackLabel: "Web Development",
    difficulty: "Beginner",
    description: "Build a one-page portfolio site introducing yourself, your skills, and a couple of projects.",
    outcome: "A single-page portfolio site you could realistically deploy and share.",
    objective: "Practice structuring a clean page with semantic HTML and CSS layout.",
    skills: "Semantic HTML, CSS layout, basic styling.",
    tools: "HTML, CSS.",
    time: "3–4 hours"
  },
  {
    id: "wd-contact-form",
    name: "Contact Form UI",
    track: "webDevelopment",
    trackLabel: "Web Development",
    difficulty: "Beginner",
    description: "Build a styled contact form (name, email, message) with basic client-side validation.",
    outcome: "A working contact form that checks required fields before it lets a visitor submit.",
    objective: "Practice form structure, styling, and simple JavaScript validation.",
    skills: "HTML forms, CSS, basic JavaScript validation.",
    tools: "HTML, CSS, JavaScript.",
    time: "2–3 hours"
  },
  {
    id: "wd-product-landing",
    name: "Responsive Product Landing Page",
    track: "webDevelopment",
    trackLabel: "Web Development",
    difficulty: "Intermediate",
    description: "Build a landing page for a fictional product with a hero section, a feature grid, and pricing.",
    outcome: "A landing page that adapts cleanly across desktop, tablet, and mobile.",
    objective: "Practice responsive layout techniques beyond a single fixed-width design.",
    skills: "Flexbox and/or CSS Grid, media queries, visual hierarchy.",
    tools: "HTML, CSS.",
    time: "4–5 hours"
  },
  {
    id: "wd-interactive-quiz",
    name: "Interactive Quiz Widget",
    track: "webDevelopment",
    trackLabel: "Web Development",
    difficulty: "Advanced",
    description: "Build a short multi-question quiz that tracks the visitor's score and shows a result at the end.",
    outcome: "A working quiz that scores answers correctly and displays a final result without reloading the page.",
    objective: "Practice DOM manipulation and managing state as the visitor interacts with the page.",
    skills: "JavaScript, DOM events, conditional logic, basic state management.",
    tools: "HTML, CSS, JavaScript.",
    time: "4–5 hours"
  }
];

// ---------- 2. STATE: variables tracking the active filters ----------
let currentTrackFilter = "all";
let currentDifficultyFilter = "all";

// ---------- 3. DOM REFERENCES ----------
const challengeGridEl = document.getElementById("challengeGrid");
const noResultsEl = document.getElementById("noResults");
const resultsCountEl = document.getElementById("resultsCount");
const trackFilterGroupEl = document.getElementById("trackFilterGroup");
const difficultyFilterGroupEl = document.getElementById("difficultyFilterGroup");

const modalOverlayEl = document.getElementById("modalOverlay");
const modalCloseEl = document.getElementById("modalClose");
const modalTrackBadgeEl = document.getElementById("modalTrackBadge");
const modalDifficultyEl = document.getElementById("modalDifficulty");
const modalTitleEl = document.getElementById("modalTitle");
const modalDescriptionEl = document.getElementById("modalDescription");
const modalObjectiveEl = document.getElementById("modalObjective");
const modalSkillsEl = document.getElementById("modalSkills");
const modalToolsEl = document.getElementById("modalTools");
const modalTimeEl = document.getElementById("modalTime");
const modalOutcomeEl = document.getElementById("modalOutcome");

// ---------- 4. HELPER FUNCTIONS ----------

function difficultyClass(difficulty) {
  if (difficulty === "Beginner") return "difficulty-beginner";
  if (difficulty === "Intermediate") return "difficulty-intermediate";
  if (difficulty === "Advanced") return "difficulty-advanced";
  return "difficulty-intermediate";
}

function trackBadgeClass(track) {
  return track === "dataAnalytics" ? "track-data" : "track-web";
}

// Conditional logic: does a challenge pass both active filters?
function matchesFilters(challenge) {
  const trackMatches = currentTrackFilter === "all" || challenge.track === currentTrackFilter;
  const difficultyMatches = currentDifficultyFilter === "all" || challenge.difficulty === currentDifficultyFilter;
  return trackMatches && difficultyMatches;
}

function getFilteredChallenges() {
  return challenges.filter(matchesFilters);
}

// Build one challenge card using DOM manipulation
function createChallengeCard(challenge) {
  const card = document.createElement("article");
  card.className = "challenge-card";

  const top = document.createElement("div");
  top.className = "challenge-card-top";

  const trackBadge = document.createElement("span");
  trackBadge.className = `track-badge ${trackBadgeClass(challenge.track)}`;
  trackBadge.textContent = challenge.trackLabel;

  const diffTag = document.createElement("span");
  diffTag.className = `difficulty-tag ${difficultyClass(challenge.difficulty)}`;
  diffTag.textContent = challenge.difficulty;

  top.appendChild(trackBadge);
  top.appendChild(diffTag);

  const title = document.createElement("h3");
  title.textContent = challenge.name;

  const desc = document.createElement("p");
  desc.className = "challenge-desc";
  desc.textContent = challenge.description;

  const outcome = document.createElement("p");
  outcome.className = "challenge-outcome";
  outcome.innerHTML = "";
  const outcomeLabel = document.createElement("strong");
  outcomeLabel.textContent = "Expected outcome: ";
  outcome.appendChild(outcomeLabel);
  outcome.appendChild(document.createTextNode(challenge.outcome));

  const viewBtn = document.createElement("button");
  viewBtn.type = "button";
  viewBtn.className = "btn btn-ghost view-challenge-btn";
  viewBtn.textContent = "View Challenge";
  viewBtn.addEventListener("click", function () {
    openModal(challenge.id);
  });

  card.appendChild(top);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(outcome);
  card.appendChild(viewBtn);

  return card;
}

// Render the grid based on the current filters
function renderChallenges() {
  const filtered = getFilteredChallenges();

  challengeGridEl.innerHTML = "";

  if (filtered.length === 0) {
    noResultsEl.hidden = false;
  } else {
    noResultsEl.hidden = true;
    filtered.forEach(function (challenge) {
      challengeGridEl.appendChild(createChallengeCard(challenge));
    });
  }

  const count = filtered.length;
  resultsCountEl.textContent = `Showing ${count} challenge${count === 1 ? "" : "s"}`;
}

// Update which button in a filter group looks active
function setActiveButton(group, value) {
  const buttons = Array.from(group.querySelectorAll(".filter-btn"));
  buttons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === value);
  });
}

// ---------- 5. MODAL LOGIC ----------

function openModal(challengeId) {
  const challenge = challenges.find(function (c) {
    return c.id === challengeId;
  });
  if (!challenge) return;

  modalTrackBadgeEl.textContent = challenge.trackLabel;
  modalTrackBadgeEl.className = `track-badge ${trackBadgeClass(challenge.track)}`;

  modalDifficultyEl.textContent = challenge.difficulty;
  modalDifficultyEl.className = `difficulty-tag ${difficultyClass(challenge.difficulty)}`;

  modalTitleEl.textContent = challenge.name;
  modalDescriptionEl.textContent = challenge.description;
  modalObjectiveEl.textContent = challenge.objective;
  modalSkillsEl.textContent = challenge.skills;
  modalToolsEl.textContent = challenge.tools;
  modalTimeEl.textContent = challenge.time;
  modalOutcomeEl.textContent = challenge.outcome;

  modalOverlayEl.hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal() {
  modalOverlayEl.hidden = true;
  document.body.classList.remove("modal-open");
}

modalCloseEl.addEventListener("click", closeModal);

// Close when clicking the dark overlay itself, not the modal content
modalOverlayEl.addEventListener("click", function (event) {
  if (event.target === modalOverlayEl) {
    closeModal();
  }
});

// Close on Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modalOverlayEl.hidden) {
    closeModal();
  }
});

// ---------- 6. EVENT LISTENERS: filters ----------

Array.from(trackFilterGroupEl.querySelectorAll(".filter-btn")).forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentTrackFilter = btn.dataset.value;
    setActiveButton(trackFilterGroupEl, currentTrackFilter);
    renderChallenges();
  });
});

Array.from(difficultyFilterGroupEl.querySelectorAll(".filter-btn")).forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentDifficultyFilter = btn.dataset.value;
    setActiveButton(difficultyFilterGroupEl, currentDifficultyFilter);
    renderChallenges();
  });
});

// ---------- 7. INITIAL RENDER ----------
renderChallenges();
