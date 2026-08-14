import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENT_RUN_STATUSES,
  INQUIRY_STATUSES,
  isAllowedInquiryStatus,
  isValidEmail,
  normalizeEmail,
  normalizeInquiryType,
  normalizeLocale,
  sanitizeAgentLogPayload,
  sanitizeText
} from '../lib/business-rules.js';

test('normalizeEmail trims and lowercases', () => {
  assert.equal(normalizeEmail('  HELLO@Example.COM  '), 'hello@example.com');
});

test('isValidEmail rejects malformed email and accepts normal email', () => {
  assert.equal(isValidEmail('hello@example.com'), true);
  assert.equal(isValidEmail('hello@'), false);
  assert.equal(isValidEmail('not-an-email'), false);
});

test('locale defaults safely to Spanish', () => {
  assert.equal(normalizeLocale('en'), 'en');
  assert.equal(normalizeLocale('EN'), 'en');
  assert.equal(normalizeLocale('fr'), 'es');
  assert.equal(normalizeLocale(undefined), 'es');
});

test('inquiry type falls back to brand', () => {
  assert.equal(normalizeInquiryType('hotel'), 'hotel');
  assert.equal(normalizeInquiryType('nonprofit'), 'nonprofit');
  assert.equal(normalizeInquiryType('unknown'), 'brand');
});

test('inquiry statuses are explicit and closed', () => {
  assert.deepEqual(INQUIRY_STATUSES, ['new', 'qualified', 'contacted', 'proposal', 'won', 'lost', 'archived']);
  assert.equal(isAllowedInquiryStatus('proposal'), true);
  assert.equal(isAllowedInquiryStatus('deleted'), false);
});

test('sanitizeText collapses whitespace and caps length', () => {
  assert.equal(sanitizeText('  uno   dos\n tres  '), 'uno dos tres');
  assert.equal(sanitizeText('abcdef', 4), 'abcd');
});

test('agent payload sanitization prevents arbitrary status and arrays as metadata', () => {
  const payload = sanitizeAgentLogPayload({
    agent_name: '  fanni  ',
    action: ' review   waitlist ',
    status: 'hacked',
    summary: '  completed   review ',
    metadata: ['not', 'object']
  });
  assert.equal(payload.agent_name, 'fanni');
  assert.equal(payload.action, 'review waitlist');
  assert.equal(payload.status, 'started');
  assert.equal(payload.summary, 'completed review');
  assert.deepEqual(payload.metadata, {});
  assert.equal(AGENT_RUN_STATUSES.includes(payload.status), true);
});
