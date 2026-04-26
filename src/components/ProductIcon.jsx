export function ProductIcon({ kind, size = 72, theme: T, imagenUrl }) {
  const s = size;
  const r = s * 0.18;

  if (imagenUrl) {
    return (
      <div style={{ width: s, height: s, borderRadius: Math.round(r), overflow: 'hidden', flexShrink: 0, background: '#f0f0f0' }}>
        <img src={imagenUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>
      </div>
    );
  }

  if (kind === 'arena') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#F4E6C9"/>
      <path d="M6 60 L24 30 L36 50 L50 24 L66 60 Z" fill="#C99A4F"/>
      <circle cx="18" cy="18" r="3" fill="#E5B977"/>
      <circle cx="54" cy="14" r="2" fill="#E5B977"/>
      <circle cx="44" cy="28" r="1.5" fill="#A87930"/>
      <circle cx="26" cy="42" r="1.5" fill="#A87930"/>
    </svg>
  );

  if (kind === 'piedra') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#DCE3E0"/>
      <polygon points="10,50 22,30 36,46 28,60 14,62" fill="#6E7A78"/>
      <polygon points="30,54 46,28 60,44 54,62 36,62" fill="#8C9896"/>
      <polygon points="44,20 56,14 62,30 50,34" fill="#AFB9B6"/>
      <path d="M18 40 l3 2 M40 38 l3-2 M50 48 l2 3" stroke="#fff" strokeWidth="1" opacity=".5"/>
    </svg>
  );

  if (kind === 'hormigon') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#E8E4D8"/>
      <path d="M4 50 Q20 40 36 48 T68 48 L68 68 L4 68 Z" fill="#B8A98B"/>
      <circle cx="14" cy="24" r="3" fill="#8E7F5F"/>
      <circle cx="30" cy="20" r="2.5" fill="#A89877"/>
      <circle cx="48" cy="26" r="3.5" fill="#8E7F5F"/>
      <circle cx="58" cy="18" r="2" fill="#A89877"/>
      <circle cx="20" cy="38" r="2" fill="#8E7F5F"/>
      <circle cx="42" cy="36" r="2.5" fill="#A89877"/>
    </svg>
  );

  if (kind === 'cemento') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#F4E6C9"/>
      <path d="M18 14 L54 14 L58 60 L14 60 Z" fill="#D89A3B"/>
      <path d="M18 14 L54 14 L52 22 L20 22 Z" fill="#A46F1E"/>
      <rect x="24" y="30" width="24" height="14" rx="2" fill="#fff"/>
      <text x="36" y="40" fontSize="9" fontWeight="800" textAnchor="middle" fill="#A46F1E" fontFamily="sans-serif">JBT</text>
      <path d="M22 48 l28 0" stroke="#A46F1E" strokeWidth="1"/>
    </svg>
  );

  if (kind === 'ladrillo') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#F3DCC8"/>
      <rect x="6" y="14" width="24" height="12" fill="#C4552B"/>
      <rect x="32" y="14" width="34" height="12" fill="#C4552B"/>
      <rect x="6" y="28" width="14" height="12" fill="#AB4923"/>
      <rect x="22" y="28" width="30" height="12" fill="#AB4923"/>
      <rect x="54" y="28" width="12" height="12" fill="#AB4923"/>
      <rect x="6" y="42" width="24" height="12" fill="#C4552B"/>
      <rect x="32" y="42" width="34" height="12" fill="#C4552B"/>
    </svg>
  );

  if (kind === 'fierro') return (
    <svg width={s} height={s} viewBox="0 0 72 72">
      <rect x="0" y="0" width="72" height="72" rx={r * 72 / s} fill="#E4E7EA"/>
      <g transform="rotate(-20 36 36)">
        <rect x="6" y="20" width="60" height="6" fill="#5F6A72"/>
        <rect x="6" y="32" width="60" height="6" fill="#7B858C"/>
        <rect x="6" y="44" width="60" height="6" fill="#5F6A72"/>
        {[...Array(12)].map((_, i) => (
          <g key={i}>
            <rect x={8 + i * 5} y="20" width="1.5" height="6" fill="#2F383E"/>
            <rect x={8 + i * 5} y="32" width="1.5" height="6" fill="#2F383E"/>
            <rect x={8 + i * 5} y="44" width="1.5" height="6" fill="#2F383E"/>
          </g>
        ))}
      </g>
    </svg>
  );

  return null;
}
