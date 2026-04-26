import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, BtnPrimary } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { useCart } from '../../context/CartContext';

const volumes = [
  { vol: '5 m³', price: 375, sub: 'Volquete chico' },
  { vol: '10 m³', price: 750, sub: 'Volquete estándar' },
  { vol: '15 m³', price: 1125, sub: 'Volquete grande' },
];

export function ScreenDetail({ theme: T }) {
  const navigate = useNavigate();
  const location = useLocation();
  const producto = location.state?.producto;
  const { agregar } = useCart();
  const [volIdx, setVolIdx] = useState(1);
  const [qty, setQty] = useState(1);
  const [agregado, setAgregado] = useState(false);

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  function handleAgregar() {
    if (producto) {
      agregar(producto, qty);
    }
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 15, color: T.ink3, marginBottom: 20, fontFamily: T.body }}>← Volver</button>

        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Product image */}
          <div style={{ background: T.primarySoft, borderRadius: 24, padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.line}` }}>
            <ProductIcon kind={producto?.tipo || 'arena'} size={160} theme={T}/>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Badge theme={T} tone="primary">AGREGADO</Badge>
              <Badge theme={T} tone="ok">EN STOCK</Badge>
            </div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: T.ink, fontFamily: T.display, lineHeight: 1.1 }}>
              {producto?.nombre || 'Arena gruesa lavada'}
            </h1>
            <div style={{ fontSize: 14, color: T.ink3, marginTop: 8 }}>
              {producto?.descripcion || 'Origen: Río Lurín · Granulometría: 0–5mm'}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 20 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{fmt(producto?.precio_unitario || 75)}</div>
              <div style={{ fontSize: 15, color: T.ink3 }}>/ {producto?.unidad || 'm³'} · IGV incluido</div>
            </div>

            {/* Volume selector */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2, marginBottom: 10 }}>Elige volumen de viaje</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {volumes.map((o, i) => (
                  <div key={i} onClick={() => setVolIdx(i)} style={{
                    background: volIdx === i ? T.primary : '#fff',
                    color: volIdx === i ? '#fff' : T.ink,
                    borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    border: `2px solid ${volIdx === i ? T.primary : T.line}`, cursor: 'pointer',
                    minWidth: 100,
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.display }}>{o.vol}</div>
                    <div style={{ fontSize: 10, opacity: .75, marginTop: 2 }}>{o.sub}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: volIdx === i ? '#fff' : T.accent }}>{fmt(o.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${T.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 44, border: 'none', background: T.bg, cursor: 'pointer', fontSize: 20, color: T.ink }}>−</button>
                <div style={{ width: 52, textAlign: 'center', fontWeight: 800, fontSize: 16, color: T.ink, fontFamily: T.display }}>{qty}</div>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 44, border: 'none', background: T.bg, cursor: 'pointer', fontSize: 20, color: T.ink }}>+</button>
              </div>
              <button onClick={handleAgregar} style={{
                flex: 1, padding: '14px 24px', background: agregado ? T.ok : T.accent,
                color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16,
                cursor: 'pointer', fontFamily: T.display, transition: 'background .2s',
              }}>
                {agregado ? '✓ Agregado al carrito' : `Agregar · ${fmt(volumes[volIdx].price * qty)}`}
              </button>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 28 }}>
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.line}`, padding: 16, display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>🚛</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Despacho en 24-48h</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>Lima · Envío gratis +S/500</div>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${T.line}`, padding: 16, display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>🛡️</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Garantía de calidad</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>Devolución si no cumple</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
