import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { getPedidosByCliente } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ESTADO_BADGE = {
  pendiente: 'neutral', confirmado: 'primary', cargando: 'warn',
  en_ruta: 'accent', entregado: 'ok', cancelado: 'danger',
};
const ESTADO_LABEL = {
  pendiente: 'Pendiente', confirmado: 'Confirmado', cargando: 'Cargando',
  en_ruta: 'En ruta', entregado: 'Entregado', cancelado: 'Cancelado',
};

const ESTADO_STEPS = ['pendiente', 'confirmado', 'cargando', 'en_ruta', 'entregado'];
const STEP_LABELS = ['Recibido', 'Confirmado', 'Cargando', 'En ruta', 'Entregado'];

function PedidoCard({ pedido, T, onClick }) {
  const primerItem = pedido.pedido_items?.[0];
  const kind = primerItem?.productos?.tipo || 'arena';
  const stepIdx = ESTADO_STEPS.indexOf(pedido.estado);
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`,
      padding: 20, cursor: 'pointer', transition: 'box-shadow .15s',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ProductIcon kind={kind} size={48} theme={T}/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.mono }}>{pedido.numero}</div>
            <Badge theme={T} tone={ESTADO_BADGE[pedido.estado] || 'neutral'}>
              {ESTADO_LABEL[pedido.estado] || pedido.estado}
            </Badge>
          </div>
          <div style={{ fontSize: 13, color: T.ink3, marginTop: 3 }}>
            {pedido.pedido_items?.length || 0} producto{pedido.pedido_items?.length !== 1 ? 's' : ''}
            {' · '}
            {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
        <div style={{ display: 'flex', gap: 0 }}>
          {STEP_LABELS.map((label, i) => {
            const done = i <= stepIdx;
            return (
              <div key={i} style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: 4, background: done ? T.accent : T.line, borderRadius: 2, marginRight: i < 4 ? 3 : 0 }}/>
                <div style={{ fontSize: 10, color: done ? T.ink2 : T.ink3, fontWeight: done ? 700 : 400, marginTop: 4 }}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: T.ink3 }}>
          📍 {pedido.direccion_entrega?.slice(0, 45)}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, fontFamily: T.display }}>
          {fmt(pedido.total)}
        </div>
      </div>
    </div>
  );
}

export function ScreenPedidos({ theme: T }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const nuevoPedido = location.state?.nuevoPedido;

  useEffect(() => {
    if (!user) return;
    getPedidosByCliente(user.id).then(({ data }) => {
      setPedidos(data || []);
      setLoading(false);
    });
  }, [user]);

  const filtrados = filtro === 'todos' ? pedidos
    : filtro === 'activos' ? pedidos.filter(p => !['entregado','cancelado'].includes(p.estado))
    : pedidos.filter(p => p.estado === 'entregado');

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      <div style={{ background: T.primary, padding: '32px 0 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          {nuevoPedido && (
            <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>¡Pedido registrado exitosamente!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>#{nuevoPedido.numero} · Te notificaremos cuando sea confirmado</div>
              </div>
            </div>
          )}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>Historial</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: T.display }}>Mis pedidos</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} en total</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['todos','Todos'], ['activos','Activos'], ['entregado','Entregados']].map(([k, l]) => (
            <button key={k} onClick={() => setFiltro(k)} style={{
              padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: T.body,
              background: filtro === k ? T.primary : '#fff',
              color: filtro === k ? '#fff' : T.ink3,
              border: filtro === k ? 'none' : `1px solid ${T.line}`,
            }}>{l}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: T.ink3, fontSize: 14 }}>Cargando pedidos...</div>
        )}
        {!loading && filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 20, border: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 48 }}>📦</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginTop: 16, fontFamily: T.display }}>Sin pedidos aún</div>
            <div style={{ fontSize: 14, color: T.ink3, marginTop: 6 }}>Tus pedidos aparecerán aquí cuando hagas una compra</div>
            <button onClick={() => navigate('/cliente/home')} style={{ marginTop: 24, padding: '12px 28px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
              Ir a la tienda
            </button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtrados.map(p => (
            <PedidoCard key={p.id} pedido={p} T={T} onClick={() => navigate('/cliente/tracking', { state: { pedido: p } })}/>
          ))}
        </div>
      </div>
    </div>
  );
}
