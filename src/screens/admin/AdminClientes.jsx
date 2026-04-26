import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';
import { AdminSidebar } from './AdminSidebar';
import { supabase } from '../../lib/supabase';

async function getClientes() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('rol', 'cliente')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

async function getPedidosCliente(clienteId) {
  const { data } = await supabase
    .from('pedidos')
    .select('id, numero, total, estado, created_at')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
    .limit(10);
  return data ?? [];
}

const ESTADO_BADGE = { pendiente: 'neutral', confirmado: 'primary', cargando: 'warn', en_ruta: 'accent', entregado: 'ok', cancelado: 'danger' };
const ESTADO_LABEL = { pendiente: 'Pendiente', confirmado: 'Confirmado', cargando: 'Cargando', en_ruta: 'En ruta', entregado: 'Entregado', cancelado: 'Cancelado' };

export function AdminClientes({ theme: T }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loadingHist, setLoadingHist] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    getClientes().then(({ data }) => { setClientes(data); setLoading(false); });
  }, []);

  async function seleccionar(c) {
    setSelected(c);
    setLoadingHist(true);
    const h = await getPedidosCliente(c.id);
    setHistorial(h);
    setLoadingHist(false);
  }

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });
  const filtrados = clientes.filter(c =>
    !busqueda || c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono?.includes(busqueda)
  );

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>CRM</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Clientes</div>
          </div>
          <div style={{ background: T.bg, borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 280, border: `1px solid ${T.line}` }}>
            <I.search size={15} color={T.ink3}/>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre, empresa, teléfono..."
              style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: T.body, color: T.ink, background: 'transparent', flex: 1 }}/>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', overflow: 'hidden' }}>
          <div style={{ overflowY: 'auto' }}>
            {loading && <div style={{ padding: 40, textAlign: 'center', color: T.ink3 }}>Cargando clientes...</div>}
            {!loading && filtrados.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: T.ink3 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>
                  {busqueda ? `Sin resultados para "${busqueda}"` : 'Sin clientes registrados aún'}
                </div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Los clientes aparecen aquí cuando se registran en la app</div>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {filtrados.length > 0 && (
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.line}` }}>
                    {['Cliente', 'Empresa', 'Teléfono', 'Miembro desde', 'Acción'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', background: T.bg }}>{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {filtrados.map(c => {
                  const initials = (c.nombre || 'C').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  const isSel = selected?.id === c.id;
                  return (
                    <tr key={c.id} onClick={() => seleccionar(c)}
                      style={{ borderBottom: `1px solid ${T.line2}`, background: isSel ? T.primarySoft : 'transparent', cursor: 'pointer', transition: 'background .1s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{c.nombre || '—'}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: T.ink2 }}>{c.empresa || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: T.ink3, fontFamily: T.mono }}>
                        {c.telefono
                          ? <a href={`https://wa.me/51${c.telefono}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                              style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>📲 {c.telefono}</a>
                          : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: T.ink3 }}>
                        {new Date(c.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={e => { e.stopPropagation(); seleccionar(c); }}
                          style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: isSel ? T.primary : T.chip, color: isSel ? '#fff' : T.ink3, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                          {isSel ? 'Viendo' : 'Ver historial'}
                        </button>
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
                <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Perfil del cliente</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.ink3, fontSize: 20 }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}>
                  {(selected.nombre || 'C').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, marginTop: 10 }}>{selected.nombre}</div>
                {selected.empresa && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{selected.empresa}</div>}
              </div>

              <div style={{ background: T.chip, borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { l: 'Teléfono', v: selected.telefono || '—' },
                  { l: 'Dirección', v: selected.direccion || '—' },
                  { l: 'Miembro desde', v: new Date(selected.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(({ l, v }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: T.ink3, fontWeight: 600 }}>{l}</span>
                    <span style={{ color: T.ink, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>

              {selected.telefono && (
                <a href={`https://wa.me/51${selected.telefono}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: '#25D366', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
                  📲 Contactar por WhatsApp
                </a>
              )}

              <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 12 }}>Historial de pedidos</div>
              {loadingHist && <div style={{ textAlign: 'center', color: T.ink3, fontSize: 12, padding: 20 }}>Cargando...</div>}
              {!loadingHist && historial.length === 0 && (
                <div style={{ textAlign: 'center', color: T.ink3, fontSize: 12, padding: 20 }}>Sin pedidos registrados</div>
              )}
              {historial.map((p, i) => (
                <div key={p.id} style={{ padding: '10px 0', borderBottom: i < historial.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.ink }}>{p.numero}</div>
                    <Badge theme={T} tone={ESTADO_BADGE[p.estado] || 'neutral'}>{ESTADO_LABEL[p.estado]}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: T.ink3 }}>{new Date(p.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{fmt(p.total)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
