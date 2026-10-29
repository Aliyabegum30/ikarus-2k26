import React, { useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { EVENTS, SEGMENT_COLORS } from './data.js';
import './styles.css';

// ---------- Logos: replace the files in /public/logos to change them ----------
const LOGOS = { csi: '/logos/csi.png', ikarus: '/logos/ikarus.png', college: '/logos/kgr.png' };

const SEG = 360 / 15;
const SPIN_MS = 6000;

// ---------- tiny hash router ----------
function useRoute() {
  const get = () => window.location.hash.replace(/^#/, '') || '/';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => { setRoute(get()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

async function api(url, opts = {}) {
  const { headers, ...rest } = opts;
  const res = await fetch(url, { ...rest, headers: { 'Content-Type': 'application/json', ...(headers || {}) } });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Which segment sits under the top pointer for a given wheel rotation
export const indexAtPointer = (rotation) => Math.floor((((360 - (rotation % 360)) % 360) + 360) % 360 / SEG);
const restingRotation = (index) => 360 - (index * SEG + SEG / 2);

// ---------- Layout ----------
function Header({ route }) {
  const tabs = [['/', 'Home'], ['/prompt2web', 'Prompt2Web'], ['/gamified-web', 'Gamified Web']];
  return (
    <header className="header">
      <div className="header-logos">
        <img className="logo logo-csi" src={LOGOS.csi} alt="CSI Student Chapter" />
        <a href="#/" className="brand">
          <img className="logo logo-ikarus" src={LOGOS.ikarus} alt="IKARUS Annual Tech Fest" />
          <span className="brand-year">IKARUS 2K26</span>
        </a>
        <img className="logo logo-college" src={LOGOS.college} alt="KG Reddy College of Engineering & Technology" />
      </div>
      <nav className="nav">
        {tabs.map(([to, label]) => (
          <a key={to} href={`#${to}`} className={`nav-tab ${route === to ? 'active' : ''}`}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

const Footer = () => (
  <footer className="footer">
    Organized by CSI Student Chapter | IKARUS 2K26 · <a href="#/admin">Organizer</a>
  </footer>
);

// ---------- Home ----------
function Home() {
  return (
    <main className="page home">
      <section className="hero">
        <div>
          <span className="pill">WEB ROULETTE</span>
          <h1 className="hero-title"><span>Spin.</span> <span>Build.</span> <span>Win.</span></h1>
          <p className="hero-lead">Two events. Endless possibilities.</p>
          <p className="muted">Spin the wheel for your challenge in Prompt2Web or Gamified Web and showcase your creativity, speed and skills.</p>
          <div className="event-cards">
            <a href="#/prompt2web" className="event-card primary">
              <span className="event-icon">✦</span>
              <span><strong>Prompt2Web</strong><small>AI Website Challenge</small></span>
              <span className="arrow">›</span>
            </a>
            <a href="#/gamified-web" className="event-card">
              <span className="event-icon">🎮</span>
              <span><strong>Gamified Web</strong><small>Game Development Challenge</small></span>
              <span className="arrow">›</span>
            </a>
          </div>
          <div className="stats">
            <div><b>15</b> Unique challenges (each)</div>
            <div><b>30</b> Minutes per challenge</div>
            <div><b>1</b> Spin per team, per event</div>
          </div>
        </div>
        <div className="hero-wheel" aria-hidden="true">
          <Wheel challenges={EVENTS.prompt2web.challenges} rotation={0} spinning={false} decorative />
        </div>
      </section>
    </main>
  );
}

// ---------- Wheel ----------
function Wheel({ challenges, rotation, spinning, onSpin, disabled, decorative }) {
  const R = 250, C = 260;
  const pt = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  };
  return (
    <div className={`wheel-wrap ${decorative ? 'decorative' : ''}`}>
      {!decorative && <div className="pointer" />}
      <svg viewBox="0 0 520 520" className="wheel-svg">
        <circle cx={C} cy={C} r={R + 8} className="wheel-rim" />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '260px 260px',
            transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.75, 0.12, 1)` : 'none',
          }}
        >
          {challenges.map((c, i) => {
            const [x1, y1] = pt(i * SEG, R);
            const [x2, y2] = pt((i + 1) * SEG, R);
            const mid = i * SEG + SEG / 2;
            const words = c.theme.replace(/^The /, '').split(' ');
            const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : words.length === 2 && c.theme.length > 12 ? words : [words.join(' ')];
            return (
              <g key={c.id}>
                <path d={`M${C},${C} L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z`} fill={SEGMENT_COLORS[i]} stroke="#fff" strokeWidth="2" />
                <g transform={`rotate(${mid} ${C} ${C})`}>
                  <text x={C} y={C - 168} className="seg-text" textAnchor="middle" transform={`rotate(-90 ${C} ${C - 168})`}>
                    {lines.map((l, j) => (
                      <tspan key={j} x={C} dy={j === 0 ? (lines.length - 1) * -7 : 15}>{l}</tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      {!decorative ? (
        <button className="hub" onClick={onSpin} disabled={disabled}>SPIN</button>
      ) : (
        <div className="hub">SPIN</div>
      )}
    </div>
  );
}

// ---------- Modal ----------
function Modal({ children, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// ---------- Challenge card ----------
function ChallengeCard({ event, index }) {
  const c = event.challenges[index];
  return (
    <article className="challenge-card">
      <div className="cc-head">
        <div>
          <span className="cc-tag">Challenge {String(c.id).padStart(2, '0')}</span>
          <h3>{c.theme}</h3>
        </div>
        <span className="cc-event">{event.name}</span>
      </div>
      <section>
        <h4>Mission</h4>
        <p>{c.mission}</p>
      </section>
      <section>
        <h4>Mandatory Conditions</h4>
        <ul>{c.conditions.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
      <div className="cc-boxes">
        <div className="cc-box"><small>Time Limit</small><strong>{event.timeLimit.toUpperCase()}</strong></div>
        <div className="cc-box bonus"><small>★ Bonus Challenge</small><span>{c.bonus}</span></div>
      </div>
    </article>
  );
}

// ---------- Event page ----------
function EventPage({ eventKey }) {
  const event = EVENTS[eventKey];
  const [teamInput, setTeamInput] = useState(() => localStorage.getItem('ikarus.team') || '');
  const [teamId, setTeamId] = useState('');
  const [status, setStatus] = useState(null); // { used, result }
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assistOpen, setAssistOpen] = useState(false);

  const loadStatus = useCallback(async (id) => {
    setBusy(true); setError('');
    const r = await api(`/api/spin?teamId=${encodeURIComponent(id)}&event=${eventKey}`).catch(() => null);
    setBusy(false);
    if (!r) return setError('Cannot reach the server. Is it running?');
    if (!r.ok) return setError(r.data.error || 'Something went wrong.');
    setTeamId(id);
    localStorage.setItem('ikarus.team', id);
    setStatus(r.data);
    setSpinning(false);
    if (r.data.used) { setRotation(restingRotation(r.data.result.index)); setRevealed(true); }
    else { setRotation(0); setRevealed(false); }
  }, [eventKey]);

  // Restore the saved team on load / when switching events
  useEffect(() => {
    setStatus(null); setTeamId(''); setRevealed(false); setRotation(0);
    const saved = localStorage.getItem('ikarus.team');
    if (saved) loadStatus(saved);
  }, [eventKey, loadStatus]);

  const submitTeam = (e) => {
    e.preventDefault();
    const id = teamInput.trim().toUpperCase();
    if (!/^[A-Z0-9-]{2,20}$/.test(id)) return setError('Enter the Team ID given by the organizers (letters, numbers or dashes).');
    loadStatus(id);
  };

  const doSpin = async () => {
    setConfirmOpen(false); setBusy(true); setError('');
    const r = await api('/api/spin', { method: 'POST', body: JSON.stringify({ teamId, event: eventKey }) }).catch(() => null);
    setBusy(false);
    if (!r) return setError('Cannot reach the server. Your spin was not used.');
    if (r.status === 409) { setStatus({ used: true, result: r.data.result }); setRotation(restingRotation(r.data.result.index)); setRevealed(true); return setError('This team has already spun for this event. Showing the saved result.'); }
    if (!r.ok) return setError(r.data.error || 'Spin failed. Your spin was not used.');
    const index = r.data.result.index;
    const jitter = (Math.random() - 0.5) * (SEG * 0.6);
    const current = rotation;
    const target = restingRotation(index) + jitter;
    const delta = (((target - current) % 360) + 360) % 360;
    const final = current + 360 * 7 + delta;
    setStatus(r.data);
    setRevealed(false);
    setSpinning(true);
    requestAnimationFrame(() => setRotation(final));
    setTimeout(() => {
      setSpinning(false);
      if (indexAtPointer(final) !== index) console.warn('Pointer mismatch', indexAtPointer(final), index);
      setRevealed(true);
      setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, SPIN_MS + 150);
  };

  const used = status?.used;
  const resultIndex = status?.result?.index;

  return (
    <main className="page event">
      <div className="event-head">
        <div>
          <span className="pill">WEB ROULETTE</span>
          <h1 className="event-title">{event.title} <span>{event.heading}</span></h1>
          <p className="muted">{event.subtitle}</p>
        </div>
        {teamId && (
          <div className={`status ${used ? 'used' : 'available'}`}>
            <span className="dot" />
            <span>{used ? 'Spin used' : 'Spin available'}</span>
            <b>{used ? '0/1' : '1/1'}</b>
          </div>
        )}
      </div>

      <div className="event-grid">
        <div className="wheel-col">
          <Wheel
            challenges={event.challenges}
            rotation={rotation}
            spinning={spinning}
            onSpin={() => setConfirmOpen(true)}
            disabled={!teamId || used || spinning || busy}
          />
          <button className="btn btn-spin" onClick={() => setConfirmOpen(true)} disabled={!teamId || used || spinning || busy}>
            {spinning ? 'SPINNING…' : used ? 'SPIN USED' : 'SPIN THE WHEEL'}
          </button>
          {revealed && resultIndex != null && (
            <p className="selected">Theme selected: <b>{event.challenges[resultIndex].theme}</b></p>
          )}
        </div>

        <aside className="side-col">
          <div className="panel">
            <h2>Your Team</h2>
            {teamId ? (
              <div className="team-row">
                <div><small className="muted">Team ID</small><div className="team-id">{teamId}</div></div>
                <button className="btn btn-ghost" disabled={spinning} onClick={() => { setTeamId(''); setStatus(null); setRevealed(false); setRotation(0); localStorage.removeItem('ikarus.team'); }}>Change team</button>
              </div>
            ) : (
              <form onSubmit={submitTeam} className="team-form">
                <input value={teamInput} onChange={(e) => setTeamInput(e.target.value)} placeholder="Enter your Team ID, e.g. TEAM-07" aria-label="Team ID" />
                <button className="btn btn-primary" disabled={busy}>Continue</button>
              </form>
            )}
            {error && <p className="error">{error}</p>}
            <ul className="facts">
              <li>15 unique themes</li>
              <li>{event.timeLimit} to build</li>
              <li>One spin per team for {event.name} — your other event spin stays separate</li>
            </ul>
          </div>
          {!revealed && (
            <div className="panel placeholder">
              <div className="ph-icon">✦</div>
              <p>{teamId ? 'Spin the wheel to reveal your challenge details!' : 'Enter your Team ID to unlock the wheel.'}</p>
            </div>
          )}
        </aside>
      </div>

      {revealed && resultIndex != null && (
        <section id="result" className="result">
          <ChallengeCard event={event} index={resultIndex} />
          <div className="result-actions">
            <span className="muted">Result locked for team {teamId}. Spun for the wrong event?</span>
            <button className="btn btn-ghost" onClick={() => setAssistOpen(true)}>Request Organizer Assistance</button>
          </div>
        </section>
      )}

      {confirmOpen && (
        <Modal onClose={() => setConfirmOpen(false)}>
          <h3>Confirm your spin</h3>
          <p>You are about to spin for <b>{event.name}</b>. Your result will be locked for this event. Your spin for the other event will remain available. Continue?</p>
          <p className="muted">Team: <b>{teamId}</b></p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setConfirmOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={doSpin}>Confirm Spin</button>
          </div>
        </Modal>
      )}
      {assistOpen && <AssistModal teamId={teamId} event={event} onClose={() => setAssistOpen(false)} />}
    </main>
  );
}

function AssistModal({ teamId, event, onClose }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const send = async () => {
    const r = await api('/api/assistance', { method: 'POST', body: JSON.stringify({ teamId, event: event.key, message: msg }) }).catch(() => null);
    if (r?.ok) setSent(true); else setErr('Could not send. Please call an organizer.');
  };
  return (
    <Modal onClose={onClose}>
      <h3>Request Organizer Assistance</h3>
      {sent ? (
        <><p>Your request has been sent. An organizer will come to your team shortly.</p><div className="modal-actions"><button className="btn btn-primary" onClick={onClose}>Close</button></div></>
      ) : (
        <>
          <p className="muted">Team <b>{teamId}</b> · {event.name}. Only organizers can change a locked result.</p>
          <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What happened? e.g. We spun the wrong event by mistake." />
          {err && <p className="error">{err}</p>}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={send}>Send Request</button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ---------- Admin ----------
function Admin() {
  const [pw, setPw] = useState(() => sessionStorage.getItem('ikarus.admin') || '');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('');

  const load = useCallback(async (p = pw) => {
    const r = await api('/api/admin/overview', { headers: { 'x-admin-password': p } }).catch(() => null);
    if (!r) return setErr('Cannot reach the server.');
    if (!r.ok) { setData(null); sessionStorage.removeItem('ikarus.admin'); return setErr(r.data.error || 'Error'); }
    sessionStorage.setItem('ikarus.admin', p); setErr(''); setData(r.data);
  }, [pw]);
  useEffect(() => { if (pw) load(pw); }, []); // eslint-disable-line

  const post = async (url, body) => {
    await api(url, { method: 'POST', headers: { 'x-admin-password': pw }, body: JSON.stringify(body) });
    load();
  };

  if (!data) {
    return (
      <main className="page admin">
        <div className="panel narrow">
          <h2>Organizer Panel</h2>
          <form onSubmit={(e) => { e.preventDefault(); load(pw); }} className="team-form">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Organizer password" aria-label="Organizer password" />
            <button className="btn btn-primary">Unlock</button>
          </form>
          {err && <p className="error">{err}</p>}
        </div>
      </main>
    );
  }
  const spins = data.spins.filter((s) => s.teamId.includes(filter.trim().toUpperCase()));
  return (
    <main className="page admin">
      <div className="admin-top">
        <h1 className="event-title">Organizer Panel</h1>
        <div className="team-form">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by Team ID" />
          <button className="btn btn-ghost" onClick={() => load()}>Refresh</button>
          <button className="btn btn-ghost" onClick={() => { sessionStorage.removeItem('ikarus.admin'); setPw(''); setData(null); }}>Lock</button>
        </div>
      </div>
      <div className="panel">
        <h2>Assistance requests</h2>
        {data.requests.length === 0 ? <p className="muted">No requests yet.</p> : (
          <table><thead><tr><th>Team</th><th>Event</th><th>Message</th><th>Time</th><th /></tr></thead><tbody>
            {data.requests.map((r) => (
              <tr key={r.id} className={r.resolved ? 'resolved' : ''}>
                <td>{r.team_id}</td><td>{EVENTS[r.event]?.name}</td><td>{r.message || '—'}</td><td>{r.created_at}</td>
                <td>{r.resolved ? 'Resolved' : <button className="btn btn-small" onClick={() => post('/api/admin/resolve', { id: r.id })}>Mark resolved</button>}</td>
              </tr>))}
          </tbody></table>
        )}
      </div>
      <div className="panel">
        <h2>Spins ({spins.length})</h2>
        {spins.length === 0 ? <p className="muted">No spins yet.</p> : (
          <table><thead><tr><th>Team</th><th>Event</th><th>Challenge</th><th>Time</th><th /></tr></thead><tbody>
            {spins.map((s) => (
              <tr key={s.teamId + s.event}>
                <td>{s.teamId}</td><td>{EVENTS[s.event].name}</td><td>{EVENTS[s.event].challenges[s.index].theme}</td><td>{s.createdAt}</td>
                <td><button className="btn btn-small danger" onClick={() => { if (confirm(`Reset ${s.teamId}'s ${EVENTS[s.event].name} spin? They will be able to spin again.`)) post('/api/admin/reset', { teamId: s.teamId, event: s.event }); }}>Reset spin</button></td>
              </tr>))}
          </tbody></table>
        )}
      </div>
    </main>
  );
}

function App() {
  const route = useRoute();
  let page = <Home />;
  if (route === '/prompt2web') page = <EventPage eventKey="prompt2web" />;
  else if (route === '/gamified-web') page = <EventPage eventKey="gamifiedWeb" />;
  else if (route === '/admin') page = <Admin />;
  return (<div className="app"><Header route={route} />{page}<Footer /></div>);
}

createRoot(document.getElementById('root')).render(<App />);
