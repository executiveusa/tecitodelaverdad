export const INQUIRY_STATUSES = ['new', 'qualified', 'contacted', 'proposal', 'won', 'lost', 'archived'];
export const INQUIRY_TYPES = ['hotel', 'brand', 'nonprofit'];
export const AGENT_RUN_STATUSES = ['started', 'success', 'failed', 'blocked'];

export function sanitizeText(value, maxLength = 500) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function normalizeEmail(value) {
  return sanitizeText(value, 320).toLowerCase();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeLocale(value) {
  return String(value || '').toLowerCase() === 'en' ? 'en' : 'es';
}

export function normalizeInquiryType(value) {
  const type = String(value || '').toLowerCase();
  return INQUIRY_TYPES.includes(type) ? type : 'brand';
}

export function isAllowedInquiryStatus(value) {
  return INQUIRY_STATUSES.includes(String(value || '').toLowerCase());
}

export function sanitizeAgentLogPayload(body = {}) {
  const status = String(body.status || 'started').toLowerCase();
  return {
    agent_name: sanitizeText(body.agent_name || 'agent', 80),
    action: sanitizeText(body.action || 'unspecified', 120),
    status: AGENT_RUN_STATUSES.includes(status) ? status : 'started',
    summary: body.summary ? sanitizeText(body.summary, 1000) : null,
    metadata: body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata) ? body.metadata : {}
  };
}
