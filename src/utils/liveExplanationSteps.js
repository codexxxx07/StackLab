import { PRECEDENCE, isOperandChar, isOperatorChar } from './visualizationSteps';

/* ──────────────────────────────────────────────────────────────────────
   HELPERS
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

function extractOperands(expr) {
  const seen = new Set();
  const result = [];
  for (const c of expr) {
    if (isOperandChar(c) && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}

function extractOperators(expr) {
  const seen = new Set();
  const result = [];
  for (const c of expr) {
    if (isOperatorChar(c) && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPostfixIntroSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  const operands = extractOperands(clean);
  const operators = extractOperators(clean);
  const steps = [];

  // Step 1: What are we converting?
  steps.push({
    type: 'intro',
    title: 'What are we converting?',
    content: `
      <p class="mb-3">We are given an <strong>infix expression</strong>:</p>
      <p class="font-mono text-lg font-extrabold mb-4">${clean}</p>
      <p class="mb-2"><strong>Infix</strong> is the notation we normally write. The operator sits <em>between</em> its operands.</p>
      <p class="mb-3">For example, in <code class="font-mono font-bold">A + B</code>:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li><strong>A</strong> and <strong>B</strong> are <em>operands</em> — the values we operate on</li>
        <li><strong>+</strong> is an <em>operator</em> — it tells us what to do</li>
      </ul>
      <p class="mb-2">In this expression:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
    `,
  });

  // Step 2: Why Postfix?
  steps.push({
    type: 'intro',
    title: 'Why Postfix?',
    content: `
      <p class="mb-3">In <strong>postfix notation</strong> (also called Reverse Polish Notation), the operator comes <em>after</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Postfix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A B +</p>
        </div>
      </div>
      <p class="mb-2">Why does this matter? In postfix:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>We don't need parentheses to show order</li>
        <li>We don't need to remember precedence rules</li>
        <li>A computer can evaluate it left to right in one pass</li>
      </ul>
    `,
  });

  // Step 3: Precedence
  const precInfo = operators.map(op => ({
    op,
    name: getOperatorName(op),
    prec: PRECEDENCE[op],
    label: getPrecedenceLabel(op),
  }));

  steps.push({
    type: 'intro',
    title: 'Operator Precedence',
    content: `
      <p class="mb-3">Not all operators have the same priority. Some must be done first.</p>
      <div class="space-y-2 mb-4">
        ${precInfo.map(o => `
          <div class="flex items-center gap-3 rounded-xl border border-stone-900/10 bg-cream/50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <span class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">${o.op}</span>
            <span class="text-xs font-semibold text-stone-600 dark:text-gray-300">${o.name}</span>
            <span class="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              o.prec === 3 ? 'bg-rose-500/10 text-rose-500' : o.prec === 2 ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-500'
            }">prec ${o.prec} — ${o.label}</span>
          </div>
        `).join('')}
      </div>
      <p>Higher precedence means the operator must be applied first. So <strong>${operators.find(o => PRECEDENCE[o] === Math.max(...operators.map(op => PRECEDENCE[op])))}</strong> (highest precedence) will be handled before <strong>${operators.find(o => PRECEDENCE[o] === Math.min(...operators.map(op => PRECEDENCE[op])))}</strong> (lowest precedence).</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPostfixNormalLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const tree = buildTree([...tokenize(clean)]);
  const finalResult = treeToPostfix(tree);

  steps.push({
    expression: clean,
    explanation: `We start with the infix expression <strong>${clean}</strong>. Our goal is to convert it to postfix notation by moving each operator after its operands, following precedence rules.`,
  });

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

    if (left.length > 1 || right.length > 1) {
      const reasons = [];
      if (left.length > 1) reasons.push(`The left side "${left}" contains operators that need processing first.`);
      if (right.length > 1) reasons.push(`The right side "${right}" contains operators that need processing first.`);
      steps.push({
        expression: currentExpr,
        explanation: `Looking at <strong>${currentExpr}</strong>: we identify <strong>${op}</strong> (${getOperatorName(op)}) as the operator with ${getPrecedenceLabel(op)} precedence (level ${prec}). ${reasons.join(' ')}`,
      });
    }

    const leftTokens = tokenize(left);
    let leftHasOps = false, ld = 0;
    for (const t of leftTokens) {
      if (t.type === 'paren' && t.value === '(') ld++;
      else if (t.type === 'paren' && t.value === ')') ld--;
      else if (ld === 0 && t.type === 'operator') leftHasOps = true;
    }
    if (leftHasOps) collectSteps(left);

    const rightTokens = tokenize(right);
    let rightHasOps = false, rd = 0;
    for (const t of rightTokens) {
      if (t.type === 'paren' && t.value === '(') rd++;
      else if (t.type === 'paren' && t.value === ')') rd--;
      else if (rd === 0 && t.type === 'operator') rightHasOps = true;
    }
    if (rightHasOps) collectSteps(right);

    const leftPostfix = treeToPostfix(buildTree([...tokenize(left)]));
    const rightPostfix = treeToPostfix(buildTree([...tokenize(right)]));
    const newExpr = leftPostfix + rightPostfix + op;

    if (newExpr !== currentExpr) {
      steps.push({
        expression: `=${newExpr}`,
        explanation: `In postfix, the operator <strong>${op}</strong> moves after both of its operands. "${left}" becomes <strong>${leftPostfix}</strong> and "${right}" becomes <strong>${rightPostfix}</strong>. Placing <strong>${op}</strong> at the end gives us <strong>${newExpr}</strong>.`,
      });
    }
  }

  collectSteps(clean);

  const lastStep = steps[steps.length - 1];
  if (!lastStep || lastStep.expression !== `=${finalResult}`) {
    steps.push({
      expression: `=${finalResult}`,
      explanation: `All operators have been placed after their operands. The final postfix expression is <strong>${finalResult}</strong>.`,
    });
  }

  const unique = [];
  for (const s of steps) {
    if (unique.length === 0 || s.expression !== unique[unique.length - 1].expression) {
      unique.push(s);
    }
  }

  return unique;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPostfixStackIntroSteps() {
  const steps = [];

  // What is a Stack?
  steps.push({
    type: 'intro',
    title: 'What is a Stack?',
    content: `
      <p class="mb-3">A <strong>stack</strong> is a data structure where the <em>last</em> item added is the <em>first</em> item removed.</p>
      <p class="mb-3 text-xs font-semibold text-stone-500 dark:text-gray-400 uppercase tracking-wider">Last In, First Out — LIFO</p>
      <div class="flex justify-center my-4">
        <div class="inline-flex flex-col items-center">
          <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500 mb-1">TOP ↓</div>
          <div class="rounded-xl border-2 border-indigo-600 bg-indigo-600/10 px-6 py-2.5 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">* ← First removed</div>
          <div class="h-0.5 w-full bg-indigo-600/20"></div>
          <div class="rounded-xl border border-stone-900/10 bg-white px-6 py-2.5 font-mono text-sm font-bold text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">+ ← Added earlier</div>
          <div class="mt-3 h-2 w-24 rounded-full bg-stone-300 dark:bg-gray-700"></div>
        </div>
      </div>
      <p>If we push <strong>+</strong> and then push <strong>*</strong>, the <strong>*</strong> sits on top and will be removed first.</p>
    `,
  });

  // Stack Rules
  steps.push({
    type: 'intro',
    title: 'Stack Method Rules',
    content: `
      <p class="mb-3">Before we process the expression, here are the rules we follow:</p>
      <div class="space-y-2">
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operand</strong> → Add directly to the output. No thinking needed.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>(</strong> → Push onto the stack. It acts as a barrier.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-amber-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-amber-500/5">
          <span class="shrink-0 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator</strong> → Compare with the top of the stack.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Higher precedence</strong> → Push the new operator on top.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">5</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Lower/equal precedence</strong> → Pop the top to output first, then push.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-sky-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-sky-500/5">
          <span class="shrink-0 rounded-lg bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-500">6</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>End of expression</strong> → Pop all remaining operators into output.</p>
        </div>
      </div>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → POSTFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPostfixStackLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const stack = [];
  let output = '';

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'We start with an empty stack and empty output. We will scan the expression <strong>left to right</strong>, one token at a time.',
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
        explanation: `<strong>${c}</strong> is an operand. Operands go directly to the postfix output — they never wait in the stack. Think of it as: "I know where you belong, so straight to the answer."`,
      });
    } else if (c === '(') {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `<strong>(</strong> is an opening parenthesis. We push it onto the stack. It acts like a <em>floor</em> — nothing below it can be popped until its matching <strong>)</strong> arrives.`,
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
          explanation: `Closing <strong>)</strong> found. We must flush everything back to the matching <strong>(</strong>. Pop <strong>${popped}</strong> from the stack and add it to the output.`,
        });
      }
      stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'DISCARD',
        explanation: `Discard the matching <strong>(</strong> from the stack. Parentheses are not included in postfix notation — the grouping is already encoded in the order of symbols.`,
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
          explanation: `We want to push <strong>${c}</strong> (precedence ${pCur}), but the stack top <strong>${top}</strong> has precedence ${PRECEDENCE[top]} which is ≥ ${pCur}. That means <strong>${top}</strong> must be applied <em>before</em> <strong>${c}</strong>, so we pop <strong>${top}</strong> to the output first.`,
        });
      }

      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `Now push <strong>${c}</strong> onto the stack. It must wait for its right operand to be processed before it can be placed in the output.`,
      });
    }
  }

  while (stack.length > 0) {
    const popped = stack.pop();
    output += popped;
    steps.push({
      token: '—',
      stack: [...stack],
      output,
      operation: 'FLUSH',
      explanation: `We've reached the end of the expression, but operators are still in the stack. Pop <strong>${popped}</strong> and add it to the output. All remaining operators must be flushed.`,
    });
  }

  steps.push({
    token: '✓',
    stack: [],
    output,
    operation: 'COMPLETE',
    explanation: `The stack is empty and the output is complete. The final postfix expression is <strong>${output}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToInfixIntroSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  const operands = extractOperands(clean);
  const operators = extractOperators(clean);
  const steps = [];

  // What are we given?
  steps.push({
    type: 'intro',
    title: 'What are we given?',
    content: `
      <p class="mb-3">We are given a <strong>postfix expression</strong>:</p>
      <p class="font-mono text-lg font-extrabold mb-4">${clean}</p>
      <p class="mb-3">In postfix notation, operators appear <em>after</em> their operands.</p>
      <p class="mb-2">This expression contains:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
      <p>Our job is to convert it back to <strong>infix notation</strong> — the standard math notation where operators sit between operands.</p>
    `,
  });

  // How do we convert?
  steps.push({
    type: 'intro',
    title: 'How do we convert?',
    content: `
      <p class="mb-3">We read the postfix expression left to right and use a <strong>stack</strong> to build sub-expressions.</p>
      <div class="space-y-2 mb-4">
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operand?</strong> → Push it onto the stack as its own mini-expression.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-orange-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-orange-500/5">
          <span class="shrink-0 rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-500">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop the top two items, put the operator between them, wrap in parentheses.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Push back</strong> → The new sub-expression goes back on the stack as one item.</p>
        </div>
      </div>
      <p class="text-xs font-semibold text-stone-500 dark:text-gray-400">When we're done, one expression remains on the stack — that's our answer.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToInfixNormalLiveSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    expression: clean,
    explanation: `We start with the postfix expression <strong>${clean}</strong>. We will read it left to right, building sub-expressions as we encounter operators.`,
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        expression: stack.join(' '),
        explanation: `<strong>${c}</strong> is an operand. We push it onto the working stack as a standalone expression — it's ready to be combined when its operator arrives.`,
      });
    } else if (isOperatorChar(c)) {
      const right = stack.pop();
      const left = stack.pop();
      const combined = `(${left}${c}${right})`;
      stack.push(combined);

      steps.push({
        expression: stack.join(' '),
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) found. We pop the top two items: <strong>${right}</strong> (right operand — it was pushed last) and <strong>${left}</strong> (left operand). Combining them: <strong>${left}</strong> <strong>${c}</strong> <strong>${right}</strong> → <strong>${combined}</strong>. The order matters — we always build (LEFT op RIGHT).`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    expression: `=${result}`,
    explanation: `Only one expression remains on the stack. That's our final infix expression: <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToInfixStackIntroSteps() {
  const steps = [];

  // What is a Stack?
  steps.push({
    type: 'intro',
    title: 'What is a Stack?',
    content: `
      <p class="mb-3">A <strong>stack</strong> is a data structure where the <em>last</em> item added is the <em>first</em> item removed.</p>
      <p class="mb-3 text-xs font-semibold text-stone-500 dark:text-gray-400 uppercase tracking-wider">Last In, First Out — LIFO</p>
      <div class="flex justify-center my-4">
        <div class="inline-flex flex-col items-center">
          <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500 mb-1">TOP ↓</div>
          <div class="rounded-xl border-2 border-indigo-600 bg-indigo-600/10 px-6 py-2.5 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">(B*C) ← First removed</div>
          <div class="h-0.5 w-full bg-indigo-600/20"></div>
          <div class="rounded-xl border border-stone-900/10 bg-white px-6 py-2.5 font-mono text-sm font-bold text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">A ← Added earlier</div>
          <div class="mt-3 h-2 w-24 rounded-full bg-stone-300 dark:bg-gray-700"></div>
        </div>
      </div>
      <p class="mb-2">For postfix → infix, the stack holds <strong>partial expressions</strong> (strings), not single characters.</p>
      <p>When an operator arrives, we pop two items, combine them, and push the result back.</p>
    `,
  });

  // Stack Rules for Postfix → Infix
  steps.push({
    type: 'intro',
    title: 'Conversion Rules',
    content: `
      <p class="mb-3">Here are the rules we follow, step by step:</p>
      <div class="space-y-2">
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operand?</strong> → Push it onto the stack. A single letter is already a valid expression.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-orange-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-orange-500/5">
          <span class="shrink-0 rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-500">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop the top expression (RIGHT operand).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Pop again</strong> → Get the next expression (LEFT operand).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Build</strong> → Create <code class="font-mono">(LEFT op RIGHT)</code> and push back.</p>
        </div>
      </div>
      <p class="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">⚠️ Order matters! The first pop is always the RIGHT operand.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → INFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

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
    explanation: 'We start with an empty stack. This stack holds <strong>partial expressions</strong> (strings), not single characters. We scan left to right.',
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
        explanation: `<strong>${c}</strong> is an operand. Push it onto the stack as its own mini-expression. Every operand starts as a standalone item.`,
      });
    } else if (isOperatorChar(c)) {
      const right = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-RIGHT',
        explanation: `Operator <strong>${c}</strong> needs two operands. Pop <strong>${right}</strong> — this is the <em>RIGHT</em> operand. It was pushed last, so it sits on top and comes off first.`,
      });

      const left = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-LEFT',
        explanation: `Pop <strong>${left}</strong> — this is the <em>LEFT</em> operand. Order matters: we always build <code class="font-mono">(LEFT op RIGHT)</code>, never <code class="font-mono">(RIGHT op LEFT)</code>.`,
      });

      const built = `(${left}${c}${right})`;
      stack.push(built);
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'BUILD',
        explanation: `Combine: <strong>${left}</strong> <strong>${c}</strong> <strong>${right}</strong> → <strong>${built}</strong>. Push the result back onto the stack. It's now one item that can be used by future operators.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    token: '✓',
    stack: [result],
    output: result,
    operation: 'COMPLETE',
    explanation: `One expression remains on the stack. That is our final infix expression: <strong>${result}</strong>.`,
  });

  return steps;
}
