import { PRECEDENCE } from './visualizationSteps';

/* ── helpers shared by both Normal-Step generators ─────────────────── */

function isOperandChar(c) {
  return /^[A-Z]$/.test(c);
}

function isOperatorChar(c) {
  return '+-*/^'.includes(c);
}

function tokenize(expr) {
  const tokens = [];
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(' || c === ')') {
      tokens.push({ type: 'paren', value: c });
    } else if (isOperatorChar(c)) {
      tokens.push({ type: 'operator', value: c });
    } else if (isOperandChar(c)) {
      tokens.push({ type: 'operand', value: c });
    }
  }
  return tokens;
}

/* ── Infix → Postfix (Normal Method) ──────────────────────────────── */

/**
 * Build a simple expression tree from infix tokens (handles precedence,
 * associativity and parenthesised sub-expressions).
 *
 * ^ is right-associative; all other operators are left-associative.
 */
function buildTree(tokens) {
  function parseExpr(minPrec) {
    let node = parseUnary();

    while (
      tokens.length > 0 &&
      tokens[0].type === 'operator' &&
      PRECEDENCE[tokens[0].value] >= minPrec
    ) {
      const op = tokens.shift();
      const prec = PRECEDENCE[op.value];
      // Right-associative (^) uses prec; left-associative uses prec + 1.
      const nextMin = op.value === '^' ? prec : prec + 1;
      const right = parseExpr(nextMin);
      node = { type: 'binary', op: op.value, left: node, right };
    }
    return node;
  }

  function parseUnary() {
    return parsePrimary();
  }

  function parsePrimary() {
    if (tokens.length === 0) return null;

    if (tokens[0].type === 'paren' && tokens[0].value === '(') {
      tokens.shift(); // consume '('
      const node = parseExpr(1);
      if (tokens.length > 0 && tokens[0].type === 'paren' && tokens[0].value === ')') {
        tokens.shift(); // consume ')'
      }
      return node;
    }

    if (tokens[0].type === 'operand') {
      return { type: 'operand', value: tokens.shift().value };
    }

    return null;
  }

  return parseExpr(1);
}

/** Convert an expression-tree node to its postfix string. */
function treeToPostfix(node) {
  if (!node) return '';
  if (node.type === 'operand') return node.value;
  return treeToPostfix(node.left) + treeToPostfix(node.right) + node.op;
}

/**
 * For infix→postfix: find the split index of the lowest-precedence
 * operator at parenthesis-depth 0.  Among operators of equal lowest
 * precedence pick the rightmost one (preserves left-associativity).
 */
function findInfixSplitIndex(expr) {
  let depth = 0;
  let bestPrec = Infinity;
  let bestIdx = -1;

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0 && isOperatorChar(c)) {
      const p = PRECEDENCE[c];
      if (p < bestPrec || (p === bestPrec && i > bestIdx)) {
        bestPrec = p;
        bestIdx = i;
      }
    }
  }
  return bestIdx;
}

/**
 * Recursively collect meaningful transformation steps.
 *
 * Each step represents a real expression transformation (operator moved
 * according to precedence), NOT character-by-character accumulation.
 *
 * Process: recursively convert left and right sub-expressions, then
 * move the operator to its postfix position.
 *
 * Returns { steps: string[], finalResult: string }
 */
function collectInfixSteps(expr) {
  const tokens = tokenize(expr);

  // Check whether the expression contains any operators (outside parens).
  let hasOp = false;
  let depth = 0;
  for (const t of tokens) {
    if (t.type === 'paren' && t.value === '(') depth++;
    else if (t.type === 'paren' && t.value === ')') depth--;
    else if (depth === 0 && t.type === 'operator') hasOp = true;
  }

  // Pure operand or parenthesised single operand — already postfix-ready.
  if (!hasOp) {
    const tree = buildTree([...tokenize(expr)]);
    return { steps: [expr], finalResult: treeToPostfix(tree) };
  }

  const tree = buildTree([...tokenize(expr)]);
  const finalResult = treeToPostfix(tree);

  // Find the lowest-precedence operator outside parentheses.
  const splitIdx = findInfixSplitIndex(expr);
  if (splitIdx === -1) {
    return { steps: [expr], finalResult };
  }

  const left = expr.slice(0, splitIdx);
  const right = expr.slice(splitIdx + 1);
  const op = expr[splitIdx];

  // Recursively convert BOTH sides.
  const leftConverted = collectInfixSteps(left);
  const rightConverted = collectInfixSteps(right);

  // The operator moved to postfix position: leftPostfix + rightPostfix + op
  const newExpr = leftConverted.finalResult + rightConverted.finalResult + op;

  // Build transformation lines in evaluation order:
  //   1. Left-side sub-expression transformations (if any)
  //   2. Right-side sub-expression transformations (if any)
  //   3. Operator moved to postfix position
  //   4. Final result of this sub-expression
  const transformLines = [];

  const leftHasOps = leftConverted.steps.length > 1;
  const rightHasOps = rightConverted.steps.length > 1;

  if (leftHasOps) {
    // Map left-side recursive steps into full expression context.
    // Each left step shows the left sub-expression transforming while
    // the right side and operator remain in their original positions.
    for (let i = 1; i < leftConverted.steps.length; i++) {
      const leftStep = leftConverted.steps[i]; // e.g. "=AB+"
      const mappedLine = leftStep.slice(1) + right + op; // e.g. "AB+)*C"
      transformLines.push(`=${mappedLine}`);
    }
  }

  if (rightHasOps) {
    // Map right-side recursive steps into full expression context.
    // Each right step shows the right sub-expression transforming while
    // the left side is in its final postfix form and the operator is in place.
    for (let i = 1; i < rightConverted.steps.length; i++) {
      const rightStep = rightConverted.steps[i]; // e.g. "=CD*"
      const mappedLine = leftConverted.finalResult + op + rightStep.slice(1); // e.g. "AB*+CD*"
      transformLines.push(`=${mappedLine}`);
    }
  }

  // Operator moved to postfix position.
  if (newExpr !== expr) {
    transformLines.push(`=${newExpr}`);
  }

  // Final result of this entire sub-expression.
  if (transformLines[transformLines.length - 1] !== `=${finalResult}`) {
    transformLines.push(`=${finalResult}`);
  }

  // Deduplicate consecutive identical lines.
  const unique = [];
  for (const s of transformLines) {
    if (unique.length === 0 || s !== unique[unique.length - 1]) {
      unique.push(s);
    }
  }

  // First line is the bare original expression; rest are = prefixed.
  return { steps: [expr, ...unique], finalResult };
}

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

  const { steps, finalResult } = collectInfixSteps(clean);
  return { steps, finalResult };
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
