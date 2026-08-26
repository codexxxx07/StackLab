import { PRECEDENCE, isOperandChar, isOperatorChar } from './visualizationSteps';

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

function tokenize(expr) {
  const tokens = [];
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(' || c === ')') tokens.push({ type: 'paren', value: c });
    else if (isOperatorChar(c)) tokens.push({ type: 'operator', value: c });
    else if (isOperandChar(c)) tokens.push({ type: 'operand', value: c });
  }
  return tokens;
}

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
      const nextMin = op.value === '^' ? prec : prec + 1;
      const right = parseExpr(nextMin);
      node = { type: 'binary', op: op.value, left: node, right };
    }
    return node;
  }
  function parseUnary() { return parsePrimary(); }
  function parsePrimary() {
    if (tokens.length === 0) return null;
    if (tokens[0].type === 'paren' && tokens[0].value === '(') {
      tokens.shift();
      const node = parseExpr(1);
      if (tokens.length > 0 && tokens[0].type === 'paren' && tokens[0].value === ')') tokens.shift();
      return node;
    }
    if (tokens[0].type === 'operand') return { type: 'operand', value: tokens.shift().value };
    return null;
  }
  return parseExpr(1);
}

function treeToPostfix(node) {
  if (!node) return '';
  if (node.type === 'operand') return node.value;
  return treeToPostfix(node.left) + treeToPostfix(node.right) + node.op;
}

function findInfixSplitIndex(expr) {
  let depth = 0, bestPrec = Infinity, bestIdx = -1;
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

function getOperatorName(op) {
  const names = { '+': 'addition', '-': 'subtraction', '*': 'multiplication', '/': 'division', '^': 'exponentiation' };
  return names[op] || op;
}

function getPrecedenceLabel(op) {
  const p = PRECEDENCE[op];
  if (p === 3) return 'highest';
  if (p === 2) return 'high';
  return 'low';
}

/**
 * Generate live explanation steps for Infix→Postfix Normal Method.
 * Returns { expression: string, explanation: string }[]
 */
export function infixToPostfixNormalLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const tree = buildTree([...tokenize(clean)]);
  const finalResult = treeToPostfix(tree);

  // Step 1: Show the starting expression
  steps.push({
    expression: clean,
    explanation: `Start with the infix expression <strong>${clean}</strong>. We need to convert it to postfix notation by moving operators after their operands based on precedence rules.`,
  });

  // Recursively collect transformation steps with explanations
  function collectSteps(currentExpr) {
    const tokens = tokenize(currentExpr);
    let hasOp = false, depth = 0;
    for (const t of tokens) {
      if (t.type === 'paren' && t.value === '(') depth++;
      else if (t.type === 'paren' && t.value === ')') depth--;
      else if (depth === 0 && t.type === 'operator') hasOp = true;
    }
    if (!hasOp) return;

    const splitIdx = findInfixSplitIndex(currentExpr);
    if (splitIdx === -1) return;

    const left = currentExpr.slice(0, splitIdx);
    const right = currentExpr.slice(splitIdx + 1);
    const op = currentExpr[splitIdx];
    const prec = PRECEDENCE[op];

    // Explain which operator to process
    if (left.length > 1 || right.length > 1) {
      steps.push({
        expression: currentExpr,
        explanation: `Identify the operator with the ${getPrecedenceLabel(op)} precedence to process first. The <strong>${op}</strong> (${getOperatorName(op)}) at the center has precedence ${prec}. ${left.length > 1 ? `The left side "${left}" needs processing.` : ''} ${right.length > 1 ? `The right side "${right}" needs processing.` : ''}`,
      });
    }

    // Process left sub-expression if it has operators
    const leftTokens = tokenize(left);
    let leftHasOps = false, ld = 0;
    for (const t of leftTokens) {
      if (t.type === 'paren' && t.value === '(') ld++;
      else if (t.type === 'paren' && t.value === ')') ld--;
      else if (ld === 0 && t.type === 'operator') leftHasOps = true;
    }
    if (leftHasOps) collectSteps(left);

    // Process right sub-expression if it has operators
    const rightTokens = tokenize(right);
    let rightHasOps = false, rd = 0;
    for (const t of rightTokens) {
      if (t.type === 'paren' && t.value === '(') rd++;
      else if (t.type === 'paren' && t.value === ')') rd--;
      else if (rd === 0 && t.type === 'operator') rightHasOps = true;
    }
    if (rightHasOps) collectSteps(right);

    // Move operator to postfix position
    const leftPostfix = treeToPostfix(buildTree([...tokenize(left)]));
    const rightPostfix = treeToPostfix(buildTree([...tokenize(right)]));
    const newExpr = leftPostfix + rightPostfix + op;

    if (newExpr !== currentExpr) {
      steps.push({
        expression: `=${newExpr}`,
        explanation: `Move <strong>${op}</strong> after its operands: "${left}" becomes "${leftPostfix}", "${right}" becomes "${rightPostfix}". Place <strong>${op}</strong> at the end → <strong>${newExpr}</strong>.`,
      });
    }
  }

  collectSteps(clean);

  // Ensure final result step exists
  const lastStep = steps[steps.length - 1];
  if (!lastStep || lastStep.expression !== `=${finalResult}`) {
    steps.push({
      expression: `=${finalResult}`,
      explanation: `All operators have been placed after their operands. The final postfix expression is <strong>${finalResult}</strong>.`,
    });
  }

  // Deduplicate consecutive identical expressions
  const unique = [];
  for (const s of steps) {
    if (unique.length === 0 || s.expression !== unique[unique.length - 1].expression) {
      unique.push(s);
    }
  }

  return unique;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

/**
 * Generate live explanation steps for Infix→Postfix Stack Method.
 * Returns { token: string, stack: string[], output: string, operation: string, explanation: string }[]
 */
export function infixToPostfixStackLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const stack = [];
  let output = '';

  // Step 1: Initialize
  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'Initialize an empty stack and an empty output string. We will scan the expression from left to right.',
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      output += c;
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'OUTPUT',
        explanation: `<strong>${c}</strong> is an operand. Operands go directly to the output without touching the stack.`,
      });
    } else if (c === '(') {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `<strong>(</strong> is an opening parenthesis. Push it onto the stack. It acts as a barrier — nothing below it can be popped until its matching <strong>)</strong> arrives.`,
      });
    } else if (c === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        const popped = stack.pop();
        output += popped;
        steps.push({
          token: c,
          stack: [...stack],
          output,
          operation: 'POP',
          explanation: `Closing <strong>)</strong> found. Pop <strong>${popped}</strong> from the stack and add it to the output.`,
        });
      }
      stack.pop(); // Remove '('
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'DISCARD',
        explanation: `Discard the matching <strong>(</strong> from the stack. Parentheses are not included in the postfix expression.`,
      });
    } else if (isOperatorChar(c)) {
      const pCur = PRECEDENCE[c];

      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= pCur
      ) {
        const top = stack.pop();
        output += top;
        steps.push({
          token: c,
          stack: [...stack],
          output,
          operation: 'POP',
          explanation: `Operator <strong>${c}</strong> (prec ${pCur}) vs stack top <strong>${top}</strong> (prec ${PRECEDENCE[top]}). Since ${PRECEDENCE[top]} ≥ ${pCur}, pop <strong>${top}</strong> to the output first.`,
        });
      }

      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `Push <strong>${c}</strong> onto the stack. It must wait for its right operand to be processed.`,
      });
    }
  }

  // Flush remaining operators
  while (stack.length > 0) {
    const popped = stack.pop();
    output += popped;
    steps.push({
      token: '—',
      stack: [...stack],
      output,
      operation: 'FLUSH',
      explanation: `Input exhausted. Pop leftover operator <strong>${popped}</strong> from the stack to the output.`,
    });
  }

  // Final step
  steps.push({
    token: '✓',
    stack: [],
    output,
    operation: 'COMPLETE',
    explanation: `Stack is empty. The final postfix expression is <strong>${output}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

/**
 * Generate live explanation steps for Postfix→Infix Normal Method.
 * Returns { expression: string, explanation: string }[]
 */
export function postfixToInfixNormalLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    expression: clean,
    explanation: `Start with the postfix expression <strong>${clean}</strong>. We will read left to right, building sub-expressions as we encounter operators.`,
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        expression: stack.join(' '),
        explanation: `<strong>${c}</strong> is an operand. Push it onto the working stack as a standalone expression.`,
      });
    } else if (isOperatorChar(c)) {
      const right = stack.pop();
      const left = stack.pop();
      const combined = `(${left}${c}${right})`;
      stack.push(combined);

      steps.push({
        expression: stack.join(' '),
        explanation: `Operator <strong>${c}</strong> found. Pop the two most recent expressions: right = <strong>${right}</strong>, left = <strong>${left}</strong>. Combine them as <strong>(${left}${c}${right})</strong> and push back.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    expression: `=${result}`,
    explanation: `One expression remains on the stack. The final infix expression is <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

/**
 * Generate live explanation steps for Postfix→Infix Stack Method.
 * Returns { token: string, stack: string[], output: string, operation: string, explanation: string }[]
 */
export function postfixToInfixStackLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'Initialize an empty stack. This stack holds partial expressions (strings), not single characters.',
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'PUSH',
        explanation: `<strong>${c}</strong> is an operand. Push it onto the stack as its own mini-expression.`,
      });
    } else if (isOperatorChar(c)) {
      const right = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-RIGHT',
        explanation: `Operator <strong>${c}</strong> needs two operands. Pop <strong>${right}</strong> — this is the RIGHT operand (it was pushed last).`,
      });

      const left = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-LEFT',
        explanation: `Pop <strong>${left}</strong> — this is the LEFT operand. Order matters: we build (LEFT op RIGHT), never (RIGHT op LEFT).`,
      });

      const built = `(${left}${c}${right})`;
      stack.push(built);
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'BUILD',
        explanation: `Combine: <strong>${left}</strong> <strong>${c}</strong> <strong>${right}</strong> → <strong>${built}</strong>. Push the result back onto the stack.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    token: '✓',
    stack: [result],
    output: result,
    operation: 'COMPLETE',
    explanation: `One expression remains. The final infix expression is <strong>${result}</strong>.`,
  });

  return steps;
}
