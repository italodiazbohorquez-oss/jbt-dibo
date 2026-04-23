import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Chip, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';

function Stat({ T, label, value, delta, tone = 'ok', icon }) {
  const Ic = I[icon];
  return (
    <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 16, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600 }}>{label}</div>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ic size={16} color={T.primary}/>
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, fontFamily: T.display, marginTop: 10, letterSpacing: '-.02em' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <span style={{ fontSize: 11, color: tone === 'ok' ? T.ok : T.danger, fontWeight: 700 }}>{delta}</span>
        <span style={{ fontSize: 11, color: T.ink3 }}>vs semana pasada</span>
      </div>
    </div>
  );
}

const recentOrders = [
  { id: 'JBT-2041', n: 'Constructora Vega', k: 'arena', v: 'S/750', st: 'En ruta', tn: 'accent' },
  { id: 'JBT-2040', n: 'Ferretería El Sol', k: 'cemento', v: 'S/1,150', st: 'Cargando', tn: 'warn' },
  { id: 'JBT-2039', n: 'Maestro L. Huamán', k: 'piedra', v: 'S/880', st: 'Confirmado', tn: 'primary' },
  { id: 'JBT-2038', n: 'Obra Las Flores', k: 'fierro', v: 'S/2,280', st: 'Entregado', tn: 'ok' },
  { id: 'JBT-2037', n: 'Edificaciones R&R', k: 'ladrillo', v: 'S/1,920', st: 'Entregado', tn: 'ok' },
];

const stockCritical = [
  { k: 'cemento', n: 'Cemento Sol 42.5kg', pct: 12, q: '42 / 350 bolsas', c: null, crit: true },
  { k: 'fierro', n: 'Fierro 1/2"', pct: 28, q: '112 / 400 varillas', c: '#E5B100', crit: false },
  { k: 'arena', n: 'Arena gruesa', pct: 68, q: '27 / 40 m³', c: null, ok: true },
];

const barData = [62, 48, 85, 72, 94, 58, 78];
const barDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function AdminDashboard({ theme: T }) {
  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Panel general</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>Buen día, José</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: T.chip, borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 260 }}>
              <I.search size={16} color={T.ink3}/>
              <span style={{ fontSize: 13, color: T.ink3 }}>Buscar pedido, cliente, producto...</span>
            </div>
            <BtnPrimary theme={T} icon={I.plus}>Nuevo pedido</BtnPrimary>
          </div>
        </div>

        <div style={{ padding: 28, flex: 1 }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <Stat T={T} label="Ventas hoy" value="S/12,840" delta="+18%" icon="wallet"/>
            <Stat T={T} label="Pedidos activos" value="23" delta="+4" icon="doc"/>
            <Stat T={T} label="Volquetes en ruta" value="5 / 8" delta="On-time 94%" icon="truck"/>
            <Stat T={T} label="Tu comisión (mes)" value="S/3,420" delta="+22%" icon="chart"/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginTop: 14 }}>
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Ventas últimos 7 días</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>Total S/78,240</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['7D', '30D', '90D'].map((p, i) => (
                    <Chip key={p} theme={T} active={i === 0} style={{ padding: '6px 12px', fontSize: 11 }}>{p}</Chip>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '0 10px' }}>
                {barData.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: i === 4 ? T.accent : T.ink3 }}>{Math.round(h * 180)}</div>
                    <div style={{ width: '100%', height: h + '%', background: i === 4 ? T.accent : T.primarySoft, borderRadius: '8px 8px 0 0' }}/>
                    <div style={{ fontSize: 10, color: T.ink3, fontWeight: 600 }}>{barDays[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Pedidos recientes</div>
                <span style={{ fontSize: 12, color: T.accent, fontWeight: 700, cursor: 'pointer' }}>Ver todos</span>
              </div>
              {recentOrders.map((o, i, arr) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                  <ProductIcon kind={o.k} size={34} theme={T}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.n}</div>
                    <div style={{ fontSize: 10, color: T.ink3, fontFamily: T.mono }}>{o.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{o.v}</div>
                    <Badge theme={T} tone={o.tn} style={{ fontSize: 9, padding: '2px 6px' }}>{o.st}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Stock crítico</div>
                <Badge theme={T} tone="danger">3 bajo mínimo</Badge>
              </div>
              {stockCritical.map((s, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? `1px solid ${T.line2}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <ProductIcon kind={s.k} size={28} theme={T}/>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.ink }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: T.ink3, fontFamily: T.mono }}>{s.q}</div>
                  </div>
                  <div style={{ height: 5, background: T.chip, borderRadius: 3 }}>
                    <div style={{ height: '100%', width: s.pct + '%', background: s.crit ? T.danger : s.ok ? T.ok : '#E5B100', borderRadius: 3 }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display, marginBottom: 12 }}>Caja diaria</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#E6F4EA', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: T.ok, fontWeight: 700 }}>Ingresos</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.ok, fontFamily: T.display, marginTop: 4 }}>+ S/12,840</div>
                  <div style={{ fontSize: 10, color: T.ink3, marginTop: 2 }}>9 operaciones</div>
                </div>
                <div style={{ background: '#FCE7E2', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: T.danger, fontWeight: 700 }}>Egresos</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.danger, fontFamily: T.display, marginTop: 4 }}>− S/3,280</div>
                  <div style={{ fontSize: 10, color: T.ink3, marginTop: 2 }}>4 operaciones</div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 12, background: T.chip, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>Saldo del día</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display }}>S/9,560</div>
                </div>
                <BtnSecondary theme={T} style={{ fontSize: 12, padding: '8px 12px' }} icon={I.eye}>Ver libro</BtnSecondary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
