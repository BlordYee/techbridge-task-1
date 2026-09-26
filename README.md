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

The backend now serves the frontend too — one running process, one URL,
nothing to keep in sync. Starting the server is the only step:

```bash
cd backend
npm install
npm start
```
You should see:
```
TechBridge Task Management running on port 3000
Try it: http://localhost:3000/api/tasks
```
Leave this running, then open **http://localhost:3000/** in a browser —
that's the actual TechBridge homepage now, served by Express. Go to
**http://localhost:3000/dashboard.html** for the dashboard itself. There's
nothing to open as a separate file and no URL to edit — `dashboard.js`
calls the API with a relative path, so it automatically works wherever
this ends up running (locally, on Replit, anywhere).

**To see the "offline" behavior**, stop the server (Ctrl+C in its
terminal) — you obviously can't refresh a page it's no longer serving,
so instead open dev tools' Network tab set to "Offline", or just note
that any `fetch` here fails the same way if the process ever stops.

## Running this with no laptop (Replit)

Since the whole site is now one Express app, this deploys cleanly to
[Replit](https://replit.com), which runs entirely in a browser (there's a
mobile app too) and gives you a live public URL — a solid way to view and
screen-record this without a computer:

1. Push this project to GitHub (same as your earlier tasks).
2. On replit.com: **Create Repl → Import from GitHub** → paste your repo URL.
3. Once it imports, open the **Shell** tab and run:
   ```bash
   cd backend && npm install
   ```
4. Set the Run command so Replit starts the server from the right folder —
   in the `.replit` file (or the Run button's settings), set it to:
   ```
   cd backend && npm start
   ```
5. Tap **Run**. Replit opens a live preview with its own public URL
   (something like `https://your-repl-name.username.repl.co`) — that's
   your homepage, and `/dashboard.html` on that same URL is your dashboard.
6. Screen record directly from that browser tab — no separate frontend
   deployment, no URL to configure, no CORS to worry about.

One thing to know: task status updates are stored in memory, not a
database, so they can reset if Replit restarts or puts the app to sleep
after inactivity — expected behavior for this stage of the project, not
a bug (see the API documentation section below).

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
where the project actually stands. I later had `server.js` also serve
the frontend folder with `express.static()`, so the whole site and the
API share one origin — `dashboard.js`'s fetch calls use a relative path
rather than a hardcoded `http://localhost:3000`, so the exact same code
works unmodified wherever this gets deployed, without editing a URL by
hand each time.

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
