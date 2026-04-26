import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';
import { getStock, actualizarStock, crearProducto, actualizarProducto } from '../../lib/api';

const TIPOS = ['arena', 'piedra', 'hormigon', 'cemento', 'ladrillo', 'fierro'];
const CATEGORIAS = { arena: 'Agregados', piedra: 'Agregados', hormigon: 'Agregados', cemento: 'Cementos', ladrillo: 'Ladrillos', fierro: 'Fierros' };

const EMPTY_FORM = { nombre: '', tipo: 'arena', descripcion: '', precio_unitario: '', costo: '', unidad: 'm³', stock_actual: '', stock_minimo: '', sku: '' };

function inputStyle(T) {
  return { width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box', background: '#fff' };
}

function ProductModal({ T, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initial?.id;
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (!form.nombre || !form.precio_unitario || !form.stock_actual) { setError('Completa nombre, precio y stock'); return; }
    setLoading(true); setError('');
    const payload = {
      nombre: form.nombre, tipo: form.tipo, descripcion: form.descripcion,
      precio_unitario: Number(form.precio_unitario), costo: Number(form.costo) || null,
      unidad: form.unidad, stock_actual: Number(form.stock_actual),
      stock_minimo: Number(form.stock_minimo) || 10, sku: form.sku || null,
    };
    const { error: err } = isEdit
      ? await actualizarProducto(initial.id, payload)
      : await crearProducto(payload);
    setLoading(false);
    if (err) { setError(err.message); return; }
    onSave();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', fontFamily: T.body }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{isEdit ? 'Editar producto' : 'Nuevo producto'}</div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: T.ink3 }}>×</button>
        </div>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Nombre *</label>
              <input style={inputStyle(T)} value={form.nombre} onChange={set('nombre')} placeholder="Ej: Arena gruesa lavada" required/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Tipo *</label>
              <select style={inputStyle(T)} value={form.tipo} onChange={set('tipo')}>
                {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Unidad</label>
              <select style={inputStyle(T)} value={form.unidad} onChange={set('unidad')}>
                {['m³', 'bolsa', 'und', 'varilla', 'kg', 'm²', 'tonelada'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Precio venta (S/) *</label>
              <input style={inputStyle(T)} type="number" step="0.01" value={form.precio_unitario} onChange={set('precio_unitario')} placeholder="75.00"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Costo (S/)</label>
              <input style={inputStyle(T)} type="number" step="0.01" value={form.costo} onChange={set('costo')} placeholder="52.00"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Stock actual *</label>
              <input style={inputStyle(T)} type="number" value={form.stock_actual} onChange={set('stock_actual')} placeholder="100"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Stock mínimo</label>
              <input style={inputStyle(T)} type="number" value={form.stock_minimo} onChange={set('stock_minimo')} placeholder="20"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>SKU / Código</label>
              <input style={inputStyle(T)} value={form.sku} onChange={set('sku')} placeholder="AGR-001"/>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Descripción</label>
              <input style={inputStyle(T)} value={form.descripcion} onChange={set('descripcion')} placeholder="Origen, granulometría, etc."/>
            </div>
          </div>
          {error && <div style={{ background: '#FCE7E2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#C0392B', fontWeight: 600 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: `1.5px solid ${T.line}`, background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: T.ink3 }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: loading ? T.ink3 : T.accent, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.body }}>
              {loading ? 'Guardando...' : (isEdit ? 'Guardar cambios' : 'Crear producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminInventory({ theme: T }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [modal, setModal] = useState(null); // null | 'new' | product_object
  const [editingStock, setEditingStock] = useState(null);
  const [stockTemp, setStockTemp] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await getStock();
    setProductos(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const categorias = ['Todos', 'Agregados', 'Cementos', 'Ladrillos', 'Fierros'];
  const tipoMap = { Agregados: ['arena','piedra','hormigon'], Cementos: ['cemento'], Ladrillos: ['ladrillo'], Fierros: ['fierro'] };
  const filtrados = filtro === 'Todos' ? productos : productos.filter(p => (tipoMap[filtro] || []).includes(p.tipo));

  async function handleStockSave(prod) {
    const nuevo = Number(stockTemp);
    if (isNaN(nuevo) || nuevo < 0) return;
    await actualizarStock(prod.id, nuevo);
    setProductos(prev => prev.map(p => p.id === prod.id ? { ...p, stock_actual: nuevo } : p));
    setEditingStock(null);
  }

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Almacén</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>
              Inventario · {productos.length} productos
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <BtnSecondary theme={T} icon={I.refresh} onClick={load}>Actualizar</BtnSecondary>
            <BtnPrimary theme={T} icon={I.plus} onClick={() => setModal('new')}>Agregar producto</BtnPrimary>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {categorias.map(c => (
              <button key={c} onClick={() => setFiltro(c)} style={{
                padding: '6px 16px', borderRadius: 20, border: `1.5px solid ${filtro === c ? T.primary : T.line}`,
                background: filtro === c ? T.primary : T.surface, color: filtro === c ? '#fff' : T.ink2,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.body,
              }}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: T.ink3 }}>Cargando inventario...</div>
          ) : filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: T.surface, borderRadius: 16, border: `1px dashed ${T.line}` }}>
              <div style={{ fontSize: 40 }}>📦</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginTop: 12, fontFamily: T.display }}>Sin productos aún</div>
              <div style={{ fontSize: 14, color: T.ink3, marginTop: 6 }}>Agrega tu primer producto para que aparezca en la tienda</div>
              <button onClick={() => setModal('new')} style={{ marginTop: 20, padding: '12px 28px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
                + Agregar primer producto
              </button>
            </div>
          ) : (
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.4fr 1fr 1fr .5fr', padding: '12px 18px', background: T.chip, fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                <div>Producto</div><div>SKU</div><div>Stock</div><div>Precio</div><div>Categoría</div><div></div>
              </div>
              {filtrados.map((p, i) => {
                const pct = p.stock_minimo ? Math.min(100, (p.stock_actual / p.stock_minimo) * 100) : 100;
                const status = pct < 30 ? 'crit' : pct < 70 ? 'low' : 'ok';
                const statusColor = status === 'crit' ? T.danger : status === 'low' ? '#E5B100' : T.ok;
                return (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.4fr 1fr 1fr .5fr', padding: '14px 18px', borderTop: i > 0 ? `1px solid ${T.line2 || T.line}` : 'none', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ProductIcon kind={p.tipo} size={40} theme={T}/>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{p.nombre}</div>
                        <div style={{ fontSize: 11, color: T.ink3 }}>{p.descripcion?.slice(0, 40) || CATEGORIAS[p.tipo]}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontFamily: T.mono, color: T.ink2 }}>{p.sku || '—'}</div>
                    <div>
                      {editingStock === p.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number" value={stockTemp}
                            onChange={e => setStockTemp(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleStockSave(p); if (e.key === 'Escape') setEditingStock(null); }}
                            autoFocus
                            style={{ width: 70, padding: '4px 8px', borderRadius: 7, border: `1.5px solid ${T.primary}`, fontSize: 13, fontFamily: T.body, outline: 'none' }}
                          />
                          <button onClick={() => handleStockSave(p)} style={{ padding: '4px 8px', background: T.primary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✓</button>
                          <button onClick={() => setEditingStock(null)} style={{ padding: '4px 8px', background: T.chip, border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>✕</button>
                        </div>
                      ) : (
                        <div onClick={() => { setEditingStock(p.id); setStockTemp(String(p.stock_actual)); }} style={{ cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{Number(p.stock_actual).toLocaleString()}</span>
                            <span style={{ fontSize: 11, color: T.ink3 }}>{p.unidad}</span>
                          </div>
                          <div style={{ height: 4, background: T.chip, borderRadius: 2, marginTop: 4, width: 100 }}>
                            <div style={{ height: '100%', width: pct + '%', background: statusColor, borderRadius: 2 }}/>
                          </div>
                          <div style={{ fontSize: 10, color: statusColor, fontWeight: 700, marginTop: 2 }}>
                            {status === 'crit' ? 'CRÍTICO' : status === 'low' ? 'BAJO' : 'Normal'} · mín {p.stock_minimo}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: T.display }}>{fmt(p.precio_unitario)}<span style={{ fontSize: 10, color: T.ink3, fontWeight: 400 }}>/{p.unidad}</span></div>
                    <div style={{ fontSize: 12, color: T.ink2 }}>{CATEGORIAS[p.tipo] || p.tipo}</div>
                    <button onClick={() => setModal(p)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ✏️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ProductModal
          T={T}
          initial={modal === 'new' ? null : modal}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
