import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from '../../../../lib/supabase';

export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient(supabaseUrl, supabasePublishableKey, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data: userData, error: userError } = await supabase.auth.getUser(auth.slice(7));
  if (userError || !userData?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [summaryRes, taskRes, integrationRes] = await Promise.all([
    supabase.rpc('tecito_dashboard_summary'),
    supabase.rpc('tecito_admin_tasks'),
    supabase.rpc('tecito_admin_integrations')
  ]);
  if (summaryRes.error || taskRes.error || integrationRes.error) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return NextResponse.json({
    ok: true,
    actor: userData.user.email,
    summary: summaryRes.data,
    tasks: taskRes.data,
    integrations: integrationRes.data
  });
}
