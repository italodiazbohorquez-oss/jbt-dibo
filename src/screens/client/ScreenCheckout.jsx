import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { BtnPrimary } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { crearPedido } from '../../lib/api';

const PAY_METHODS = [
  { id: 'yape', l: 'Yape', sub: 'QR · al instante', logo: 'Y', color: '#6B2FA5' },
  { id: 'transferencia', l: 'Transferencia', sub: 'BCP / Interbank', logo: '$', color: null },
  { id: 'tarjeta', l: 'Tarjeta', sub: 'Visa / Mastercard', logo: 'C', color: null },
  { id: 'contraentrega', l: 'Contra entrega', sub: 'Efectivo al chofer', logo: '✓', color: null },
];

export function ScreenCheckout({ theme: T }) {
  const navigate = useNavigate();
  const { items, total, vaciar, actualizarCantidad, quitar } = useCart();
  const { user } = useAuth();
  const [metodo, setMetodo] = useState('yape');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });
  const totalConDespacho = total >= 500 ? total : total + 50;

  async function handleConfirmar() {
    if (!user || items.length === 0) return;
    setLoading(true);
    setError(null);

    const cartItems = items.map(i => ({
      producto_id: i.producto_id,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      subtotal: i.subtotal,
    }));

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const { data, error: err } = await crearPedido({
      clienteId: user.id,
      items: cartItems,
      direccion: 'Obra Las Flores, Mz B Lt 14',
      metodoPago: metodo,
      fechaEntrega: mañana.toISOString().slice(0, 10),
    });

    setLoading(false);
    if (err) { setError('Error al registrar el pedido. Intenta de nuevo.'); return; }
    vaciar();
    navigate('/cliente/pedidos', { state: { nuevoPedido: data } });
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.bg, fontFamily: T.body }}>
        <div style={{ fontSize: 64 }}>🛒</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, marginTop: 16, fontFamily: T.display }}>Tu carrito está vacío</div>
        <div style={{ fontSize: 14, color: T.ink3, marginTop: 8 }}>Agrega productos desde la tienda</div>
        <button onClick={() => navigate('/cliente/home')} style={{ marginTop: 24, padding: '12px 32px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: T.body }}>
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: T.ink3, fontSize: 20 }}>←</button>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Confirmar pedido</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Delivery info */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>Entrega</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Obra Las Flores, Mz B Lt 14</div>
                  <div style={{ fontSize: 12, color: T.ink3 }}>Villa El Salvador · Ref. portón azul</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📅</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>
                    Mañana · {new Date(Date.now() + 86400000).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink3 }}>Ventana: 8:00 AM – 12:00 PM</div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>
                Tu pedido ({items.length} {items.length === 1 ? 'producto' : 'productos'})
              </div>
              {items.map((x, i, arr) => (
                <div key={x.producto_id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                  <ProductIcon kind={x.tipo} size={52} theme={T}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{x.nombre}</div>
                    <div style={{ fontSize: 13, color: T.ink3 }}>{x.unidad} · {fmt(x.precio_unitario)} c/u</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.bg, borderRadius: 8, padding: '4px 8px', border: `1px solid ${T.line}` }}>
                      <button onClick={() => x.cantidad <= 1 ? quitar(x.producto_id) : actualizarCantidad(x.producto_id, x.cantidad - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: T.ink, fontWeight: 700, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.ink, minWidth: 24, textAlign: 'center' }}>{x.cantidad}</span>
                      <button onClick={() => actualizarCantidad(x.producto_id, x.cantidad + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: T.ink, fontWeight: 700, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display, minWidth: 70, textAlign: 'right' }}>{fmt(x.subtotal)}</div>
                    <button onClick={() => quitar(x.producto_id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: T.ink3, fontSize: 18, lineHeight: 1 }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment method */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>Método de pago</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {PAY_METHODS.map((m, i) => {
                  const sel = metodo === m.id;
                  const bgColor = m.color || [T.primary, T.ink, T.accent, T.ok][i];
                  return (
                    <div key={m.id} onClick={() => setMetodo(m.id)} style={{
                      border: `2px solid ${sel ? T.primary : T.line}`, borderRadius: 12, padding: 14,
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      background: sel ? T.primarySoft : '#fff', transition: 'all .15s',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: bgColor, color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{m.logo}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: sel ? T.primary : T.ink }}>{m.l}</div>
                        <div style={{ fontSize: 11, color: T.ink3 }}>{m.sub}</div>
                      </div>
                      {sel && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column — summary */}
          <div style={{ position: 'sticky', top: 72 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
              {/* Receipt header */}
              <div style={{ background: T.primary, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>JB</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: T.display }}>JBT DIBO S.A.C</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>RUC: 20615017770</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Boleta de venta</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ padding: 20 }}>
                {items.map(x => (
                  <div key={x.producto_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.ink2, padding: '4px 0' }}>
                    <span style={{ flex: 1, marginRight: 8 }}>{x.nombre} ×{x.cantidad}</span>
                    <span style={{ fontWeight: 600, color: T.ink }}>{fmt(x.subtotal)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: T.line, margin: '12px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: T.ink }}>{fmt(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>Despacho</span>
                  <span style={{ fontWeight: 600, color: total >= 500 ? T.ok : T.ink }}>{total >= 500 ? 'Gratis' : fmt(50)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>IGV (18%)</span>
                  <span style={{ fontWeight: 600, color: T.ink }}>Incluido</span>
                </div>
                <div style={{ height: 2, background: T.line, margin: '12px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Total</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{fmt(totalConDespacho)}</span>
                </div>

                {total < 500 && (
                  <div style={{ background: T.accentSoft, borderRadius: 10, padding: '10px 12px', marginTop: 12, fontSize: 12, color: T.accentDark, fontWeight: 600 }}>
                    Agrega {fmt(500 - total)} más para despacho gratis
                  </div>
                )}

                {error && (
                  <div style={{ background: '#FCE7E2', borderRadius: 10, padding: '10px 12px', marginTop: 12, fontSize: 13, color: '#C0392B', fontWeight: 600 }}>
                    {error}
                  </div>
                )}

                <button onClick={handleConfirmar} disabled={loading} style={{
                  width: '100%', marginTop: 20, padding: '14px', background: loading ? T.ink3 : T.accent,
                  color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.display,
                }}>
                  {loading ? 'Registrando...' : `Confirmar pedido`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
