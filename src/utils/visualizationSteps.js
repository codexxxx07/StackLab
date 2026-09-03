export const PRECEDENCE = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };

export const isOperatorChar = (c) => '+-*/^'.includes(c);

export const isOperandChar = (c) => /^[A-Z]$/.test(c);

export const isOpenParen = (c) => c === '(';

export const isCloseParen = (c) => c === ')';

export const cleanExpression = (raw) =>
  (raw || '').replace(/\s+/g, '').toUpperCase();

/**
 * Escape a user-derived string for safe interpolation into HTML that is later
 * rendered via dangerouslySetInnerHTML. No-op for the validated safe charset
 * (A-Z, + - * / ^, parentheses), so it never changes algorithm output.
 */
export const escapeHtml = (s = '') =>
  s.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]);
