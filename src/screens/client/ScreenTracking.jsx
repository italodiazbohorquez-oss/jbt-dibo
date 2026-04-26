import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';

export function ScreenTracking({ theme: T }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      {/* Map area */}
      <div style={{ height: 380, background: '#D9E7DB', position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 H40 M20 0 V40" stroke="#B9CDB9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)"/>
          <path d="M0 80 Q200 110 400 90 T800 120" stroke="#fff" strokeWidth="16" fill="none"/>
          <path d="M100 0 V80 Q160 200 320 280 T560 380" stroke="#fff" strokeWidth="14" fill="none"/>
          <path d="M80 30 Q240 80 380 120 Q500 160 520 280" stroke={T.accent} strokeWidth="4" strokeDasharray="8 5" fill="none"/>
        </svg>
        <div style={{ position: 'absolute', top: 40, left: 80, width: 16, height: 16, borderRadius: '50%', background: T.primary, border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}/>
        <div style={{ position: 'absolute', top: 130, left: 310, transform: 'translate(-50%,-50%)' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.3)', border: '3px solid #fff' }}>
            <I.truck size={24} color="#fff"/>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 260, left: 500, width: 20, height: 20, borderRadius: '50%', background: '#fff', border: `3px solid ${T.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary }}/>
        </div>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 16, left: 16, width: 42, height: 42, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)', cursor: 'pointer' }}>
          ←
        </button>
      </div>

      {/* Info panel */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
          <div>
            <Badge theme={T} tone="accent">EN CAMINO</Badge>
            <div style={{ fontSize: 32, fontWeight: 900, color: T.ink, fontFamily: T.display, marginTop: 10, letterSpacing: '-.02em' }}>Llega en 18 min</div>
            <div style={{ fontSize: 15, color: T.ink3, marginTop: 6 }}>
              {pedido ? `Pedido #${pedido.numero}` : 'Pedido #JBT-2041'} · 10 m³ arena gruesa
            </div>

            <div style={{ display: 'flex', gap: 0, marginTop: 24 }}>
              {['Confirmado', 'Cargado', 'En ruta', 'Entregado'].map((s, i) => (
                <div key={i} style={{ flex: 1, position: 'relative' }}>
                  <div style={{ height: 5, background: i <= 2 ? T.accent : T.line, borderRadius: 2, marginRight: i < 3 ? 3 : 0 }}/>
                  <div style={{ fontSize: 12, fontWeight: i <= 2 ? 700 : 400, color: i <= 2 ? T.ink : T.ink3, marginTop: 6 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: T.ink3, marginBottom: 4 }}>Placa del vehículo</div>
            <div style={{ background: T.ink, color: '#FFCC00', padding: '8px 16px', borderRadius: 8, fontSize: 18, fontWeight: 900, fontFamily: T.mono }}>AQG-472</div>
          </div>
        </div>

        {/* Driver card */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, marginTop: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, fontFamily: T.display, flexShrink: 0 }}>MC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Manuel Castro</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{ color: '#E5B100', fontSize: 16 }}>★</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.ink2 }}>4.9</span>
              <span style={{ fontSize: 13, color: T.ink3 }}>· 124 entregas completadas</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ width: 46, height: 46, borderRadius: '50%', background: '#25D366', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <I.whatsapp size={22} color="#fff"/>
            </button>
            <button style={{ width: 46, height: 46, borderRadius: '50%', background: T.primary, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <I.phone size={22} color="#fff"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
