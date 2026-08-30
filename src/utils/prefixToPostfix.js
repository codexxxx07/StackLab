import { cleanExpression, isOperandChar, isOperatorChar } from './visualizationSteps';

/**
 * Prefix → Postfix (stack of strings).
 * Scan the prefix expression RIGHT → LEFT.
 * Operand  → push.
 * Operator → a = pop() (first / top), b = pop() (second),
 *            push a + b + operator.
 *
 * Because we scan right → left, the first pop "a" is the LEFT operand
 * (it was pushed most recently) and it comes FIRST in postfix.
 */
export function prefixToPostfix(raw) {
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
      { text: 'Scan the prefix expression right → left, one symbol at a time.', tone: 'plain' },
    ],
  });

  for (let i = expr.length - 1; i >= 0; i--) {
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
      // POP #1 — sits on top → LEFT operand (right-to-left scan).
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
          { text: `First pop = "${a}" → the LEFT operand.`, tone: 'warn' },
          { text: 'Scanning right → left it was pushed last, so it comes off first and leads in postfix.', tone: 'info' },
        ],
      });

      // POP #2 — below it → RIGHT operand.
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
          { text: `Second pop = "${b}" → the RIGHT operand.`, tone: 'warn' },
          { text: 'Order matters! We build a + b + operator — never b + a + operator.', tone: 'hot' },
        ],
      });

      const built = `${a}${b}${c}`;
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
          { text: `Postfix puts the operator LAST: "${a}" + "${b}" + "${c}".`, tone: 'info' },
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
    charIndex: -1,
    action: 'Conversion complete',
    output: result,
    result,
    reason: [
      { text: 'One single expression remains on the stack — that is the answer.', tone: 'good' },
      { text: `Final postfix expression: ${result}`, tone: 'win' },
    ],
  });

  return { result, steps };
}
