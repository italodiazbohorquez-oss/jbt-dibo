import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductIcon } from '../../components/ProductIcon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { crearPedido } from '../../lib/api';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Logos de pago ───────────────────────────────────────────
function LogoYape() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#6B2FA5,#9B4DCA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L4 8.5V15.5L12 21L20 15.5V8.5L12 3Z" fill="white" fillOpacity="0.3"/>
        <path d="M9 8L12 13L15 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="13" x2="12" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
function LogoBCP() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#E8521A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 11, fontFamily: 'Arial', letterSpacing: '-.5px' }}>BCP</span>
    </div>
  );
}
function LogoVisa() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#1A1F71', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 1 }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: 10, fontFamily: 'Arial', letterSpacing: '-.3px' }}>VISA</span>
    </div>
  );
}
function LogoCash() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
      💵
    </div>
  );
}

const PAY_METHODS = [
  { id: 'yape',          l: 'Yape',           sub: 'QR · al instante',   Logo: LogoYape  },
  { id: 'transferencia', l: 'Transferencia',   sub: 'BCP / Interbank',    Logo: LogoBCP   },
  { id: 'tarjeta',       l: 'Tarjeta',         sub: 'Visa / Mastercard',  Logo: LogoVisa  },
  { id: 'contraentrega', l: 'Contra entrega',  sub: 'Efectivo al chofer', Logo: LogoCash  },
];

const FRANJAS = [
  { id: 'manana', l: '7:00 AM – 1:00 PM',  icon: '🌅' },
  { id: 'tarde',  l: '2:00 PM – 5:00 PM',   icon: '☀️' },
];

// Devuelve fecha mínima (mañana, saltando domingo)
function minFecha() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // si mañana es domingo → lunes
  return d.toISOString().slice(0, 10);
}

// Fecha máxima: 14 días hábiles adelante
function maxFecha() {
  const d = new Date();
  d.setDate(d.getDate() + 20);
  return d.toISOString().slice(0, 10);
}

export function ScreenCheckout({ theme: T }) {
  const navigate = useNavigate();
  const { items, total, vaciar, actualizarCantidad, quitar } = useCart();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();

  const [metodo, setMetodo] = useState('yape');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [fecha, setFecha] = useState(minFecha);
  const [franja, setFranja] = useState('manana');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });
  const totalConDespacho = total >= 500 ? total : total + 50;

  // eslint-disable-next-line no-unused-vars
  async function detectarUbicacion() {
    if (!navigator.geolocation) { setGpsError('Tu dispositivo no soporta GPS'); return; }
    setGpsLoading(true); setGpsError('');
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,  // usa GPS del dispositivo, no IP
          timeout: 15000,
          maximumAge: 0,             // siempre fresco, sin caché
        })
      );
      const { latitude, longitude, accuracy } = pos.coords;
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es-PE,es' } }
      );
      const geo = await resp.json();
      const a = geo.address || {};
      const calle = [a.road, a.house_number].filter(Boolean).join(' ');
      const zona  = a.suburb || a.neighbourhood || a.quarter || a.village || '';
      const dist  = a.city_district || a.district || a.municipality || a.town || a.city || '';
      const partes = [calle, zona, dist].filter(Boolean);
      const direccionDetectada = partes.join(', ') || geo.display_name?.split(',').slice(0, 3).join(', ') || '';
      setDireccion(direccionDetectada);
      // Aviso si la precisión es baja (> 100m)
      if (accuracy > 100) {
        setGpsError(`Precisión aproximada: ±${Math.round(accuracy)}m. Verifica o corrige la dirección.`);
      }
    } catch (e) {
      if (e.code === 1) setGpsError('Permiso de ubicación denegado. Actívalo en la configuración de tu navegador.');
      else if (e.code === 2) setGpsError('No se pudo obtener la ubicación. Verifica que el GPS esté activo.');
      else setGpsError('Tiempo de espera agotado. Intenta de nuevo o escribe la dirección manualmente.');
    } finally { setGpsLoading(false); }
  }

  function handleConfirmar() {
    if (!user || items.length === 0) return;
    if (!direccion.trim()) { setError('Ingresa la dirección de entrega para continuar.'); return; }
    setError(null);
    setShowConfirm(true);
  }

  async function handleProceder() {
    setLoading(true); setError(null); setShowConfirm(false);

    const cartItems = items.map(i => ({
      producto_id: i.producto_id || null,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      subtotal: i.subtotal,
    }));

    const franjaLabel = FRANJAS.find(f => f.id === franja)?.l;
    const direccionCompleta = [
      direccion.trim(),
      referencia.trim() ? `Ref: ${referencia.trim()}` : null,
      `Horario: ${franjaLabel}`,
    ].filter(Boolean).join(' · ');

    const { data: pedido, error: err } = await crearPedido({
      clienteId: user.id,
      items: cartItems,
      direccion: direccionCompleta,
      metodoPago: metodo,
      fechaEntrega: fecha,
    });

    setLoading(false);
    if (err) {
      setError(`Error: ${err.message || err.details || JSON.stringify(err)}`);
      return;
    }
    vaciar();
    navigate('/cliente/pedidos', { state: { nuevoPedido: pedido } });
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

  const fmtFecha = (d) => d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body, paddingBottom: isMobile ? 80 : 0 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px 14px' : '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 16 : 28 }}>
          <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: T.ink3, fontSize: 20 }}>←</button>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Confirmar pedido</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? 14 : 24, alignItems: 'start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Dirección ─────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>📍 Dirección de entrega</div>

              {/* GPS button */}
              <button
                onClick={detectarUbicacion}
                disabled={gpsLoading}
                style={{
                  width: '100%', padding: '10px 14px', marginBottom: 10,
                  border: `1.5px dashed ${T.primary}`, borderRadius: 10,
                  background: T.primarySoft, cursor: gpsLoading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 13, fontWeight: 700, color: T.primary, fontFamily: T.body,
                }}
              >
                <span>{gpsLoading ? '📡' : '🎯'}</span>
                {gpsLoading ? 'Detectando ubicación...' : 'Usar mi ubicación actual (GPS)'}
              </button>
              {gpsError && <div style={{ fontSize: 12, color: T.danger, marginBottom: 8, fontWeight: 600 }}>{gpsError}</div>}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1, height: 1, background: T.line }}/>
                <span style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>O escribe la dirección</span>
                <div style={{ flex: 1, height: 1, background: T.line }}/>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 5 }}>
                  Dirección completa <span style={{ color: T.danger }}>*</span>
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Los Álamos 342, Villa El Salvador"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: `1.5px solid ${!direccion && error ? T.danger : T.line}`,
                    fontSize: 14, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 5 }}>Referencia (opcional)</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                  placeholder="Ej: Portón azul, frente a la bodega"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 14, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* ── Fecha de entrega ──────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>📅 ¿Cuándo deseas recibirlo?</div>

              {/* Calendario desplegable */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 6 }}>Fecha de entrega</label>
                <input
                  type="date"
                  value={fecha}
                  min={minFecha()}
                  max={maxFecha()}
                  onChange={e => {
                    if (!e.target.value) return;
                    // Si elige domingo, avanzar al lunes automáticamente
                    const d = new Date(e.target.value + 'T12:00:00');
                    if (d.getDay() === 0) {
                      d.setDate(d.getDate() + 1);
                      setFecha(d.toISOString().slice(0, 10));
                    } else {
                      setFecha(e.target.value);
                    }
                  }}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: `1.5px solid ${T.primary}`, fontSize: 15,
                    fontFamily: T.body, color: T.ink, outline: 'none',
                    boxSizing: 'border-box', cursor: 'pointer',
                    background: T.primarySoft,
                  }}
                />
                {fecha && (
                  <div style={{ fontSize: 12, color: T.primary, fontWeight: 600, marginTop: 5 }}>
                    {new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 4 }}>Lunes a sábado · Los domingos no hay despacho</div>
              </div>

              {/* Franjas horarias: solo 2 */}
              <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 8 }}>Franja horaria</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {FRANJAS.map((f) => (
                  <button key={f.id} onClick={() => setFranja(f.id)} style={{
                    padding: '14px 10px', borderRadius: 12,
                    border: `2px solid ${franja === f.id ? T.accent : T.line}`,
                    background: franja === f.id ? T.accentSoft : '#fff',
                    cursor: 'pointer', textAlign: 'center', fontFamily: T.body,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: franja === f.id ? T.accent : T.ink }}>{f.l}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Productos ────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>
                🧱 Tu pedido ({items.length} {items.length === 1 ? 'producto' : 'productos'})
              </div>
              {items.map((x, i, arr) => (
                <div key={x.producto_id ?? x.nombre} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ProductIcon kind={x.tipo} size={isMobile ? 40 : 52} theme={T}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.nombre}</div>
                      <div style={{ fontSize: 12, color: T.ink3 }}>{x.unidad} · {fmt(x.precio_unitario)} c/u</div>
                    </div>
                    <button onClick={() => quitar(x.producto_id ?? x.nombre)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: T.ink3, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingLeft: isMobile ? 52 : 64 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.bg, borderRadius: 8, padding: '4px 10px', border: `1px solid ${T.line}` }}>
                      <button onClick={() => x.cantidad <= 1 ? quitar(x.producto_id ?? x.nombre) : actualizarCantidad(x.producto_id ?? x.nombre, x.cantidad - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: T.ink, fontWeight: 700, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: 15, fontWeight: 700, color: T.ink, minWidth: 28, textAlign: 'center' }}>{x.cantidad}</span>
                      <button onClick={() => actualizarCantidad(x.producto_id ?? x.nombre, x.cantidad + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: T.ink, fontWeight: 700, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(x.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Método de pago ───────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>💳 Método de pago</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 10 }}>
                {PAY_METHODS.map(({ id, l, sub, Logo }) => {
                  const sel = metodo === id;
                  return (
                    <div key={id} onClick={() => setMetodo(id)} style={{
                      border: `2px solid ${sel ? T.primary : T.line}`, borderRadius: 12, padding: 14,
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      background: sel ? T.primarySoft : '#fff', transition: 'all .15s',
                    }}>
                      <Logo/>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: sel ? T.primary : T.ink }}>{l}</div>
                        <div style={{ fontSize: 11, color: T.ink3 }}>{sub}</div>
                      </div>
                      {sel && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>✓</div>}
                    </div>
                  );
                })}
              </div>

              {metodo === 'yape' && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#F5EDFF', borderRadius: 10, fontSize: 13, color: '#4A1A7A', fontWeight: 600 }}>
                  📱 Envía el pago al <strong>965 432 100</strong> · Titular: JBT DIBO<br/>
                  <span style={{ fontWeight: 400 }}>Adjunta el comprobante por WhatsApp al confirmar.</span>
                </div>
              )}
              {metodo === 'transferencia' && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#FFF3ED', borderRadius: 10, fontSize: 13, color: '#7A3910', fontWeight: 600 }}>
                  🏦 <strong>BCP</strong> · Cta: 193-2841567-0-88<br/>
                  CCI: 002-193-002841567088-17 · Titular: JBT DIBO S.A.C.
                </div>
              )}
              {metodo === 'contraentrega' && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: '#E6F4EA', borderRadius: 10, fontSize: 13, color: '#1A6B3A', fontWeight: 600 }}>
                  ✓ El conductor cobrará al momento de la entrega. Ten el monto exacto listo.
                </div>
              )}
            </div>
          </div>

          {/* Right column — resumen */}
          <div style={isMobile ? {} : { position: 'sticky', top: 72 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
              <div style={{ background: T.primary, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>JB</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: T.display }}>JBT DIBO S.A.C</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>RUC: 20615017770</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Pedido</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ padding: 20 }}>
                {/* Resumen entrega */}
                <div style={{ padding: '10px 12px', background: T.bg, borderRadius: 10, marginBottom: 14, fontSize: 12 }}>
                  {direccion ? (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span>📍</span>
                      <span style={{ color: T.ink, fontWeight: 600 }}>{direccion.slice(0, 45)}{direccion.length > 45 ? '...' : ''}</span>
                    </div>
                  ) : (
                    <div style={{ color: T.danger, fontWeight: 600 }}>⚠️ Falta dirección de entrega</div>
                  )}
                  <div style={{ display: 'flex', gap: 6, color: T.ink3 }}>
                    <span>📅</span>
                    <span>
                      {fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'}
                      {' · '}{FRANJAS.find(f => f.id === franja)?.l}
                    </span>
                  </div>
                </div>

                {profile && (
                  <div style={{ fontSize: 13, color: T.ink3, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${T.line}` }}>
                    Cliente: <strong style={{ color: T.ink }}>{profile.nombre}</strong>
                  </div>
                )}

                {items.map(x => (
                  <div key={x.producto_id ?? x.nombre} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.ink2, padding: '4px 0' }}>
                    <span style={{ flex: 1, marginRight: 8 }}>{x.nombre} ×{x.cantidad}</span>
                    <span style={{ fontWeight: 600, color: T.ink }}>{fmt(x.subtotal)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: T.line, margin: '12px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600, color: T.ink }}>{fmt(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>Despacho</span>
                  <span style={{ fontWeight: 600, color: total >= 500 ? T.ok : T.ink }}>{total >= 500 ? 'Gratis' : fmt(50)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.ink2, padding: '4px 0' }}>
                  <span>IGV (18%)</span><span style={{ fontWeight: 600, color: T.ink }}>Incluido</span>
                </div>
                <div style={{ height: 2, background: T.line, margin: '12px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Total</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{fmt(totalConDespacho)}</span>
                </div>

                {total < 500 && (
                  <div style={{ background: T.accentSoft, borderRadius: 10, padding: '10px 12px', marginTop: 12, fontSize: 12, color: T.accentDark, fontWeight: 600 }}>
                    Agrega {fmt(500 - total)} más para despacho gratis
                  </div>
                )}
                {error && (
                  <div style={{ background: '#FCE7E2', borderRadius: 10, padding: '10px 12px', marginTop: 12, fontSize: 13, color: '#C0392B', fontWeight: 600 }}>{error}</div>
                )}

                <button onClick={handleConfirmar} disabled={loading} style={{
                  width: '100%', marginTop: 20, padding: '14px',
                  background: loading ? T.ink3 : T.accent, color: '#fff',
                  border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.display,
                }}>
                  {loading ? 'Registrando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420, fontFamily: T.body }}>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>🧱</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, textAlign: 'center', fontFamily: T.display, marginBottom: 6 }}>¿Confirmar pedido?</div>
            <div style={{ fontSize: 13, color: T.ink3, textAlign: 'center', marginBottom: 20 }}>
              Tu pedido por <strong style={{ color: T.ink }}>{fmt(totalConDespacho)}</strong> será enviado a JBT DIBO para su procesamiento.
            </div>
            <div style={{ background: T.bg, borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13 }}>
              {items.map(x => (
                <div key={x.producto_id ?? x.nombre} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: T.ink2 }}>
                  <span>{x.nombre} ×{x.cantidad}</span>
                  <span style={{ fontWeight: 700, color: T.ink }}>{fmt(x.subtotal)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: T.ink }}>
                <span>Total</span><span>{fmt(totalConDespacho)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: `1.5px solid ${T.line}`, background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: T.ink3, fontFamily: T.body }}>
                Volver
              </button>
              <button onClick={handleProceder} style={{ flex: 2, padding: '13px 0', borderRadius: 12, border: 'none', background: T.accent, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: T.display }}>
                Sí, confirmar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra inferior fija en móvil */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 60, left: 0, right: 0, zIndex: 40,
          background: '#fff', borderTop: `1px solid ${T.line}`,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 -4px 20px rgba(0,0,0,.08)',
        }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{fmt(totalConDespacho)}</div>
          </div>
          <button onClick={handleConfirmar} disabled={loading} style={{
            flex: 1, padding: '14px',
            background: loading ? T.ink3 : T.accent, color: '#fff',
            border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.display,
          }}>
            {loading ? 'Registrando...' : 'Confirmar pedido'}
          </button>
        </div>
      )}
    </div>
  );
}
