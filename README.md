# IKARUS 2K26 — Web Roulette Challenge

Spin-the-wheel platform for **Prompt2Web** and **Gamified Web**, organized by the CSI Student Chapter.

- React + Vite frontend, Node.js + Express + SQLite backend
- One spin per team **per event**, enforced and stored on the server
- Organizer panel to reset accidental spins and view assistance requests

## Requirements

- Node.js 18 or newer (20 / 22 LTS recommended) — https://nodejs.org
- VS Code

## Run in VS Code

1. Extract the ZIP and open the folder in VS Code (**File → Open Folder…**).
2. Open a terminal (**Terminal → New Terminal**).
3. (Optional) Set the organizer password: copy `.env.example` to `.env` and change `ADMIN_PASSWORD`.
4. Install and start:

   ```bash
   npm install
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser.

`npm run dev` starts both the backend (port 3001) and the website (port 5173) together.

### Use on other laptops on the same Wi‑Fi (event day)

```bash
npm start
```

This builds the site and serves everything from **http://<this-laptop-IP>:3001**. All devices then share one database, so teams cannot spin again from another laptop.

## How teams use it

1. Choose **Prompt2Web** or **Gamified Web**.
2. Enter the Team ID given by the organizers (e.g. `TEAM-07`).
3. Press **SPIN THE WHEEL** → confirm → the challenge card appears under the wheel.
4. The result is locked for that event. Refreshing, new tabs or other browsers show the same saved result. The other event's spin stays available.
5. Spun the wrong event? Press **Request Organizer Assistance**.

## Organizer panel

Open **http://localhost:5173/#/admin** (or the "Organizer" link in the footer).
Default password: `ikarus-admin-2k26` — change it in `.env` before the event.

You can see every spin, reset a team's spin for one event, and mark assistance requests as resolved.

## Logos

Logos live in `public/logos/`. Replace a file with one of the same name to change it:

| File | Position |
|---|---|
| `public/logos/csi.png` | Top left — CSI Student Chapter |
| `public/logos/ikarus.png` | Top middle — IKARUS |
| `public/logos/kgr.png` | Top right — KG Reddy College |

## Editing challenges

All 30 challenges are in `src/data.js`. Segment order on the wheel matches the order in that file.

## Tests

```bash
npm test
```

Checks that each event has 15 themes, that a second spin is refused, that the two events are independent, that refreshing never changes a saved result, that 10 simultaneous spins allow only one, and that organizer resets work.

## Data

Spins are stored in `server/ikarus.db`. Delete this file (with the server stopped) to clear all results before the event.

## Project structure

```
index.html         page shell
src/main.jsx       the whole website (home, both event pages, organizer panel)
src/data.js        all 30 challenge definitions
src/styles.css     design
server/index.js    API + SQLite
server/test.js     automated rule tests
public/logos/      the three logos
```
