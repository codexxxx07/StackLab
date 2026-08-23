import ComingSoonCard from '../components/ComingSoonCard';

export default function PrefixToPostfix() {
  return (
    <ComingSoonCard
      title="Prefix → Postfix"
      color="cyan"
      desc="The final boss: complete the conversion cycle and close the notation loop for good."
      planned={[
        'Mirrored scanning engine',
        'Cycle diagram tying all 6 conversions',
        'Full trace table + dual explanations',
      ]}
      example={{ in: '+A*BC', out: 'ABC*+' }}
    />
  );
}
