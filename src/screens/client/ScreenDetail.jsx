import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Badge, BtnPrimary } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';

const volumes = [
  { vol: '5 m³', price: 'S/375', sel: false, sub: 'Volquete chico' },
  { vol: '10 m³', price: 'S/750', sel: true, sub: 'Volquete estándar' },
  { vol: '15 m³', price: 'S/1,125', sel: false, sub: 'Volquete grande' },
];

export function ScreenDetail({ theme: T }) {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: T.surface, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <I.chevL size={18} color={T.ink}/>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[I.heart, I.dots].map((Ic, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: T.surface, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Ic size={16} color={T.ink}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 20px 16px', display: 'flex', justifyContent: 'center', background: T.primarySoft, margin: '0 16px', borderRadius: 18, flexShrink: 0 }}>
        <div style={{ transform: 'scale(2.4)', padding: 30 }}>
          <ProductIcon kind="arena" size={72} theme={T}/>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 80px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <Badge theme={T} tone="primary">AGREGADO</Badge>
          <Badge theme={T} tone="ok">EN STOCK</Badge>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em', lineHeight: 1.1 }}>Arena gruesa lavada</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Origen: Río Lurín · Granulometría: 0–5mm</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: T.ink, fontFamily: T.display }}>S/75</div>
          <div style={{ fontSize: 14, color: T.ink3 }}>/ m³ · IGV incluido</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2, marginBottom: 10 }}>Elige volumen de viaje</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {volumes.map((o, i) => (
              <div key={i} style={{
                background: o.sel ? T.primary : T.surface, color: o.sel ? '#fff' : T.ink,
                borderRadius: 12, padding: '10px 8px', textAlign: 'center',
                border: `1.5px solid ${o.sel ? T.primary : T.line}`, cursor: 'pointer',
              }}>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: T.display }}>{o.vol}</div>
                <div style={{ fontSize: 9, opacity: .7, marginTop: 1 }}>{o.sub}</div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3, color: o.sel ? '#fff' : T.accent }}>{o.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 22, background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.truck size={20} color={T.accentDark}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Despacho en 24-48h</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>Lima Sur · Envío incluido +S/500</div>
            </div>
            <I.chevR size={18} color={T.ink3}/>
          </div>
          <div style={{ height: 1, background: T.line, margin: '12px 0' }}/>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.shield size={20} color={T.primary}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Garantía de material</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>Devolución si no cumple calidad</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 14px', background: T.surface, borderTop: `1px solid ${T.line}`, display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: T.chip, borderRadius: 10, padding: 4 }}>
          <button style={{ width: 30, height: 30, borderRadius: 8, background: T.surface, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><I.minus size={16} color={T.ink}/></button>
          <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 800, color: T.ink, fontFamily: T.display }}>1</div>
          <button style={{ width: 30, height: 30, borderRadius: 8, background: T.surface, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><I.plus size={16} color={T.ink}/></button>
        </div>
        <BtnPrimary theme={T} full style={{ flex: 1 }} icon={I.cart}
          onClick={() => navigate('/cliente/checkout')}>Agregar · S/750</BtnPrimary>
      </div>
    </div>
  );
}
