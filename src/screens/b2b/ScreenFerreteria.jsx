import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { TabBar } from '../client/TabBar';

const quickActions = [
  { i: 'refresh', l: 'Repetir pedido', sub: 'Últimos 30d' },
  { i: 'doc', l: 'Facturas', sub: '3 pendientes' },
  { i: 'chart', l: 'Mis compras', sub: 'Reportes' },
];

const mayorista = [
  { k: 'cemento', n: 'Cemento Sol 42.5kg', pm: 23, pu: 28, min: '50 bolsas' },
  { k: 'ladrillo', n: 'Ladrillo KK 18h', pm: 0.95, pu: 1.2, min: '1000 und' },
  { k: 'fierro', n: 'Fierro 1/2" x 9m', pm: 32, pu: 38, min: '20 varillas' },
  { k: 'arena', n: 'Arena gruesa', pm: 62, pu: 75, min: '10 m³' },
];

export function ScreenFerreteria({ theme: T }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ background: T.ink, padding: '14px 16px 18px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, opacity: .65, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Ferretería</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: T.display, marginTop: 2 }}>Ferretería El Sol · Surco</div>
          </div>
          <Badge theme={T} tone="accent">B2B</Badge>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`, borderRadius: 14, padding: 14, marginTop: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: .75, letterSpacing: '.06em', textTransform: 'uppercase' }}>Línea de crédito</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 24, fontWeight: 800, fontFamily: T.display, color: '#fff' }}>S/8,420</span>
            <span style={{ fontSize: 12, opacity: .7 }}>de S/15,000</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '56%', background: T.accent, borderRadius: 4 }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, opacity: .75 }}>
            <span>Disponible</span>
            <span>Vence 15 May · 30 días</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {quickActions.map((x, i) => {
            const Ic = I[x.i];
            return (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: 10, cursor: 'pointer' }}>
                <Ic size={18} color={T.primary}/>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginTop: 6 }}>{x.l}</div>
                <div style={{ fontSize: 10, color: T.ink3 }}>{x.sub}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Precio mayorista</div>
          <Badge theme={T} tone="primary">−18%</Badge>
        </div>

        {mayorista.map((x, i) => (
          <div key={i} style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.line}`, padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProductIcon kind={x.k} size={44} theme={T}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{x.n}</div>
              <div style={{ fontSize: 10, color: T.ink3, marginTop: 2 }}>Mín. {x.min}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: T.ink3, textDecoration: 'line-through' }}>S/{x.pu}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.primary, fontFamily: T.display }}>S/{x.pm}</div>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: T.primary, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <I.plus size={16} color="#fff"/>
            </button>
          </div>
        ))}
      </div>

      <TabBar active="home" T={T}/>
    </div>
  );
}
