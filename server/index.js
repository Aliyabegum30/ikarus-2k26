
import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EVENTS } from '../src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PORT = Number(process.env.PORT || 3001);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is missing. Configure it in .env.');
}

const STORE_FILE = path.join(__dirname, 'roulette-data.json');

const app = express();
app.use(express.json());

// JSON storage replaces the native SQLite dependency.
let store = { spins: [], assistance: [] };

if (fs.existsSync(STORE_FILE)) {
  store = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
  store.spins ??= [];
  store.assistance ??= [];
}

function saveStore() {
  const temporaryFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(store, null, 2));
  fs.renameSync(temporaryFile, STORE_FILE);
}

const normTeam = value => String(value || '').trim().toUpperCase();

const validTeam = team =>
  /^[A-Z0-9-]{2,20}$/.test(team);

const validEvent = event =>
  Object.prototype.hasOwnProperty.call(EVENTS, event);

const toResult = row =>
  row
    ? {
        teamId: row.team_id,
        event: row.event,
        index: row.challenge_index,
        createdAt: row.created_at
      }
    : null;

function check(req, res) {
  const teamId = normTeam(
    req.body?.teamId ?? req.query.teamId
  );

  const event = String(
    req.body?.event ?? req.query.event ?? ''
  );

  if (!validTeam(teamId)) {
    res.status(400).json({
      error: 'Team ID must contain 2–20 letters, numbers or dashes.'
    });
    return null;
  }

  if (!validEvent(event)) {
    res.status(400).json({ error: 'Unknown event.' });
    return null;
  }

  return { teamId, event };
}

function findSpin(teamId, event) {
  return store.spins.find(
    row => row.team_id === teamId && row.event === event
  );
}

// Check whether a team has already spun for this event.
app.get('/api/spin', (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const row = findSpin(key.teamId, key.event);

  res.json({
    used: Boolean(row),
    result: toResult(row)
  });
});

// One spin per team per event.
app.post('/api/spin', (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const existing = findSpin(key.teamId, key.event);

  if (existing) {
    return res.status(409).json({
      error: 'This team has already spun for this event.',
      result: toResult(existing)
    });
  }

  const challenges = EVENTS[key.event].challenges;

  if (!Array.isArray(challenges) || challenges.length === 0) {
    return res.status(500).json({
      error: 'No challenges are configured for this event.'
    });
  }

  const row = {
    team_id: key.teamId,
    event: key.event,
    challenge_index: crypto.randomInt(challenges.length),
    created_at: new Date().toISOString()
  };

  store.spins.push(row);
  saveStore();

  res.json({
    used: true,
    result: toResult(row)
  });
});

// Submit a request for organizer assistance.
app.post('/api/assistance', (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const request = {
    id: crypto.randomUUID(),
    team_id: key.teamId,
    event: key.event,
    message: String(req.body?.message || '').slice(0, 500),
    resolved: 0,
    created_at: new Date().toISOString()
  };

  store.assistance.push(request);
  saveStore();

  res.json({ ok: true });
});

// Organizer authentication.
function admin(req, res, next) {
  const given = Buffer.from(
    String(req.get('x-admin-password') || '')
  );
  const real = Buffer.from(ADMIN_PASSWORD);

  if (
    given.length !== real.length ||
    !crypto.timingSafeEqual(given, real)
  ) {
    return res.status(401).json({
      error: 'Wrong organizer password.'
    });
  }

  next();
}

app.get('/api/admin/overview', admin, (_req, res) => {
  res.json({
    spins: [...store.spins]
      .sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      )
      .map(toResult),

    requests: [...store.assistance].sort(
      (a, b) =>
        a.resolved - b.resolved ||
        b.created_at.localeCompare(a.created_at)
    )
  });
});

app.post('/api/admin/reset', admin, (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const before = store.spins.length;

  store.spins = store.spins.filter(
    row =>
      !(row.team_id === key.teamId && row.event === key.event)
  );

  const removed = before - store.spins.length;
  saveStore();

  res.json({ ok: true, removed });
});

app.post('/api/admin/resolve', admin, (req, res) => {
  const request = store.assistance.find(
    item => item.id === req.body?.id
  );

  if (!request) {
    return res.status(404).json({
      error: 'Assistance request not found.'
    });
  }

  request.resolved = 1;
  saveStore();

  res.json({ ok: true });
});

// Serve the production frontend when available.
const dist = path.join(ROOT, 'dist');

if (fs.existsSync(dist)) {
  app.use(express.static(dist));

  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`IKARUS server running at http://localhost:${PORT}`);
});
