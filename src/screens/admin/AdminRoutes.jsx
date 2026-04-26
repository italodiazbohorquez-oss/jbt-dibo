import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { BtnPrimary, Badge } from '../../components/UI';
import { AdminSidebar } from './AdminSidebar';
import { getChoferes, getRutasHoy } from '../../lib/api';

const ESTADO_CH = {
  en_ruta: { tn: 'accent', label: 'En ruta' },
  cargando: { tn: 'warn', label: 'Cargando' },
  libre: { tn: 'neutral', label: 'Libre' },
  retornando: { tn: 'primary', label: 'Retornando' },
};

export function AdminRoutes({ theme: T }) {
  const [choferes, setChoferes] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function load() {
      const [chRes, rtRes] = await Promise.all([getChoferes(), getRutasHoy()]);
      setChoferes(chRes.data);
      setRutas(rtRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const enRuta = choferes.filter(c => c.estado === 'en_ruta').length;
  const hoy = new Date().toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

  const listaDisplay = choferes.map(ch => {
    const ruta = rutas.find(r => r.choferes?.id === ch.id || r.chofer_id === ch.id);
    return { ...ch, ruta };
  });

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Despacho</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>
              Rutas del día · {hoy}
            </div>
          </div>
          <BtnPrimary theme={T} icon={I.route}>Planificar ruta</BtnPrimary>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', overflow: 'hidden' }}>
          <div style={{ borderRight: `1px solid ${T.line}`, overflowY: 'auto', background: T.surface }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Volquetes · {choferes.length} registrados
              </div>
              <Badge theme={T} tone="accent">{enRuta} en ruta</Badge>
            </div>

            {loading && <div style={{ padding: 24, textAlign: 'center', color: T.ink3, fontSize: 13 }}>Cargando choferes...</div>}

            {listaDisplay.map((ch, i) => {
              const est = ESTADO_CH[ch.estado] || { tn: 'neutral', label: ch.estado || 'Libre' };
              const isActive = active === i;
              return (
                <div key={ch.id} onClick={() => setActive(i)}
                  style={{ padding: 14, borderBottom: `1px solid ${T.line2}`, background: isActive ? T.primarySoft : 'transparent', borderLeft: `3px solid ${isActive ? T.primary : 'transparent'}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ background: T.ink, color: '#FFCC00', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 800, fontFamily: T.mono }}>
                      {ch.placa || '???'}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, flex: 1 }}>{ch.nombre}</div>
                    <Badge theme={T} tone={est.tn}>{est.label}</Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink2 }}>
                    <I.pin size={14} color={T.ink3}/>
                    <span style={{ flex: 1 }}>
                      {ch.ruta?.pedidos?.direccion_entrega?.slice(0, 30) || 'Sin ruta asignada'}
                    </span>
                  </div>
                  {ch.ruta?.pedidos?.numero && (
                    <div style={{ fontSize: 11, color: T.ink3, marginTop: 4, fontFamily: T.mono }}>
                      Pedido {ch.ruta.pedidos.numero}
                    </div>
                  )}
                  {ch.celular && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <button style={{ padding: '4px 10px', borderRadius: 8, background: '#25D366', border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <I.whatsapp size={12} color="#fff"/> WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {!loading && choferes.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: T.ink3, fontSize: 13 }}>
                No hay choferes registrados
              </div>
            )}
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

            {choferes.filter(c => c.estado === 'en_ruta').slice(0, 2).map((ch, i) => (
              <div key={ch.id} style={{ position: 'absolute', left: i === 0 ? 380 : 540, top: i === 0 ? 260 : 510 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: i === 0 ? T.accent : T.primary, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I.truck size={20} color="#fff"/>
                </div>
                <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: T.mono, color: T.ink, whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,.1)' }}>
                  {ch.placa}
                </div>
              </div>
            ))}

            <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', borderRadius: 12, padding: 14, minWidth: 220, boxShadow: '0 4px 16px rgba(0,0,0,.1)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Resumen del día</div>
              {[
                { l: 'Choferes activos', v: String(enRuta), c: T.ok },
                { l: 'Total choferes', v: String(choferes.length), c: T.ink },
                { l: 'Rutas hoy', v: String(rutas.length), c: T.ink },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: T.ink2 }}>{r.l}</span>
                  <span style={{ fontWeight: 800, color: r.c, fontFamily: T.display }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
