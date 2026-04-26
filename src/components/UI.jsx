import { I } from './Icons';

export function Phone({ theme: T, children, dark = false }) {
  return (
    <div style={{
      width: 360, height: 720, background: T.bg,
      borderRadius: 28, overflow: 'hidden', position: 'relative',
      boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 20px 60px -20px rgba(10,30,20,.2)',
      border: `1px solid ${T.line}`,
      fontFamily: T.body,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', fontSize: 12, color: dark ? '#fff' : T.ink, fontWeight: 600,
        background: dark ? T.primary : 'transparent',
        flexShrink: 0,
      }}>
        <span>9:41</span>
        <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a' }}/>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 7h2v2H1zM5 5h2v4H5zM9 3h2v6H9zM13 1h0v8" stroke={dark ? '#fff' : T.ink} strokeWidth="1.5" fill="none"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 8.5L1 3.5a8 8 0 0 1 12 0L7 8.5z" fill={dark ? '#fff' : T.ink}/></svg>
          <svg width="18" height="10" viewBox="0 0 18 10"><rect x="0.5" y="1" width="14" height="8" rx="1.5" fill="none" stroke={dark ? '#fff' : T.ink}/><rect x="2" y="2.5" width="10" height="5" fill={dark ? '#fff' : T.ink}/><rect x="15" y="3.5" width="1.5" height="3" fill={dark ? '#fff' : T.ink}/></svg>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: 100, height: 4, borderRadius: 4, background: T.ink, opacity: 0.85 }}/>
      </div>
    </div>
  );
}

export function BtnPrimary({ theme: T, children, onClick, full, style, icon: Icon, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: T.accent, color: '#fff', border: 'none', borderRadius: 12,
      padding: '13px 18px', fontSize: 15, fontWeight: 700,
      letterSpacing: '-.01em', cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : 'auto',
      boxShadow: `0 1px 0 rgba(255,255,255,.2) inset, 0 6px 14px -6px ${T.accent}80`,
      opacity: disabled ? .6 : 1,
      fontFamily: T.body, ...style,
    }}>
      {Icon && <Icon size={18} color="#fff"/>}
      {children}
    </button>
  );
}

export function BtnSecondary({ theme: T, children, onClick, full, style, icon: Icon }) {
  return (
    <button onClick={onClick} style={{
      background: T.surface, color: T.ink, border: `1.5px solid ${T.line}`, borderRadius: 12,
      padding: '12px 16px', fontSize: 14, fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : 'auto',
      fontFamily: T.body, ...style,
    }}>
      {Icon && <Icon size={18} color={T.ink}/>}
      {children}
    </button>
  );
}

export function Chip({ theme: T, children, active, onClick, icon: Icon, style }) {
  return (
    <button onClick={onClick} style={{
      background: active ? T.ink : T.chip, color: active ? '#fff' : T.ink2,
      border: 'none', borderRadius: 100,
      padding: '8px 14px', fontSize: 13, fontWeight: 600, letterSpacing: '-.005em',
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      fontFamily: T.body, whiteSpace: 'nowrap', ...style,
    }}>
      {Icon && <Icon size={14} color={active ? '#fff' : T.ink2}/>}
      {children}
    </button>
  );
}

export function Badge({ theme: T, children, tone = 'ok', style }) {
  const tones = {
    ok: { bg: '#E6F4EA', fg: T.ok },
    warn: { bg: '#FFF3CC', fg: '#8A6500' },
    danger: { bg: '#FCE7E2', fg: T.danger },
    accent: { bg: T.accentSoft, fg: T.accentDark },
    neutral: { bg: T.chip, fg: T.ink2 },
    primary: { bg: T.primarySoft, fg: T.primaryDark },
  }[tone] || { bg: T.chip, fg: T.ink2 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: tones.bg, color: tones.fg,
      borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700,
      letterSpacing: '.02em', textTransform: 'uppercase',
      fontFamily: T.body, ...style,
    }}>{children}</span>
  );
}
