import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { TabBar } from './TabBar';
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

  return (
    <div onClick={onClick} style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <ProductIcon kind={kind} size={40} theme={T}/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.mono }}>{pedido.numero}</div>
            <Badge theme={T} tone={ESTADO_BADGE[pedido.estado] || 'neutral'} style={{ fontSize: 9 }}>
              {ESTADO_LABEL[pedido.estado] || pedido.estado}
            </Badge>
          </div>
          <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
            {pedido.pedido_items?.length || 0} producto{pedido.pedido_items?.length !== 1 ? 's' : ''}
            {' · '}
            {new Date(pedido.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
          {STEP_LABELS.map((label, i) => {
            const done = i <= stepIdx;
            return (
              <div key={i} style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: 3, background: done ? T.accent : T.line, borderRadius: 2, marginRight: i < 4 ? 2 : 0 }}/>
                <div style={{ fontSize: 9, color: done ? T.ink2 : T.ink3, fontWeight: done ? 700 : 400, marginTop: 3 }}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: T.ink3 }}>
          <I.pin size={11} color={T.ink3}/>{' '}
          {pedido.direccion_entrega?.slice(0, 35)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display }}>
          S/{Number(pedido.total).toLocaleString('es-PE')}
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
      setPedidos(data);
      setLoading(false);
    });
  }, [user]);

  const filtrados = filtro === 'todos' ? pedidos
    : filtro === 'activos' ? pedidos.filter(p => !['entregado','cancelado'].includes(p.estado))
    : pedidos.filter(p => p.estado === 'entregado');

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ background: T.primary, padding: '14px 16px 18px', color: '#fff', flexShrink: 0 }}>
        <div style={{ fontSize: 11, opacity: .75, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Mis compras</div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.01em', marginTop: 2, fontFamily: T.display }}>Mis pedidos</div>
      </div>

      {nuevoPedido && (
        <div style={{ background: '#E6F4EA', borderLeft: `4px solid ${T.ok}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <I.check size={18} color={T.ok}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ok }}>¡Pedido registrado!</div>
            <div style={{ fontSize: 11, color: T.ink3 }}>#{nuevoPedido.numero} · Te notificaremos cuando sea confirmado</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 4px' }}>
        {[['todos','Todos'], ['activos','Activos'], ['entregado','Entregados']].map(([k, l]) => (
          <button key={k} onClick={() => setFiltro(k)} style={{
            padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            background: filtro === k ? T.primary : T.surface,
            color: filtro === k ? '#fff' : T.ink3,
            border: filtro === k ? 'none' : `1px solid ${T.line}`,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 20px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: T.ink3, fontSize: 13 }}>Cargando pedidos...</div>
        )}
        {!loading && filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <I.doc size={40} color={T.ink3}/>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginTop: 12 }}>Sin pedidos aún</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Tus pedidos aparecerán aquí</div>
            <button onClick={() => navigate('/cliente/home')} style={{ marginTop: 16, padding: '10px 24px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Comprar ahora
            </button>
          </div>
        )}
        {filtrados.map(p => (
          <PedidoCard key={p.id} pedido={p} T={T} onClick={() => navigate('/cliente/tracking', { state: { pedido: p } })}/>
        ))}
        <div style={{ height: 80 }}/>
      </div>

      <TabBar active="pedidos" T={T}/>
    </div>
  );
}
