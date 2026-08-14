'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../lib/supabase';

export default function LoginPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get('email') || ''),
      password: String(data.get('password') || '')
    });
    setBusy(false);
    if (error) {
      setMessage('No se pudo iniciar sesión. Verifica tus credenciales.');
      return;
    }
    router.replace('/control');
  }

  async function sendMagicLink() {
    const email = document.querySelector('input[name="email"]')?.value?.trim();
    if (!email) {
      setMessage('Escribe tu correo autorizado primero.');
      return;
    }
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/control`
      }
    });
    setBusy(false);
    setMessage(error ? 'No pudimos enviar el enlace privado.' : 'Enlace privado enviado. Revisa tu correo.');
  }

  return (
    <main className="control-auth-shell">
      <section className="control-auth-card">
        <a className="control-mark" href="/">TECITO <span>DE LA VERDAD</span></a>
        <p className="kicker">Control privado</p>
        <h1>Casa de Ediciones</h1>
        <p>Acceso para humanos autorizados y operadores del negocio. Los usuarios no autorizados pueden autenticarse, pero no pueden leer datos de Tecito.</p>
        <form onSubmit={submit} className="control-auth-form">
          <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          <label><span>Contraseña</span><input name="password" type="password" autoComplete="current-password" /></label>
          <button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar con contraseña'}</button>
          <button type="button" onClick={sendMagicLink} disabled={busy}>Enviar enlace privado por correo</button>
          <small role="status">{message}</small>
        </form>
      </section>
    </main>
  );
}
