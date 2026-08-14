'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../lib/supabase';

function Metric({ label, value }) {
  return <div className="control-metric"><span>{label}</span><strong>{value ?? '—'}</strong></div>;
}

export default function ControlRoom() {
  const supabase = useMemo(() => getSupabase(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');

  async function refresh() {
    setError('');
    const [{ data: summaryData, error: summaryError }, { data: waitData }, { data: inquiryData }, { data: runData }] = await Promise.all([
      supabase.rpc('tecito_dashboard_summary'),
      supabase.rpc('tecito_admin_waitlist', { p_limit: 50 }),
      supabase.rpc('tecito_admin_inquiries', { p_limit: 50 }),
      supabase.rpc('tecito_admin_agent_runs', { p_limit: 30 })
    ]);
    if (summaryError) setError('Tu sesión existe, pero no tiene acceso a Tecito.');
    setSummary(summaryData || null);
    setWaitlist(waitData || []);
    setInquiries(inquiryData || []);
    setRuns(runData || []);
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!alive) return;
      if (!currentUser) {
        router.replace('/login');
        return;
      }
      setUser(currentUser);
      await refresh();
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  async function updateInquiry(id, status) {
    await supabase.rpc('tecito_update_inquiry_status', { p_id: id, p_status: status });
    await refresh();
  }

  if (loading) return <main className="control-shell"><div className="control-loading">Abriendo la Casa…</div></main>;

  return (
    <main className="control-shell">
      <header className="control-topbar">
        <div><a className="control-mark" href="/">TECITO <span>DE LA VERDAD</span></a><small>Control Room</small></div>
        <div className="control-user"><span>{user?.email}</span><button onClick={signOut}>Salir</button></div>
      </header>

      <section className="control-hero">
        <div><p className="kicker">Negocio · privado</p><h1>La Casa, en una sola vista.</h1><p>Leads, ediciones, agentes y operaciones sin entrar a la base de datos.</p></div>
        <button className="control-refresh" onClick={refresh}>Actualizar</button>
      </section>

      {error && <div className="control-alert">{error}</div>}

      <section className="control-metrics">
        <Metric label="Lista de espera" value={summary?.waitlist} />
        <Metric label="Consultas nuevas" value={summary?.new_inquiries} />
        <Metric label="Ediciones activas" value={summary?.active_editions} />
        <Metric label="Verdades" value={summary?.truths} />
      </section>

      <section className="control-grid">
        <article className="control-panel">
          <div className="control-panel-head"><div><p className="kicker">Pipeline</p><h2>Consultas</h2></div><span>{inquiries.length}</span></div>
          <div className="control-list">
            {inquiries.length === 0 && <p className="control-empty">Aún no hay consultas.</p>}
            {inquiries.map((item) => <div className="control-row" key={item.id}>
              <div><strong>{item.organization_name || item.contact_name || item.email}</strong><small>{item.inquiry_type} · {item.email}</small>{item.message && <p>{item.message}</p>}</div>
              <select value={item.status} onChange={(e) => updateInquiry(item.id, e.target.value)}><option value="new">new</option><option value="qualified">qualified</option><option value="contacted">contacted</option><option value="proposal">proposal</option><option value="won">won</option><option value="lost">lost</option><option value="archived">archived</option></select>
            </div>)}
          </div>
        </article>

        <article className="control-panel">
          <div className="control-panel-head"><div><p className="kicker">Audiencia</p><h2>Lista de espera</h2></div><span>{waitlist.length}</span></div>
          <div className="control-list compact">
            {waitlist.length === 0 && <p className="control-empty">Aún no hay registros.</p>}
            {waitlist.map((item) => <div className="control-row" key={item.id}><div><strong>{item.email}</strong><small>{item.locale.toUpperCase()} · {item.source}</small></div><time>{new Date(item.created_at).toLocaleDateString()}</time></div>)}
          </div>
        </article>
      </section>

      <section className="control-panel control-agent-panel">
        <div className="control-panel-head"><div><p className="kicker">Agentes</p><h2>Actividad</h2></div><span>{runs.length}</span></div>
        <div className="control-list compact">
          {runs.length === 0 && <p className="control-empty">No hay ejecuciones registradas todavía. Los agentes autorizados pueden usar el RPC <code>tecito_agent_log_run</code>.</p>}
          {runs.map((run) => <div className="control-row" key={run.id}><div><strong>{run.agent_name}</strong><small>{run.action}</small>{run.summary && <p>{run.summary}</p>}</div><span className={`run-status ${run.status}`}>{run.status}</span></div>)}
        </div>
      </section>

      <section className="control-links">
        <a href="/">Ver sitio público ↗</a>
        <a href="https://supabase.com/dashboard/project/cyxdevcjycmffhmwxojh" target="_blank" rel="noreferrer">Supabase ↗</a>
        <a href="https://vercel.com/pauli-4426s-projects/tecitodelaverdad" target="_blank" rel="noreferrer">Vercel ↗</a>
      </section>
    </main>
  );
}
