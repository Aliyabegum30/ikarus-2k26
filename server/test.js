// End-to-end rule test. Run: npm test  (starts its own server on a temp database)
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { EVENTS } from '../src/data.js';

const PORT = 3999;
const DB_FILE = path.join(os.tmpdir(), `ikarus-test-${Date.now()}.db`);
const base = `http://localhost:${PORT}`;
const srv = spawn(process.execPath, ['server/index.js'], { env: { ...process.env, PORT, DB_FILE, ADMIN_PASSWORD: 'test-pw' }, stdio: 'pipe' });

const j = async (url, opts = {}) => {
  const { headers, ...rest } = opts;
  const r = await fetch(base + url, { ...rest, headers: { 'Content-Type': 'application/json', ...(headers || {}) } });
  return { status: r.status, body: await r.json() };
};
const spin = (teamId, event) => j('/api/spin', { method: 'POST', body: JSON.stringify({ teamId, event }) });
let passed = 0;
const t = async (name, fn) => { await fn(); passed++; console.log('  ✓', name); };

try {
  for (let i = 0; i < 50; i++) { try { await fetch(base + '/api/spin'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }

  await t('both events contain exactly 15 themes', () => {
    assert.equal(EVENTS.prompt2web.challenges.length, 15);
    assert.equal(EVENTS.gamifiedWeb.challenges.length, 15);
    for (const e of Object.values(EVENTS)) for (const c of e.challenges) {
      assert.ok(c.theme && c.mission && c.bonus && c.conditions.length === 4, c.theme);
    }
  });

  await t('new team has a spin available in both events', async () => {
    assert.equal((await j('/api/spin?teamId=T1&event=prompt2web')).body.used, false);
    assert.equal((await j('/api/spin?teamId=T1&event=gamifiedWeb')).body.used, false);
  });

  let p1;
  await t('first Prompt2Web spin succeeds', async () => {
    const r = await spin('t1', 'prompt2web');
    assert.equal(r.status, 200); p1 = r.body.result.index;
    assert.ok(p1 >= 0 && p1 < 15);
  });

  await t('second Prompt2Web spin is refused and returns same result', async () => {
    const r = await spin('T1', 'prompt2web');
    assert.equal(r.status, 409); assert.equal(r.body.result.index, p1);
  });

  await t('Prompt2Web spin does not consume Gamified Web spin', async () => {
    assert.equal((await j('/api/spin?teamId=T1&event=gamifiedWeb')).body.used, false);
    assert.equal((await spin('T1', 'gamifiedWeb')).status, 200);
    assert.equal((await spin('T1', 'gamifiedWeb')).status, 409);
  });

  await t('reloading status never changes the saved result', async () => {
    for (let i = 0; i < 5; i++) assert.equal((await j('/api/spin?teamId=T1&event=prompt2web')).body.result.index, p1);
  });

  await t('parallel spins (multiple tabs) allow only one success', async () => {
    const rs = await Promise.all(Array.from({ length: 10 }, () => spin('T2', 'gamifiedWeb')));
    assert.equal(rs.filter((r) => r.status === 200).length, 1);
    assert.equal(new Set(rs.map((r) => r.body.result.index)).size, 1);
  });

  await t('admin needs password; reset re-enables only that event', async () => {
    assert.equal((await j('/api/admin/overview')).status, 401);
    const h = { 'x-admin-password': 'test-pw' };
    assert.equal((await j('/api/admin/reset', { method: 'POST', headers: h, body: JSON.stringify({ teamId: 'T1', event: 'prompt2web' }) })).status, 200);
    assert.equal((await j('/api/spin?teamId=T1&event=prompt2web')).body.used, false);
    assert.equal((await j('/api/spin?teamId=T1&event=gamifiedWeb')).body.used, true);
  });

  await t('assistance request is stored for organizers', async () => {
    await j('/api/assistance', { method: 'POST', body: JSON.stringify({ teamId: 'T1', event: 'prompt2web', message: 'wrong event' }) });
    const o = await j('/api/admin/overview', { headers: { 'x-admin-password': 'test-pw' } });
    assert.equal(o.body.requests[0].message, 'wrong event');
  });

  console.log(`\nAll ${passed} tests passed.`);
} catch (e) {
  console.error('\nTEST FAILED:', e.message); process.exitCode = 1;
} finally {
  srv.kill();
  setTimeout(() => { for (const f of [DB_FILE, DB_FILE + '-wal', DB_FILE + '-shm']) fs.rmSync(f, { force: true }); }, 200);
}
