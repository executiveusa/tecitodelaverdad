# Tecito Business Layer

## Isolation

Tecito data lives in the dedicated `tecito` schema inside the shared `botanic-creations` Supabase project. The schema is not granted to `anon` or normal `authenticated` roles. Public and authenticated access is intentionally limited to narrow `public.tecito_*` RPC functions.

## Human access

- `/login` — private operator login using Supabase Auth.
- `/control` — private Control Room for authorized Tecito members.
- Current owner membership is mapped to the existing Supabase Auth account for `executiveusa@gmail.com`.

Control Room exposes business information without requiring humans to use the database dashboard:

- waitlist count and recent subscribers
- commissioned-edition inquiries and pipeline status
- edition/truth counts
- recent agent activity
- links to the public site, Supabase and Vercel

## Agent access

Agents should be created as dedicated Supabase Auth users and added to `tecito.members` with role `agent`. Do not share the owner login and do not give agents the service-role key.

Authenticated agent endpoints:

- `GET /api/agent/status` — returns the Tecito business summary for an authorized member JWT.
- `POST /api/agent/log` — records an agent action in `tecito.agent_runs` and `tecito.audit_log`.

Both require `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` and still pass through the Tecito membership check.

Example log body:

```json
{
  "agent_name": "fanni",
  "action": "review_waitlist_growth",
  "status": "success",
  "summary": "Reviewed current acquisition activity.",
  "metadata": { "source": "website" }
}
```

## Public business RPCs

- `tecito_join_waitlist` — safe public email capture.
- `tecito_submit_inquiry` — safe public hotel/corporate/nonprofit lead capture.
- `tecito_catalog` — active interactive catalog pages.

## Authorized RPCs

- `tecito_dashboard_summary`
- `tecito_admin_waitlist`
- `tecito_admin_inquiries`
- `tecito_admin_agent_runs`
- `tecito_update_inquiry_status`
- `tecito_agent_log_run`

## Guardrails

- No client receives a Supabase secret/service-role key.
- `tecito` schema privileges are revoked from `anon` and `authenticated`.
- Human and agent authorization is checked against `tecito.members`.
- Agent activity is auditable.
- Public forms only call narrow SECURITY DEFINER functions with constrained inputs.
- Supplier formulation remains unpromised until confirmed in writing by Tiesta Tea.
