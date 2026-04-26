import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';

const quickActions = [
  { i: 'refresh', l: 'Repetir pedido', sub: 'Últimos 30 días', emoji: '🔄' },
  { i: 'doc', l: 'Facturas', sub: '3 pendientes', emoji: '🧾' },
  { i: 'chart', l: 'Mis compras', sub: 'Ver reportes', emoji: '📊' },
];

const mayorista = [
  { k: 'cemento', n: 'Cemento Sol 42.5kg', pm: 23, pu: 28, min: '50 bolsas' },
  { k: 'ladrillo', n: 'Ladrillo KK 18h', pm: 0.95, pu: 1.2, min: '1000 und' },
  { k: 'fierro', n: 'Fierro 1/2" x 9m', pm: 32, pu: 38, min: '20 varillas' },
  { k: 'arena', n: 'Arena gruesa', pm: 62, pu: 75, min: '10 m³' },
];

export function ScreenFerreteria({ theme: T }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      {/* Header */}
      <div style={{ background: T.ink, padding: '32px 0 40px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, opacity: .65, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Portal</div>
              <div style={{ fontSize: 28, fontWeight: 900, fontFamily: T.display }}>Ferretería El Sol · Surco</div>
              <div style={{ fontSize: 14, opacity: .7, marginTop: 4 }}>Canal mayorista B2B · RUC 20101234567</div>
            </div>
            <Badge theme={T} tone="accent">B2B MAYORISTA</Badge>
          </div>

          {/* Credit line card */}
          <div style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`, borderRadius: 20, padding: '20px 24px', marginTop: 24, position: 'relative', overflow: 'hidden', maxWidth: 480 }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: .75, letterSpacing: '.06em', textTransform: 'uppercase' }}>Línea de crédito disponible</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: T.display }}>S/8,420</span>
              <span style={{ fontSize: 14, opacity: .7 }}>de S/15,000</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,.2)', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '56%', background: T.accent, borderRadius: 4 }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, opacity: .75 }}>
              <span>56% utilizado</span>
              <span>Vence 15 May · 30 días</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {quickActions.map((x, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontSize: 28 }}>{x.emoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{x.l}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{x.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Precio mayorista</div>
          <Badge theme={T} tone="primary">−18% vs precio público</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mayorista.map((x, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <ProductIcon kind={x.k} size={56} theme={T}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{x.n}</div>
                <div style={{ fontSize: 13, color: T.ink3, marginTop: 3 }}>Compra mínima: {x.min}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 16 }}>
                <div style={{ fontSize: 12, color: T.ink3, textDecoration: 'line-through' }}>S/{x.pu}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.primary, fontFamily: T.display }}>S/{x.pm}</div>
              </div>
              <button style={{ width: 44, height: 44, borderRadius: 12, background: T.primary, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, color: '#fff' }}>
                +
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
