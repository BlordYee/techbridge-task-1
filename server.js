/* =========================================================
   TechBridge Task Management API
   Task 7 — a small Express backend serving the internship
   task data that the Task 6 dashboard used to hardcode.
   ========================================================= */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const TASKS_FILE = path.join(__dirname, "data", "tasks.json");

// Load the task data once at startup. Updates during this run are kept
// in memory (see PUT /api/tasks/:id below); restarting the server reloads
// the original data from tasks.json. Persisting every change back to disk
// is listed as an optional stretch goal in the brief, not a requirement.
let tasks = JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));

// ---------- Middleware ----------

// Parse JSON request bodies (needed for PUT /api/tasks/:id)
app.use(express.json());

// Allow the frontend to call this API even when it's opened from a
// different origin (a file:// page, a separate static server/port, or a
// deployed site) rather than being served by this same Express app.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ---------- Routes ----------

// Friendly root route, mostly so visiting http://localhost:3000 in a
// browser shows something useful instead of "Cannot GET /".
app.get("/", (req, res) => {
  res.send(
    "TechBridge Task Management API is running. Try GET /api/tasks or GET /api/tasks/1"
  );
});

// GET /api/tasks — return every task
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id — return one task by id
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} was not found.` });
  }

  res.json(task);
});

// PUT /api/tasks/:id — update a task's status
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} was not found.` });
  }

  const { status } = req.body;
  const allowedStatuses = ["completed", "in-progress", "not-started"];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: `status is required and must be one of: ${allowedStatuses.join(", ")}`
    });
  }

  task.status = status;
  res.json(task);
});

// Catch-all for any other /api/* route, so a typo returns a clear JSON
// error instead of Express's default HTML "Cannot GET" page.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Unknown API route." });
});

app.listen(PORT, () => {
  console.log(`TechBridge Task Management API running at http://localhost:${PORT}`);
  console.log(`Try it: http://localhost:${PORT}/api/tasks`);
});
