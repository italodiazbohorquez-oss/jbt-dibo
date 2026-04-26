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
  const { items, total, vaciar } = useCart();
  const { user } = useAuth();
  const [metodo, setMetodo] = useState('yape');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.bg, padding: 32 }}>
        <I.cart size={48} color={T.ink3}/>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginTop: 12 }}>Tu carrito está vacío</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4, textAlign: 'center' }}>Agrega productos desde la pantalla principal</div>
        <button onClick={() => navigate('/cliente/home')} style={{ marginTop: 20, padding: '10px 24px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, background: T.surface, borderBottom: `1px solid ${T.line}`, flexShrink: 0 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <I.chevL size={20} color={T.ink}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Confirmar pedido</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 90px' }}>
        <div style={{ background: T.surface, borderRadius: 14, padding: 12, border: `1px solid ${T.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.pin size={18} color={T.primary}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Entregar en Obra Las Flores</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>Mz B Lt 14, Villa El Salvador · Ref. portón azul</div>
            </div>
            <I.chevR size={18} color={T.ink3}/>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 14, padding: 12, border: `1px solid ${T.line}`, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.cal size={18} color={T.accentDark}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>
              Mañana · {new Date(Date.now() + 86400000).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ fontSize: 11, color: T.ink3 }}>Ventana: 8:00 AM – 12:00 PM</div>
          </div>
          <I.chevR size={18} color={T.ink3}/>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Tu pedido ({items.length} {items.length === 1 ? 'producto' : 'productos'})
        </div>
        <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, marginTop: 8 }}>
          {items.map((x, i, arr) => (
            <div key={x.producto_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
              <ProductIcon kind={x.tipo} size={44} theme={T}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{x.nombre}</div>
                <div style={{ fontSize: 11, color: T.ink3 }}>{x.cantidad} {x.unidad}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(x.subtotal)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Método de pago</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {PAY_METHODS.map((m, i) => {
            const sel = metodo === m.id;
            const bgColor = m.color || [T.primary, T.ink, T.accent, T.ok][i];
            return (
              <div key={m.id} onClick={() => setMetodo(m.id)}
                style={{ background: T.surface, border: `1.5px solid ${sel ? T.primary : T.line}`, borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: bgColor, color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: T.display }}>{m.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{m.l}</div>
                  <div style={{ fontSize: 10, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
                </div>
                {sel && <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.check size={10} color="#fff"/></div>}
              </div>
            );
          })}
        </div>

        <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 12, marginTop: 16, overflow: 'hidden' }}>
          {/* Encabezado comprobante */}
          <div style={{ background: T.primarySoft, borderRadius: 10, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 11, fontFamily: T.display }}>JB</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.primary, fontFamily: T.display }}>JBT DIBO S.A.C</div>
              <div style={{ fontSize: 10, color: T.ink3, fontFamily: T.mono }}>RUC: 20615017770</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, color: T.ink3, textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>Boleta de venta</div>
              <div>{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: T.ink2 }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 700, color: T.ink }}>{fmt(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: T.ink2 }}>
            <span>Despacho</span>
            <span style={{ fontWeight: 700, color: total >= 500 ? T.ok : T.ink }}>{total >= 500 ? 'Gratis' : fmt(50)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: T.ink2 }}>
            <span>IGV (18%)</span>
            <span style={{ fontWeight: 700, color: T.ink }}>Incluido</span>
          </div>
          <div style={{ height: 1, background: T.line, margin: '8px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Total a pagar</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(total >= 500 ? total : total + 50)}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FCE7E2', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 13, color: T.danger, fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px 14px', background: T.surface, borderTop: `1px solid ${T.line}`, flexShrink: 0 }}>
        <BtnPrimary theme={T} full icon={loading ? null : I.shield} onClick={handleConfirmar} disabled={loading}>
          {loading ? 'Registrando pedido...' : `Confirmar pedido · ${fmt(total >= 500 ? total : total + 50)}`}
        </BtnPrimary>
      </div>
    </div>
  );
}
