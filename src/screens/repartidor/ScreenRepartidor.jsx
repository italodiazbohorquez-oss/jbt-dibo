import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPedidosEnRuta, actualizarEstadoPedido } from '../../lib/api';
import { TOKENS } from '../../tokens';

const T = TOKENS.cantera;

function RepartidorLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { error: err } = await signIn({ email, password });
      if (err) throw err;
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : (err.message || 'Error al iniciar sesión'));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D1F2D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: T.body }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 28 }}>
            🚛
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: T.display }}>Portal Repartidor</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>JBT DIBO S.A.C</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>Correo</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              placeholder="conductor@jbtdibo.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: T.body, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: T.body, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && (
            <div style={{ background: 'rgba(220,50,50,.15)', border: '1px solid rgba(220,50,50,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#FF8080', fontWeight: 600 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ marginTop: 4, padding: 14, borderRadius: 12, border: 'none', background: loading ? 'rgba(255,255,255,.1)' : T.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body }}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
          Acceso exclusivo para conductores
        </div>
      </div>
    </div>
  );
}

function RepartidorAccessDenied() {
  const { signOut } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#0D1F2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.body }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: T.display, marginBottom: 8 }}>Sin acceso</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 28 }}>
          Esta área es solo para conductores. Ingresa con tu cuenta de repartidor.
        </div>
        <button onClick={signOut} style={{ padding: '12px 28px', background: T.primary, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

const ESTADO_COLORS = {
  confirmado: { bg: '#FFF8E7', color: '#B45309', label: 'Confirmado' },
  cargando:   { bg: '#EFF6FF', color: '#1D4ED8', label: 'Cargando' },
  en_ruta:    { bg: '#ECFDF5', color: '#065F46', label: 'En ruta' },
  entregado:  { bg: '#F0FDF4', color: '#166534', label: 'Entregado' },
};

function PedidoCard({ pedido, onMarcarEntregado, onMarcarEnRuta }) {
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });
  const estado = ESTADO_COLORS[pedido.estado] || ESTADO_COLORS.confirmado;

  async function handleEntregado() {
    if (!confirmando) { setConfirmando(true); return; }
    setLoading(true);
    await onMarcarEntregado(pedido.id);
    setLoading(false);
    setConfirmando(false);
  }

  async function handleEnRuta() {
    setLoading(true);
    await onMarcarEnRuta(pedido.id);
    setLoading(false);
  }

  const clienteNombre = pedido.profiles?.nombre || 'Cliente';
  const clienteCelular = pedido.profiles?.celular;

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5EDE8', overflow: 'hidden', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1A2E25', fontFamily: T.display }}>{pedido.numero}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: estado.bg, color: estado.color, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {estado.label}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#5C7A6A' }}>
            {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1A2E25', fontFamily: T.display }}>{fmt(pedido.total)}</div>
          <div style={{ fontSize: 11, color: '#5C7A6A' }}>{pedido.metodo_pago === 'efectivo' ? '💵 Efectivo' : pedido.metodo_pago === 'yape' ? '📱 Yape' : '🏦 Transferencia'}</div>
        </div>
      </div>

      {/* Cliente */}
      <div style={{ padding: '12px 20px', background: '#F8FAF9', borderBottom: '1px solid #E5EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.primarySoft, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, fontFamily: T.display }}>
            {clienteNombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A2E25' }}>{clienteNombre}</div>
            {clienteCelular && <div style={{ fontSize: 12, color: '#5C7A6A' }}>{clienteCelular}</div>}
          </div>
        </div>
        {clienteCelular && (
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`https://wa.me/51${clienteCelular}`} target="_blank" rel="noreferrer">
              <button style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
            </a>
            <a href={`tel:${clienteCelular}`}>
              <button style={{ width: 38, height: 38, borderRadius: '50%', background: T.primary, border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</button>
            </a>
          </div>
        )}
      </div>

      {/* Dirección */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #E5EDE8', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, marginTop: 2 }}>📍</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5C7A6A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>Dirección de entrega</div>
          <div style={{ fontSize: 14, color: '#1A2E25', fontWeight: 600 }}>{pedido.direccion_entrega}</div>
        </div>
      </div>

      {/* Items */}
      {pedido.pedido_items?.length > 0 && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #E5EDE8' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5C7A6A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Productos</div>
          {pedido.pedido_items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#1A2E25', padding: '3px 0' }}>
              <span>{item.productos?.nombre || item.nombre}</span>
              <span style={{ fontWeight: 700 }}>{item.cantidad} {item.productos?.unidad || item.unidad}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '14px 20px', display: 'flex', gap: 10 }}>
        {pedido.estado === 'confirmado' || pedido.estado === 'cargando' ? (
          <button
            onClick={handleEnRuta}
            disabled={loading}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: T.primary, color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Actualizando...' : '🚛 Salir a ruta'}
          </button>
        ) : pedido.estado === 'en_ruta' ? (
          <button
            onClick={handleEntregado}
            disabled={loading}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: confirmando ? '#DC2626' : T.ok, color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body, opacity: loading ? 0.7 : 1, transition: 'background .2s' }}
          >
            {loading ? 'Guardando...' : confirmando ? '¿Confirmar entrega?' : '✓ Marcar entregado'}
          </button>
        ) : (
          <div style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#F0FDF4', color: '#166534', fontWeight: 700, fontSize: 14, textAlign: 'center', fontFamily: T.body }}>
            ✓ Entregado
          </div>
        )}
        {confirmando && (
          <button
            onClick={() => setConfirmando(false)}
            style={{ padding: '12px 20px', borderRadius: 12, border: `1px solid #E5EDE8`, background: '#fff', color: '#5C7A6A', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

function RepartidorDashboard() {
  const { profile, signOut } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function cargar() {
    setLoading(true);
    const { data, error: err } = await getPedidosEnRuta();
    if (err) setError('Error cargando pedidos');
    else setPedidos(data || []);
    setLoading(false);
  }

  useEffect(() => { cargar(); }, []);

  async function handleMarcarEnRuta(pedidoId) {
    const { error: err } = await actualizarEstadoPedido(pedidoId, 'en_ruta');
    if (!err) cargar();
  }

  async function handleMarcarEntregado(pedidoId) {
    const { error: err } = await actualizarEstadoPedido(pedidoId, 'entregado');
    if (!err) cargar();
  }

  const activos = pedidos.filter(p => p.estado !== 'entregado');
  const entregados = pedidos.filter(p => p.estado === 'entregado');

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7F5', fontFamily: T.body }}>
      {/* Header */}
      <div style={{ background: '#0D1F2D', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚛</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: T.display }}>Mis Entregas</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{profile?.nombre || 'Conductor'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={cargar} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↻</button>
          <button onClick={signOut} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.body }}>Salir</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5EDE8', padding: '14px 24px', display: 'flex', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.primary, fontFamily: T.display }}>{activos.length}</div>
          <div style={{ fontSize: 11, color: '#5C7A6A', fontWeight: 600 }}>Pendientes</div>
        </div>
        <div style={{ width: 1, background: '#E5EDE8' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.ok, fontFamily: T.display }}>{entregados.length}</div>
          <div style={{ fontSize: 11, color: '#5C7A6A', fontWeight: 600 }}>Entregados hoy</div>
        </div>
        <div style={{ width: 1, background: '#E5EDE8' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1A2E25', fontFamily: T.display }}>
            {pedidos.filter(p => p.estado === 'en_ruta').length}
          </div>
          <div style={{ fontSize: 11, color: '#5C7A6A', fontWeight: 600 }}>En ruta</div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#5C7A6A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Cargando pedidos...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ color: '#DC2626', fontWeight: 600, marginBottom: 16 }}>{error}</div>
            <button onClick={cargar} style={{ padding: '10px 24px', background: T.primary, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: T.body }}>Reintentar</button>
          </div>
        ) : activos.length === 0 && entregados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A2E25', fontFamily: T.display, marginBottom: 8 }}>Sin entregas pendientes</div>
            <div style={{ fontSize: 14, color: '#5C7A6A' }}>No hay pedidos asignados por ahora</div>
          </div>
        ) : (
          <>
            {activos.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#5C7A6A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>
                  Entregas pendientes ({activos.length})
                </div>
                {activos.map(p => (
                  <PedidoCard
                    key={p.id}
                    pedido={p}
                    onMarcarEntregado={handleMarcarEntregado}
                    onMarcarEnRuta={handleMarcarEnRuta}
                  />
                ))}
              </>
            )}

            {entregados.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#5C7A6A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12, marginTop: activos.length > 0 ? 24 : 0 }}>
                  Completadas hoy ({entregados.length})
                </div>
                {entregados.map(p => (
                  <PedidoCard
                    key={p.id}
                    pedido={p}
                    onMarcarEntregado={handleMarcarEntregado}
                    onMarcarEnRuta={handleMarcarEnRuta}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ScreenRepartidor() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D1F2D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.body }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚛</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  if (!user) return <RepartidorLogin />;
  if (profile && profile.rol !== 'repartidor') return <RepartidorAccessDenied />;

  return <RepartidorDashboard />;
}
