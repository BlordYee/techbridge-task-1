# TechBridge Task Management (Tasks 1–7)

The TechBridge website, now with a real backend. Tasks 1–6 built a static
site; Task 7 adds a small Express API and connects the Intern Dashboard to
it with `fetch()`, so task data comes from real HTTP requests instead of
being hardcoded in the page.

## Project structure
```
techbridge-task-management/
├── frontend/
│   ├── index.html
│   ├── programs.html
│   ├── tasks.html
│   ├── challenges.html
│   ├── dashboard.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── script.js        (Roadmap page, Tasks 3–4)
│   │   ├── challenges.js    (Challenge Hub, Task 5)
│   │   └── dashboard.js     (Intern Dashboard, Tasks 6–7)
│   └── images/
│       └── techbridge-logo.png
│
└── backend/
    ├── server.js
    ├── package.json
    ├── .gitignore
    └── data/
        └── tasks.json
```

## How to run it

**1. Start the backend** (do this first — the dashboard needs it running):
```bash
cd backend
npm install
npm start
```
You should see:
```
TechBridge Task Management API running at http://localhost:3000
Try it: http://localhost:3000/api/tasks
```
Leave this terminal open. Visit `http://localhost:3000/api/tasks` in a
browser to confirm you get back a JSON array of 8 tasks.

**2. Open the frontend.** With the backend still running, open
`frontend/dashboard.html` directly in a browser (double-click it, or use
a simple static server / VS Code's Live Server extension). The dashboard
will fetch its task data from `http://localhost:3000` automatically.

**3. To see the "offline" behavior**, stop the backend (Ctrl+C in its
terminal) and refresh the dashboard — it should show "Unable to load
tasks" and "Backend Status: Offline" instead of a blank page.

The rest of the site (`index.html`, `programs.html`, `tasks.html`,
`challenges.html`) doesn't need the backend running — only the dashboard's
task tracker does.

## API documentation

| Method | Endpoint            | Purpose                                            |
|--------|----------------------|-----------------------------------------------------|
| GET    | `/api/tasks`         | Returns all 8 tasks as a JSON array.                |
| GET    | `/api/tasks/:id`     | Returns one task by id, or a 404 if it doesn't exist.|
| PUT    | `/api/tasks/:id`     | Updates a task's status. Body: `{ "status": "completed" }`. Accepts `"completed"`, `"in-progress"`, or `"not-started"`; anything else returns a 400. |

Each task object looks like:
```json
{
  "id": 1,
  "title": "TechBridge Homepage",
  "description": "Design and build the first version of the TechBridge website using HTML and CSS.",
  "status": "completed"
}
```

Task status updates are kept in memory for the life of the running
server — restarting the server reloads the original data from
`data/tasks.json`. Writing every change back to disk (or a real
database) is listed as an optional stretch goal in the brief, not a
requirement for the main task.

The server also sends CORS headers (`Access-Control-Allow-Origin: *`) so
the dashboard can call it whether it's opened as a local file, served
from a different port, or eventually deployed somewhere else entirely.

## Developer note — Task 7 (Task Management API)
I split the project into `frontend/` and `backend/` folders, since this
task's whole point was separating "where the data lives" from "what
displays it" — something a single flat folder can't really demonstrate.
The backend is a small Express app with three routes (`GET /api/tasks`,
`GET /api/tasks/:id`, `PUT /api/tasks/:id`) backed by one in-memory array
loaded from `tasks.json` at startup. On the frontend, `dashboard.js` no
longer hardcodes a task list — `fetchAllTasks()` requests `/api/tasks` on
load, shows "Loading tasks…" while it waits, and either renders the real
data or shows "Unable to load tasks" if the request fails. "Mark as
Completed" now sends a `PUT` request and only updates the on-screen
count, percentage, and bar once the server actually confirms the change,
rather than assuming it worked. "View Task" does its own fresh
`GET /api/tasks/:id` each time it's clicked, per the brief, instead of
reusing whatever was already loaded. I updated Task 8's record and left
it "To be announced" as before, but updated Task 7 itself to its real
title now that this brief exists, and moved Task 6 to "completed" since
we've moved past it — the dashboard's progress numbers still reflect
where the project actually stands.

The trickiest part wasn't the Express routes themselves — those are
standard and I was confident in that syntax — it was verifying the whole
thing actually works, given I have no internet access in this sandbox to
run `npm install express` for real. Rather than skip testing, I wrote a
small stand-in implementation of just the parts of the Express API
`server.js` uses (`app.get`, `app.put`, `app.use`, `req.params`,
`req.body`, `res.json`), used it to actually run the real, unmodified
`server.js`, and hit every endpoint with `curl` — all 8 tasks returned
correctly, a bad id returned 404, an invalid status returned 400, and a
status update was reflected on the next GET. I then went a step further
and ran the real `dashboard.js` in Node (which has built-in `fetch`)
against that live server, using a minimal mocked page instead of a real
browser, and confirmed the actual numbers it computed — completed count,
remaining count, and rounded percentage — were correct after a real fetch
and after a real status update, and that turning the server off produced
the "Offline" / "Unable to load tasks" state instead of a crash. That
stand-in server and its test scripts aren't part of what's shipped here;
they only existed to prove the real files work before handing them over.

## Notes on placeholder links
The application form and WhatsApp community links were not available at
the time of building these tasks, so all CTA buttons currently point to
`#` and are marked with a short "link to be added" note beneath them.
Swap in the real links across `index.html`, `programs.html`,
`tasks.html`, and `challenges.html`:
- Search for `Open the application form` / `Apply for TechBridge
  Internship` / `Apply for this program` to update the application link.
- Search for `Join on WhatsApp` to update the community link.
