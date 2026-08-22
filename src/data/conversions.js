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
    title: 'Infix → Postfix',
    desc: 'Operators sink behind operands as precedence and parentheses drive the stack.',
    example: { in: 'A+B*C', out: 'ABC*+' },
    color: 'grape',
    status: 'live',
    tagline: 'The classic Shunting Yard',
  },
  {
    id: 'postfix-to-infix',
    path: '/postfix-to-infix',
    from: 'POSTFIX',
    to: 'INFIX',
    title: 'Postfix → Infix',
    desc: 'A stack of growing strings reassembles the expression, one operator at a time.',
    example: { in: 'ABC*+', out: 'A+(B*C)' },
    color: 'sky',
    status: 'live',
    tagline: 'Rebuild what was torn down',
  },
  {
    id: 'infix-to-prefix',
    path: '/infix-to-prefix',
    from: 'INFIX',
    to: 'PREFIX',
    title: 'Infix → Prefix',
    desc: 'Operators leap in front of their operands — reversed scanning meets the stack.',
    example: { in: 'A+B*C', out: '+A*BC' },
    color: 'mint',
    status: 'soon',
    tagline: 'Polish notation ahead!',
  },
  {
    id: 'prefix-to-infix',
    path: '/prefix-to-infix',
    from: 'PREFIX',
    to: 'INFIX',
    title: 'Prefix → Infix',
    desc: 'Read right → left and let the string stack unfold each operation.',
    example: { in: '+A*BC', out: 'A+B*C' },
    color: 'coral',
    status: 'soon',
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
    color: 'flamingo',
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
    color: 'lemon',
    status: 'soon',
    tagline: 'Close the loop',
  },
];

export const LIVE_CONVERSIONS = CONVERSIONS.filter((c) => c.status === 'live');
export const SOON_CONVERSIONS = CONVERSIONS.filter((c) => c.status === 'soon');

/** Class lookup so dynamic Tailwind classes stay statically analyzable. */
export const COLOR_STYLES = {
  grape: { solid: 'bg-grape text-white', soft: 'bg-grape-soft', bar: 'bg-grape' },
  sky: { solid: 'bg-sky text-white', soft: 'bg-sky-soft', bar: 'bg-sky' },
  mint: { solid: 'bg-mint text-white', soft: 'bg-mint-soft', bar: 'bg-mint' },
  coral: { solid: 'bg-coral text-white', soft: 'bg-coral-soft', bar: 'bg-coral' },
  flamingo: { solid: 'bg-flamingo text-white', soft: 'bg-flamingo-soft', bar: 'bg-flamingo' },
  lemon: { solid: 'bg-lemon text-ink', soft: 'bg-lemon-soft', bar: 'bg-lemon' },
  turq: { solid: 'bg-turq text-white', soft: 'bg-turq-soft', bar: 'bg-turq' },
};
