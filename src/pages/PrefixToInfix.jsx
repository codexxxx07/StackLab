import ComingSoonCard from '../components/ComingSoonCard';

export default function PrefixToInfix() {
  return (
    <ComingSoonCard
      title="Prefix → Infix"
      color="coral"
      desc="Read the expression right-to-left and let a string stack unfold each operation back into bracketed infix."
      planned={[
        'Right-to-left scanner visual',
        'String-stack growth animation',
        'Pop-order spotlight panel',
        'Full trace table + dual explanations',
      ]}
      example={{ in: '+A*BC', out: 'A+B*C' }}
    />
  );
}
