import { supabase } from './supabase';

// ── Productos ──────────────────────────────────────────────
export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre');
  return { data: data ?? [], error };
}

// ── Pedidos ────────────────────────────────────────────────
export async function getPedidos({ limite = 20 } = {}) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`*, profiles(nombre, empresa, celular), pedido_items(*, productos(nombre, tipo, unidad))`)
    .order('created_at', { ascending: false })
    .limit(limite);
  return { data: data ?? [], error };
}

export async function getPedidosByCliente(clienteId) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`*, pedido_items(*, productos(nombre, tipo, unidad)), choferes(nombre, placa, telefono)`)
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function crearPedido({ clienteId, items, direccion, metodoPago, fechaEntrega }) {
  const numero = 'JBT-' + Date.now().toString().slice(-4);
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);

  const { data: pedido, error: pedErr } = await supabase
    .from('pedidos')
    .insert({
      numero, cliente_id: clienteId,
      direccion_entrega: direccion,
      metodo_pago: metodoPago,
      fecha_entrega: fechaEntrega,
      subtotal, total: subtotal,
      estado: 'pendiente',
    })
    .select()
    .single();

  if (pedErr) return { error: pedErr };

  // Solo insertar columnas que definitivamente existen en pedido_items
  const pedidoItems = items.map(i => ({
    pedido_id: pedido.id,
    producto_id: i.producto_id || null,
    cantidad: Number(i.cantidad),
    subtotal: Number(i.subtotal),
    // Campos opcionales: se incluyen solo si tienen valor
    ...(i.nombre        && { nombre: i.nombre }),
    ...(i.precio_unitario != null && { precio_unitario: Number(i.precio_unitario) }),
  }));

  const { error: itemErr } = await supabase
    .from('pedido_items')
    .insert(pedidoItems);

  if (itemErr) {
    // Si falla por columna inexistente, reintentamos sin campos opcionales
    if (itemErr.code === '42703') {
      const itemsMinimos = items.map(i => ({
        pedido_id: pedido.id,
        producto_id: i.producto_id || null,
        cantidad: Number(i.cantidad),
        subtotal: Number(i.subtotal),
      }));
      const { error: itemErr2 } = await supabase.from('pedido_items').insert(itemsMinimos);
      return { data: pedido, error: itemErr2 };
    }
    return { data: pedido, error: itemErr };
  }

  return { data: pedido, error: null };
}

export async function actualizarEstadoPedido(pedidoId, estado) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', pedidoId)
    .select()
    .single();
  return { data, error };
}

// ── Inventario / Stock ─────────────────────────────────────
export async function getStock() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('tipo');
  return { data: data ?? [], error };
}

export async function actualizarStock(productoId, nuevoStock) {
  const { data, error } = await supabase
    .from('productos')
    .update({ stock_actual: nuevoStock })
    .eq('id', productoId)
    .select()
    .single();
  return { data, error };
}

// ── Choferes / Rutas ───────────────────────────────────────
export async function getChoferes() {
  const { data, error } = await supabase
    .from('choferes')
    .select('*')
    .eq('activo', true)
    .order('nombre');
  return { data: data ?? [], error };
}

export async function getRutasHoy() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('rutas')
    .select(`*, pedidos(numero, direccion_entrega, estado), choferes(nombre, placa, estado)`)
    .eq('fecha', today);
  return { data: data ?? [], error };
}

// ── Caja diaria ────────────────────────────────────────────
export async function getCajaHoy() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('caja')
    .select('*')
    .eq('fecha', today)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function registrarMovimientoCaja({ tipo, concepto, monto, pedidoId }) {
  const { data, error } = await supabase
    .from('caja')
    .insert({ tipo, concepto, monto, pedido_id: pedidoId })
    .select()
    .single();
  return { data, error };
}

// ── Gestión de productos (admin) ───────────────────────────
export async function crearProducto(data) {
  const { data: prod, error } = await supabase
    .from('productos')
    .insert({ ...data, activo: true })
    .select()
    .single();
  return { data: prod, error };
}

export async function actualizarProducto(id, data) {
  const { data: prod, error } = await supabase
    .from('productos')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  return { data: prod, error };
}

export async function cancelarPedido(pedidoId) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado: 'cancelado' })
    .eq('id', pedidoId)
    .select()
    .single();
  return { data, error };
}

export async function eliminarProducto(id) {
  const { data, error } = await supabase
    .from('productos')
    .update({ activo: false })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ── Choferes ───────────────────────────────────────────────
export async function asignarChoferAPedido(pedidoId, choferId) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ chofer_id: choferId })
    .eq('id', pedidoId)
    .select()
    .single();
  return { data, error };
}

export async function actualizarEstadoChofer(choferId, estado) {
  const { data, error } = await supabase
    .from('choferes')
    .update({ estado })
    .eq('id', choferId)
    .select()
    .single();
  return { data, error };
}

export async function getPedidosEnRuta() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`*, profiles(nombre, celular), pedido_items(*, productos(nombre, tipo, unidad))`)
    .in('estado', ['confirmado', 'cargando', 'en_ruta'])
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

// ── KPIs Dashboard ─────────────────────────────────────────
export async function getKPIs() {
  const today = new Date().toISOString().slice(0, 10);

  const [cajaDia, pedidosActivos, choferes] = await Promise.all([
    supabase.from('caja').select('tipo, monto').eq('fecha', today),
    supabase.from('pedidos').select('id', { count: 'exact' }).in('estado', ['confirmado','cargando','en_ruta']),
    supabase.from('choferes').select('estado').eq('activo', true),
  ]);

  const ingresos = (cajaDia.data ?? []).filter(r => r.tipo === 'ingreso').reduce((s, r) => s + Number(r.monto), 0);
  const egresos  = (cajaDia.data ?? []).filter(r => r.tipo === 'egreso').reduce((s, r) => s + Number(r.monto), 0);
  const enRuta   = (choferes.data ?? []).filter(c => c.estado === 'en_ruta').length;
  const total    = (choferes.data ?? []).length;

  return {
    ventasHoy: ingresos,
    egresos,
    saldo: ingresos - egresos,
    pedidosActivos: pedidosActivos.count ?? 0,
    choferes: { enRuta, total },
  };
}
