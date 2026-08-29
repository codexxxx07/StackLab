/**
 * Single source of truth for every conversion the site knows about.
 * Adding a future conversion = add an entry here + flip status to "live".
 */
export const CONVERSIONS = [
  {
    id: 'infix-to-postfix',
    path: '/infix-to-postfix',
    from: 'INFIX',
    to: 'POSTFIX',
    title: 'Infix to Postfix',
    desc: 'Operators sink behind operands as precedence and parentheses drive the stack.',
    example: { in: 'A+B*C', out: 'ABC*+' },
    color: 'orange',
    status: 'live',
    tagline: 'The classic Shunting Yard',
  },
  {
    id: 'postfix-to-infix',
    path: '/postfix-to-infix',
    from: 'POSTFIX',
    to: 'INFIX',
    title: 'Postfix to Infix',
    desc: 'A stack of growing strings reassembles the expression, one operator at a time.',
    example: { in: 'ABC*+', out: 'A+(B*C)' },
    color: 'indigo',
    status: 'live',
    tagline: 'Rebuild what was torn down',
  },
  {
    id: 'infix-to-prefix',
    path: '/infix-to-prefix',
    from: 'INFIX',
    to: 'PREFIX',
    title: 'Infix to Prefix',
    desc: 'Operators leap in front of their operands — reversed scanning meets the stack.',
    example: { in: 'A+B*C', out: '+A*BC' },
    color: 'emerald',
    status: 'live',
    tagline: 'Polish notation ahead!',
  },
  {
    id: 'prefix-to-infix',
    path: '/prefix-to-infix',
    from: 'PREFIX',
    to: 'INFIX',
    title: 'Prefix to Infix',
    desc: 'Read right → left and let the string stack unfold each operation.',
    example: { in: '+A*BC', out: 'A+B*C' },
    color: 'rose',
    status: 'live',
    tagline: 'Un-Polish the notation',
  },
  {
    id: 'postfix-to-prefix',
    path: '/postfix-to-prefix',
    from: 'POSTFIX',
    to: 'PREFIX',
    title: 'Postfix → Prefix',
    desc: 'Same pop-pop-build dance — but this time operators land in front.',
    example: { in: 'ABC*+', out: '+A*BC' },
    color: 'pink',
    status: 'soon',
    tagline: 'Operator goes first',
  },
  {
    id: 'prefix-to-postfix',
    path: '/prefix-to-postfix',
    from: 'PREFIX',
    to: 'POSTFIX',
    title: 'Prefix → Postfix',
    desc: 'Complete the conversion cycle and close the notation loop.',
    example: { in: '+A*BC', out: 'ABC*+' },
    color: 'cyan',
    status: 'soon',
    tagline: 'Close the loop',
  },
];

export const LIVE_CONVERSIONS = CONVERSIONS.filter((c) => c.status === 'live');
export const SOON_CONVERSIONS = CONVERSIONS.filter((c) => c.status === 'soon');

/** Class lookup so dynamic Tailwind classes stay statically analyzable. */
export const COLOR_STYLES = {
  orange: { solid: 'bg-orange-500 text-white', soft: 'bg-orange-500/10', bar: 'bg-orange-500' },
  indigo: { solid: 'bg-indigo-600 text-white', soft: 'bg-indigo-600/10', bar: 'bg-indigo-600' },
  emerald: { solid: 'bg-emerald-500 text-white', soft: 'bg-emerald-500/10', bar: 'bg-emerald-500' },
  rose: { solid: 'bg-rose-500 text-white', soft: 'bg-rose-500/10', bar: 'bg-rose-500' },
  pink: { solid: 'bg-pink-500 text-white', soft: 'bg-pink-500/10', bar: 'bg-pink-500' },
  cyan: { solid: 'bg-cyan-400 text-stone-900', soft: 'bg-cyan-400/10', bar: 'bg-cyan-400' },
  amber: { solid: 'bg-amber-500 text-stone-900', soft: 'bg-amber-500/10', bar: 'bg-amber-500' },
};
