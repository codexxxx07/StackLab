export const PRECEDENCE = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };

export const isOperatorChar = (c) => '+-*/^'.includes(c);

export const isOperandChar = (c) => /^[A-Z]$/.test(c);

export const isOpenParen = (c) => c === '(';

export const isCloseParen = (c) => c === ')';

export const cleanExpression = (raw) =>
  (raw || '').replace(/\s+/g, '').toUpperCase();
