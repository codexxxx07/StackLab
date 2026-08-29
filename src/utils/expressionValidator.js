import { isCloseParen, isOpenParen, isOperandChar, isOperatorChar } from './visualizationSteps';

const fail = (error) => ({ valid: false, error });

export function validateInfix(raw) {
  const expr = (raw || '').replace(/\s+/g, '').toUpperCase();

  if (!expr) {
    return fail('The input is empty! Type an expression like A+B*C to get started.');
  }

  if (!/^[A-Z+\-*/^()]+$/.test(expr)) {
    const bad = [...expr].find((c) => !/[A-Z+\-*/^()]/.test(c));
    return fail(
      `"${bad}" is not allowed here. Use operands A-Z, operators + - * / ^ and parentheses only.`
    );
  }

  // Token walk: alternate between expecting an operand and expecting an operator.
  let expectOperand = true;
  let depth = 0;

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    const around = expr.slice(Math.max(0, i - 4), i + 5);

    if (isOpenParen(c)) {
      if (!expectOperand) {
        return fail(`Unexpected "(" in "...${around}..." — looks like an operator is missing before it.`);
      }
      depth++;
      continue;
    }

    if (isCloseParen(c)) {
      if (expectOperand) {
        return fail(`")" in "...${around}..." has no operand before it.`);
      }
      if (depth === 0) {
        return fail('Unbalanced parentheses — this ")" has no matching "(".');
      }
      depth--;
      continue;
    }

    if (isOperandChar(c)) {
      if (!expectOperand) {
        return fail(`Missing operator between operands near "...${around}..."`);
      }
      expectOperand = false;
      continue;
    }

    if (isOperatorChar(c)) {
      if (expectOperand) {
        return fail(`Operator "${c}" needs an operand before it. Check "...${around}..."`);
      }
      expectOperand = true;
      continue;
    }
  }

  if (depth > 0) {
    return fail(`Unbalanced parentheses — ${depth} opening "(" never got closed.`);
  }

  if (expectOperand) {
    return fail('The expression cannot end with a bare operator. Something like "A+" is incomplete.');
  }

  return { valid: true, error: null };
}

export function validatePostfix(raw) {
  const expr = (raw || '').replace(/\s+/g, '').toUpperCase();

  if (!expr) {
    return fail('The input is empty! Type a postfix expression like ABC*+ to get started.');
  }

  if (!/^[A-Z+\-*/^]+$/.test(expr)) {
    const bad = [...expr].find((c) => !/[A-Z+\-*/^]/.test(c));
    return fail(
      `"${bad}" is not allowed here. Postfix uses operands A-Z and operators + - * / ^ (no parentheses).`
    );
  }

  // Simulate the stack counter: operands push, operators consume two & produce one.
  let count = 0;

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];

    if (isOperandChar(c)) {
      count++;
    } else if (isOperatorChar(c)) {
      if (count < 2) {
        return fail(
          `Invalid postfix — operator "${c}" arrived but there ${count === 1 ? 'is only 1 operand' : 'are no operands'} available for it.`
        );
      }
      count -= 1;
    }
  }

  if (count === 0) {
    return fail('Invalid postfix — every operand got consumed. Are some operators missing?');
  }

  if (count > 1) {
    return fail(`Too many operands — ${count} unfinished expressions are left on the stack. Operators are missing.`);
  }

  return { valid: true, error: null };
}

export function validatePrefix(raw) {
  const expr = (raw || '').replace(/\s+/g, '').toUpperCase();

  if (!expr) {
    return fail('The input is empty! Type a prefix expression like *+ABC to get started.');
  }

  if (!/^[A-Z+\-*/^]+$/.test(expr)) {
    const bad = [...expr].find((c) => !/[A-Z+\-*/^]/.test(c));
    return fail(
      `"${bad}" is not allowed here. Prefix uses operands A-Z and operators + - * / ^ (no parentheses).`
    );
  }

  // Scan right → left: operands push, operators consume two & produce one.
  let count = 0;

  for (let i = expr.length - 1; i >= 0; i--) {
    const c = expr[i];

    if (isOperandChar(c)) {
      count++;
    } else if (isOperatorChar(c)) {
      if (count < 2) {
        return fail(
          `Invalid prefix — operator "${c}" arrived but there ${count === 1 ? 'is only 1 operand' : 'are no operands'} available for it.`
        );
      }
      count -= 1;
    }
  }

  if (count === 0) {
    return fail('Invalid prefix — every operand got consumed. Are some operators missing?');
  }

  if (count > 1) {
    return fail(`Too many operands — ${count} unfinished expressions are left on the stack. Operators are missing.`);
  }

  return { valid: true, error: null };
}
