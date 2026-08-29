import { cleanExpression, isOperandChar, isOperatorChar } from './visualizationSteps';

/**
 * Prefix → Infix (stack of strings).
 * Scan the prefix expression RIGHT → LEFT.
 * Operand  → push.
 * Operator → a = pop() (LEFT operand), b = pop() (RIGHT operand),
 *            push "(" + a + operator + b + ")".
 *
 * The first pop is the LEFT operand because it was pushed most recently
 * (right-to-left scan means the left-side sub-expression lands on top).
 */
export function prefixToInfix(raw) {
  const expr = cleanExpression(raw);
  const steps = [];
  const stack = [];
  let n = 0;

  const snap = () => [...stack];

  const record = (step) => steps.push({ stack: snap(), event: null, ...step });

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
        action: `Push operand "${c}"`,
        event: { kind: 'push', value: c },
        reason: [
          { text: `"${c}" is an operand.`, tone: 'good' },
          { text: 'Every operand starts life as its own mini-expression on the stack.', tone: 'info' },
        ],
      });
    } else if (isOperatorChar(c)) {
      // POP #1 — sits on top → it is the LEFT operand.
      const left = stack.pop();
      record({
        step: n++,
        type: 'pop-left',
        symbol: c,
        charIndex: i,
        action: `POP #1 → "${left}"`,
        popped: left,
        slot: 'left',
        event: { kind: 'pop', value: left },
        reason: [
          { text: `Operator "${c}" needs two operands.`, tone: 'hot' },
          { text: `First pop = "${left}" → the LEFT operand.`, tone: 'warn' },
          { text: 'Scanning right → left it was pushed last, so it belongs on the left side of the operator.', tone: 'info' },
        ],
      });

      // POP #2 — below it → RIGHT operand.
      const right = stack.pop();
      record({
        step: n++,
        type: 'pop-right',
        symbol: c,
        charIndex: i,
        action: `POP #2 → "${right}"`,
        popped: right,
        slot: 'right',
        event: { kind: 'pop', value: right },
        reason: [
          { text: `Second pop = "${right}" → the RIGHT operand.`, tone: 'warn' },
          { text: 'Order matters! We will build ( LEFT op RIGHT ) — never ( RIGHT op LEFT ).', tone: 'hot' },
        ],
      });

      const built = `(${left}${c}${right})`;
      stack.push(built);
      record({
        step: n++,
        type: 'combine',
        symbol: c,
        charIndex: i,
        action: `Build ${built} → PUSH`,
        built,
        event: { kind: 'push', value: built },
        reason: [
          { text: `Wrap them up: "(" + LEFT + "${c}" + RIGHT + ")"`, tone: 'info' },
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
    result,
    reason: [
      { text: 'One single expression remains on the stack — that is the answer.', tone: 'good' },
      { text: `Final infix expression: ${result}`, tone: 'win' },
    ],
  });

  return { result, steps };
}