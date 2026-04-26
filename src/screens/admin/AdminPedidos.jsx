import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';
import { getPedidos, actualizarEstadoPedido } from '../../lib/api';

const ESTADO_BADGE = {
  pendiente: 'neutral', confirmado: 'primary', cargando: 'warn',
  en_ruta: 'accent', entregado: 'ok', cancelado: 'danger',
};
const ESTADO_LABEL = {
  pendiente: 'Pendiente', confirmado: 'Confirmado', cargando: 'Cargando',
  en_ruta: 'En ruta', entregado: 'Entregado', cancelado: 'Cancelado',
};

const NEXT_ESTADO = {
  pendiente: 'confirmado',
  confirmado: 'cargando',
  cargando: 'en_ruta',
  en_ruta: 'entregado',
};
const NEXT_LABEL = {
  pendiente: 'Confirmar',
  confirmado: 'Cargar',
  cargando: 'Despachar',
  en_ruta: 'Entregar',
};

const FILTROS = ['todos', 'pendiente', 'confirmado', 'cargando', 'en_ruta', 'entregado'];
const FILTRO_LABEL = { todos: 'Todos', ...ESTADO_LABEL };

export function AdminPedidos({ theme: T }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await getPedidos({ limite: 50 });
    setPedidos(data);
    setLoading(false);
  }

  async function avanzarEstado(pedido) {
    const next = NEXT_ESTADO[pedido.estado];
    if (!next) return;
    setUpdating(pedido.id);
    const { data } = await actualizarEstadoPedido(pedido.id, next);
    if (data) {
      setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, estado: next } : p));
      if (selected?.id === pedido.id) setSelected({ ...selected, estado: next });
    }
    setUpdating(null);
  }

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  const filtrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.estado === filtro);

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Gestión</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>Todos los pedidos</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <BtnSecondary theme={T} icon={I.refresh} onClick={load}>Actualizar</BtnSecondary>
            <BtnPrimary theme={T} icon={I.plus}>Nuevo pedido</BtnPrimary>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, padding: '12px 28px', borderBottom: `1px solid ${T.line}`, background: T.surface, overflowX: 'auto', flexShrink: 0 }}>
          {FILTROS.map(f => {
            const count = f === 'todos' ? pedidos.length : pedidos.filter(p => p.estado === f).length;
            return (
              <button key={f} onClick={() => setFiltro(f)} style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                background: filtro === f ? T.primary : T.chip,
                color: filtro === f ? '#fff' : T.ink3,
              }}>
                {FILTRO_LABEL[f]} {count > 0 && <span style={{ opacity: .75 }}>({count})</span>}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', overflow: 'hidden' }}>
          <div style={{ overflowY: 'auto' }}>
            {loading && (
              <div style={{ padding: 40, textAlign: 'center', color: T.ink3, fontSize: 13 }}>Cargando pedidos...</div>
            )}
            {!loading && filtrados.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: T.ink3, fontSize: 13 }}>
                Sin pedidos {filtro !== 'todos' ? `con estado "${ESTADO_LABEL[filtro]}"` : ''}
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.line}` }}>
                  {['Pedido', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha', 'Acción'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', background: T.bg }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => {
                  const primerItem = p.pedido_items?.[0];
                  const kind = primerItem?.productos?.tipo || 'arena';
                  const isSelected = selected?.id === p.id;
                  return (
                    <tr key={p.id} onClick={() => setSelected(isSelected ? null : p)}
                      style={{ borderBottom: `1px solid ${T.line2}`, background: isSelected ? T.primarySoft : 'transparent', cursor: 'pointer', transition: 'background .1s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.ink }}>{p.numero}</div>
                        <div style={{ fontSize: 10, color: T.ink3, marginTop: 2 }}>
                          {new Date(p.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: T.ink }}>
                        {p.profiles?.nombre || p.profiles?.empresa || 'Cliente'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ProductIcon kind={kind} size={28} theme={T}/>
                          <div>
                            <div style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{primerItem?.productos?.nombre || '—'}</div>
                            {p.pedido_items?.length > 1 && <div style={{ fontSize: 10, color: T.ink3 }}>+{p.pedido_items.length - 1} más</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: T.display, fontSize: 13, fontWeight: 800, color: T.ink }}>
                        {fmt(p.total)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge theme={T} tone={ESTADO_BADGE[p.estado] || 'neutral'}>{ESTADO_LABEL[p.estado] || p.estado}</Badge>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: T.ink3 }}>
                        {p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        {NEXT_ESTADO[p.estado] && (
                          <button onClick={() => avanzarEstado(p)} disabled={updating === p.id}
                            style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: updating === p.id ? .6 : 1 }}>
                            {updating === p.id ? '...' : NEXT_LABEL[p.estado]}
                          </button>
                        )}
                        {p.estado === 'entregado' && <span style={{ fontSize: 11, color: T.ok, fontWeight: 700 }}>✓ Completado</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected && (
            <div style={{ borderLeft: `1px solid ${T.line}`, background: T.surface, overflowY: 'auto', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Detalle del pedido</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <I.x size={18} color={T.ink3}/>
                </button>
              </div>

              <div style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 4 }}>{selected.numero}</div>
              <Badge theme={T} tone={ESTADO_BADGE[selected.estado] || 'neutral'} style={{ marginBottom: 16 }}>{ESTADO_LABEL[selected.estado]}</Badge>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Cliente</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{selected.profiles?.nombre || 'Cliente'}</div>
                {selected.profiles?.empresa && <div style={{ fontSize: 11, color: T.ink3 }}>{selected.profiles.empresa}</div>}
              </div>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Entrega</div>
                <div style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{selected.direccion_entrega}</div>
                {selected.fecha_entrega && (
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
                    {new Date(selected.fecha_entrega).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Productos</div>
                {selected.pedido_items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.line2}` }}>
                    <ProductIcon kind={item.productos?.tipo || 'arena'} size={32} theme={T}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{item.productos?.nombre || '—'}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{item.cantidad} {item.productos?.unidad}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: T.ink2 }}>Método de pago</span>
                  <span style={{ fontWeight: 700, color: T.ink }}>{selected.metodo_pago || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, marginTop: 8 }}>
                  <span style={{ color: T.ink, fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(selected.total)}</span>
                </div>
              </div>

              {NEXT_ESTADO[selected.estado] && (
                <button onClick={() => avanzarEstado(selected)} disabled={updating === selected.id}
                  style={{ width: '100%', padding: '12px 0', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', opacity: updating === selected.id ? .6 : 1 }}>
                  {updating === selected.id ? 'Actualizando...' : `→ ${NEXT_LABEL[selected.estado]}`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
