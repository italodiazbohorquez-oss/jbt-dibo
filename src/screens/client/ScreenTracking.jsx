import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';

export function ScreenTracking({ theme: T }) {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ height: 280, background: '#D9E7DB', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 H40 M20 0 V40" stroke="#B9CDB9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)"/>
          <path d="M0 80 Q100 110 180 90 T360 120" stroke="#fff" strokeWidth="14" fill="none"/>
          <path d="M40 0 V80 Q80 140 160 180 T280 280" stroke="#fff" strokeWidth="12" fill="none"/>
          <path d="M40 30 Q120 60 180 90 Q240 120 250 180" stroke={T.accent} strokeWidth="3.5" strokeDasharray="6 4" fill="none"/>
        </svg>
        <div style={{ position: 'absolute', top: 22, left: 34, width: 14, height: 14, borderRadius: '50%', background: T.primary, border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}/>
        <div style={{ position: 'absolute', top: 95, left: 145, transform: 'translate(-50%,-50%)' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,.25)', border: '3px solid #fff' }}>
            <I.truck size={20} color="#fff"/>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 175, left: 240, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: `3px solid ${T.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.primary }}/>
        </div>
        <div onClick={() => navigate(-1)} style={{ position: 'absolute', top: 12, left: 12, width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)', cursor: 'pointer' }}>
          <I.chevL size={18} color={T.ink}/>
        </div>
      </div>

      <div style={{ flex: 1, background: T.surface, borderRadius: '20px 20px 0 0', marginTop: -20, padding: '16px 18px', position: 'relative', overflowY: 'auto' }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: T.line, margin: '0 auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Badge theme={T} tone="accent">EN CAMINO</Badge>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, marginTop: 6, letterSpacing: '-.02em' }}>Llega en 18 min</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Pedido #JBT-2041 · 10 m³ arena gruesa</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: T.ink3 }}>Placa</div>
            <div style={{ background: T.ink, color: '#FFCC00', padding: '4px 8px', borderRadius: 6, fontSize: 13, fontWeight: 800, fontFamily: T.mono, marginTop: 2 }}>AQG-472</div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 0 }}>
          {['Confirmado', 'Cargado', 'En ruta', 'Entregado'].map((s, i) => (
            <div key={i} style={{ flex: 1, position: 'relative' }}>
              <div style={{ height: 4, background: i <= 2 ? T.accent : T.line, borderRadius: 2 }}/>
              <div style={{ fontSize: 10, fontWeight: 700, color: i <= 2 ? T.ink : T.ink3, marginTop: 6 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ background: T.chip, borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: T.display }}>MC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Manuel Castro</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <I.star size={12} color="#E5B100"/>
              <span style={{ fontSize: 11, color: T.ink2, fontWeight: 600 }}>4.9</span>
              <span style={{ fontSize: 11, color: T.ink3 }}>· 124 entregas</span>
            </div>
          </div>
          <button style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <I.whatsapp size={18} color="#fff"/>
          </button>
          <button style={{ width: 38, height: 38, borderRadius: '50%', background: T.primary, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <I.phone size={18} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}
