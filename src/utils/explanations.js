import { PRECEDENCE } from './visualizationSteps';

/**
 * Infix → Postfix: Generate the "Normal Method" transformation steps.
 *
 * Produces human-readable derivation using the = style:
 *   A+B*C
 *   =A+BC*
 *   =ABC*+
 *
 * The steps show how operators are reordered based on precedence.
 *
 * Returns { steps: string[], finalResult: string }
 */
export function infixToPostfixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  const tokens = [];
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === '(' || c === ')') {
      tokens.push({ type: 'paren', value: c });
    } else if ('+-*/^'.includes(c)) {
      tokens.push({ type: 'operator', value: c });
    } else if (/^[A-Z]$/.test(c)) {
      tokens.push({ type: 'operand', value: c });
    }
  }

  const outputTokens = [];
  const stack = [];

  for (const tok of tokens) {
    if (tok.type === 'operand') {
      outputTokens.push(tok.value);
    } else if (tok.type === 'paren' && tok.value === '(') {
      stack.push(tok.value);
    } else if (tok.type === 'paren' && tok.value === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        outputTokens.push(stack.pop());
      }
      stack.pop();
    } else if (tok.type === 'operator') {
      const pCur = PRECEDENCE[tok.value];
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= pCur
      ) {
        outputTokens.push(stack.pop());
      }
      stack.push(tok.value);
    }
  }

  while (stack.length) {
    outputTokens.push(stack.pop());
  }

  const finalResult = outputTokens.join('');

  const steps = [];
  steps.push(clean);

  let currentOutput = '';
  let parenOpen = 0;

  for (const tok of tokens) {
    if (tok.type === 'operand') {
      currentOutput += tok.value;
      steps.push(`=${currentOutput}${parenOpen > 0 ? '(' .repeat(parenOpen) : ''}`);
    } else if (tok.type === 'paren' && tok.value === '(') {
      parenOpen++;
    } else if (tok.type === 'paren' && tok.value === ')') {
      parenOpen--;
    } else if (tok.type === 'operator') {
      const pCur = PRECEDENCE[tok.value];

      let popped = '';
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= pCur
      ) {
        popped += stack.pop();
        currentOutput += popped[popped.length - 1];
      }

      if (popped) {
        steps.push(`=${currentOutput}`);
      }

      stack.push(tok.value);
    }
  }

  while (stack.length) {
    currentOutput += stack.pop();
  }

  if (steps[steps.length - 1] !== `=${finalResult}`) {
    steps.push(`=${finalResult}`);
  }

  const unique = [];
  for (const s of steps) {
    if (unique.length === 0 || s !== unique[unique.length - 1]) {
      unique.push(s);
    }
  }

  return { steps: unique, finalResult };
}

/**
 * Infix → Postfix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, postfix: string }[]
 */
export function infixToPostfixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      postfix: s.output,
    }));
}

/**
 * Postfix → Infix: Generate the "Normal Method" transformation steps.
 *
 * Shows progressive grouping using parentheses as the stack combines.
 * Uses the = style:
 *   ABC*+
 *   =AB(C*)
 *   =A(B*C)
 *   =(A+(B*C))
 *
 * Returns { steps: string[], finalResult: string }
 */
export function postfixToInfixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  const stack = [];
  const steps = [];
  steps.push(clean);

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (/^[A-Z]$/.test(c)) {
      stack.push(c);
    } else if ('+-*/^'.includes(c)) {
      const right = stack.pop();
      const left = stack.pop();
      const combined = `(${left}${c}${right})`;
      stack.push(combined);

      const currentStack = [...stack];
      const lastCombined = currentStack.pop();
      const prefix = currentStack.join('');

      steps.push(`=${prefix}${lastCombined}`);
    }
  }

  const result = stack[0] || '';

  if (steps[steps.length - 1] !== `=${result}`) {
    steps.push(`=${result}`);
  }

  const unique = [];
  for (const s of steps) {
    if (unique.length === 0 || s !== unique[unique.length - 1]) {
      unique.push(s);
    }
  }

  return { steps: unique, finalResult: result };
}

/**
 * Postfix → Infix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, operation: string }[]
 */
export function postfixToInfixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(', '),
      operation: s.action,
    }));
}
