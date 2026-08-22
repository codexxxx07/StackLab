import ComingSoonCard from '../components/ComingSoonCard';

export default function InfixToPrefix() {
  return (
    <ComingSoonCard
      title="Infix → Prefix"
      color="mint"
      desc="The shunting-yard's mirror twin: scan right-to-left, flip the brackets, and operators jump in front of their operands."
      planned={[
        'Reversed scanning with bracket swapping',
        'Right-associative ^ handling',
        'Prefix output tape, built backwards',
        'Full trace table + dual explanations',
      ]}
      example={{ in: 'A+B*C', out: '+A*BC' }}
    />
  );
}
