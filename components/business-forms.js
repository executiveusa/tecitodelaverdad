'use client';

import { useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase';

export function WaitlistForm({ lang = 'es' }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email');
    setBusy(true);
    setStatus('');
    const { error } = await supabase.rpc('tecito_join_waitlist', { p_email: email, p_locale: lang, p_source: 'website' });
    setBusy(false);
    if (error) {
      setStatus(lang === 'en' ? 'We could not save your email. Please try again.' : 'No pudimos guardar tu correo. Inténtalo de nuevo.');
      return;
    }
    form.reset();
    setStatus(lang === 'en' ? 'You are on the list for the first edition.' : 'Ya estás en la lista de la primera edición.');
  }

  return (
    <div>
      <form className="waitlist-form" onSubmit={submit}>
        <input type="email" name="email" required placeholder={lang === 'en' ? 'Your email' : 'Tu correo'} aria-label={lang === 'en' ? 'Your email' : 'Tu correo'} />
        <button className="pressable" type="submit" disabled={busy}>{busy ? '…' : (lang === 'en' ? 'Join →' : 'Entrar →')}</button>
      </form>
      <div className="form-note" role="status">{status}</div>
    </div>
  );
}

export function InquiryForm({ lang = 'es' }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setStatus('');
    const { error } = await supabase.rpc('tecito_submit_inquiry', {
      p_type: data.get('type'),
      p_organization: data.get('organization'),
      p_contact: data.get('contact'),
      p_email: data.get('email'),
      p_message: data.get('message')
    });
    setBusy(false);
    if (error) {
      setStatus(lang === 'en' ? 'Something went wrong. Please try again.' : 'Algo salió mal. Inténtalo de nuevo.');
      return;
    }
    form.reset();
    setStatus(lang === 'en' ? 'Received. The House will follow up.' : 'Recibido. La Casa dará seguimiento.');
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="inquiry-grid">
        <label><span>{lang === 'en' ? 'Type' : 'Tipo'}</span><select name="type" defaultValue="hotel"><option value="hotel">{lang === 'en' ? 'Hotel / resort' : 'Hotel / resort'}</option><option value="corporate">{lang === 'en' ? 'Brand / team' : 'Marca / equipo'}</option><option value="nonprofit">{lang === 'en' ? 'Nonprofit' : 'Fundación'}</option><option value="other">{lang === 'en' ? 'Other' : 'Otro'}</option></select></label>
        <label><span>{lang === 'en' ? 'Organization' : 'Organización'}</span><input name="organization" /></label>
        <label><span>{lang === 'en' ? 'Your name' : 'Tu nombre'}</span><input name="contact" /></label>
        <label><span>Email</span><input type="email" name="email" required /></label>
      </div>
      <label className="message-field"><span>{lang === 'en' ? 'What should this edition become?' : '¿Qué debería convertirse esta edición?'}</span><textarea name="message" rows="4" /></label>
      <div className="inquiry-actions"><button className="cta pressable" type="submit" disabled={busy}>{busy ? '…' : (lang === 'en' ? 'Start a conversation →' : 'Iniciar una conversación →')}</button><small role="status">{status}</small></div>
    </form>
  );
}
