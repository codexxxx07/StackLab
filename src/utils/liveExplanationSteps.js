import { PRECEDENCE, isOperandChar, isOperatorChar, escapeHtml } from './visualizationSteps';

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

/**
 * Infix → Prefix split index: lowest precedence at depth 0, ties go to the
 * rightmost operator — this mirrors the reversed-scan stack method.
 */
function findInfixSplitIndexPrefix(expr) {
  let depth = 0, bestPrec = Infinity, bestIdx = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0 && isOperatorChar(c)) {
      const p = PRECEDENCE[c];
      if (p < bestPrec || (p === bestPrec && i > bestIdx)) { bestPrec = p; bestIdx = i; }
    }
  }
  return bestIdx;
}

/** Peel redundant outer parentheses, e.g. "((A))" → "A". */
function peelParens(s) {
  let out = s;
  while (out.length > 1 && out[0] === '(' && out[out.length - 1] === ')') out = out.slice(1, -1);
  return out;
}

/** Compute the final Prefix string purely from the split rule (no tree needed). */
function prefixFromSplit(expr) {
  const tokens = tokenize(expr);
  let hasOp = false, depth = 0;
  for (const t of tokens) {
    if (t.type === 'paren' && t.value === '(') depth++;
    else if (t.type === 'paren' && t.value === ')') depth--;
    else if (depth === 0 && t.type === 'operator') hasOp = true;
  }
  if (!hasOp) {
    const peeled = peelParens(expr);
    return peeled !== expr ? prefixFromSplit(peeled) : expr;
  }
  const splitIdx = findInfixSplitIndexPrefix(expr);
  if (splitIdx === -1) return expr;
  const left = expr.slice(0, splitIdx);
  const right = expr.slice(splitIdx + 1);
  const op = expr[splitIdx];
  const leftWrapped = isFullyWrapped(left);
  const rightWrapped = isFullyWrapped(right);
  const lf = prefixFromSplit(leftWrapped ? left.slice(1, -1) : left);
  const rf = prefixFromSplit(rightWrapped ? right.slice(1, -1) : right);
  return op + lf + rf;
}

function findInfixSplitIndex(expr) {
  let depth = 0, bestPrec = Infinity, bestIdx = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0 && isOperatorChar(c)) {
      const p = PRECEDENCE[c];
      if (c === '^') {
        if (p < bestPrec || (p === bestPrec && i < bestIdx)) { bestPrec = p; bestIdx = i; }
      } else {
        if (p < bestPrec || (p === bestPrec && i > bestIdx)) { bestPrec = p; bestIdx = i; }
      }
    }
  }
  return bestIdx;
}

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

function countOpsAtDepth0(s) {
  let count = 0, d = 0;
  for (const c of s) {
    if (c === '(') d++;
    else if (c === ')') d--;
    else if (d === 0 && isOperatorChar(c)) count++;
  }
  return count;
}

function hasOpsAtDepth0(s) {
  let d = 0;
  for (const c of s) {
    if (c === '(') d++;
    else if (c === ')') d--;
    else if (d === 0 && isOperatorChar(c)) return true;
  }
  return false;
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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const tree = buildTree([...tokenize(clean)]);
  const finalResult = treeToPostfix(tree);

  steps.push({
    expression: clean,
    explanation: `We start with the infix expression <strong>${clean}</strong>. Our goal is to convert it to postfix notation by moving each operator after its operands, following precedence rules.`,
  });

  function collectSteps(currentExpr, parentExpr) {
    const tokens = tokenize(currentExpr);
    let hasOp = false, depth = 0;
    for (const t of tokens) {
      if (t.type === 'paren' && t.value === '(') depth++;
      else if (t.type === 'paren' && t.value === ')') depth--;
      else if (depth === 0 && t.type === 'operator') hasOp = true;
    }

    if (!hasOp) {
      if (isFullyWrapped(currentExpr)) {
        const inner = currentExpr.slice(1, -1);
        if (hasOpsAtDepth0(inner)) {
          collectSteps(inner, parentExpr);
          return;
        }
      }
      return;
    }

    const splitIdx = findInfixSplitIndex(currentExpr);
    if (splitIdx === -1) return;

    const left = currentExpr.slice(0, splitIdx);
    const right = currentExpr.slice(splitIdx + 1);
    const op = currentExpr[splitIdx];

    const leftWrapped = isFullyWrapped(left);
    const rightWrapped = isFullyWrapped(right);

    const leftConverted = leftWrapped
      ? { steps: collectStepsHelper(left.slice(1, -1)), finalResult: treeToPostfix(buildTree([...tokenize(left.slice(1, -1))])) }
      : { steps: collectStepsHelper(left), finalResult: treeToPostfix(buildTree([...tokenize(left)])) };
    const rightConverted = rightWrapped
      ? { steps: collectStepsHelper(right.slice(1, -1)), finalResult: treeToPostfix(buildTree([...tokenize(right.slice(1, -1))])) }
      : { steps: collectStepsHelper(right), finalResult: treeToPostfix(buildTree([...tokenize(right)])) };

    const newExpr = leftConverted.finalResult + rightConverted.finalResult + op;

    const leftHasOps = leftConverted.steps.length > 1;
    if (leftHasOps) {
      const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
      for (let i = 1; i < leftConverted.steps.length; i++) {
        const innerStep = leftConverted.steps[i].slice(1);
        let transformExpr;
        if (leftWrapped && innerOpCount <= 1) {
          transformExpr = `=${innerStep}${op}${right}`;
        } else if (leftWrapped) {
          transformExpr = `=(${innerStep})${op}${right}`;
        } else {
          transformExpr = `=${innerStep}${op}${right}`;
        }
        steps.push({
          expression: transformExpr,
          explanation: `Processing the left side: operator <strong>${innerStep.slice(-1)}</strong> moves after its operands, transforming "${left}" to <strong>${leftConverted.steps[i].slice(1)}</strong>. The full expression becomes <strong>${transformExpr.slice(1)}</strong>.`,
        });
      }
    } else if (leftWrapped) {
      steps.push({
        expression: `=${left.slice(1, -1)}${op}${right}`,
        explanation: `The left side <strong>${left}</strong> is parenthesized with no inner operators to process. We strip the parentheses, leaving <strong>${left.slice(1, -1)}</strong>. The expression becomes <strong>${left.slice(1, -1)}${op}${right}</strong>.`,
      });
    }

    const rightHasOps = rightConverted.steps.length > 1;
    if (rightHasOps) {
      const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
      for (let i = 1; i < rightConverted.steps.length; i++) {
        const innerStep = rightConverted.steps[i].slice(1);
        let transformExpr;
        if (rightWrapped && innerOpCount <= 1) {
          transformExpr = `=${leftConverted.finalResult}${op}${innerStep}`;
        } else if (rightWrapped) {
          transformExpr = `=${leftConverted.finalResult}${op}(${innerStep})`;
        } else {
          transformExpr = `=${leftConverted.finalResult}${op}${innerStep}`;
        }
        steps.push({
          expression: transformExpr,
          explanation: `Processing the right side: operator <strong>${innerStep.slice(-1)}</strong> moves after its operands, transforming "${right}" to <strong>${rightConverted.steps[i].slice(1)}</strong>. The full expression becomes <strong>${transformExpr.slice(1)}</strong>.`,
        });
      }
    } else if (rightWrapped) {
      steps.push({
        expression: `=${leftConverted.finalResult}${op}${right.slice(1, -1)}`,
        explanation: `The right side <strong>${right}</strong> is parenthesized with no inner operators to process. We strip the parentheses, leaving <strong>${right.slice(1, -1)}</strong>. The expression becomes <strong>${leftConverted.finalResult}${op}${right.slice(1, -1)}</strong>.`,
      });
    }

    if (newExpr !== currentExpr) {
      steps.push({
        expression: `=${newExpr}`,
        explanation: `Operator <strong>${op}</strong> (${getOperatorName(op)}) moves after both of its operands. "<strong>${leftConverted.finalResult}</strong>" (left) and "<strong>${rightConverted.finalResult}</strong>" (right) are now in postfix order. Placing <strong>${op}</strong> at the end gives us <strong>${newExpr}</strong>.`,
      });
    }
  }

  function collectStepsHelper(expr) {
    const tokens = tokenize(expr);
    let hasOp = false, depth = 0;
    for (const t of tokens) {
      if (t.type === 'paren' && t.value === '(') depth++;
      else if (t.type === 'paren' && t.value === ')') depth--;
      else if (depth === 0 && t.type === 'operator') hasOp = true;
    }

    if (!hasOp) {
      if (isFullyWrapped(expr)) {
        const inner = expr.slice(1, -1);
        const innerResult = collectStepsHelper(inner);
        if (innerResult.length > 1) {
          const result = [expr];
          for (let i = 1; i < innerResult.length; i++) {
            result.push(`=${innerResult[i].slice(1)}`);
          }
          return result;
        }
      }
      return [expr];
    }

    const tree = buildTree([...tokenize(expr)]);
    const finalResult = treeToPostfix(tree);
    const splitIdx = findInfixSplitIndex(expr);
    if (splitIdx === -1) return [expr];

    const left = expr.slice(0, splitIdx);
    const right = expr.slice(splitIdx + 1);
    const op = expr[splitIdx];

    const leftWrapped = isFullyWrapped(left);
    const rightWrapped = isFullyWrapped(right);

    const leftConverted = leftWrapped
      ? collectStepsHelper(left.slice(1, -1))
      : collectStepsHelper(left);
    const rightConverted = rightWrapped
      ? collectStepsHelper(right.slice(1, -1))
      : collectStepsHelper(right);

    const leftPostfix = treeToPostfix(buildTree([...tokenize(leftWrapped ? left.slice(1, -1) : left)]));
    const rightPostfix = treeToPostfix(buildTree([...tokenize(rightWrapped ? right.slice(1, -1) : right)]));
    const newExpr = leftPostfix + rightPostfix + op;

    const transformLines = [];

    const leftHasOps = leftConverted.length > 1;
    if (leftHasOps) {
      const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
      for (let i = 1; i < leftConverted.length; i++) {
        const innerStep = leftConverted[i].slice(1);
        if (leftWrapped && innerOpCount <= 1) transformLines.push(`=${innerStep}${op}${right}`);
        else if (leftWrapped) transformLines.push(`=(${innerStep})${op}${right}`);
        else transformLines.push(`=${innerStep}${op}${right}`);
      }
    } else if (leftWrapped) {
      transformLines.push(`=${left.slice(1, -1)}${op}${right}`);
    }

    const rightHasOps = rightConverted.length > 1;
    if (rightHasOps) {
      const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
      for (let i = 1; i < rightConverted.length; i++) {
        const innerStep = rightConverted[i].slice(1);
        if (rightWrapped && innerOpCount <= 1) transformLines.push(`=${leftPostfix}${op}${innerStep}`);
        else if (rightWrapped) transformLines.push(`=${leftPostfix}${op}(${innerStep})`);
        else transformLines.push(`=${leftPostfix}${op}${innerStep}`);
      }
    } else if (rightWrapped) {
      transformLines.push(`=${leftPostfix}${op}${right.slice(1, -1)}`);
    }

    if (newExpr !== expr) transformLines.push(`=${newExpr}`);
    if (transformLines[transformLines.length - 1] !== `=${finalResult}`) transformLines.push(`=${finalResult}`);

    const unique = [];
    for (const s of transformLines) {
      if (unique.length === 0 || s !== unique[unique.length - 1]) unique.push(s);
    }
    return [expr, ...unique];
  }

  collectSteps(clean, clean);

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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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

/* ──────────────────────────────────────────────────────────────────────
   INFIX → PREFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPrefixIntroSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
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
      <p class="mb-2">This expression contains:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
    `,
  });

  // Step 2: What is Prefix?
  steps.push({
    type: 'intro',
    title: 'What is Prefix?',
    content: `
      <p class="mb-3">In <strong>prefix notation</strong> (also called Polish Notation), the operator comes <em>before</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Prefix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">+ A B</p>
        </div>
      </div>
      <p class="mb-2">Why does this matter? In prefix:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>We don't need parentheses to show order</li>
        <li>We don't need to remember precedence rules</li>
        <li>A computer can evaluate it right to left in one pass</li>
      </ul>
    `,
  });

  // Step 3: The big idea
  steps.push({
    type: 'intro',
    title: 'From Infix to Prefix — the big idea',
    content: `
      <p class="mb-3">To convert, we move each operator <strong>in FRONT of</strong> the two operands it joins — but priority decides <em>which operator moves when</em>.</p>
      <div class="space-y-2 mb-3">
        <div class="flex items-center gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Higher precedence</strong> operators (like <strong>*</strong>, <strong>/</strong>, <strong>^</strong>) are converted first.</p>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-stone-900/10 bg-orange-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-orange-500/5">
          <span class="shrink-0 rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-500">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Lower precedence</strong> operators (like <strong>+</strong>, <strong>-</strong>) are converted last.</p>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Parentheses</strong> force a group to be converted first.</p>
        </div>
      </div>
      <p class="mb-2">If we convert <code class="font-mono font-bold">A+B*C</code>, the <strong>*</strong> joins <strong>B</strong> and <strong>C</strong> into <code class="font-mono font-bold">*BC</code>, and then the <strong>+</strong> joins <strong>A</strong> and <strong>*BC</strong> into <code class="font-mono font-bold">+A*BC</code>.</p>
      <p>In other words: an operator is placed <em>in front of</em> its <strong>two</strong> operands.</p>
    `,
  });

  // Step 4: Operator Precedence
  const precInfo = operators.map(op => ({
    op,
    name: getOperatorName(op),
    prec: PRECEDENCE[op],
    label: getPrecedenceLabel(op),
  }));

  if (precInfo.length > 0) {
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
        <p>In prefix conversion we handle the operators of <strong>highest</strong> precedence first — they move in front of their operands before the lower-precedence operators do.</p>
      `,
    });
  }

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → PREFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPrefixNormalLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const finalResult = prefixFromSplit(clean);

  steps.push({
    expression: clean,
    explanation: `We start with the infix expression <strong>${clean}</strong>. Our goal is to convert it to prefix notation by moving each operator in FRONT of its operands, following precedence rules.`,
  });

  function collectSteps(currentExpr) {
    const tokens = tokenize(currentExpr);
    let hasOp = false, depth = 0;
    for (const t of tokens) {
      if (t.type === 'paren' && t.value === '(') depth++;
      else if (t.type === 'paren' && t.value === ')') depth--;
      else if (depth === 0 && t.type === 'operator') hasOp = true;
    }

    if (!hasOp) {
      if (isFullyWrapped(currentExpr)) {
        const inner = currentExpr.slice(1, -1);
        if (
          hasOpsAtDepth0(inner) ||
          (isFullyWrapped(inner) && hasOpsAtDepth0(inner.slice(1, -1)))
        ) {
          collectSteps(inner);
          return;
        }
      }
      // Pure operand wrappers (e.g. "((A))") produce no real transformation —
      // mirror the normal method: keep the starting expression only.
      return;
    }

    const splitIdx = findInfixSplitIndexPrefix(currentExpr);
    if (splitIdx === -1) return;

    const left = currentExpr.slice(0, splitIdx);
    const right = currentExpr.slice(splitIdx + 1);
    const op = currentExpr[splitIdx];

    const leftWrapped = isFullyWrapped(left);
    const rightWrapped = isFullyWrapped(right);

    const leftConverted = leftWrapped
      ? { steps: collectStepsHelper(left.slice(1, -1)), finalResult: prefixFromSplit(left.slice(1, -1)) }
      : { steps: collectStepsHelper(left), finalResult: prefixFromSplit(left) };
    const rightConverted = rightWrapped
      ? { steps: collectStepsHelper(right.slice(1, -1)), finalResult: prefixFromSplit(right.slice(1, -1)) }
      : { steps: collectStepsHelper(right), finalResult: prefixFromSplit(right) };

    const newExpr = op + leftConverted.finalResult + rightConverted.finalResult;

    const leftHasOps = leftConverted.steps.length > 1;
    if (leftHasOps) {
      const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
      for (let i = 1; i < leftConverted.steps.length; i++) {
        const innerStep = leftConverted.steps[i].slice(1);
        const transformExpr = leftWrapped && innerOpCount > 1
          ? `=(${innerStep})${op}${right}`
          : `=${innerStep}${op}${right}`;
        const innerLabel = (leftWrapped ? left.slice(1, -1) : left);
        steps.push({
          expression: transformExpr,
          explanation: `Working on the left side <strong>${innerLabel}</strong>: its operator <strong>${innerStep.slice(0, 1)}</strong> has priority within this group, so it is converted first and moves to the front of its operands → <strong>${innerStep}</strong>. The full expression becomes <strong>${transformExpr.slice(1)}</strong>.`,
        });
      }
    } else if (leftWrapped) {
      steps.push({
        expression: `=${left.slice(1, -1)}${op}${right}`,
        explanation: `The left side <strong>${left}</strong> is parenthesized but has no inner operators to process, so we strip the parentheses → <strong>${left.slice(1, -1)}</strong>. The expression becomes <strong>${left.slice(1, -1)}${op}${right}</strong>.`,
      });
    }

    const rightHasOps = rightConverted.steps.length > 1;
    if (rightHasOps) {
      const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
      for (let i = 1; i < rightConverted.steps.length; i++) {
        const innerStep = rightConverted.steps[i].slice(1);
        const transformExpr = rightWrapped && innerOpCount > 1
          ? `=${leftConverted.finalResult}${op}(${innerStep})`
          : `=${leftConverted.finalResult}${op}${innerStep}`;
        const innerLabel = (rightWrapped ? right.slice(1, -1) : right);
        steps.push({
          expression: transformExpr,
          explanation: `Working on the right side <strong>${innerLabel}</strong>: its operator <strong>${innerStep.slice(0, 1)}</strong> binds tighter than <strong>${op}</strong> (higher precedence), so it is converted first and moves to the front of its operands → <strong>${innerStep}</strong>. The full expression becomes <strong>${transformExpr.slice(1)}</strong>.`,
        });
      }
    } else if (rightWrapped) {
      steps.push({
        expression: `=${leftConverted.finalResult}${op}${right.slice(1, -1)}`,
        explanation: `The right side <strong>${right}</strong> is parenthesized but has no inner operators to process, so we strip the parentheses → <strong>${right.slice(1, -1)}</strong>. The expression becomes <strong>${leftConverted.finalResult}${op}${right.slice(1, -1)}</strong>.`,
      });
    }

    if (newExpr !== currentExpr) {
      steps.push({
        expression: `=${newExpr}`,
        explanation: `Now <strong>${op}</strong> (${getOperatorName(op)}) must come before everything it joins. Prefix puts the operator FIRST: <strong>${op}</strong> + "<strong>${leftConverted.finalResult}</strong>" (left) + "<strong>${rightConverted.finalResult}</strong>" (right) = <strong>${newExpr}</strong>.`,
      });
    }
  }

  function collectStepsHelper(expr) {
    const tokens = tokenize(expr);
    let hasOp = false, depth = 0;
    for (const t of tokens) {
      if (t.type === 'paren' && t.value === '(') depth++;
      else if (t.type === 'paren' && t.value === ')') depth--;
      else if (depth === 0 && t.type === 'operator') hasOp = true;
    }

    if (!hasOp) {
      if (isFullyWrapped(expr)) {
        const inner = expr.slice(1, -1);
        const innerResult = collectStepsHelper(inner);
        if (innerResult.length > 1) {
          const result = [expr];
          for (let i = 1; i < innerResult.length; i++) {
            result.push(`=${innerResult[i].slice(1)}`);
          }
          return result;
        }
      }
      const peeled = peelParens(expr);
      if (peeled !== expr && peeled.length > 0) {
        const innerResult = collectStepsHelper(peeled);
        if (innerResult.length > 1) {
          const result = [expr];
          for (let i = 1; i < innerResult.length; i++) {
            result.push(`=${innerResult[i].slice(1)}`);
          }
          return result;
        }
      }
      return [expr];
    }

    const finalResult = prefixFromSplit(expr);
    const splitIdx = findInfixSplitIndexPrefix(expr);
    if (splitIdx === -1) return [expr];

    const left = expr.slice(0, splitIdx);
    const right = expr.slice(splitIdx + 1);
    const op = expr[splitIdx];

    const leftWrapped = isFullyWrapped(left);
    const rightWrapped = isFullyWrapped(right);

    const leftConverted = leftWrapped ? collectStepsHelper(left.slice(1, -1)) : collectStepsHelper(left);
    const rightConverted = rightWrapped ? collectStepsHelper(right.slice(1, -1)) : collectStepsHelper(right);

    const leftPrefix = prefixFromSplit(leftWrapped ? left.slice(1, -1) : left);
    const rightPrefix = prefixFromSplit(rightWrapped ? right.slice(1, -1) : right);
    const newExpr = op + leftPrefix + rightPrefix;

    const transformLines = [];

    const leftHasOps = leftConverted.length > 1;
    if (leftHasOps) {
      const innerOpCount = leftWrapped ? countOpsAtDepth0(left.slice(1, -1)) : 0;
      for (let i = 1; i < leftConverted.length; i++) {
        const innerStep = leftConverted[i].slice(1);
        if (leftWrapped && innerOpCount > 1) transformLines.push(`=(${innerStep})${op}${right}`);
        else transformLines.push(`=${innerStep}${op}${right}`);
      }
    } else if (leftWrapped) {
      transformLines.push(`=${left.slice(1, -1)}${op}${right}`);
    }

    const rightHasOps = rightConverted.length > 1;
    if (rightHasOps) {
      const innerOpCount = rightWrapped ? countOpsAtDepth0(right.slice(1, -1)) : 0;
      for (let i = 1; i < rightConverted.length; i++) {
        const innerStep = rightConverted[i].slice(1);
        if (rightWrapped && innerOpCount > 1) transformLines.push(`=${leftPrefix}${op}(${innerStep})`);
        else transformLines.push(`=${leftPrefix}${op}${innerStep}`);
      }
    } else if (rightWrapped) {
      transformLines.push(`=${leftPrefix}${op}${right.slice(1, -1)}`);
    }

    if (newExpr !== expr) transformLines.push(`=${newExpr}`);
    if (transformLines[transformLines.length - 1] !== `=${finalResult}`) transformLines.push(`=${finalResult}`);

    const unique = [];
    for (const s of transformLines) {
      if (unique.length === 0 || s !== unique[unique.length - 1]) unique.push(s);
    }
    return [expr, ...unique];
  }

  collectSteps(clean);

  const hasAnyOperator = [...clean].some(isOperatorChar);
  const lastStep = steps[steps.length - 1];
  if (hasAnyOperator && (!lastStep || lastStep.expression !== `=${finalResult}`)) {
    steps.push({
      expression: `=${finalResult}`,
      explanation: `All operators have moved in front of their operands. The final prefix expression is <strong>${finalResult}</strong>.`,
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
   INFIX → PREFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPrefixStackIntroSteps() {
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

  // The Infix → Prefix trick
  steps.push({
    type: 'intro',
    title: 'The Infix → Prefix trick',
    content: `
      <p class="mb-3">Prefix conversion reuses the postfix machinery by <strong>flipping the input</strong>. Here are the rules:</p>
      <div class="space-y-2 mb-3">
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Reverse</strong> the infix expression first.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operand</strong> → Add straight to the draft output.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-amber-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-amber-500/5">
          <span class="shrink-0 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>)</strong> → Push it. In the reversed world it plays the role of "<strong>(</strong>" — a floor.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>(</strong> → Pop everything back to the <strong>)</strong> floor, then discard the floor.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-sky-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-sky-500/5">
          <span class="shrink-0 rounded-lg bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-500">5</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator</strong> → Pop while the stack top has <strong>STRICTLY higher</strong> precedence, then push.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">6</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>End</strong> → Flush the stack, then <strong>reverse the draft</strong> to get the prefix.</p>
        </div>
      </div>
      <p class="text-xs font-semibold text-stone-500 dark:text-gray-400">Why strictly higher? The reversed scan flips associativity, so equal precedence must be left stacked to stay correct.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   INFIX → PREFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function infixToPrefixStackLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];
  let output = '';
  const reversed = [...clean].reverse().join('');

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'We start with an empty stack and an empty draft. The plan: reverse the infix expression, scan the reversed string left to right like a postfix problem, then reverse the draft at the end.',
  });

  steps.push({
    token: '↩',
    stack: [],
    output: '',
    operation: 'REVERSE',
    explanation: `Flip the expression: <strong>${clean}</strong> → <strong>${reversed}</strong>. Now "<strong>)</strong>" plays the role of an opening bracket (pushed as a floor) and "<strong>(</strong>" triggers a pop back to that floor.`,
  });

  for (let i = 0; i < reversed.length; i++) {
    const c = reversed[i];

    if (isOperandChar(c)) {
      output += c;
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'OUTPUT',
        explanation: `<strong>${c}</strong> is an operand in the reversed scan. Operands never wait in the stack — append it straight to the draft output. Once flipped at the end it will land in the correct position.`,
      });
    } else if (c === ')') {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `<strong>)</strong> is the opening bracket of the reversed world. Push it onto the stack — it acts as a <em>floor</em>. Nothing below it may be popped until its matching <strong>(</strong> arrives.`,
      });
    } else if (c === '(') {
      while (stack.length > 0 && stack[stack.length - 1] !== ')') {
        const popped = stack.pop();
        output += popped;
        steps.push({
          token: c,
          stack: [...stack],
          output,
          operation: 'POP',
          explanation: `<strong>(</strong> is the pop trigger. Flush everything on top of the <strong>)</strong> floor into the draft output. Pop <strong>${popped}</strong>.`,
        });
      }
      stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'DISCARD',
        explanation: `Discard the <strong>)</strong> floor itself — parentheses never appear in prefix notation. Grouping is encoded purely in the order of symbols.`,
      });
    } else if (isOperatorChar(c)) {
      const pCur = PRECEDENCE[c];

      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== ')' &&
        PRECEDENCE[stack[stack.length - 1]] > pCur
      ) {
        const top = stack.pop();
        output += top;
        steps.push({
          token: c,
          stack: [...stack],
          output,
          operation: 'POP',
          explanation: `Incoming operator <strong>${c}</strong> (precedence ${pCur}). The stack top <strong>${top}</strong> has precedence ${PRECEDENCE[top]} — <strong>strictly higher</strong> — so <strong>${top}</strong> binds tighter and must move to the output first. We compare with <strong>&gt;</strong> (not ≥) to keep equal-precedence operators stacked in scan order.`,
        });
      }

      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output,
        operation: 'PUSH',
        explanation: `Now the top no longer outranks <strong>${c}</strong> (or the stack is empty / protected by a floor). Push <strong>${c}</strong> onto the stack — it waits until its right operand is processed before moving to the draft.`,
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
      explanation: `The reversed string is exhausted, but operators are still waiting. Pop <strong>${popped}</strong> and append it to the draft output. All leftovers must be flushed.`,
    });
  }

  const result = [...output].reverse().join('');

  steps.push({
    token: '⇆',
    stack: [],
    output: result,
    operation: 'REVERSE',
    explanation: `The draft "<strong>${output}</strong>" is the postfix of the reversed expression. Flip it backwards: <strong>${output}</strong> → <strong>${result}</strong>. That is the Prefix expression!`,
  });

  steps.push({
    token: '✓',
    stack: [],
    output: result,
    operation: 'COMPLETE',
    explanation: `The stack is empty and every operator found its place. Final prefix expression: <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → INFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToInfixIntroSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  const operands = extractOperands(clean);
  const operators = extractOperators(clean);
  const steps = [];

  // What are we given?
  steps.push({
    type: 'intro',
    title: 'What are we given?',
    content: `
      <p class="mb-3">We are given a <strong>prefix expression</strong>:</p>
      <p class="font-mono text-lg font-extrabold mb-4">${clean}</p>
      <p class="mb-3">In prefix notation, each operator comes <em>before</em> its operands. For example <code class="font-mono font-bold">+ A B</code> means <code class="font-mono font-bold">A + B</code>.</p>
      <p class="mb-2">This expression contains:</p>
      <ul class="list-disc list-inside space-y-1 mb-3">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
      <p>Our job is to convert it back to <strong>infix notation</strong> — the standard math notation where operators sit between operands.</p>
    `,
  });

  // Why scan right → left?
  steps.push({
    type: 'intro',
    title: 'Why do we read right → left?',
    content: `
      <p class="mb-3">Because in a prefix expression the operator comes <strong>FIRST</strong>, its operands live on its <strong>right</strong>.</p>
      <p class="mb-3">When we read right → left, we always meet the <em>operands before the operator that combines them</em> — so we can group them up the moment the operator appears.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Prefix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">+ A B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">(A + B)</p>
        </div>
      </div>
      <p class="mb-2">Reading right → left we see:</p>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>B</strong> — push as its own expression</li>
        <li><strong>A</strong> — push as its own expression</li>
        <li><strong>+</strong> — pop two, combine into <strong>(A+B)</strong></li>
      </ul>
    `,
  });

  // Order matters
  steps.push({
    type: 'intro',
    title: 'Order matters',
    content: `
      <p class="mb-3">When an operator pops its two operands, the <strong>first</strong> pop is the <strong>LEFT</strong> operand and the <strong>second</strong> pop is the <strong>RIGHT</strong> operand.</p>
      <p class="mb-3">Reading right → left, <strong>B</strong> is pushed before <strong>A</strong>, so <strong>A</strong> sits on top. When <strong>+</strong> pops, <strong>A</strong> (LEFT) comes off first, then <strong>B</strong> (RIGHT).</p>
      <div class="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-stone-900/10 bg-rose-500/5 p-3 font-mono text-sm font-bold dark:border-white/10 dark:bg-rose-500/5">
        <span class="rounded-lg bg-stone-900/5 px-2 py-0.5 dark:bg-white/10">LEFT</span>
        <span class="text-rose-500">A</span>
        <span class="text-stone-400">+</span>
        <span class="text-stone-900 dark:text-white">B</span>
        <span class="rounded-lg bg-stone-900/5 px-2 py-0.5 dark:bg-white/10">RIGHT</span>
      </div>
      <p class="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">⚠️ Swapping them would produce a wrong expression, e.g. (A+B) vs (B+A).</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → INFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToInfixNormalLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    expression: clean,
    explanation: `We start with the prefix expression <strong>${clean}</strong>. We read it right → left, rebuilding grouped sub-expressions whenever we meet an operator.`,
  });

  for (let i = clean.length - 1; i >= 0; i--) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
    } else if (isOperatorChar(c)) {
      const left = stack.pop();
      const right = stack.pop();
      const combined = `(${left}${c}${right})`;
      stack.push(combined);

      const remaining = clean.slice(0, i);
      const display = remaining + [...stack].reverse().join('');
      steps.push({
        expression: `=${display}`,
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) joins the two expressions on top of the stack: <strong>${left}</strong> (left) and <strong>${right}</strong> (right). Wrap them with the operator between — <strong>(${left}${c}${right})</strong> — and replace them by one grouped expression. The part left of the operator has not been read yet, so it stays as-is: <strong>${display}</strong>.`,
      });
    }
  }

  const result = stack[0] || '';
  const lastExpr = steps[steps.length - 1];
  if (!lastExpr || lastExpr.expression !== `=${result}`) {
    steps.push({
      expression: `=${result}`,
      explanation: `Every operator has been rebuilt and only one grouped expression remains: <strong>${result}</strong>. That is our final infix expression.`,
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
   PREFIX → INFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToInfixStackIntroSteps() {
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
      <p class="mb-2">For prefix → infix, the stack holds <strong>partial expressions</strong> (strings), not single characters.</p>
      <p>When an operator arrives, we pop two items, combine them, and push the result back.</p>
    `,
  });

  // Conversion Rules
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
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop the top expression (<strong>LEFT</strong> operand).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Pop again</strong> → Get the next expression (<strong>RIGHT</strong> operand).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Build</strong> → Create <code class="font-mono">(LEFT op RIGHT)</code> and push back.</p>
        </div>
      </div>
      <p class="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">⚠️ Order matters! Because we read right → left, the first pop is always the LEFT operand.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → INFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToInfixStackLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'We start with an empty stack of <strong>partial expressions</strong> (strings). We scan the prefix expression <strong>right → left</strong>, because the operands of an operator always sit to its right in prefix.',
  });

  for (let i = clean.length - 1; i >= 0; i--) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'PUSH',
        explanation: `<strong>${c}</strong> is an operand. Push it onto the stack as its own mini-expression. Reading right → left we meet operands first, so they wait on the stack for the operator that combines them.`,
      });
    } else if (isOperatorChar(c)) {
      const left = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-LEFT',
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) needs two operands. First pop = <strong>${left}</strong> — this is the <em>LEFT</em> operand. It was pushed most recently (right → left scan), so it sits on top and comes off first.`,
      });

      const right = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'POP-RIGHT',
        explanation: `Second pop = <strong>${right}</strong> — this is the <em>RIGHT</em> operand. Order matters: we always build <code class="font-mono">(LEFT op RIGHT)</code>, never <code class="font-mono">(RIGHT op LEFT)</code>.`,
      });

      const built = `(${left}${c}${right})`;
      stack.push(built);
      steps.push({
        token: c,
        stack: [...stack],
        output: '',
        operation: 'BUILD',
        explanation: `Combine: (<strong>${left}</strong> <strong>${c}</strong> <strong>${right}</strong>) → <strong>${built}</strong>. Push the finished sub-expression back onto the stack — it is now one item that outer operators can reuse.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    token: '✓',
    stack: [result],
    output: result,
    operation: 'COMPLETE',
    explanation: `Only one expression remains on the stack. That is our final infix expression: <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → PREFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToPrefixIntroSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  const operands = extractOperands(clean);
  const operators = extractOperators(clean);
  const steps = [];

  // What is Postfix?
  steps.push({
    type: 'intro',
    title: 'What is Postfix?',
    content: `
      <p class="mb-3">We are given a <strong>postfix expression</strong>:</p>
      <p class="font-mono text-lg font-extrabold mb-4">${clean}</p>
      <p class="mb-2">In <strong>postfix notation</strong> the operator comes <em>AFTER</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Postfix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">AB+</p>
        </div>
      </div>
      <p class="mb-2">So <code class="font-mono font-bold">AB+</code> simply means <code class="font-mono font-bold">A + B</code> — the <strong>+</strong> lands after both operands.</p>
      <p class="mb-2 mt-3">This expression contains:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
    `,
  });

  // What is Prefix?
  steps.push({
    type: 'intro',
    title: 'What is Prefix?',
    content: `
      <p class="mb-3">In <strong>prefix notation</strong> (Polish Notation) the operator comes <em>BEFORE</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Prefix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">+AB</p>
        </div>
      </div>
      <p class="mb-3">So <code class="font-mono font-bold">+AB</code> also means <code class="font-mono font-bold">A + B</code> — the <strong>+</strong> comes first.</p>
      <p>Our job: rewrite the postfix <strong>${clean}</strong> so every operator jumps to the <em>front</em> of the two operands it joins.</p>
    `,
  });

  // From Postfix to Prefix — the big idea
  steps.push({
    type: 'intro',
    title: 'From Postfix to Prefix',
    content: `
      <p class="mb-3">Read the postfix expression left → right. Whenever you see an <strong>operator</strong>, take the two expressions it owns and place the operator <em>in front of both</em>.</p>
      <div class="space-y-2 mb-3">
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-emerald-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-emerald-500/5">
          <span class="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">1</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operand?</strong> → Push it as its own mini-expression.</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-orange-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-orange-500/5">
          <span class="shrink-0 rounded-lg bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-500">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop two, put the operator <em>in front</em> of them, push the result.</p>
        </div>
      </div>
      <p class="mb-2">For <code class="font-mono font-bold">${clean}</code>:</p>
      <p class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 font-mono text-sm font-bold dark:border-white/10 dark:bg-white/5"><code class="font-mono">B * C</code> first, then <code class="font-mono">A + (B*C)</code> — the prefix form puts each operator <em>before</em> the expression it operates on.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → PREFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToPrefixNormalLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    expression: clean,
    explanation: `We start with the postfix expression <strong>${clean}</strong>. We read it left → right, turning every operand into a prefix sub-expression and combining them the moment an operator arrives.`,
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        expression: stack.join(' '),
        explanation: `<strong>${c}</strong> is an operand. For now it is its own mini-expression, waiting on the stack to be combined when an operator joins it.`,
      });
    } else if (isOperatorChar(c)) {
      const a = stack.pop();
      const b = stack.pop();
      const combined = `${c}${b}${a}`;
      stack.push(combined);

      steps.push({
        expression: stack.join(' '),
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) wants to come <em>before</em> its two operands. First pop <strong>${a}</strong> must go LAST, second pop <strong>${b}</strong> goes next. Prefix puts the operator first: <strong>${c}</strong> + <strong>${b}</strong> + <strong>${a}</strong> → <strong>${combined}</strong>.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    expression: `=${result}`,
    explanation: `Only one expression remains on the stack. Every operator has moved in front of its operands — that is our final prefix expression: <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → PREFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToPrefixStackIntroSteps() {
  const steps = [];

  steps.push({
    type: 'intro',
    title: 'What is a Stack?',
    content: `
      <p class="mb-3">A <strong>stack</strong> is a data structure where the <em>last</em> item added is the <em>first</em> item removed.</p>
      <p class="mb-3 text-xs font-semibold text-stone-500 dark:text-gray-400 uppercase tracking-wider">Last In, First Out — LIFO</p>
      <div class="flex justify-center my-4">
        <div class="inline-flex flex-col items-center">
          <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500 mb-1">TOP ↓</div>
          <div class="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 px-6 py-2.5 font-mono text-sm font-bold text-emerald-500 dark:text-emerald-400">(B*C) ← First removed</div>
          <div class="h-0.5 w-full bg-emerald-500/20"></div>
          <div class="rounded-xl border border-stone-900/10 bg-white px-6 py-2.5 font-mono text-sm font-bold text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">A ← Added earlier</div>
          <div class="mt-3 h-2 w-24 rounded-full bg-stone-300 dark:bg-gray-700"></div>
        </div>
      </div>
      <p class="mb-2">For postfix → prefix, the stack holds <strong>partial expressions</strong> (strings), not single characters.</p>
      <p>When an operator arrives, we pop two items, build the prefix, and push the result back.</p>
    `,
  });

  // Conversion Rules
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
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop the top expression (first pop = <code class="font-mono">a</code>).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Pop again</strong> → Get the next expression (second pop = <code class="font-mono">b</code>).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Build</strong> → Create <code class="font-mono">operator + b + a</code> and push back.</p>
        </div>
      </div>
      <p class="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">⚠️ Order matters! The first pop <code class="font-mono">a</code> goes LAST in the built prefix.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   POSTFIX → PREFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function postfixToPrefixStackLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'We start with an empty stack of <strong>partial expressions</strong> (strings). We scan the postfix expression <strong>left → right</strong>, because in postfix the operands of an operator always sit to its left.',
  });

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output: c,
        operation: 'PUSH',
        explanation: `<strong>${c}</strong> is an operand. Push it onto the stack as its own mini-expression. We will need it later when its operator arrives.`,
      });
    } else if (isOperatorChar(c)) {
      const a = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: stack.length ? stack[stack.length - 1] : '',
        operation: 'POP-A',
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) needs two operands. First pop = <strong>${a}</strong>. Because it was pushed last, it sits on top — and in prefix it must go <em>LAST</em>.`,
      });

      const b = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: stack.length ? stack[stack.length - 1] : '',
        operation: 'POP-B',
        explanation: `Second pop = <strong>${b}</strong>. Order matters: we build <code class="font-mono">operator + b + a</code>, never <code class="font-mono">operator + a + b</code>.`,
      });

      const built = `${c}${b}${a}`;
      stack.push(built);
      steps.push({
        token: c,
        stack: [...stack],
        output: built,
        operation: 'BUILD',
        explanation: `Combine: <strong>${c}</strong> + <strong>${b}</strong> + <strong>${a}</strong> → <strong>${built}</strong>. Push the finished prefix sub-expression back onto the stack — it is now one item that outer operators can reuse.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    token: '✓',
    stack: [result],
    output: result,
    operation: 'COMPLETE',
    explanation: `One expression remains on the stack. That is our final prefix expression: <strong>${result}</strong>.`,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → POSTFIX — Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToPostfixIntroSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  const operands = extractOperands(clean);
  const operators = extractOperators(clean);
  const steps = [];

  // What is Prefix?
  steps.push({
    type: 'intro',
    title: 'What is Prefix?',
    content: `
      <p class="mb-3">We are given a <strong>prefix expression</strong>:</p>
      <p class="font-mono text-lg font-extrabold mb-4">${clean}</p>
      <p class="mb-2">In <strong>prefix notation</strong> the operator comes <em>BEFORE</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Prefix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">+AB</p>
        </div>
      </div>
      <p class="mb-2">So <code class="font-mono font-bold">+AB</code> means <code class="font-mono font-bold">A + B</code> — the <strong>+</strong> comes first.</p>
      <p class="mb-2 mt-3">This expression contains:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Operands: <strong>${operands.join(', ')}</strong></li>
        <li>Operators: <strong>${operators.join(', ')}</strong></li>
      </ul>
    `,
  });

  // What is Postfix?
  steps.push({
    type: 'intro',
    title: 'What is Postfix?',
    content: `
      <p class="mb-3">In <strong>postfix notation</strong> (Reverse Polish Notation) the operator comes <em>AFTER</em> its operands.</p>
      <div class="grid grid-cols-2 gap-4 my-4">
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Infix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">A + B</p>
        </div>
        <div class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 dark:border-white/10 dark:bg-white/5">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-gray-400 mb-1">Postfix</p>
          <p class="font-mono text-lg font-extrabold text-stone-900 dark:text-white">AB+</p>
        </div>
      </div>
      <p class="mb-3">So <code class="font-mono font-bold">AB+</code> also means <code class="font-mono font-bold">A + B</code> — the <strong>+</strong> comes last.</p>
      <p>Our job: rewrite the prefix <strong>${clean}</strong> so every operator lands <em>after</em> the two operands it joins.</p>
    `,
  });

  // From Prefix to Postfix — the big idea
  steps.push({
    type: 'intro',
    title: 'From Prefix to Postfix',
    content: `
      <p class="mb-3">Read the prefix expression <strong>right → left</strong>. Whenever you see an <strong>operator</strong>, pop the two expressions it owns and place the operator <em>after both</em>.</p>
      <p class="mb-2">For <code class="font-mono font-bold">${clean}</code>, the prefix <code class="font-mono font-bold">+A*BC</code> means <code class="font-mono font-bold">A + (B*C)</code>. Postfix puts each operator AFTER its operands, so the <strong>*</strong> joins <strong>BC</strong> first, then <strong>+</strong> joins <strong>A</strong> and <strong>BC*</strong>.</p>
      <p class="rounded-xl border border-stone-900/10 bg-cream/50 p-3 font-mono text-sm font-bold dark:border-white/10 dark:bg-white/5">This makes the relationship between the notations obvious: they are the same expression written with the operator in front, between, or behind.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → POSTFIX — Normal Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToPostfixNormalLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    expression: clean,
    explanation: `We start with the prefix expression <strong>${clean}</strong>. We read it right → left, rebuilding postfix sub-expressions whenever we meet an operator.`,
  });

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
      steps.push({
        expression: `=${display}`,
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) joins the two expressions it owns: <strong>${a}</strong> then <strong>${b}</strong>, and moves <em>after both</em> — so <strong>${a}</strong> + <strong>${b}</strong> + <strong>${c}</strong> → <strong>${combined}</strong>. The part before the operator has not been read yet, so it stays as-is: <strong>${display}</strong>.`,
      });
    }
  }

  const result = stack[0] || '';
  const lastExpr = steps[steps.length - 1];
  if (!lastExpr || lastExpr.expression !== `=${result}`) {
    steps.push({
      expression: `=${result}`,
      explanation: `Every operator has moved after its operands and only one grouped expression remains: <strong>${result}</strong>. That is our final postfix expression.`,
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
   PREFIX → POSTFIX — Stack Method Intro Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToPostfixStackIntroSteps() {
  const steps = [];

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
      <p class="mb-2">For prefix → postfix, the stack holds <strong>partial expressions</strong> (strings), not single characters.</p>
      <p>When an operator arrives, we pop two items, build the postfix, and push the result back.</p>
    `,
  });

  // Conversion Rules
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
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-indigo-600/5 px-3 py-2.5 dark:border-white/10 dark:bg-indigo-600/5">
          <span class="shrink-0 rounded-lg bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600">2</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Operator?</strong> → Pop the top expression (first pop = <code class="font-mono">a</code>).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-rose-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-rose-500/5">
          <span class="shrink-0 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">3</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Pop again</strong> → Get the next expression (second pop = <code class="font-mono">b</code>).</p>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-stone-900/10 bg-pink-500/5 px-3 py-2.5 dark:border-white/10 dark:bg-pink-500/5">
          <span class="shrink-0 rounded-lg bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-500">4</span>
          <p class="text-xs font-semibold text-stone-700 dark:text-gray-300"><strong>Build</strong> → Create <code class="font-mono">a + b + operator</code> and push back.</p>
        </div>
      </div>
      <p class="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">⚠️ Order matters! Because we read right → left, the first pop <code class="font-mono">a</code> comes FIRST in the built postfix.</p>
    `,
  });

  return steps;
}

/* ──────────────────────────────────────────────────────────────────────
   PREFIX → POSTFIX — Stack Method Live Steps
   ────────────────────────────────────────────────────────────────────── */

export function prefixToPostfixStackLiveSteps(expr) {
  const clean = escapeHtml(expr.replace(/\s+/g, '').toUpperCase());
  if (!clean) return [];

  const steps = [];
  const stack = [];

  steps.push({
    token: '—',
    stack: [],
    output: '',
    operation: 'INITIALIZE',
    explanation: 'We start with an empty stack of <strong>partial expressions</strong> (strings). We scan the prefix expression <strong>right → left</strong>, because the operands of an operator always sit to its right in prefix.',
  });

  for (let i = clean.length - 1; i >= 0; i--) {
    const c = clean[i];

    if (isOperandChar(c)) {
      stack.push(c);
      steps.push({
        token: c,
        stack: [...stack],
        output: c,
        operation: 'PUSH',
        explanation: `<strong>${c}</strong> is an operand. Push it onto the stack as its own mini-expression. Reading right → left we meet operands first, so they wait on the stack for the operator that combines them.`,
      });
    } else if (isOperatorChar(c)) {
      const a = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: stack.length ? stack[stack.length - 1] : '',
        operation: 'POP-A',
        explanation: `Operator <strong>${c}</strong> (${getOperatorName(c)}) needs two operands. First pop = <strong>${a}</strong> — because we scanned right → left, it was pushed last, so it comes off first and <em>leads</em> in postfix.`,
      });

      const b = stack.pop();
      steps.push({
        token: c,
        stack: [...stack],
        output: stack.length ? stack[stack.length - 1] : '',
        operation: 'POP-B',
        explanation: `Second pop = <strong>${b}</strong>. Order matters: we build <code class="font-mono">a + b + operator</code>, never <code class="font-mono">b + a + operator</code>.`,
      });

      const built = `${a}${b}${c}`;
      stack.push(built);
      steps.push({
        token: c,
        stack: [...stack],
        output: built,
        operation: 'BUILD',
        explanation: `Combine: <strong>${a}</strong> + <strong>${b}</strong> + <strong>${c}</strong> → <strong>${built}</strong>. Push the finished postfix sub-expression back onto the stack — it is now one item that outer operators can reuse.`,
      });
    }
  }

  const result = stack[0] || '';
  steps.push({
    token: '✓',
    stack: [result],
    output: result,
    operation: 'COMPLETE',
    explanation: `One expression remains on the stack. That is our final postfix expression: <strong>${result}</strong>.`,
  });

  return steps;
}
