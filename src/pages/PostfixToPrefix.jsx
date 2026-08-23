import ComingSoonCard from '../components/ComingSoonCard';

export default function PostfixToPrefix() {
  return (
    <ComingSoonCard
      title="Postfix → Prefix"
      color="pink"
      desc="Same pop-pop-build dance you know from Postfix → Infix — but the operator lands in front instead of between."
      planned={[
        'String stack with operator-first building',
        'Side-by-side compare with Infix rebuilding',
        'Full trace table + dual explanations',
      ]}
      example={{ in: 'ABC*+', out: '+A*BC' }}
    />
  );
}
