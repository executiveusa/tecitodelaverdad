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
  const [integrations, setIntegrations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  async function refresh() {
    setError('');
    const [summaryRes, waitRes, inquiryRes, runRes, integrationRes, taskRes] = await Promise.all([
      supabase.rpc('tecito_dashboard_summary'),
      supabase.rpc('tecito_admin_waitlist', { p_limit: 50 }),
      supabase.rpc('tecito_admin_inquiries', { p_limit: 50 }),
      supabase.rpc('tecito_admin_agent_runs', { p_limit: 30 }),
      supabase.rpc('tecito_admin_integrations'),
      supabase.rpc('tecito_admin_tasks')
    ]);
    if (summaryRes.error) setError('Tu sesión existe, pero no tiene acceso a Tecito.');
    setSummary(summaryRes.data || null);
    setWaitlist(waitRes.data || []);
    setInquiries(inquiryRes.data || []);
    setRuns(runRes.data || []);
    setIntegrations(integrationRes.data || []);
    setTasks(taskRes.data || []);
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

  async function updateTask(id, status) {
    await supabase.rpc('tecito_update_task_status', { p_id: id, p_status: status });
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
        <div><p className="kicker">Negocio · privado</p><h1>La Casa, en una sola vista.</h1><p>Leads, ediciones, agentes, integraciones y trabajo operativo sin entrar a la base de datos.</p></div>
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

      <section className="control-grid">
        <article className="control-panel">
          <div className="control-panel-head"><div><p className="kicker">Trabajo</p><h2>Cola operativa</h2></div><span>{tasks.filter((task) => task.status !== 'done').length} abiertos</span></div>
          <div className="control-list">
            {tasks.map((task) => <div className="control-row task-row" key={task.id}>
              <div><strong>P{task.priority} · {task.title}</strong><small>{task.area} · {task.assignee_type}{task.assignee ? ` · ${task.assignee}` : ''}</small>{task.notes && <p>{task.notes}</p>}</div>
              <select value={task.status} onChange={(e) => updateTask(task.id, e.target.value)}><option value="todo">todo</option><option value="in_progress">in progress</option><option value="blocked">blocked</option><option value="done">done</option></select>
            </div>)}
          </div>
        </article>

        <article className="control-panel">
          <div className="control-panel-head"><div><p className="kicker">Sistema</p><h2>Integraciones</h2></div><span>{integrations.filter((item) => item.status === 'connected').length}/{integrations.length}</span></div>
          <div className="control-list compact">
            {integrations.map((item) => <div className="control-row integration-row" key={item.id}><div><strong>{item.name}</strong><small>{item.category}</small>{item.note && <p>{item.note}</p>}</div><span className={`integration-status ${item.status}`}>{item.status.replace('_',' ')}</span></div>)}
          </div>
        </article>
      </section>

      <section className="control-panel control-agent-panel">
        <div className="control-panel-head"><div><p className="kicker">Agentes</p><h2>Actividad</h2></div><span>{runs.length}</span></div>
        <div className="control-list compact">
          {runs.length === 0 && <p className="control-empty">No hay ejecuciones registradas todavía. Los agentes autorizados pueden usar el endpoint <code>/api/agent/log</code>.</p>}
          {runs.map((run) => <div className="control-row" key={run.id}><div><strong>{run.agent_name}</strong><small>{run.action}</small>{run.summary && <p>{run.summary}</p>}</div><span className={`run-status ${run.status}`}>{run.status}</span></div>)}
        </div>
      </section>

      <section className="control-links">
        <a href="/">Ver sitio público ↗</a>
        <a href="https://github.com/executiveusa/tecitodelaverdad" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://supabase.com/dashboard/project/cyxdevcjycmffhmwxojh" target="_blank" rel="noreferrer">Supabase ↗</a>
        <a href="https://vercel.com/pauli-4426s-projects/tecitodelaverdad" target="_blank" rel="noreferrer">Vercel ↗</a>
      </section>
    </main>
  );
}
