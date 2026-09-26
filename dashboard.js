/* =========================================================
   TechBridge — Intern Dashboard
   Task 7: the task tracker now talks to a real backend.
   Task data is requested from the Express API (Task 7) instead
   of being hardcoded here. The Challenge Hub connector and the
   Modern Web Technologies explorer below are unchanged from
   Task 6 — this task is specifically about the task tracker.
   ========================================================= */

// ---------- 1. CONFIG ----------
// Left empty on purpose: the backend (backend/server.js) now serves this
// frontend itself, so the API lives on the exact same origin this page
// was loaded from — a relative path like "/api/tasks" already resolves
// correctly whether that origin is http://localhost:3000, a Replit URL,
// or anywhere else this gets deployed. Nothing to edit here.
const API_BASE_URL = "";

// ---------- 2. STATE ----------
// internTasks now starts empty and is populated by fetchAllTasks() below,
// instead of being written out by hand.
let internTasks = [];
let currentTaskFilter = "all";
let currentTechKey = "nextjs";
let modalOpenTaskId = null;

// ---------- 3. DATA: technology explorer content (unchanged from Task 6) ----------

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
    description: "Backend development is what happens behind the scenes of a website — the server that stores data, runs business logic, and responds to requests from the frontend (the part people see and click on in their browser). This dashboard's task tracker is a small example: the frontend you're looking at requests data from an Express server over a REST API. A few commonly used backend technologies:",
    items: [
      { name: "Node.js", blurb: "A JavaScript runtime that lets developers build servers using the same language as the frontend." },
      { name: "Express.js", blurb: "A lightweight Node.js framework for building web servers and APIs quickly — it's what powers this dashboard's backend." },
      { name: "Django", blurb: "A Python framework known for helping developers build secure, database-backed backends fast." },
      { name: "Laravel", blurb: "A PHP framework popular for building web applications with a clean, expressive syntax." }
    ]
  }
};

// ---------- 4. DOM REFERENCES ----------
// Every variable below is suffixed so it never shares a name with an
// element's id (a bare match can throw in Safari/WebKit).
const apiStatusTextEl = document.getElementById("apiStatusText");
const apiStatusDotEl = document.getElementById("apiStatusDot");

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
const taskModalErrorEl = document.getElementById("taskModalError");

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

// ---------- 6. API STATUS INDICATOR ----------

function setApiStatus(connected) {
  if (connected) {
    apiStatusTextEl.textContent = "Connected";
    apiStatusDotEl.className = "api-status-dot api-status-connected";
  } else {
    apiStatusTextEl.textContent = "Offline";
    apiStatusDotEl.className = "api-status-dot api-status-offline";
  }
}

// ---------- 7. PROGRESS CALCULATION ----------

function updateProgress() {
  const total = internTasks.length;

  if (total === 0) {
    statCompletedEl.textContent = "—";
    statRemainingEl.textContent = "—";
    statPercentEl.textContent = "—";
    progressBarFillEl.style.width = "0%";
    progressCaptionEl.textContent = "Waiting for task data…";
    return;
  }

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

// ---------- 8. TASK CARD RENDERING ----------

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
  numberBadge.textContent = "Task " + task.id;

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
    openTaskModal(task.id);
  });
  actions.appendChild(viewBtn);

  if (task.status !== "completed") {
    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "btn btn-primary";
    completeBtn.textContent = "Mark as Completed";
    completeBtn.addEventListener("click", function () {
      markTaskCompleted(task.id);
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

function showTaskGridMessage(message, isError) {
  taskGridEl.innerHTML = "";
  const p = document.createElement("p");
  p.className = isError ? "task-grid-error" : "task-grid-loading";
  p.textContent = message;
  taskGridEl.appendChild(p);
}

function setActiveFilterButton(group, value) {
  Array.from(group.querySelectorAll(".filter-btn")).forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === value);
  });
}

// ---------- 9. LOADING ALL TASKS FROM THE API ----------

async function fetchAllTasks() {
  showTaskGridMessage("Loading tasks…", false);

  try {
    const response = await fetch(API_BASE_URL + "/api/tasks");
    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }
    const data = await response.json();

    internTasks = data;
    setApiStatus(true);
    updateProgress();
    renderTasks();
  } catch (error) {
    internTasks = [];
    setApiStatus(false);
    updateProgress();
    showTaskGridMessage(
      "Unable to load tasks. Please check your connection or try again.",
      true
    );
  }
}

// ---------- 10. MARK TASK COMPLETED (PUT request) ----------

async function markTaskCompleted(taskId) {
  try {
    const response = await fetch(API_BASE_URL + "/api/tasks/" + taskId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" })
    });

    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }

    const updatedTask = await response.json();
    setApiStatus(true);

    // Update the matching task in our local copy so the grid and
    // progress numbers reflect the change immediately.
    const task = internTasks.find(function (t) {
      return t.id === taskId;
    });
    if (task) {
      task.status = updatedTask.status;
    }

    updateProgress();
    renderTasks();

    if (modalOpenTaskId === taskId) {
      openTaskModal(taskId);
    }
  } catch (error) {
    setApiStatus(false);
    window.alert("Couldn't update that task right now. Please check that the backend server is running and try again.");
  }
}

// ---------- 11. TASK DETAIL MODAL (GET one task) ----------

async function openTaskModal(taskId) {
  modalOpenTaskId = taskId;
  taskModalErrorEl.hidden = true;
  taskModalActionBtnEl.hidden = true;

  taskModalNumberEl.textContent = "Task " + taskId;
  taskModalStatusEl.textContent = "";
  taskModalTitleEl.textContent = "Loading…";
  taskModalDescriptionEl.textContent = "";

  taskModalOverlayEl.hidden = false;
  document.body.classList.add("modal-open");

  try {
    const response = await fetch(API_BASE_URL + "/api/tasks/" + taskId);
    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }
    const task = await response.json();
    setApiStatus(true);

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
  } catch (error) {
    setApiStatus(false);
    taskModalTitleEl.textContent = "Task " + taskId;
    taskModalErrorEl.hidden = false;
    taskModalErrorEl.textContent = "Unable to load this task's details. Please check your connection or try again.";
  }
}

function closeTaskModal() {
  taskModalOverlayEl.hidden = true;
  document.body.classList.remove("modal-open");
  modalOpenTaskId = null;
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
  if (modalOpenTaskId !== null) {
    markTaskCompleted(modalOpenTaskId);
  }
});

// ---------- 12. TASK FILTER EVENT LISTENERS ----------

Array.from(taskFilterGroupEl.querySelectorAll(".filter-btn")).forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentTaskFilter = btn.dataset.value;
    setActiveFilterButton(taskFilterGroupEl, currentTaskFilter);
    renderTasks();
  });
});

// ---------- 13. TECH EXPLORER (unchanged from Task 6) ----------

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

// ---------- 14. INITIAL LOAD ----------
updateProgress();
fetchAllTasks();
renderTech(currentTechKey);
