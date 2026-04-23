import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';

const elementTypes = [
  { l: 'Cimiento', sub: 'Zapatas / vigas', sel: false, i: 'brick' },
  { l: 'Columna', sub: 'Vertical estructural', sel: true, i: 'layers' },
  { l: 'Losa', sub: 'Aligerada / maciza', sel: false, i: 'box' },
  { l: 'Muro', sub: 'Ladrillo + mortero', sel: false, i: 'brick' },
];

const dims = [
  { l: 'Ancho', v: '0.30', u: 'm' },
  { l: 'Largo', v: '0.30', u: 'm' },
  { l: 'Alto', v: '2.80', u: 'm' },
];

const results = [
  { k: 'cemento', n: 'Cemento Sol 42.5kg', q: '26 bolsas', p: 'S/728' },
  { k: 'arena', n: 'Arena gruesa', q: '0.8 m³', p: 'S/60' },
  { k: 'piedra', n: 'Piedra chancada 1/2"', q: '1.2 m³', p: 'S/106' },
  { k: 'fierro', n: 'Fierro 1/2" corrugado', q: '48 varillas', p: 'S/1,824' },
];

export function ScreenQuote({ theme: T }) {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ background: T.primary, padding: '14px 16px 24px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            <I.chevL size={20} color="#fff"/>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Cotizar por obra</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: T.display, letterSpacing: '-.02em', lineHeight: 1.2 }}>¿Cuánto material necesitas?</div>
        <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>Te calculamos cantidades y precios para tu obra.</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        <div style={{ marginTop: -8, background: T.surface, borderRadius: 16, padding: 14, border: `1px solid ${T.line}`, boxShadow: '0 4px 12px -8px rgba(0,0,0,.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Tipo de elemento</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            {elementTypes.map((x, i) => {
              const Ic = I[x.i];
              return (
                <div key={i} style={{ background: x.sel ? T.primary : T.surface, border: `1.5px solid ${x.sel ? T.primary : T.line}`, borderRadius: 12, padding: 12, cursor: 'pointer' }}>
                  <Ic size={18} color={x.sel ? '#fff' : T.ink2}/>
                  <div style={{ fontSize: 14, fontWeight: 700, color: x.sel ? '#fff' : T.ink, marginTop: 6 }}>{x.l}</div>
                  <div style={{ fontSize: 11, color: x.sel ? 'rgba(255,255,255,.75)' : T.ink3, marginTop: 1 }}>{x.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 16, padding: 14, border: `1px solid ${T.line}`, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Dimensiones de columna</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
            {dims.map((x, i) => (
              <div key={i} style={{ border: `1.5px solid ${T.line}`, borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: T.ink3, fontWeight: 600 }}>{x.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{x.v}</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>{x.u}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '10px 12px', background: T.chip, borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink2 }}># de columnas iguales</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={{ width: 26, height: 26, borderRadius: 6, background: T.surface, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><I.minus size={13} color={T.ink}/></button>
              <div style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, fontFamily: T.display }}>8</div>
              <button style={{ width: 26, height: 26, borderRadius: 6, background: T.surface, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><I.plus size={13} color={T.ink}/></button>
            </div>
          </div>
        </div>

        <div style={{ background: T.ink, borderRadius: 16, padding: 16, marginTop: 14, color: '#fff' }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.08em' }}>Materiales estimados</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((x, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8, borderBottom: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                <ProductIcon kind={x.k} size={34} theme={T}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{x.n}</div>
                  <div style={{ fontSize: 11, opacity: .7 }}>{x.q}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, fontFamily: T.display }}>{x.p}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.15)' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Total estimado</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, fontFamily: T.display }}>S/2,718</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 14px', background: T.surface, borderTop: `1px solid ${T.line}`, display: 'flex', gap: 10, flexShrink: 0 }}>
        <BtnSecondary theme={T} icon={I.save}>Guardar</BtnSecondary>
        <BtnPrimary theme={T} full style={{ flex: 1 }} icon={I.cart}
          onClick={() => navigate('/cliente/checkout')}>Agregar todo al pedido</BtnPrimary>
      </div>
    </div>
  );
}
