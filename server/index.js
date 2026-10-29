
import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { EVENTS } from '../src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PORT = Number(process.env.PORT || 3001);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is missing. Configure it in .env.');
}

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SECRET_KEY must be configured in .env.'
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const app = express();
app.use(express.json());

const normTeam = value =>
  String(value || '').trim().toUpperCase();

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

function handleDatabaseError(res, error) {
  console.error('Database operation failed:', error.message);

  return res.status(500).json({
    error: 'A database operation failed. Please try again.'
  });
}

// Check whether a team has already spun for this event.
app.get('/api/spin', async (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const { data, error } = await supabase
    .from('spins')
    .select('*')
    .eq('team_id', key.teamId)
    .eq('event', key.event)
    .maybeSingle();

  if (error) return handleDatabaseError(res, error);

  res.json({
    used: Boolean(data),
    result: toResult(data)
  });
});

// One spin per team per event.
app.post('/api/spin', async (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const challenges = EVENTS[key.event].challenges;

  if (!Array.isArray(challenges) || challenges.length === 0) {
    return res.status(500).json({
      error: 'No challenges are configured for this event.'
    });
  }

  const row = {
    team_id: key.teamId,
    event: key.event,
    challenge_index: crypto.randomInt(challenges.length)
  };

  const { data, error } = await supabase
    .from('spins')
    .insert(row)
    .select()
    .single();

  if (error) {
    // Another request may have recorded this team's spin first.
    if (error.code === '23505') {
      const existing = await supabase
        .from('spins')
        .select('*')
        .eq('team_id', key.teamId)
        .eq('event', key.event)
        .maybeSingle();

      if (existing.error) {
        return handleDatabaseError(res, existing.error);
      }

      return res.status(409).json({
        error: 'This team has already spun for this event.',
        result: toResult(existing.data)
      });
    }

    return handleDatabaseError(res, error);
  }

  res.json({
    used: true,
    result: toResult(data)
  });
});

// Submit a request for organizer assistance.
app.post('/api/assistance', async (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const message = String(req.body?.message || '').slice(0, 500);

  const { error } = await supabase
    .from('assistance')
    .insert({
      team_id: key.teamId,
      event: key.event,
      message
    });

  if (error) return handleDatabaseError(res, error);

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

app.get('/api/admin/overview', admin, async (_req, res) => {
  const [spinsResult, assistanceResult] = await Promise.all([
    supabase
      .from('spins')
      .select('*')
      .order('created_at', { ascending: false }),

    supabase
      .from('assistance')
      .select('*')
      .order('resolved', { ascending: true })
      .order('created_at', { ascending: false })
  ]);

  if (spinsResult.error) {
    return handleDatabaseError(res, spinsResult.error);
  }

  if (assistanceResult.error) {
    return handleDatabaseError(res, assistanceResult.error);
  }

  res.json({
    spins: (spinsResult.data || []).map(toResult),
    requests: (assistanceResult.data || []).map(item => ({
      ...item,
      resolved: item.resolved ? 1 : 0
    }))
  });
});

// Reset one team's spin for one event.
app.post('/api/admin/reset', admin, async (req, res) => {
  const key = check(req, res);
  if (!key) return;

  const { data, error } = await supabase
    .from('spins')
    .delete()
    .eq('team_id', key.teamId)
    .eq('event', key.event)
    .select('team_id');

  if (error) return handleDatabaseError(res, error);

  res.json({
    ok: true,
    removed: data.length
  });
});

// Mark an assistance request as resolved.
app.post('/api/admin/resolve', admin, async (req, res) => {
  const id = req.body?.id;

  if (typeof id !== 'string' || !id) {
    return res.status(400).json({
      error: 'A valid assistance request ID is required.'
    });
  }

  const { data, error } = await supabase
    .from('assistance')
    .update({ resolved: true })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) return handleDatabaseError(res, error);

  if (!data) {
    return res.status(404).json({
      error: 'Assistance request not found.'
    });
  }

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

// Run the Express server locally.
// Vercel imports the app as a serverless function.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`IKARUS server running at http://localhost:${PORT}`);
  });
}

export default app;
