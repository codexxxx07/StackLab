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
      if (c === '^') {
        // Right-associative: pick the leftmost ^ at same precedence
        if (p < bestPrec || (p === bestPrec && i < bestIdx)) {
          bestPrec = p;
          bestIdx = i;
        }
      } else {
        // Left-associative: pick the rightmost operator at same precedence
        if (p < bestPrec || (p === bestPrec && i > bestIdx)) {
          bestPrec = p;
          bestIdx = i;
        }
      }
    }
  }
  return bestIdx;
}

/**
 * Check whether a string is fully wrapped in matching parentheses,
 * i.e. the first '(' matches the last ')' and nothing else is at depth 0.
 */
function isFullyWrapped(s) {
  if (!s.startsWith('(') || !s.endsWith(')') || s.length <= 2) return false;
  let d = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') d++;
    else if (s[i] === ')') d--;
    if (d === 0 && i < s.length - 1) return false;
  }
  return true;
}

/** Count operators at parenthesis-depth 0 in a string. */
function countOpsAtDepth0(s) {
  let count = 0;
  let d = 0;
  for (const c of s) {
    if (c === '(') d++;
    else if (c === ')') d--;
    else if (d === 0 && isOperatorChar(c)) count++;
  }
  return count;
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
 * For parenthesized sub-expressions:
 *   - If the inner expression has only 1 operator, parens are stripped
 *     immediately (e.g. (A+B)*C → AB+*C).
 *   - If the inner expression has multiple operators, parens stay during
 *     inner transforms and are removed when the outer operator moves
 *     (e.g. (A+B+C)*D → (A+BC+)*D → (AB+C+)*D → AB+C+D*).
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

  // Pure operand or parenthesized expression without operators at depth 0.
  if (!hasOp) {
    // If this is a fully wrapped expression with operators inside,
    // strip the outer parens and process the inner content.
    if (isFullyWrapped(expr)) {
      const inner = expr.slice(1, -1);
      const innerResult = collectInfixSteps(inner);
      if (innerResult.steps.length > 1) {
        const steps = [expr];
        for (let i = 1; i < innerResult.steps.length; i++) {
          steps.push(`=${innerResult.steps[i].slice(1)}`);
        }
        return { steps, finalResult: innerResult.finalResult };
      }
    }
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

  const leftWrapped = isFullyWrapped(left);
  const rightWrapped = isFullyWrapped(right);

  // For wrapped sides, recurse on the inner content (without parens).
  const leftConverted = leftWrapped
    ? collectInfixSteps(left.slice(1, -1))
    : collectInfixSteps(left);
  const rightConverted = rightWrapped
    ? collectInfixSteps(right.slice(1, -1))
    : collectInfixSteps(right);

  // The operator moved to postfix position: leftPostfix + rightPostfix + op
  const newExpr = leftConverted.finalResult + rightConverted.finalResult + op;

  // Build transformation lines in evaluation order:
  //   1. Left-side sub-expression transformations (if any)
  //   2. Right-side sub-expression transformations (if any)
  //   3. Operator moved to postfix position
  //   4. Final result of this sub-expression
  const transformLines = [];

  // 1. Left-side sub-expression transformations.
  const leftHasOps = leftConverted.steps.length > 1;
  if (leftHasOps) {
    const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
    for (let i = 1; i < leftConverted.steps.length; i++) {
      const innerStep = leftConverted.steps[i].slice(1); // Remove "=" prefix
      if (leftWrapped && innerOpCount <= 1) {
        // Simple inner expression — strip parens immediately.
        transformLines.push(`=${innerStep}${op}${right}`);
      } else if (leftWrapped) {
        // Complex inner expression — keep parens during inner transforms.
        transformLines.push(`=(${innerStep})${op}${right}`);
      } else {
        transformLines.push(`=${innerStep}${op}${right}`);
      }
    }
  } else if (leftWrapped) {
    // Left is wrapped but has no internal transformations — just unwrap.
    transformLines.push(`=${left.slice(1, -1)}${op}${right}`);
  }

  // 2. Right-side sub-expression transformations.
  const rightHasOps = rightConverted.steps.length > 1;
  if (rightHasOps) {
    const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
    for (let i = 1; i < rightConverted.steps.length; i++) {
      const innerStep = rightConverted.steps[i].slice(1); // Remove "=" prefix
      if (rightWrapped && innerOpCount <= 1) {
        // Simple inner expression — strip parens immediately.
        transformLines.push(`=${leftConverted.finalResult}${op}${innerStep}`);
      } else if (rightWrapped) {
        // Complex inner expression — keep parens during inner transforms.
        transformLines.push(`=${leftConverted.finalResult}${op}(${innerStep})`);
      } else {
        transformLines.push(`=${leftConverted.finalResult}${op}${innerStep}`);
      }
    }
  } else if (rightWrapped) {
    // Right is wrapped but has no internal transformations — just unwrap.
    transformLines.push(`=${leftConverted.finalResult}${op}${right.slice(1, -1)}`);
  }

  // 3. Operator moved to postfix position.
  if (newExpr !== expr) {
    transformLines.push(`=${newExpr}`);
  }

  // 4. Final result of this entire sub-expression.
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
 * Returns { expression: string, stack: string, infix: string }[]
 *
 * The third column (the growing INFIX result) mirrors the reference
 * Infix → Postfix table: it shows the most complete sub-expression on the
 * top of the stack, which is exactly how this algorithm assembles the answer.
 */
export function postfixToInfixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      infix: s.stack.length ? s.stack[s.stack.length - 1] : s.built || '',
    }));
}

/* ── Infix → Prefix (Normal Method) ──────────────────────────────── */

/**
 * For infix→prefix: find the split index of the lowest-precedence
 * operator at parenthesis-depth 0.  Among operators of equal lowest
 * precedence pick the rightmost one (this mirrors the reversed-scan
 * stack so both methods produce identical answers).
 */
function findInfixSplitIndexPrefix(expr) {
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

/** Strip redundant outer parentheses from an operand-only string, e.g. "(A)" → "A". */
function peelOperand(s) {
  let out = s;
  while (out.length > 1 && out[0] === '(' && out[out.length - 1] === ')') {
    out = out.slice(1, -1);
  }
  return out;
}

/**
 * Recursively collect meaningful Prefix transformation steps.
 *
 * Each step represents a real expression transformation (operator moved
 * in FRONT of its operands according to precedence), NOT character-by-
 * character accumulation.
 *
 * Process: recursively convert left and right sub-expressions, then move
 * the operator to the prefix (front) position.
 *
 * Returns { steps: string[], finalResult: string }
 */
function collectPrefixSteps(expr) {
  const tokens = tokenize(expr);

  let hasOp = false;
  let depth = 0;
  for (const t of tokens) {
    if (t.type === 'paren' && t.value === '(') depth++;
    else if (t.type === 'paren' && t.value === ')') depth--;
    else if (depth === 0 && t.type === 'operator') hasOp = true;
  }

  // Pure operand or parenthesized expression without operators at depth 0.
  if (!hasOp) {
    if (isFullyWrapped(expr)) {
      const inner = expr.slice(1, -1);
      const innerResult = collectPrefixSteps(inner);
      if (innerResult.steps.length > 1) {
        const steps = [expr];
        for (let i = 1; i < innerResult.steps.length; i++) {
          steps.push(`=${innerResult.steps[i].slice(1)}`);
        }
        return { steps, finalResult: innerResult.finalResult };
      }
    }
    // Redundant outer parens (even nested ones) can hide the real content.
    const peeled = peelOperand(expr);
    if (peeled !== expr) {
      const innerResult = collectPrefixSteps(peeled);
      const steps = [expr];
      for (let i = 1; i < innerResult.steps.length; i++) {
        steps.push(`=${innerResult.steps[i].slice(1)}`);
      }
      return { steps, finalResult: innerResult.finalResult };
    }
    return { steps: [expr], finalResult: expr };
  }

  const splitIdx = findInfixSplitIndexPrefix(expr);
  if (splitIdx === -1) {
    const peeled = peelOperand(expr);
    if (peeled !== expr) {
      const innerResult = collectPrefixSteps(peeled);
      const steps = [expr];
      for (let i = 1; i < innerResult.steps.length; i++) {
        steps.push(`=${innerResult.steps[i].slice(1)}`);
      }
      return { steps, finalResult: innerResult.finalResult };
    }
    return { steps: [expr], finalResult: expr };
  }

  const left = expr.slice(0, splitIdx);
  const right = expr.slice(splitIdx + 1);
  const op = expr[splitIdx];

  const leftWrapped = isFullyWrapped(left);
  const rightWrapped = isFullyWrapped(right);

  const leftConverted = leftWrapped
    ? collectPrefixSteps(left.slice(1, -1))
    : collectPrefixSteps(left);
  const rightConverted = rightWrapped
    ? collectPrefixSteps(right.slice(1, -1))
    : collectPrefixSteps(right);

  // The operator moved to the prefix position: op + leftPrefix + rightPrefix
  const newExpr = op + leftConverted.finalResult + rightConverted.finalResult;

  const transformLines = [];

  // 1. Left-side sub-expression transformations.
  const leftHasOps = leftConverted.steps.length > 1;
  if (leftHasOps) {
    const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
    for (let i = 1; i < leftConverted.steps.length; i++) {
      const innerStep = leftConverted.steps[i].slice(1);
      if (leftWrapped && innerOpCount <= 1) {
        transformLines.push(`=${innerStep}${op}${right}`);
      } else if (leftWrapped) {
        transformLines.push(`=(${innerStep})${op}${right}`);
      } else {
        transformLines.push(`=${innerStep}${op}${right}`);
      }
    }
  } else if (leftWrapped) {
    transformLines.push(`=${left.slice(1, -1)}${op}${right}`);
  }

  // 2. Right-side sub-expression transformations.
  const rightHasOps = rightConverted.steps.length > 1;
  if (rightHasOps) {
    const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
    for (let i = 1; i < rightConverted.steps.length; i++) {
      const innerStep = rightConverted.steps[i].slice(1);
      if (rightWrapped && innerOpCount <= 1) {
        transformLines.push(`=${leftConverted.finalResult}${op}${innerStep}`);
      } else if (rightWrapped) {
        transformLines.push(`=${leftConverted.finalResult}${op}(${innerStep})`);
      } else {
        transformLines.push(`=${leftConverted.finalResult}${op}${innerStep}`);
      }
    }
  } else if (rightWrapped) {
    transformLines.push(`=${leftConverted.finalResult}${op}${right.slice(1, -1)}`);
  }

  // 3. Operator moved to the prefix position.
  if (newExpr !== expr) {
    transformLines.push(`=${newExpr}`);
  }

  // 4. Final result of this entire sub-expression.
  if (transformLines[transformLines.length - 1] !== `=${newExpr}`) {
    transformLines.push(`=${newExpr}`);
  }

  // Deduplicate consecutive identical lines.
  const unique = [];
  for (const s of transformLines) {
    if (unique.length === 0 || s !== unique[unique.length - 1]) {
      unique.push(s);
    }
  }

  return { steps: [expr, ...unique], finalResult: newExpr };
}

/**
 * Infix → Prefix: Generate the "Normal Method" transformation steps.
 *
 * Produces a readable derivation using the = style:
 *   (A+B)*C
 *   =+AB*C
 *   =*+ABC
 *
 * Returns { steps: string[], finalResult: string }
 */
export function infixToPrefixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  return collectPrefixSteps(clean);
}

/**
 * Infix → Prefix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, prefix: string }[]
 */
export function infixToPrefixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      prefix: s.output,
    }));
}

/* ── Prefix → Infix (Normal Method) ──────────────────────────────── */

/**
 * Prefix → Infix: Generate the "Normal Method" transformation steps.
 *
 * Scans right → left and progressively re-parenthesises the expression.
 * Uses the = style:
 *   *+ABC
 *   =*(A+B)C
 *   =((A+B)*C)
 *
 * Returns { steps: string[], finalResult: string }
 */
export function prefixToInfixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  const stack = [];
  const steps = [];
  steps.push(clean);

  for (let i = clean.length - 1; i >= 0; i--) {
    const c = clean[i];

    if (/^[A-Z]$/.test(c)) {
      stack.push(c);
    } else if ('+-*/^'.includes(c)) {
      const left = stack.pop();
      const right = stack.pop();
      const combined = `(${left}${c}${right})`;
      stack.push(combined);

      const remaining = clean.slice(0, i);
      const display = remaining + [...stack].reverse().join('');
      steps.push(`=${display}`);
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
 * Prefix → Infix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, infix: string }[]
 *
 * The third column (the growing INFIX result) mirrors the reference
 * Infix → Postfix table: it shows the most complete sub-expression on the
 * top of the stack, which is exactly how this algorithm assembles the answer.
 */
export function prefixToInfixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      infix: s.stack.length ? s.stack[s.stack.length - 1] : s.built || '',
    }));
}

/* ── Postfix → Prefix (Normal Method) ────────────────────────────── */

/**
 * Postfix → Prefix: Generate the "Normal Method" transformation steps.
 *
 * Reads the postfix expression left → right and progressively rebuilds it
 * as prefix by combining each operator with the two expressions before it.
 * Uses the = style:
 *   ABC*+
 *   =A*BC
 *   =+A*BC
 *
 * Each state is a meaningful transformation (never character-by-character).
 *
 * Returns { steps: string[], finalResult: string }
 */
export function postfixToPrefixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  const stack = [];
  const steps = [];
  steps.push(clean);

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
    } else if (isOperatorChar(c)) {
      const a = stack.pop();
      const b = stack.pop();
      const combined = `${c}${b}${a}`;
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
 * Postfix → Prefix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, prefix: string }[]
 *
 * The third column (the growing PREFIX result) mirrors the reference
 * Infix → Postfix table: it shows the most complete expression on the top
 * of the stack, which is how this algorithm assembles the answer.
 */
export function postfixToPrefixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      prefix: s.output || '',
    }));
}

/* ── Prefix → Postfix (Normal Method) ────────────────────────────── */

/**
 * Prefix → Postfix: Generate the "Normal Method" transformation steps.
 *
 * Reads the prefix expression right → left and progressively rebuilds it
 * as postfix by placing each operator after the two expressions it owns.
 * Uses the = style:
 *   +A*BC
 *   =+ABC*
 *   =ABC*+
 *
 * Each state is a meaningful transformation (never character-by-character).
 *
 * Returns { steps: string[], finalResult: string }
 */
export function prefixToPostfixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };

  const stack = [];
  const steps = [];
  steps.push(clean);

  for (let i = clean.length - 1; i >= 0; i--) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
    } else if (isOperatorChar(c)) {
      const a = stack.pop();
      const b = stack.pop();
      const combined = `${a}${b}${c}`;
      stack.push(combined);

      const remaining = clean.slice(0, i);
      const display = remaining + [...stack].reverse().join('');
      steps.push(`=${display}`);
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
 * Prefix → Postfix: Generate the "Stack Method" execution table rows.
 *
 * Returns { expression: string, stack: string, postfix: string }[]
 *
 * The third column (the growing POSTFIX result) mirrors the reference
 * Infix → Postfix table: it shows the most complete expression on the top
 * of the stack, which is how this algorithm assembles the answer.
 */
export function prefixToPostfixStackRows(steps) {
  if (!steps || steps.length === 0) return [];

  return steps
    .filter((s) => s.type !== 'init' && s.type !== 'done')
    .map((s) => ({
      expression: s.symbol,
      stack: s.stack.join(' '),
      postfix: s.output || '',
    }));
}
