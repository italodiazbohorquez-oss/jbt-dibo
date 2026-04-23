import { I } from '../../components/Icons';
import { BtnPrimary, Badge } from '../../components/UI';
import { AdminSidebar } from './AdminSidebar';

const trucks = [
  { p: 'AQG-472', ch: 'Manuel Castro', st: 'En ruta', tn: 'accent', pd: 'JBT-2041', dest: 'Obra Las Flores · VES', eta: '18 min', active: true },
  { p: 'BNY-103', ch: 'Luis Mendoza', st: 'Cargando', tn: 'warn', pd: 'JBT-2040', dest: 'Ferretería El Sol · Surco', eta: 'Sale 11:30', active: false },
  { p: 'AXC-889', ch: 'Raúl Quispe', st: 'En ruta', tn: 'accent', pd: 'JBT-2039', dest: 'Obra Piérola · SJM', eta: '42 min', active: false },
  { p: 'CLM-215', ch: 'Diego Pérez', st: 'Retornando', tn: 'primary', pd: '—', dest: 'Planta Lurín', eta: '25 min', active: false },
  { p: 'BTG-507', ch: 'Víctor Ríos', st: 'Libre', tn: 'neutral', pd: '—', dest: 'Disponible 14:00', eta: '—', active: false },
];

export function AdminRoutes({ theme: T }) {
  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Despacho</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>Rutas del día · Mie 22 Abr</div>
          </div>
          <BtnPrimary theme={T} icon={I.route}>Planificar ruta</BtnPrimary>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', overflow: 'hidden' }}>
          <div style={{ borderRight: `1px solid ${T.line}`, overflowY: 'auto', background: T.surface }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.line}`, fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em' }}>Volquetes · 8 asignados</div>
            {trucks.map((r, i) => (
              <div key={i} style={{ padding: 14, borderBottom: `1px solid ${T.line2}`, background: r.active ? T.primarySoft : 'transparent', borderLeft: `3px solid ${r.active ? T.primary : 'transparent'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ background: T.ink, color: '#FFCC00', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 800, fontFamily: T.mono }}>{r.p}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, flex: 1 }}>{r.ch}</div>
                  <Badge theme={T} tone={r.tn}>{r.st}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink2 }}>
                  <I.pin size={14} color={T.ink3}/>
                  <span style={{ flex: 1 }}>{r.dest}</span>
                  <span style={{ fontWeight: 700, color: T.ink }}>{r.eta}</span>
                </div>
                {r.pd !== '—' && (
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 4, fontFamily: T.mono }}>Pedido {r.pd}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: '#D9E7DB', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="amap" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M0 25 H50 M25 0 V50" stroke="#BBCFBC" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#amap)"/>
              <path d="M0 300 Q200 280 400 310 T800 340" stroke="#fff" strokeWidth="18" fill="none"/>
              <path d="M0 500 L900 480" stroke="#fff" strokeWidth="14" fill="none"/>
              <path d="M250 0 L290 600" stroke="#fff" strokeWidth="12" fill="none"/>
              <path d="M600 0 L620 600" stroke="#fff" strokeWidth="14" fill="none"/>
              <path d="M140 400 Q230 350 290 310 Q400 260 520 280" stroke={T.accent} strokeWidth="4" strokeDasharray="8 5" fill="none"/>
              <path d="M140 400 Q200 460 290 460 L290 540 L620 540" stroke={T.primary} strokeWidth="4" strokeDasharray="8 5" fill="none"/>
            </svg>

            <div style={{ position: 'absolute', left: 110, top: 370, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: T.ink, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.box size={22} color={T.accent}/>
              </div>
              <div style={{ background: T.ink, color: '#fff', padding: '3px 8px', borderRadius: 4, marginTop: 6, fontSize: 10, fontWeight: 700 }}>PLANTA LURÍN</div>
            </div>

            <div style={{ position: 'absolute', left: 380, top: 260 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.accent, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.truck size={20} color="#fff"/>
              </div>
              <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: T.mono, color: T.ink, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,.1)' }}>AQG-472</div>
            </div>

            <div style={{ position: 'absolute', left: 540, top: 510 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.primary, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.truck size={20} color="#fff"/>
              </div>
              <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: T.mono, color: T.ink, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,.1)' }}>AXC-889</div>
            </div>

            <div style={{ position: 'absolute', left: 515, top: 270, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `4px solid ${T.accent}` }}/>
            <div style={{ position: 'absolute', left: 615, top: 525, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `4px solid ${T.primary}` }}/>

            <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', borderRadius: 12, padding: 14, minWidth: 220, boxShadow: '0 4px 16px rgba(0,0,0,.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Resumen del día</div>
              {[
                { l: 'Viajes programados', v: '14', c: T.ink },
                { l: 'Completados', v: '9', c: T.ok },
                { l: 'm³ despachados', v: '185 m³', c: T.ink },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: T.ink2 }}>{r.l}</span>
                  <span style={{ fontWeight: 800, color: r.c, fontFamily: T.display }}>{r.v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: T.line, margin: '10px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: T.ink2, fontWeight: 700 }}>Revenue</span>
                <span style={{ fontWeight: 800, color: T.accent, fontFamily: T.display }}>S/12,840</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
