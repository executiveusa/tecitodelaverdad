'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../lib/supabase';

export default function LoginPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(data.get('email') || ''),
      password: String(data.get('password') || '')
    });
    setBusy(false);
    if (authError) {
      setError('No se pudo iniciar sesión. Verifica tus credenciales.');
      return;
    }
    router.replace('/control');
  }

  return (
    <main className="control-auth-shell">
      <section className="control-auth-card">
        <a className="control-mark" href="/">TECITO <span>DE LA VERDAD</span></a>
        <p className="kicker">Control privado</p>
        <h1>Casa de Ediciones</h1>
        <p>Acceso para humanos autorizados y operadores del negocio.</p>
        <form onSubmit={submit} className="control-auth-form">
          <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          <label><span>Contraseña</span><input name="password" type="password" autoComplete="current-password" required /></label>
          <button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar al control room'}</button>
          <small role="alert">{error}</small>
        </form>
      </section>
    </main>
  );
}
