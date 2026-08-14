import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from '../../../../lib/supabase';
import { sanitizeAgentLogPayload } from '../../../../lib/business-rules';

export async function POST(request) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false }
  });

  const token = auth.slice(7);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const payload = sanitizeAgentLogPayload(await request.json().catch(() => ({})));
  const { data, error } = await supabase.rpc('tecito_agent_log_run', {
    p_agent_name: payload.agent_name,
    p_action: payload.action,
    p_status: payload.status,
    p_summary: payload.summary,
    p_metadata: payload.metadata
  });

  if (error) {
    return NextResponse.json(
      { error: error.message === 'forbidden' ? 'forbidden' : 'invalid_request' },
      { status: error.message === 'forbidden' ? 403 : 400 }
    );
  }

  return NextResponse.json({ ok: true, run_id: data, actor: userData.user.email });
}
