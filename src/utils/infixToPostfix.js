import {
  PRECEDENCE,
  cleanExpression,
  isOperandChar,
  isOperatorChar,
} from './visualizationSteps';

/**
 * Infix → Postfix (stack algorithm).
 * Pure function: returns { result, steps } where every step is a full
 * snapshot of the machine — the UI simply renders the step list.
 */
export function infixToPostfix(raw) {
  const expr = cleanExpression(raw);
  const steps = [];
  const stack = [];
  let output = '';
  let n = 0;

  const snap = () => [...stack];

  const record = (step) => steps.push({ output, stack: snap(), event: null, ...step });

  record({
    step: n++,
    type: 'init',
    symbol: 'START',
    charIndex: -1,
    action: 'Initialize stack & output',
    reason: [
      { text: 'Empty stack, empty output. The machine is ready.', tone: 'info' },
      { text: 'Scan the expression left → right, one symbol at a time.', tone: 'plain' },
    ],
  });

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];

    if (isOperandChar(c)) {
      output += c;
      record({
        step: n++,
        type: 'operand',
        symbol: c,
        charIndex: i,
        action: `Add "${c}" to OUTPUT`,
        output,
        event: { kind: 'output', value: c },
        reason: [
          { text: `"${c}" is an operand (A–Z).`, tone: 'good' },
          { text: 'Operands never wait in the stack — they go straight to the output.', tone: 'info' },
        ],
      });
    } else if (c === '(') {
      stack.push(c);
      record({
        step: n++,
        type: 'paren-open',
        symbol: c,
        charIndex: i,
        action: 'Push "(" onto stack',
        event: { kind: 'push', value: c },
        reason: [
          { text: '"(" opens a fresh sub-expression.', tone: 'warn' },
          { text: 'It acts as a floor on the stack — nothing below it may be popped until its ")" arrives.', tone: 'info' },
        ],
      });
    } else if (c === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        const popped = stack.pop();
        output += popped;
        record({
          step: n++,
          type: 'paren-pop',
          symbol: ')',
          charIndex: i,
          action: `Pop "${popped}" → OUTPUT`,
          output,
          event: { kind: 'pop', value: popped },
          reason: [
            { text: '")" arrived — everything back to "(" must be flushed first.', tone: 'hot' },
            { text: `Pop "${popped}" from the stack and append it to the output.`, tone: 'good' },
          ],
        });
      }
      stack.pop();
      record({
        step: n++,
        type: 'paren-discard',
        symbol: ')',
        charIndex: i,
        action: 'Discard "(" pair',
        event: { kind: 'pop', value: '(' },
        reason: [
          { text: 'The matching "(" is removed but never printed.', tone: 'warn' },
          { text: 'Postfix has no parentheses — grouping lives in the order of symbols.', tone: 'info' },
        ],
      });
    } else if (isOperatorChar(c)) {
      const pCur = PRECEDENCE[c];
      let didPop = false;

      while (
        stack.length > 0 &&
        stack[stack.length - 1] !== '(' &&
        PRECEDENCE[stack[stack.length - 1]] >= pCur
      ) {
        const top = stack.pop();
        output += top;
        didPop = true;
        record({
          step: n++,
          type: 'op-pop',
          symbol: c,
          charIndex: i,
          action: `Pop "${top}" → OUTPUT`,
          output,
          event: { kind: 'pop', value: top },
          compare: { current: c, currentScore: pCur, top, topScore: PRECEDENCE[top], verdict: '≤' },
          reason: [
            { text: `Incoming operator "${c}" — priority ${pCur}.`, tone: 'hot' },
            { text: `Stack top "${top}" — priority ${PRECEDENCE[top]}.`, tone: 'info' },
            { text: `${PRECEDENCE[top]} ≥ ${pCur} → "${top}" must be applied first.`, tone: 'warn' },
            { text: `Pop "${top}" and append it to the output.`, tone: 'good' },
          ],
        });
      }

      stack.push(c);
      const topNow = stack[stack.length - 2];
      let pushReasons;
      if (didPop) {
        pushReasons = [
          { text: `Now the top is ${topNow ? `"${topNow}" (priority ${PRECEDENCE[topNow]})` : 'empty'} — weaker than "${c}".`, tone: 'info' },
          { text: `Safe zone reached → push "${c}".`, tone: 'good' },
        ];
      } else if (stack.length === 1) {
        pushReasons = [
          { text: `Priority("${c}") = ${pCur}.`, tone: 'info' },
          { text: 'Stack is empty — nothing outranks it yet. Push it and wait for its right operand.', tone: 'good' },
        ];
      } else if (topNow === '(') {
        pushReasons = [
          { text: `Top of stack is "(" — a protected floor.`, tone: 'info' },
          { text: `Push "${c}" inside this bracket context.`, tone: 'good' },
        ];
      } else {
        pushReasons = [
          { text: `Priority("${c}") = ${pCur} < Priority("${topNow}") = ${PRECEDENCE[topNow]}.`, tone: 'warn' },
          { text: `The operator on top must be applied AFTER "${c}", so "${c}" goes on top. Push.`, tone: 'good' },
        ];
      }
      record({
        step: n++,
        type: 'op-push',
        symbol: c,
        charIndex: i,
        action: `Push "${c}" onto stack`,
        event: { kind: 'push', value: c },
        compare: didPop
          ? null
          : topNow && topNow !== '('
            ? { current: c, currentScore: pCur, top: topNow, topScore: PRECEDENCE[topNow], verdict: '<' }
            : null,
        reason: [
          { text: `"${c}" is an operator with priority ${pCur}.`, tone: 'hot' },
          ...pushReasons,
        ],
      });
    }
  }

  while (stack.length > 0) {
    const popped = stack.pop();
    output += popped;
    record({
      step: n++,
      type: 'flush',
      symbol: 'END',
      charIndex: expr.length,
      action: `Pop leftover "${popped}" → OUTPUT`,
      output,
      event: { kind: 'pop', value: popped },
      reason: [
        { text: 'Input exhausted — flush whatever operators are still waiting.', tone: 'hot' },
        { text: `Pop "${popped}" from the stack and append it to the output.`, tone: 'good' },
      ],
    });
  }

  record({
    step: n++,
    type: 'done',
    symbol: 'DONE',
    charIndex: expr.length,
    action: 'Conversion complete',
    output,
    result: output,
    reason: [
      { text: `Stack is empty and every operator found its place.`, tone: 'good' },
      { text: `Final postfix expression: ${output}`, tone: 'win' },
    ],
  });

  return { result: output, steps };
}
