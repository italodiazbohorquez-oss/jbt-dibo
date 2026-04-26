import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';

const ESTADO_STEPS = ['pendiente', 'confirmado', 'cargando', 'en_ruta', 'entregado'];
const STEP_LABELS = ['Recibido', 'Confirmado', 'Cargando', 'En camino', 'Entregado'];
const STEP_DESC = [
  'Tu pedido fue recibido y está siendo revisado',
  'Pedido confirmado, preparando materiales',
  'Materiales siendo cargados al volquete',
  'El volquete está en camino a tu obra',
  'Entrega completada',
];

export function ScreenTracking({ theme: T }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido;

  const stepIdx = pedido ? ESTADO_STEPS.indexOf(pedido.estado) : 3;
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  if (!pedido) {
    return (
      <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: 24 }}>
          <div style={{ fontSize: 48 }}>📦</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, marginTop: 16, fontFamily: T.display }}>Sin pedido seleccionado</div>
          <div style={{ fontSize: 14, color: T.ink3, marginTop: 8 }}>Ve a "Mis pedidos" y selecciona uno para rastrearlo</div>
          <button onClick={() => navigate('/cliente/pedidos')} style={{ marginTop: 24, padding: '12px 28px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  const isEnRoute = pedido.estado === 'en_ruta';
  const isEntregado = pedido.estado === 'entregado';

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      {/* Map visual */}
      <div style={{ height: 300, background: isEntregado ? '#D9E7D9' : '#D9E7DB', position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="mapgrid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 H40 M20 0 V40" stroke={isEntregado ? '#A9CDA9' : '#B9CDB9'} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid2)"/>
          <path d="M0 80 Q200 110 400 90 T900 120" stroke="#fff" strokeWidth="16" fill="none"/>
          <path d="M100 0 V80 Q180 200 360 260 T600 300" stroke="#fff" strokeWidth="14" fill="none"/>
          {!isEntregado && (
            <path d="M80 30 Q250 80 410 130 Q530 170 545 260" stroke={T.accent} strokeWidth="4" strokeDasharray="8 5" fill="none"/>
          )}
        </svg>
        {/* Origin dot */}
        <div style={{ position: 'absolute', top: 38, left: 78, width: 16, height: 16, borderRadius: '50%', background: T.primary, border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}/>
        {/* Truck / checkmark */}
        {isEntregado ? (
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 64, height: 64, borderRadius: '50%', background: T.ok, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,.25)', border: '4px solid #fff', fontSize: 28 }}>✓</div>
        ) : (
          <div style={{ position: 'absolute', top: '40%', left: isEnRoute ? '55%' : '35%', transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.3)', border: '3px solid #fff' }}>
              <I.truck size={24} color="#fff"/>
            </div>
          </div>
        )}
        {/* Destination dot */}
        <div style={{ position: 'absolute', top: '75%', left: '62%', width: 20, height: 20, borderRadius: '50%', background: '#fff', border: `3px solid ${T.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary }}/>
        </div>
        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 16, left: 16, width: 42, height: 42, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)', cursor: 'pointer', fontSize: 18 }}>←</button>
      </div>

      {/* Info panel */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
        {/* Status header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Badge theme={T} tone={isEntregado ? 'ok' : isEnRoute ? 'accent' : 'primary'}>
                {isEntregado ? '✓ ENTREGADO' : isEnRoute ? '🚛 EN CAMINO' : STEP_LABELS[stepIdx]?.toUpperCase()}
              </Badge>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: T.ink, fontFamily: T.display, lineHeight: 1.2 }}>
              {isEntregado ? '¡Entrega completada!' : isEnRoute ? `En camino a tu obra` : STEP_DESC[stepIdx]}
            </div>
            <div style={{ fontSize: 14, color: T.ink3, marginTop: 6 }}>
              Pedido {pedido.numero} · {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 20 }}>
            <div style={{ fontSize: 12, color: T.ink3, marginBottom: 4 }}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: T.ink, fontFamily: T.display }}>{fmt(pedido.total)}</div>
          </div>
        </div>

        {/* Progress bar */}
        {!isEntregado && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1px solid ${T.line}`, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {STEP_LABELS.map((label, i) => {
                const done = i <= stepIdx;
                const isCurrent = i === stepIdx;
                return (
                  <div key={i} style={{ flex: 1, position: 'relative' }}>
                    <div style={{ height: 5, background: done ? T.accent : T.line, borderRadius: 2, marginRight: i < 4 ? 3 : 0, transition: 'background .3s' }}/>
                    <div style={{ fontSize: 11, fontWeight: done ? 700 : 400, color: done ? T.ink : T.ink3, marginTop: 6, transition: 'color .3s' }}>{label}</div>
                    {isCurrent && (
                      <div style={{ position: 'absolute', top: -3, right: 3, width: 11, height: 11, borderRadius: '50%', background: T.accent, border: '2px solid #fff', boxShadow: '0 0 0 2px ' + T.accent }}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>Productos del pedido</div>
          {pedido.pedido_items?.map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>
                {item.productos?.nombre || item.nombre}
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: T.ink3 }}>
                <span>{item.cantidad} {item.productos?.unidad || item.unidad}</span>
                <span style={{ fontWeight: 700, color: T.ink }}>{fmt(item.subtotal)}</span>
              </div>
            </div>
          ))}
          {(!pedido.pedido_items || pedido.pedido_items.length === 0) && (
            <div style={{ fontSize: 13, color: T.ink3 }}>Sin detalle de productos</div>
          )}
        </div>

        {/* Delivery info */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, marginTop: 2 }}>📍</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Dirección de entrega</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{pedido.direccion_entrega}</div>
            </div>
          </div>
        </div>

        {/* Driver contact — only when en_ruta */}
        {isEnRoute && (
          <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, fontFamily: T.display, flexShrink: 0 }}>
              {pedido.choferes?.nombre?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{pedido.choferes?.nombre || 'Conductor asignado'}</div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>
                {pedido.choferes?.placa && <span>Placa: <strong style={{ color: T.ink }}>{pedido.choferes.placa}</strong></span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {pedido.choferes?.telefono && (
                <>
                  <a href={`https://wa.me/51${pedido.choferes.telefono}`} target="_blank" rel="noreferrer">
                    <button style={{ width: 46, height: 46, borderRadius: '50%', background: '#25D366', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22 }}>💬</button>
                  </a>
                  <a href={`tel:${pedido.choferes.telefono}`}>
                    <button style={{ width: 46, height: 46, borderRadius: '50%', background: T.primary, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22 }}>📞</button>
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
