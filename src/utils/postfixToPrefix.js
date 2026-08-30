import { cleanExpression, isOperandChar, isOperatorChar } from './visualizationSteps';

/**
 * Postfix → Prefix (stack of strings).
 * Scan the postfix expression LEFT → RIGHT.
 * Operand  → push.
 * Operator → a = pop() (first / top), b = pop() (second),
 *            push operator + b + a.
 *
 * The first pop is "a" and it goes LAST in the built string because in a
 * prefix expression the operator leads and the operands follow in their
 * (second-popped, first-popped) order.
 */
export function postfixToPrefix(raw) {
  const expr = cleanExpression(raw);
  const steps = [];
  const stack = [];
  let n = 0;

  const snap = () => [...stack];

  const record = (step) => steps.push({ stack: snap(), output: topOrEmpty(stack), event: null, ...step });

  function topOrEmpty(s) {
    return s.length ? s[s.length - 1] : '';
  }

  record({
    step: n++,
    type: 'init',
    symbol: 'START',
    charIndex: -1,
    action: 'Initialize string stack',
    reason: [
      { text: 'This stack holds PARTIAL EXPRESSIONS (strings), not single characters.', tone: 'info' },
      { text: 'Scan the postfix expression left → right.', tone: 'plain' },
    ],
  });

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];

    if (isOperandChar(c)) {
      stack.push(c);
      record({
        step: n++,
        type: 'operand',
        symbol: c,
        charIndex: i,
        output: c,
        action: `Push operand "${c}"`,
        event: { kind: 'push', value: c },
        reason: [
          { text: `"${c}" is an operand.`, tone: 'good' },
          { text: 'Every operand starts life as its own mini-expression on the stack.', tone: 'info' },
        ],
      });
    } else if (isOperatorChar(c)) {
      // POP #1 — sits on top.
      const a = stack.pop();
      record({
        step: n++,
        type: 'pop-a',
        symbol: c,
        charIndex: i,
        action: `POP #1 → "${a}"`,
        popped: a,
        slot: 'a',
        output: topOrEmpty(stack),
        event: { kind: 'pop', value: a },
        reason: [
          { text: `Operator "${c}" needs two operands.`, tone: 'hot' },
          { text: `First pop = "${a}" — it was pushed last, so it sits on top.`, tone: 'warn' },
          { text: 'In prefix, the first-popped operand goes LAST.', tone: 'info' },
        ],
      });

      // POP #2 — below it.
      const b = stack.pop();
      record({
        step: n++,
        type: 'pop-b',
        symbol: c,
        charIndex: i,
        action: `POP #2 → "${b}"`,
        popped: b,
        slot: 'b',
        output: topOrEmpty(stack),
        event: { kind: 'pop', value: b },
        reason: [
          { text: `Second pop = "${b}".`, tone: 'warn' },
          { text: 'Order matters! We build operator + b + a — never operator + a + b.', tone: 'hot' },
        ],
      });

      const built = `${c}${b}${a}`;
      stack.push(built);
      record({
        step: n++,
        type: 'combine',
        symbol: c,
        charIndex: i,
        action: `Build ${built} → PUSH`,
        built,
        output: built,
        event: { kind: 'push', value: built },
        reason: [
          { text: `Prefix puts the operator FIRST: "${c}" + "${b}" + "${a}".`, tone: 'info' },
          { text: `= ${built}`, tone: 'win' },
          { text: 'The finished sub-expression goes back on the stack as one item.', tone: 'good' },
        ],
      });
    }
  }

  const result = stack[0] ?? '';

  record({
    step: n,
    type: 'done',
    symbol: 'DONE',
    charIndex: expr.length,
    action: 'Conversion complete',
    output: result,
    result,
    reason: [
      { text: 'One single expression remains on the stack — that is the answer.', tone: 'good' },
      { text: `Final prefix expression: ${result}`, tone: 'win' },
    ],
  });

  return { result, steps };
}
