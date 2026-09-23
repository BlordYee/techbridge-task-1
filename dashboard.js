/* =========================================================
   TechBridge — Intern Dashboard
   Task 6: dynamic task tracker, live progress, filtering,
   a task detail modal, and an interactive tech explorer.
   ========================================================= */

// ---------- 1. DATA: an array of task objects ----------
// Tasks 1-6 reflect this project's real build history.
// Tasks 7-8 haven't been announced yet, so they're placeholders.

const internTasks = [
  {
    number: 1,
    title: "TechBridge Homepage",
    description: "Design and build the first version of the TechBridge website using HTML and CSS.",
    status: "completed"
  },
  {
    number: 2,
    title: "TechBridge Programs Experience",
    description: "Create a dedicated page presenting TechBridge's Data Analytics and Web Development programs.",
    status: "completed"
  },
  {
    number: 3,
    title: "Internship Tasks Experience",
    description: "Build an interface presenting the internship's 8-task journey and its progression.",
    status: "completed"
  },
  {
    number: 4,
    title: "Interactive Internship Roadmap",
    description: "Use JavaScript to let visitors switch between the Data Analytics and Web Development tracks.",
    status: "completed"
  },
  {
    number: 5,
    title: "TechBridge Challenge Hub",
    description: "Build an interactive hub of practice challenges with track and difficulty filtering.",
    status: "completed"
  },
  {
    number: 6,
    title: "Intern Dashboard",
    description: "Build an interactive dashboard where interns can track progress, manage tasks, and explore technologies. You're using it right now.",
    status: "in-progress"
  },
  {
    number: 7,
    title: "To be announced",
    description: "Details for this task haven't been shared yet — check back once TechBridge announces it.",
    status: "not-started"
  },
  {
    number: 8,
    title: "To be announced",
    description: "Details for this task haven't been shared yet — check back once TechBridge announces it.",
    status: "not-started"
  }
];

// ---------- 2. DATA: technology explorer content ----------

const techData = {
  nextjs: {
    name: "Next.js",
    tag: "Frontend framework",
    description: "Next.js is a React framework for building production web applications. It adds server-side rendering, static site generation, and built-in routing on top of React, so teams don't have to wire all of that up by hand.",
    items: null
  },
  vuejs: {
    name: "Vue.js",
    tag: "Frontend framework",
    description: "Vue.js is a progressive JavaScript framework for building user interfaces. It's designed to be adopted incrementally — you can use it for a single interactive component or scale it up to a full single-page application.",
    items: null
  },
  angular: {
    name: "Angular",
    tag: "Frontend framework",
    description: "Angular is a full-featured, opinionated framework built by Google, using TypeScript. It comes with routing, forms, and HTTP handling built in, making it a common choice for large, structured applications built by bigger teams.",
    items: null
  },
  backend: {
    name: "Backend Development",
    tag: "Server-side",
    description: "Backend development is what happens behind the scenes of a website — the server that stores data, runs business logic, and responds to requests from the frontend (the part people see and click on in their browser). A few commonly used backend technologies:",
    items: [
      { name: "Node.js", blurb: "A JavaScript runtime that lets developers build servers using the same language as the frontend." },
      { name: "Express.js", blurb: "A lightweight Node.js framework for building web servers and APIs quickly." },
      { name: "Django", blurb: "A Python framework known for helping developers build secure, database-backed backends fast." },
      { name: "Laravel", blurb: "A PHP framework popular for building web applications with a clean, expressive syntax." }
    ]
  }
};

// ---------- 3. STATE ----------
let currentTaskFilter = "all";
let currentTechKey = "nextjs";

// ---------- 4. DOM REFERENCES ----------
// Every variable below is suffixed so it never shares a name with
// an element's id (a bare match can throw in Safari/WebKit).
const statCompletedEl = document.getElementById("statCompleted");
const statRemainingEl = document.getElementById("statRemaining");
const statPercentEl = document.getElementById("statPercent");
const progressBarFillEl = document.getElementById("progressBarFill");
const progressCaptionEl = document.getElementById("progressCaption");

const taskFilterGroupEl = document.getElementById("taskFilterGroup");
const taskGridEl = document.getElementById("taskGrid");

const techExplorerGroupEl = document.getElementById("techExplorerGroup");
const techPanelEl = document.getElementById("techPanel");

const taskModalOverlayEl = document.getElementById("taskModalOverlay");
const taskModalCloseBtnEl = document.getElementById("taskModalCloseBtn");
const taskModalNumberEl = document.getElementById("taskModalNumber");
const taskModalStatusEl = document.getElementById("taskModalStatus");
const taskModalTitleEl = document.getElementById("taskModalTitle");
const taskModalDescriptionEl = document.getElementById("taskModalDescription");
const taskModalActionBtnEl = document.getElementById("taskModalActionBtn");

let modalOpenTaskNumber = null;

// ---------- 5. HELPERS: status labels + classes ----------

function statusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In Progress";
  return "Not Started";
}

function statusClass(status) {
  if (status === "completed") return "status-done";
  if (status === "in-progress") return "status-current";
  return "status-upcoming";
}

// ---------- 6. PROGRESS CALCULATION ----------

function updateProgress() {
  const total = internTasks.length;
  const completed = internTasks.filter(function (t) {
    return t.status === "completed";
  }).length;
  const remaining = total - completed;
  const percent = Math.round((completed / total) * 100);

  statCompletedEl.textContent = String(completed);
  statRemainingEl.textContent = String(remaining);
  statPercentEl.textContent = percent + "%";
  progressBarFillEl.style.width = percent + "%";
  progressCaptionEl.textContent = completed + " / " + total + " tasks completed";
}

// ---------- 7. TASK CARD RENDERING ----------

function matchesTaskFilter(task) {
  return currentTaskFilter === "all" || task.status === currentTaskFilter;
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card-item status-border-" + task.status;

  const top = document.createElement("div");
  top.className = "task-card-top";

  const numberBadge = document.createElement("span");
  numberBadge.className = "task-number-badge";
  numberBadge.textContent = "Task " + task.number;

  const statusPill = document.createElement("span");
  statusPill.className = "status-pill " + statusClass(task.status);
  statusPill.textContent = statusLabel(task.status);

  top.appendChild(numberBadge);
  top.appendChild(statusPill);

  const title = document.createElement("h3");
  title.textContent = task.title;

  const desc = document.createElement("p");
  desc.className = "task-card-desc";
  desc.textContent = task.description;

  const actions = document.createElement("div");
  actions.className = "task-card-actions";

  const viewBtn = document.createElement("button");
  viewBtn.type = "button";
  viewBtn.className = "btn btn-ghost";
  viewBtn.textContent = "View Task";
  viewBtn.addEventListener("click", function () {
    openTaskModal(task.number);
  });
  actions.appendChild(viewBtn);

  if (task.status !== "completed") {
    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "btn btn-primary";
    completeBtn.textContent = "Mark as Completed";
    completeBtn.addEventListener("click", function () {
      markTaskCompleted(task.number);
    });
    actions.appendChild(completeBtn);
  }

  card.appendChild(top);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(actions);

  return card;
}

function renderTasks() {
  taskGridEl.innerHTML = "";
  internTasks.filter(matchesTaskFilter).forEach(function (task) {
    taskGridEl.appendChild(createTaskCard(task));
  });
}

function setActiveFilterButton(group, value) {
  Array.from(group.querySelectorAll(".filter-btn")).forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === value);
  });
}

// ---------- 8. MARK TASK COMPLETED ----------

function markTaskCompleted(taskNumber) {
  const task = internTasks.find(function (t) {
    return t.number === taskNumber;
  });
  if (!task) return;

  task.status = "completed";
  updateProgress();
  renderTasks();

  // If the modal for this task is currently open, refresh it in place
  if (modalOpenTaskNumber === taskNumber) {
    openTaskModal(taskNumber);
  }
}

// ---------- 9. TASK DETAIL MODAL ----------

function openTaskModal(taskNumber) {
  const task = internTasks.find(function (t) {
    return t.number === taskNumber;
  });
  if (!task) return;

  modalOpenTaskNumber = taskNumber;

  taskModalNumberEl.textContent = "Task " + task.number;
  taskModalStatusEl.textContent = statusLabel(task.status);
  taskModalStatusEl.className = "status-pill " + statusClass(task.status);
  taskModalTitleEl.textContent = task.title;
  taskModalDescriptionEl.textContent = task.description;

  if (task.status === "completed") {
    taskModalActionBtnEl.hidden = true;
  } else {
    taskModalActionBtnEl.hidden = false;
    taskModalActionBtnEl.textContent = "Mark as Completed";
  }

  taskModalOverlayEl.hidden = false;
  document.body.classList.add("modal-open");
}

function closeTaskModal() {
  taskModalOverlayEl.hidden = true;
  document.body.classList.remove("modal-open");
  modalOpenTaskNumber = null;
}

taskModalCloseBtnEl.addEventListener("click", closeTaskModal);

taskModalOverlayEl.addEventListener("click", function (event) {
  if (event.target === taskModalOverlayEl) {
    closeTaskModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !taskModalOverlayEl.hidden) {
    closeTaskModal();
  }
});

taskModalActionBtnEl.addEventListener("click", function () {
  if (modalOpenTaskNumber !== null) {
    markTaskCompleted(modalOpenTaskNumber);
  }
});

// ---------- 10. TASK FILTER EVENT LISTENERS ----------

Array.from(taskFilterGroupEl.querySelectorAll(".filter-btn")).forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentTaskFilter = btn.dataset.value;
    setActiveFilterButton(taskFilterGroupEl, currentTaskFilter);
    renderTasks();
  });
});

// ---------- 11. TECH EXPLORER ----------

function renderTech(key) {
  const tech = techData[key];
  if (!tech) return;

  currentTechKey = key;
  techPanelEl.innerHTML = "";

  const tag = document.createElement("span");
  tag.className = "tech-tag";
  tag.textContent = tech.tag;

  const name = document.createElement("h3");
  name.textContent = tech.name;

  const desc = document.createElement("p");
  desc.className = "tech-desc";
  desc.textContent = tech.description;

  techPanelEl.appendChild(tag);
  techPanelEl.appendChild(name);
  techPanelEl.appendChild(desc);

  if (tech.items) {
    const list = document.createElement("ul");
    list.className = "tech-item-list";
    tech.items.forEach(function (item) {
      const li = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = item.name + ": ";
      li.appendChild(strong);
      li.appendChild(document.createTextNode(item.blurb));
      list.appendChild(li);
    });
    techPanelEl.appendChild(list);
  }

  setActiveFilterButton(techExplorerGroupEl, key);
}

Array.from(techExplorerGroupEl.querySelectorAll(".filter-btn")).forEach(function (btn) {
  btn.addEventListener("click", function () {
    renderTech(btn.dataset.value);
  });
});

// ---------- 12. INITIAL RENDER ----------
updateProgress();
renderTasks();
renderTech(currentTechKey);
