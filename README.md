# Classroom Game Platform (Firebase + GitHub Pages)

A plug-and-play web app where your projector shows the **game screen** and student tablets act as **controllers**. Modules are drop-in files you can swap per lesson.

## Quick Start

1. **Fork or upload this repo** to your GitHub account.
2. In the repo, create a file at the root called **`firebase-config.js`** with your Firebase web config:
   ```js
   export const firebaseConfig = {
     apiKey: "…",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "…",
     appId: "…"
   };
   ```
   > This is client-side config used by Firebase SDK and can be public.
3. Enable **Firebase Realtime Database** in console and choose rules suitable for class.
4. **Enable GitHub Pages** → Settings → Pages → Build and deployment = “GitHub Actions”.
5. The included workflow will auto-deploy on every push to `main`.
6. Open your site at: `https://<your-username>.github.io/<repo-name>/index.html`.

## Develop locally

- Use VS Code’s **Live Server** or any static server.
- Open `index.html` (screen) on your laptop and `controller.html` on tablets.

## Add a lesson module

1. Create `js/modules/mylesson.js` exporting `init`, `start`, `draw`.
2. Add it to `moduleMap` in `index.html`.
3. In `init`, publish controller buttons to `/rooms/{code}/ui/buttons` and initial state to `/rooms/{code}/state`.

## Files

- `index.html` — teacher screen + room controls
- `controller.html` — student controller (auto-renders buttons)
- `js/core.js` — Firebase init, room creation, action bus, tiny i18n
- `js/modules/` — plug-in lessons (e.g., `buzzer.js`, `trashdash.js`)
- `styles.css` — minimal styling

## Security notes

For a short in-class demo you can start with open rules, then tighten:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
Better: scope to `/rooms/*`, restrict write rate, and **auto-expire rooms** with Cloud Functions or a cron (optional).

## License

MIT
