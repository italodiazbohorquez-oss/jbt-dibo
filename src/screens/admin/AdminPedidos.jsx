import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';
import { getPedidos, actualizarEstadoPedido, crearPedido, getProductos, getChoferes, asignarChoferAPedido, cancelarPedido } from '../../lib/api';
import { supabase } from '../../lib/supabase';

const ESTADO_BADGE  = { pendiente: 'neutral', confirmado: 'primary', cargando: 'warn', en_ruta: 'accent', entregado: 'ok', cancelado: 'danger' };
const ESTADO_LABEL  = { pendiente: 'Pendiente', confirmado: 'Confirmado', cargando: 'Cargando', en_ruta: 'En ruta', entregado: 'Entregado', cancelado: 'Cancelado' };
const NEXT_ESTADO   = { pendiente: 'confirmado', confirmado: 'cargando', cargando: 'en_ruta', en_ruta: 'entregado' };
const NEXT_LABEL    = { pendiente: 'Confirmar', confirmado: 'Cargar', cargando: 'Despachar', en_ruta: 'Entregar' };
const WA_MSG = {
  confirmado: (n) => `✅ Hola! Tu pedido *${n}* de JBT DIBO ha sido *confirmado*. Lo estamos preparando para el despacho. ¡Gracias por tu confianza!`,
  cargando:   (n) => `⏳ Tu pedido *${n}* de JBT DIBO está siendo *cargado* en el vehículo. Pronto saldrá para tu dirección.`,
  en_ruta:    (n) => `🚛 ¡Tu pedido *${n}* de JBT DIBO está *en camino*! El volquete ya está dirigiéndose a tu dirección. Prepárate para recibirlo.`,
  entregado:  (n) => `✅ Tu pedido *${n}* de JBT DIBO ha sido *entregado*. ¡Muchas gracias por elegirnos! Ante cualquier consulta, estamos a tu disposición.`,
};
const FILTROS       = ['todos', 'pendiente', 'confirmado', 'cargando', 'en_ruta', 'entregado'];
const FILTRO_LABEL  = { todos: 'Todos', ...ESTADO_LABEL };

// ── Modal: Nuevo pedido manual ──────────────────────────────
function NuevoPedidoModal({ T, onSave, onClose }) {
  const [productos, setProductos] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodo, setMetodo] = useState('contraentrega');
  const [lineas, setLineas] = useState([{ productoId: '', cantidad: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductos().then(({ data }) => setProductos(data || []));
  }, []);

  const inp = (val, set, ph) => (
    <input
      value={val} onChange={e => set(e.target.value)} placeholder={ph}
      style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box' }}
    />
  );

  function addLinea() { setLineas(prev => [...prev, { productoId: '', cantidad: 1 }]); }
  function removeLinea(i) { setLineas(prev => prev.filter((_, j) => j !== i)); }
  function setLinea(i, key, val) { setLineas(prev => prev.map((l, j) => j === i ? { ...l, [key]: val } : l)); }

  const items = lineas.map(l => {
    const prod = productos.find(p => p.id === l.productoId);
    if (!prod) return null;
    const precio = Number(prod.precio ?? prod.precio_unitario ?? 0);
    const cantidad = Number(l.cantidad) || 1;
    return { producto_id: prod.id, nombre: prod.nombre, cantidad, precio_unitario: precio, subtotal: precio * cantidad };
  }).filter(Boolean);

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  async function handleGuardar() {
    if (!clienteNombre.trim()) { setError('Ingresa el nombre del cliente.'); return; }
    if (!direccion.trim()) { setError('Ingresa la dirección de entrega.'); return; }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return; }
    setLoading(true); setError('');
    const { error: err } = await crearPedido({
      clienteId: null,
      items,
      direccion: `${direccion.trim()} | Cliente: ${clienteNombre.trim()}${clienteTelefono ? ` · Tel: ${clienteTelefono}` : ''}`,
      metodoPago: metodo,
      fechaEntrega: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    });
    setLoading(false);
    if (err) { setError(err.message || 'Error al crear el pedido.'); return; }
    onSave();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', fontFamily: T.body }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Nuevo pedido manual</div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: T.ink3 }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Cliente */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Datos del cliente</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: T.ink3, fontWeight: 600, marginBottom: 4 }}>Nombre *</label>
                {inp(clienteNombre, setClienteNombre, 'Ej: Luis Quispe')}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: T.ink3, fontWeight: 600, marginBottom: 4 }}>Teléfono</label>
                {inp(clienteTelefono, setClienteTelefono, '9XX XXX XXX')}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Dirección de entrega *</label>
            {inp(direccion, setDireccion, 'Av. Los Álamos 342, Villa El Salvador')}
          </div>

          {/* Productos */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Productos *</div>
            {lineas.map((l, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 32px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <select
                  value={l.productoId} onChange={e => setLinea(i, 'productoId', e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', background: '#fff' }}
                >
                  <option value="">Seleccionar...</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} — {fmt(p.precio ?? p.precio_unitario ?? 0)}/{p.unidad}</option>
                  ))}
                </select>
                <input
                  type="number" min="1" value={l.cantidad} onChange={e => setLinea(i, 'cantidad', e.target.value)}
                  style={{ padding: '10px 8px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', textAlign: 'center' }}
                />
                <button onClick={() => removeLinea(i)} style={{ width: 32, height: 38, borderRadius: 8, border: 'none', background: T.chip, cursor: 'pointer', color: T.ink3, fontSize: 16 }}>×</button>
              </div>
            ))}
            <button onClick={addLinea} style={{ padding: '8px 16px', borderRadius: 9, border: `1.5px dashed ${T.line}`, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: T.ink3, fontFamily: T.body }}>
              + Agregar producto
            </button>
          </div>

          {/* Método de pago */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Método de pago</label>
            <select value={metodo} onChange={e => setMetodo(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', background: '#fff' }}>
              {[['contraentrega','Contra entrega'],['yape','Yape'],['transferencia','Transferencia bancaria'],['tarjeta','Tarjeta']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {/* Total preview */}
          {items.length > 0 && (
            <div style={{ background: T.primarySoft, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: T.primary, fontWeight: 600 }}>{items.length} producto{items.length > 1 ? 's' : ''}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.primary, fontFamily: T.display }}>{fmt(total)}</div>
            </div>
          )}

          {error && <div style={{ background: '#FCE7E2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#C0392B', fontWeight: 600 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1.5px solid ${T.line}`, background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: T.ink3 }}>Cancelar</button>
            <button onClick={handleGuardar} disabled={loading} style={{ flex: 2, padding: 12, borderRadius: 10, border: 'none', background: loading ? T.ink3 : T.accent, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.body }}>
              {loading ? 'Creando...' : 'Crear pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pantalla principal ──────────────────────────────────────
export function AdminPedidos({ theme: T }) {
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(location.state?.nuevo === true);
  const [waPending, setWaPending] = useState(null);
  const [choferes, setChoferes] = useState([]);
  const [asignando, setAsignando] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [motivoAdmin, setMotivoAdmin] = useState('');
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    load();
    getChoferes().then(({ data }) => setChoferes(data || []));

    const channel = supabase
      .channel('admin-pedidos')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pedidos',
      }, () => {
        load();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pedidos',
      }, (payload) => {
        setPedidos(prev => prev.map(p =>
          p.id === payload.new.id
            ? { ...p, estado: payload.new.estado, motivo_cancelacion: payload.new.motivo_cancelacion }
            : p
        ));
        setSelected(prev => prev?.id === payload.new.id
          ? { ...prev, estado: payload.new.estado, motivo_cancelacion: payload.new.motivo_cancelacion }
          : prev
        );
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await getPedidos({ limite: 50 });
    if (error) console.error('Error cargando pedidos:', error);
    setPedidos(data);
    setLoading(false);
  }

  async function avanzarEstado(pedido) {
    const next = NEXT_ESTADO[pedido.estado];
    if (!next) return;
    setUpdating(pedido.id);
    const { data } = await actualizarEstadoPedido(pedido.id, next);
    if (data) {
      const updated = { ...pedido, estado: next };
      setPedidos(prev => prev.map(p => p.id === pedido.id ? updated : p));
      if (selected?.id === pedido.id) setSelected(updated);
      const phone = pedido.profiles?.telefono;
      if (phone && WA_MSG[next]) {
        setWaPending({ numero: pedido.numero, phone, estado: next });
      }
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
            <BtnPrimary theme={T} icon={I.plus} onClick={() => setModalNuevo(true)}>Nuevo pedido</BtnPrimary>
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
                {FILTRO_LABEL[f]}{count > 0 ? ` (${count})` : ''}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', overflow: 'hidden' }}>
          <div style={{ overflowY: 'auto' }}>
            {loading && <div style={{ padding: 40, textAlign: 'center', color: T.ink3, fontSize: 13 }}>Cargando pedidos...</div>}
            {!loading && filtrados.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: T.ink3, fontSize: 13 }}>
                Sin pedidos {filtro !== 'todos' ? `con estado "${ESTADO_LABEL[filtro]}"` : ''}
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.line}` }}>
                  {['Pedido', 'Cliente', 'Productos', 'Total', 'Estado', 'Entrega', 'Acción'].map(h => (
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
                    <tr key={p.id} onClick={() => { setSelected(isSelected ? null : p); setWaPending(null); }}
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
                      <td style={{ padding: '12px 16px', fontFamily: T.display, fontSize: 13, fontWeight: 800, color: T.ink }}>{fmt(p.total)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge theme={T} tone={ESTADO_BADGE[p.estado] || 'neutral'}>{ESTADO_LABEL[p.estado] || p.estado}</Badge>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: T.ink3 }}>
                        {p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                        {NEXT_ESTADO[p.estado] ? (
                          <button onClick={() => avanzarEstado(p)} disabled={updating === p.id}
                            style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: updating === p.id ? .6 : 1 }}>
                            {updating === p.id ? '...' : NEXT_LABEL[p.estado]}
                          </button>
                        ) : p.estado === 'entregado' ? (
                          <span style={{ fontSize: 11, color: T.ok, fontWeight: 700 }}>✓ Listo</span>
                        ) : null}
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
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>×</button>
              </div>

              <div style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 4 }}>{selected.numero}</div>
              <Badge theme={T} tone={ESTADO_BADGE[selected.estado] || 'neutral'} style={{ marginBottom: 16 }}>{ESTADO_LABEL[selected.estado]}</Badge>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Cliente</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{selected.profiles?.nombre || 'Cliente'}</div>
                {selected.profiles?.empresa && <div style={{ fontSize: 11, color: T.ink3 }}>{selected.profiles.empresa}</div>}
                {selected.profiles?.telefono && (
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    📱 {selected.profiles.celular}
                  </div>
                )}
              </div>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Dirección de entrega</div>
                <div style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{selected.direccion_entrega}</div>
                {selected.fecha_entrega && (
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 4 }}>
                    {new Date(selected.fecha_entrega).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Productos</div>
                {selected.pedido_items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.line2}` }}>
                    <ProductIcon kind={item.productos?.tipo || 'arena'} size={32} theme={T}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{item.productos?.nombre || item.nombre || '—'}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{item.cantidad} {item.productos?.unidad}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: T.chip, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: T.ink2 }}>Método de pago</span>
                  <span style={{ fontWeight: 700, color: T.ink }}>{selected.metodo_pago || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
                  <span style={{ color: T.ink, fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(selected.total)}</span>
                </div>
              </div>

              {/* Asignar chofer */}
              {['confirmado','cargando','en_ruta'].includes(selected.estado) && (
                <div style={{ marginBottom: 12, background: T.chip, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>🚛 Chofer asignado</div>
                  <select
                    value={selected.chofer_id || ''}
                    disabled={asignando}
                    onChange={async e => {
                      const choferId = e.target.value || null;
                      setAsignando(true);
                      const { data } = await asignarChoferAPedido(selected.id, choferId);
                      if (data) {
                        const chofer = choferes.find(c => c.id === choferId) || null;
                        const updated = { ...selected, chofer_id: choferId, choferes: chofer };
                        setPedidos(prev => prev.map(p => p.id === selected.id ? updated : p));
                        setSelected(updated);
                      }
                      setAsignando(false);
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, background: '#fff', outline: 'none', cursor: 'pointer' }}>
                    <option value="">— Sin chofer —</option>
                    {choferes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} · {c.placa}</option>
                    ))}
                  </select>
                  {selected.choferes?.telefono && (
                    <a href={`https://wa.me/51${selected.choferes.telefono}`} target="_blank" rel="noreferrer"
                      style={{ display: 'block', marginTop: 8, textAlign: 'center', fontSize: 12, color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                      📲 WhatsApp al chofer
                    </a>
                  )}
                </div>
              )}

              {NEXT_ESTADO[selected.estado] && (
                <button onClick={() => avanzarEstado(selected)} disabled={updating === selected.id}
                  style={{ width: '100%', padding: '12px 0', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', opacity: updating === selected.id ? .6 : 1, marginBottom: 8 }}>
                  {updating === selected.id ? 'Actualizando...' : `→ ${NEXT_LABEL[selected.estado]}`}
                </button>
              )}

              {!['cancelado','entregado'].includes(selected.estado) && (
                <button onClick={() => { setCancelModal(true); setMotivoAdmin(''); }}
                  style={{ width: '100%', padding: '10px 0', background: '#fff', color: T.danger, border: `1.5px solid ${T.danger}`, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Cancelar pedido
                </button>
              )}

              {selected.motivo_cancelacion && (
                <div style={{ marginTop: 8, background: '#FEF2F2', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#991B1B' }}>
                  Motivo cancelación: {selected.motivo_cancelacion}
                </div>
              )}

              {waPending && waPending.numero === selected.numero && (
                <div style={{ marginTop: 12, background: '#E7F5E9', borderRadius: 12, padding: 14, border: '1.5px solid #4CAF50' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32', marginBottom: 8 }}>
                    Estado actualizado — Notificar al cliente
                  </div>
                  <div style={{ fontSize: 11, color: '#388E3C', marginBottom: 10, lineHeight: 1.5, background: '#C8E6C9', borderRadius: 8, padding: '8px 10px' }}>
                    {WA_MSG[waPending.estado]?.(waPending.numero)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={`https://wa.me/51${waPending.phone.replace(/\D/g, '')}?text=${encodeURIComponent(WA_MSG[waPending.estado]?.(waPending.numero) || '')}`}
                      target="_blank" rel="noreferrer"
                      style={{ flex: 1, display: 'block', padding: '10px 0', background: '#25D366', color: '#fff', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                      📲 Enviar por WhatsApp
                    </a>
                    <button onClick={() => setWaPending(null)}
                      style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: T.chip, cursor: 'pointer', fontSize: 12, color: T.ink3, fontWeight: 700 }}>
                      Omitir
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modalNuevo && (
        <NuevoPedidoModal T={T} onSave={() => { setModalNuevo(false); load(); }} onClose={() => setModalNuevo(false)}/>
      )}

      {cancelModal && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420, fontFamily: T.body }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Cancelar {selected.numero}</div>
            <div style={{ fontSize: 13, color: T.ink3, marginBottom: 16 }}>Indica el motivo de cancelación (se registrará en el pedido).</div>
            <textarea
              value={motivoAdmin}
              onChange={e => setMotivoAdmin(e.target.value)}
              placeholder="Ej: Producto sin stock, cliente solicitó cancelación, error en dirección..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 13, resize: 'vertical', fontFamily: T.body, outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => setCancelModal(false)}
                style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `1.5px solid ${T.line}`, background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: T.ink3, fontFamily: T.body }}>
                Volver
              </button>
              <button disabled={cancelando || !motivoAdmin.trim()} onClick={async () => {
                setCancelando(true);
                const { data } = await cancelarPedido(selected.id, motivoAdmin.trim());
                if (data) {
                  const updated = { ...selected, estado: 'cancelado', motivo_cancelacion: motivoAdmin.trim() };
                  setPedidos(prev => prev.map(p => p.id === selected.id ? updated : p));
                  setSelected(updated);
                }
                setCancelando(false);
                setCancelModal(false);
              }}
                style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: cancelando || !motivoAdmin.trim() ? T.ink3 : T.danger, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: T.body }}>
                {cancelando ? 'Cancelando...' : 'Confirmar cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
