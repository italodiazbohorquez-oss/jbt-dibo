import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { BtnPrimary, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';
import { getKPIs, getPedidos, getStock, getVentas7Dias } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ESTADO_BADGE = {
  en_ruta: 'accent', cargando: 'warn', confirmado: 'primary',
  entregado: 'ok', pendiente: 'neutral', cancelado: 'danger',
};
const ESTADO_LABEL = {
  en_ruta: 'En ruta', cargando: 'Cargando', confirmado: 'Confirmado',
  entregado: 'Entregado', pendiente: 'Pendiente', cancelado: 'Cancelado',
};

function Stat({ T, label, value, sub, icon, highlight }) {
  const Ic = I[icon];
  return (
    <div style={{ background: highlight ? T.primary : T.surface, borderRadius: 14, border: `1px solid ${highlight ? T.primary : T.line}`, padding: 18, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: highlight ? 'rgba(255,255,255,.75)' : T.ink3, fontWeight: 600 }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: highlight ? 'rgba(255,255,255,.2)' : T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ic size={17} color={highlight ? '#fff' : T.primary}/>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: highlight ? '#fff' : T.ink, fontFamily: T.display, marginTop: 10, letterSpacing: '-.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: highlight ? 'rgba(255,255,255,.7)' : T.ink3, marginTop: 4, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

function BarChart({ T, data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  const fmt = (n) => n >= 1000 ? 'S/' + (n / 1000).toFixed(1) + 'k' : 'S/' + n;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 4px' }}>
      {data.map((d, i) => {
        const h = Math.max(4, (d.total / max) * 100);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            {d.total > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: d.isToday ? T.accent : T.ink3 }}>{fmt(d.total)}</div>}
            {!d.total && <div style={{ fontSize: 9, color: T.line }}> </div>}
            <div style={{ width: '100%', height: h + '%', background: d.isToday ? T.accent : T.primarySoft, borderRadius: '6px 6px 0 0', minHeight: 4 }}/>
            <div style={{ fontSize: 10, color: d.isToday ? T.accent : T.ink3, fontWeight: d.isToday ? 800 : 600 }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminDashboard({ theme: T }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState({ ventasHoy: 0, pedidosActivos: 0, choferes: { enRuta: 0, total: 0 }, stockCritico: 0 });
  const [pedidos, setPedidos] = useState([]);
  const [stockCrit, setStockCrit] = useState([]);
  const [ventas7, setVentas7] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    const [kRes, pRes, sRes, v7Res] = await Promise.all([
      getKPIs(), getPedidos({ limite: 6 }), getStock(), getVentas7Dias(),
    ]);
    setKpis(kRes);
    setPedidos(pRes.data || []);
    setStockCrit((sRes.data || []).filter(p => p.stock_minimo != null && p.stock_actual <= p.stock_minimo));
    setVentas7(v7Res);
    setLastUpdate(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });
  const totalVentas7 = ventas7.reduce((s, d) => s + d.total, 0);

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Panel general</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display }}>
              Buen día, {profile?.nombre?.split(' ')[0] || 'Admin'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {lastUpdate && (
              <div style={{ fontSize: 11, color: T.ink3 }}>
                Actualizado {lastUpdate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <button onClick={load} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.refresh size={16} color={T.ink3}/>
            </button>
            <BtnPrimary theme={T} icon={I.plus} onClick={() => navigate('/admin/pedidos', { state: { nuevo: true } })}>Nuevo pedido</BtnPrimary>
          </div>
        </div>

        <div style={{ padding: 24, flex: 1 }}>
          {/* KPIs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Stat T={T} label="Ventas hoy" value={fmt(kpis.ventasHoy)} sub="pedidos del día" icon="wallet" highlight/>
            <Stat T={T} label="Pedidos activos" value={String(kpis.pedidosActivos)} sub="confirmado + en ruta" icon="doc"/>
            <Stat T={T} label="Volquetes" value={`${kpis.choferes.enRuta} / ${kpis.choferes.total}`} sub="en ruta hoy" icon="truck"/>
            <Stat T={T} label="Stock crítico" value={String(kpis.stockCritico)} sub="productos bajo mínimo" icon="box"/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 14 }}>
            {/* Gráfico ventas 7 días */}
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Ventas últimos 7 días</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: T.display, marginTop: 2 }}>{fmt(totalVentas7)}</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>total acumulado</div>
                </div>
                <div style={{ background: T.accentSoft, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: T.accentDark }}>
                  En tiempo real
                </div>
              </div>
              {loading ? (
                <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3, fontSize: 13 }}>Cargando...</div>
              ) : (
                <BarChart T={T} data={ventas7}/>
              )}
            </div>

            {/* Pedidos recientes */}
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Pedidos recientes</div>
                <span onClick={() => navigate('/admin/pedidos')} style={{ fontSize: 12, color: T.accent, fontWeight: 700, cursor: 'pointer' }}>Ver todos →</span>
              </div>
              {loading && <div style={{ fontSize: 13, color: T.ink3, padding: '20px 0', textAlign: 'center' }}>Cargando...</div>}
              {!loading && pedidos.length === 0 && (
                <div style={{ fontSize: 13, color: T.ink3, padding: '20px 0', textAlign: 'center' }}>Sin pedidos aún</div>
              )}
              {pedidos.map((o, i, arr) => {
                const kind = o.pedido_items?.[0]?.productos?.tipo || 'arena';
                return (
                  <div key={o.id} onClick={() => navigate('/admin/pedidos')}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none', cursor: 'pointer' }}>
                    <ProductIcon kind={kind} size={32} theme={T}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.profiles?.nombre || 'Cliente'}
                      </div>
                      <div style={{ fontSize: 10, color: T.ink3, fontFamily: T.mono }}>{o.numero}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(o.total)}</div>
                      <Badge theme={T} tone={ESTADO_BADGE[o.estado] || 'neutral'} style={{ fontSize: 9, padding: '2px 6px' }}>
                        {ESTADO_LABEL[o.estado] || o.estado}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Stock crítico */}
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Stock crítico</div>
                {stockCrit.length > 0
                  ? <Badge theme={T} tone="danger">{stockCrit.length} bajo mínimo</Badge>
                  : <Badge theme={T} tone="ok">Todo normal</Badge>}
              </div>
              {!loading && stockCrit.length === 0 && (
                <div style={{ fontSize: 13, color: T.ok, padding: '20px 0', textAlign: 'center', fontWeight: 700 }}>✓ Todos los productos tienen stock suficiente</div>
              )}
              {stockCrit.map((s, i) => {
                const pct = s.stock_minimo > 0 ? Math.min(100, (s.stock_actual / s.stock_minimo) * 100) : 100;
                const color = pct < 20 ? T.danger : pct < 60 ? '#E5B100' : T.ok;
                return (
                  <div key={s.id} style={{ padding: '10px 0', borderBottom: i < stockCrit.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <ProductIcon kind={s.tipo} size={28} theme={T}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{s.nombre}</div>
                        <div style={{ fontSize: 11, color: T.ink3 }}>{s.stock_actual} / {s.stock_minimo} {s.unidad}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, color }}>{Math.round(pct)}%</div>
                    </div>
                    <div style={{ height: 5, background: T.chip, borderRadius: 3 }}>
                      <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: 3, transition: 'width .5s' }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen del día */}
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display, marginBottom: 14 }}>Resumen del día</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#E6F4EA', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.ok, fontWeight: 700, marginBottom: 4 }}>💰 Ventas</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.ok, fontFamily: T.display }}>{fmt(kpis.ventasHoy)}</div>
                  <div style={{ fontSize: 10, color: '#4a7c5e', marginTop: 2 }}>pedidos de hoy</div>
                </div>
                <div style={{ background: T.primarySoft, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.primary, fontWeight: 700, marginBottom: 4 }}>📦 Activos</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.primary, fontFamily: T.display }}>{kpis.pedidosActivos}</div>
                  <div style={{ fontSize: 10, color: T.primary, marginTop: 2 }}>por despachar</div>
                </div>
              </div>
              <div style={{ background: T.chip, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600, marginBottom: 10 }}>Accesos rápidos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { l: '+ Nuevo pedido', path: '/admin/pedidos', state: { nuevo: true }, icon: 'plus' },
                    { l: 'Ver inventario', path: '/admin/inventario', icon: 'box' },
                    { l: 'Gestionar rutas', path: '/admin/rutas', icon: 'truck' },
                  ].map(({ l, path, state, icon }) => {
                    const Ic = I[icon];
                    return (
                      <button key={path} onClick={() => navigate(path, { state })}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, border: `1px solid ${T.line}`, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: T.body }}>
                        <Ic size={15} color={T.primary}/> {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
