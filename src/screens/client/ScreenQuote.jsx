import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
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
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      <div style={{ background: T.primary, padding: '32px 0 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>Herramienta</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: T.display }}>Cotizador de obra</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginTop: 6 }}>Calculamos las cantidades y precios para tu proyecto</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          {/* Left: inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 16 }}>Tipo de elemento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {elementTypes.map((x, i) => {
                  const Ic = I[x.i];
                  return (
                    <div key={i} style={{ background: x.sel ? T.primary : T.bg, border: `2px solid ${x.sel ? T.primary : T.line}`, borderRadius: 14, padding: 16, cursor: 'pointer' }}>
                      {Ic && <Ic size={20} color={x.sel ? '#fff' : T.ink2}/>}
                      <div style={{ fontSize: 15, fontWeight: 700, color: x.sel ? '#fff' : T.ink, marginTop: 8 }}>{x.l}</div>
                      <div style={{ fontSize: 12, color: x.sel ? 'rgba(255,255,255,.75)' : T.ink3, marginTop: 2 }}>{x.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 16 }}>Dimensiones de columna</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {dims.map((x, i) => (
                  <div key={i} style={{ border: `2px solid ${T.line}`, borderRadius: 12, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase' }}>{x.l}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{x.v}</div>
                      <div style={{ fontSize: 13, color: T.ink3 }}>{x.u}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '12px 16px', background: T.bg, borderRadius: 12, border: `1px solid ${T.line}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink2 }}># de columnas iguales</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>−</button>
                  <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 900, fontSize: 18, fontFamily: T.display, color: T.ink }}>8</div>
                  <button style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div style={{ position: 'sticky', top: 72 }}>
            <div style={{ background: T.ink, borderRadius: 20, padding: 24, color: '#fff' }}>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Materiales estimados</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.map((x, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                    <ProductIcon kind={x.k} size={40} theme={T}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{x.n}</div>
                      <div style={{ fontSize: 12, opacity: .6, marginTop: 2 }}>{x.q}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, fontFamily: T.display }}>{x.p}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.15)' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Total estimado</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: T.accent, fontFamily: T.display }}>S/2,718</div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
                  Guardar
                </button>
                <button onClick={() => navigate('/cliente/checkout')} style={{ flex: 2, padding: '12px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
                  Agregar todo al pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
