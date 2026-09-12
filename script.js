/* =========================================================
   TechBridge — Interactive Internship Roadmap
   Task 4: track selection + dynamic rendering with JavaScript
   ========================================================= */

// ---------- 1. DATA: objects + arrays ----------
// Each task is an object. Each track is an array of those objects.

const webDevelopmentTasks = [
  {
    number: 1,
    title: "Build the TechBridge Homepage",
    day: 1,
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    difficulty: "Beginner",
    status: "done"
  },
  {
    number: 2,
    title: "Build the TechBridge Programs Experience",
    day: 4,
    description: "Create a Programs experience presenting TechBridge's available learning programs.",
    difficulty: "Beginner",
    status: "done"
  },
  {
    number: 3,
    title: "Build the Internship Tasks Experience",
    day: 8,
    description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
    difficulty: "Beginner → Intermediate",
    status: "done"
  },
  {
    number: 4,
    title: "Build an Interactive Internship Roadmap",
    day: 11,
    description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks. You're using it right now.",
    difficulty: "Beginner → Intermediate",
    status: "current"
  },
  {
    number: 5,
    title: "Build the Intern Registration Experience",
    day: 15,
    description: "Create a professional registration and onboarding interface for TechBridge interns.",
    difficulty: "Intermediate",
    status: "upcoming"
  },
  {
    number: 6,
    title: "Build the Task Submission System",
    day: 19,
    description: "Create an interface through which interns can prepare and submit their task work.",
    difficulty: "Intermediate",
    status: "upcoming"
  },
  {
    number: 7,
    title: "Build the Intern Dashboard",
    day: 22,
    description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
    difficulty: "Intermediate",
    status: "upcoming"
  },
  {
    number: 8,
    title: "Build the Complete TechBridge Internship Platform",
    day: 26,
    description: "Combine the different components created during the internship into a complete TechBridge platform.",
    difficulty: "Intermediate",
    status: "upcoming"
  }
];

const dataAnalyticsTasks = [
  {
    number: 1,
    title: "Data Cleaning Basics",
    day: 1,
    description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
    difficulty: "Beginner"
  },
  {
    number: 2,
    title: "Formulas & Pivot Tables",
    day: 4,
    description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
    difficulty: "Beginner"
  },
  {
    number: 3,
    title: "Data Visualization",
    day: 8,
    description: "Create charts and a simple dashboard that communicate useful insights from a dataset.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 4,
    title: "Introduction to SQL",
    day: 11,
    description: "Practice basic SQL queries and use them to answer real-world questions about data.",
    difficulty: "Beginner → Intermediate"
  },
  {
    number: 5,
    title: "SQL Joins & Aggregations",
    day: 15,
    description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
    difficulty: "Intermediate"
  },
  {
    number: 6,
    title: "Lookup Functions & Data Wrangling",
    day: 19,
    description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
    difficulty: "Intermediate"
  },
  {
    number: 7,
    title: "Mini Analysis Project",
    day: 22,
    description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
    difficulty: "Intermediate"
  },
  {
    number: 8,
    title: "Capstone Project",
    day: 26,
    description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
    difficulty: "Intermediate"
  }
];

// A track is itself an object: a label plus its array of tasks.
const tracks = {
  webDevelopment: {
    label: "Web Development",
    accent: "web",
    tasks: webDevelopmentTasks
  },
  dataAnalytics: {
    label: "Data Analytics",
    accent: "data",
    tasks: dataAnalyticsTasks
  }
};

// ---------- 2. STATE: a variable that tracks the current selection ----------
let currentTrack = "webDevelopment";

// ---------- 3. DOM REFERENCES ----------
const timelineEl = document.getElementById("taskTimeline");
const cvTrackNameEl = document.getElementById("cvTrackName");
const currentlyViewingEl = document.getElementById("currentlyViewing");
const trackButtons = Array.from(document.querySelectorAll(".track-btn"));

// ---------- 4. HELPER FUNCTIONS ----------

// Conditional logic: map a difficulty label to a CSS class
function difficultyClass(difficulty) {
  if (difficulty === "Beginner") return "difficulty-beginner";
  if (difficulty === "Beginner → Intermediate") return "difficulty-beginner-int";
  if (difficulty === "Intermediate") return "difficulty-intermediate";
  if (difficulty === "Intermediate → Advanced") return "difficulty-intermediate-adv";
  if (difficulty === "Advanced") return "difficulty-advanced";
  return "difficulty-intermediate";
}

// Conditional logic: map a task status to a label + class (Web Development only)
function statusInfo(status) {
  if (status === "done") return { label: "Completed", className: "status-done" };
  if (status === "current") return { label: "In progress", className: "status-current" };
  return { label: "Upcoming", className: "status-upcoming" };
}

// Build one <li> task card using DOM manipulation
function createTaskCard(task, index, totalTasks) {
  const li = document.createElement("li");
  li.className = "timeline-item";
  if (task.status === "done") li.classList.add("is-done");
  if (task.status === "current") li.classList.add("is-current");
  if (index === totalTasks - 1) li.classList.add("is-last");

  const marker = document.createElement("div");
  marker.className = "timeline-marker";

  const dayEl = document.createElement("span");
  dayEl.className = "timeline-day";
  dayEl.textContent = `Day ${task.day}`;

  const dot = document.createElement("span");
  dot.className = "timeline-dot";

  marker.appendChild(dayEl);
  marker.appendChild(dot);

  const card = document.createElement("article");
  card.className = "task-card";

  const top = document.createElement("div");
  top.className = "task-card-top";

  const numberEl = document.createElement("span");
  numberEl.className = "task-number";
  numberEl.textContent = `Task ${task.number}`;
  top.appendChild(numberEl);

  // Status pill only exists on tasks that have a status (Web Development track)
  if (task.status) {
    const info = statusInfo(task.status);
    const pill = document.createElement("span");
    pill.className = `status-pill ${info.className}`;
    pill.textContent = info.label;
    top.appendChild(pill);
  }

  const titleEl = document.createElement("h3");
  titleEl.textContent = task.title;

  const descEl = document.createElement("p");
  descEl.textContent = task.description;

  const diffEl = document.createElement("span");
  diffEl.className = `difficulty-tag ${difficultyClass(task.difficulty)}`;
  diffEl.textContent = task.difficulty;

  card.appendChild(top);
  card.appendChild(titleEl);
  card.appendChild(descEl);
  card.appendChild(diffEl);

  li.appendChild(marker);
  li.appendChild(card);

  return li;
}

// Render the full timeline for a given track key
function renderTrack(trackKey) {
  const track = tracks[trackKey];
  if (!track) return; // conditional guard

  currentTrack = trackKey;

  // Clear previous content, then rebuild with DOM manipulation
  timelineEl.innerHTML = "";
  track.tasks.forEach((task, index) => {
    const card = createTaskCard(task, index, track.tasks.length);
    timelineEl.appendChild(card);
  });

  // Update the "Currently viewing" indicator
  cvTrackNameEl.textContent = track.label.toUpperCase();
  currentlyViewingEl.classList.remove("accent-web", "accent-data");
  currentlyViewingEl.classList.add(track.accent === "web" ? "accent-web" : "accent-data");

  // Update button active states
  trackButtons.forEach((btn) => {
    const isActive = btn.dataset.track === trackKey;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

// ---------- 5. EVENT LISTENERS ----------
trackButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    renderTrack(btn.dataset.track);
  });
});

// ---------- 6. INITIAL RENDER ----------
renderTrack(currentTrack);
