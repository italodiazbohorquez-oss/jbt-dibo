import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Chip, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';
import { getKPIs, getPedidos, getStock } from '../../lib/api';

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

const ESTADO_BADGE = {
  en_ruta: 'accent', cargando: 'warn', confirmado: 'primary',
  entregado: 'ok', pendiente: 'neutral', cancelado: 'danger',
};
const ESTADO_LABEL = {
  en_ruta: 'En ruta', cargando: 'Cargando', confirmado: 'Confirmado',
  entregado: 'Entregado', pendiente: 'Pendiente', cancelado: 'Cancelado',
};

export function AdminDashboard({ theme: T }) {
  const [kpis, setKpis] = useState({ ventasHoy: 0, pedidosActivos: 0, choferes: { enRuta: 0, total: 0 } });
  const [pedidos, setPedidos] = useState([]);
  const [stockCrit, setStockCrit] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      const [kRes, pRes, sRes] = await Promise.all([getKPIs(), getPedidos({ limite: 5 }), getStock()]);
      setKpis(kRes);
      setPedidos(pRes.data);
      setStockCrit(sRes.data.filter(p => p.stock_actual <= p.stock_minimo).slice(0, 3));
      setLoadingData(false);
    }
    load();
  }, []);

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

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
            <Stat T={T} label="Ventas hoy" value={fmt(kpis.ventasHoy)} delta="en tiempo real" icon="wallet"/>
            <Stat T={T} label="Pedidos activos" value={String(kpis.pedidosActivos)} delta="confirmados + en ruta" icon="doc"/>
            <Stat T={T} label="Volquetes en ruta" value={`${kpis.choferes.enRuta} / ${kpis.choferes.total}`} delta="activos hoy" icon="truck"/>
            <Stat T={T} label="Tu comisión (mes)" value={fmt(kpis.ventasHoy * 0.05)} delta="0.05% sobre ventas" icon="chart"/>
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
              {loadingData && <div style={{ fontSize: 13, color: T.ink3, padding: '20px 0', textAlign: 'center' }}>Cargando...</div>}
              {pedidos.map((o, i, arr) => {
                const primerItem = o.pedido_items?.[0];
                const kind = primerItem?.productos?.tipo || 'arena';
                return (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                    <ProductIcon kind={kind} size={34} theme={T}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.profiles?.nombre || o.profiles?.empresa || 'Cliente'}</div>
                      <div style={{ fontSize: 10, color: T.ink3, fontFamily: T.mono }}>{o.numero}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(o.total)}</div>
                      <Badge theme={T} tone={ESTADO_BADGE[o.estado] || 'neutral'} style={{ fontSize: 9, padding: '2px 6px' }}>{ESTADO_LABEL[o.estado] || o.estado}</Badge>
                    </div>
                  </div>
                );
              })}
              {!loadingData && pedidos.length === 0 && (
                <div style={{ fontSize: 13, color: T.ink3, padding: '20px 0', textAlign: 'center' }}>Sin pedidos aún</div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Stock crítico</div>
                <Badge theme={T} tone="danger">3 bajo mínimo</Badge>
              </div>
              {stockCrit.length === 0 && !loadingData && (
                <div style={{ fontSize: 13, color: T.ok, padding: '20px 0', textAlign: 'center' }}>✓ Todo el stock en niveles normales</div>
              )}
              {stockCrit.map((s, i) => {
                const pct = Math.min(100, (s.stock_actual / s.stock_minimo) * 100);
                const color = pct < 20 ? T.danger : pct < 60 ? '#E5B100' : T.ok;
                return (
                  <div key={s.id} style={{ padding: '10px 0', borderBottom: i < stockCrit.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <ProductIcon kind={s.tipo} size={28} theme={T}/>
                      <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.ink }}>{s.nombre}</div>
                      <div style={{ fontSize: 11, color: T.ink3, fontFamily: T.mono }}>{s.stock_actual} / {s.stock_minimo} {s.unidad}</div>
                    </div>
                    <div style={{ height: 5, background: T.chip, borderRadius: 3 }}>
                      <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: 3 }}/>
                    </div>
                  </div>
                );
              })}
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
