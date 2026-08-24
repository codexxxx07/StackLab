// Standalone test — mirrors the logic in explanations.js

const PRECEDENCE = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };

function isOperandChar(c) { return /^[A-Z]$/.test(c); }
function isOperatorChar(c) { return '+-*/^'.includes(c); }

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
    while (tokens.length > 0 && tokens[0].type === 'operator' && PRECEDENCE[tokens[0].value] >= minPrec) {
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
      if (p < bestPrec || (p === bestPrec && i > bestIdx)) { bestPrec = p; bestIdx = i; }
    }
  }
  return bestIdx;
}

function collectInfixSteps(expr) {
  const tokens = tokenize(expr);
  let hasOp = false, depth = 0;
  for (const t of tokens) {
    if (t.type === 'paren' && t.value === '(') depth++;
    else if (t.type === 'paren' && t.value === ')') depth--;
    else if (depth === 0 && t.type === 'operator') hasOp = true;
  }
  if (!hasOp) {
    const tree = buildTree([...tokenize(expr)]);
    return { steps: [expr], finalResult: treeToPostfix(tree) };
  }
  const tree = buildTree([...tokenize(expr)]);
  const finalResult = treeToPostfix(tree);
  const splitIdx = findInfixSplitIndex(expr);
  if (splitIdx === -1) return { steps: [expr], finalResult };

  const left = expr.slice(0, splitIdx);
  const right = expr.slice(splitIdx + 1);
  const op = expr[splitIdx];

  const leftConverted = collectInfixSteps(left);
  const rightConverted = collectInfixSteps(right);
  const newExpr = leftConverted.finalResult + rightConverted.finalResult + op;

  const transformLines = [];
  const leftHasOps = leftConverted.steps.length > 1;
  const rightHasOps = rightConverted.steps.length > 1;

  if (leftHasOps) {
    for (let i = 1; i < leftConverted.steps.length; i++) {
      const leftStep = leftConverted.steps[i];
      const mappedLine = leftStep.slice(1) + right + op;
      transformLines.push(`=${mappedLine}`);
    }
  }
  if (rightHasOps) {
    for (let i = 1; i < rightConverted.steps.length; i++) {
      const rightStep = rightConverted.steps[i];
      const mappedLine = leftConverted.finalResult + op + rightStep.slice(1);
      transformLines.push(`=${mappedLine}`);
    }
  }
  if (newExpr !== expr) transformLines.push(`=${newExpr}`);
  if (transformLines[transformLines.length - 1] !== `=${finalResult}`) transformLines.push(`=${finalResult}`);
  const unique = [];
  for (const s of transformLines) { if (unique.length === 0 || s !== unique[unique.length - 1]) unique.push(s); }
  return { steps: [expr, ...unique], finalResult };
}

function infixToPostfixNormalSteps(expr) {
  const clean = expr.replace(/\s+/g, '').toUpperCase();
  if (!clean) return { steps: [], finalResult: '' };
  return collectInfixSteps(clean);
}

// ── Test Suite ──

let pass = 0, fail = 0;

function test(input, expectedSteps, expectedResult) {
  const r = infixToPostfixNormalSteps(input);
  const stepsOk = JSON.stringify(r.steps) === JSON.stringify(expectedSteps);
  const resultOk = r.finalResult === expectedResult;

  if (stepsOk && resultOk) {
    pass++;
    return;
  }

  fail++;
  console.log(`FAIL: ${input}`);
  if (!stepsOk) {
    console.log(`  Expected steps: ${JSON.stringify(expectedSteps)}`);
    console.log(`  Got steps:      ${JSON.stringify(r.steps)}`);
  }
  if (!resultOk) {
    console.log(`  Expected result: ${expectedResult}`);
    console.log(`  Got result:      ${r.finalResult}`);
  }
}

// ── Basic precedence ──
test('A+B*C',
  ['A+B*C', '=A+BC*', '=ABC*+'],
  'ABC*+');

test('A*B+C',
  ['A*B+C', '=AB*+C', '=AB*C+'],
  'AB*C+');

test('A+B*C*D',
  ['A+B*C*D', '=A+BC*D', '=A+BCD**', '=ABCD**+'],
  'ABCD**+');

test('A*B+C*D',
  ['A*B+C*D', '=AB*+C*D', '=AB*+CD*', '=AB*CD*+'],
  'AB*CD*+');

// ── Left associativity (same precedence) ──
test('A+B+C',
  ['A+B+C', '=A+BC+', '=AB+C+'],
  'AB+C+');

test('A+B-C',
  ['A+B-C', '=A+BC-', '=AB+C-'],
  'AB+C-');

test('A*B*C',
  ['A*B*C', '=A*BC*', '=AB*C*'],
  'AB*C*');

test('A/B*C',
  ['A/B*C', '=A/BC*', '=AB/C*'],
  'AB/C*');

// ── Right-associativity (^) ──
test('A^B^C',
  ['A^B^C', '=A^BC^', '=ABC^^'],
  'ABC^^');

// ── Parentheses ──
test('(A+B)*C',
  ['(A+B)*C', '=(AB+)*C', '=AB+C*'],
  'AB+C*');

test('A*(B+C)',
  ['A*(B+C)', '=A*BC+', '=ABC+*'],
  'ABC+*');

test('(A+B)*(C+D)',
  ['(A+B)*(C+D)', '=(AB+)*C+D', '=(AB+)*CD+', '=AB+CD+*'],
  'AB+CD+*');

test('(A+B+C)*D',
  ['(A+B+C)*D', '=(A+BC+)*D', '=(AB+C+)*D', '=AB+C+D*'],
  'AB+C+D*');

// ── Nested parentheses ──
test('((A+B))*C',
  ['((A+B))*C', '=((AB+))*C', '=(AB+)*C', '=AB+C*'],
  'AB+C*');

test('A+(B*(C+D))',
  ['A+(B*(C+D))', '=A+(B*CD+)', '=A+(BCD+*)', '=A+BCD+*', '=ABCD+*+'],
  'ABCD+*+');

// ── Complex expressions ──
test('A+B*(C+D)',
  ['A+B*(C+D)', '=A+B*CD+', '=A+BCD+*', '=ABCD+*+'],
  'ABCD+*+');

test('A*B+C*D-E/F',
  ['A*B+C*D-E/F', '=AB*+C*D-E/F', '=AB*+CD*-E/F', '=AB*+CD*-EF/', '=AB*CD*+EF/-'],
  'AB*CD*+EF/-');

test('A^B*C+D',
  ['A^B*C+D', '=A^BC*+D', '=ABC^*+D', '=ABC^*D+'],
  'ABC^*D+');

// ── Single operand ──
test('A',
  ['A'],
  'A');

// ── Two operands with one operator ──
test('A+B',
  ['A+B', '=AB+'],
  'AB+');

test('A*B',
  ['A*B', '=AB*'],
  'AB*');

// ── Deeply nested ──
test('(A+(B*(C+D)))',
  ['(A+(B*(C+D)))', '=(A+(B*CD+))', '=(A+(BCD+*))', '=(A+BCD+*)', '=(ABCD+*+)'],
  '(ABCD+*+)');

// ── Additional edge cases ──
test('A+B*C^D',
  ['A+B*C^D', '=A+BC^D*', '=A+BCD^*', '=ABCD^*+'],
  'ABCD^*+');

test('(A+B)^C',
  ['(A+B)^C', '=(AB+)^C', '=AB+C^'],
  'AB+C^');

test('A*(B+C*D)',
  ['A*(B+C*D)', '=A*(B+CD*)', '=A*(BCD*+)', '=A+BCD*+', '=ABCD*++'],
  'ABCD*++');

console.log(`\nResults: ${pass} passed, ${fail} failed out of ${pass + fail} total`);
if (fail > 0) process.exit(1);
