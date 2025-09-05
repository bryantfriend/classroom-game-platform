CLASSROOM GAME PLATFORM (Firebase Realtime DB)
=============================================

What this is
------------
A plug‑and‑play web app where:
- The projector/laptop opens **index.html** (the game screen + teacher controls).
- Each student tablet opens **controller.html** (dynamic buttons).
- Everything syncs via **Firebase Realtime Database**. No Node server required.

Quick Start (10 minutes)
------------------------
1) Create a Firebase project → add a Web app.
2) Enable **Realtime Database** (test mode is OK for class demo).
3) Copy **firebase-config.sample.js** to **firebase-config.js** and paste your config from Firebase Console.
4) Open **index.html** in a local web server (e.g., VS Code Live Server) or host on GitHub Pages/Netlify (remember: Firebase needs https for some features).
5) On the projector laptop: **index.html** will auto-create a room and show a room code.
6) On tablets: open **controller.html**, enter the room code, and join.
7) Choose a module (e.g., *Quick Buzzer* or *Trash Dash*) and press **Start**.

How the platform is reusable
----------------------------
- Controllers are **schema-driven**. The teacher module publishes an array of buttons to `/rooms/{code}/ui/buttons` and controllers render them.
- Actions from controllers are written to `/rooms/{code}/actions`. Each module listens and updates `/rooms/{code}/state`.
- The screen (`index.html`) imports a module from `js/modules/*` and calls `init()`, `start()`, and `draw()`.

Module API
----------
Each module exports:
- `async init({ code, uiRef, stateRef })`
- `start({ code })`
- `draw({ room, canvas, ctx })`
- optional: `attachActionListener(code)` if it needs to process controller actions.

Add your own lesson game
------------------------
1) Create `js/modules/mylesson.js`.
2) In `index.html`, add it to `moduleMap`.
3) In `init()`, write controller UI: `set(uiRef, { buttons: [ {key, label, actionType}, ... ] })`.
4) Use `attachActionListener` or handle actions inside `draw()` logic to update `stateRef`.

Classroom notes
---------------
- Rotate students: new pair joins with the same room code; scores persist for the session.
- For bilingual labels, swap out the button `label` dynamically based on `room.locale`.
- For privacy, avoid storing personal data in Firebase.

Security rules (basic demo)
---------------------------
In Firebase Console → Realtime Database → Rules, you can start with open rules for a short class demo:
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
Then tighten later (e.g., limit to `/rooms/*` and expire rooms after class).

Files
-----
- index.html — teacher/screen
- controller.html — student controller
- styles.css — basic styling
- js/core.js — Firebase init, helpers
- js/modules/buzzer.js — example module
- js/modules/trashdash.js — example module
- firebase-config.sample.js — copy → firebase-config.js and fill in
