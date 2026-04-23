import { useNavigate, useLocation } from 'react-router-dom';
import { I } from '../../components/Icons';

const items = [
  { id: 'dash', path: '/admin', l: 'Dashboard', i: 'chart' },
  { id: 'orders', path: '/admin/pedidos', l: 'Pedidos', i: 'doc', badge: 8 },
  { id: 'stock', path: '/admin/inventario', l: 'Inventario', i: 'box' },
  { id: 'routes', path: '/admin/rutas', l: 'Rutas', i: 'route' },
  { id: 'cash', path: '/admin/caja', l: 'Caja diaria', i: 'wallet' },
  { id: 'clients', path: '/admin/clientes', l: 'Clientes', i: 'users' },
  { id: 'quotes', path: '/admin/cotizaciones', l: 'Cotizaciones', i: 'calc' },
  { id: 'invoice', path: '/admin/facturacion', l: 'Facturación', i: 'file' },
  { id: 'team', path: '/admin/personal', l: 'Personal', i: 'hardhat' },
];

export function AdminSidebar({ T }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ width: 232, background: T.ink, padding: '18px 0', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontFamily: T.display, fontSize: 14 }}>JB</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-.01em', fontFamily: T.display }}>JBT DIBO</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>Admin · v2.1</div>
        </div>
      </div>
      <div style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
        {items.map((it) => {
          const Ic = I[it.i];
          const isA = location.pathname === it.path || (it.path !== '/admin' && location.pathname.startsWith(it.path));
          return (
            <div key={it.id} onClick={() => navigate(it.path)} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              background: isA ? T.accent : 'transparent',
              color: isA ? '#fff' : 'rgba(255,255,255,.68)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', position: 'relative',
            }}>
              <Ic size={17} color={isA ? '#fff' : 'rgba(255,255,255,.68)'}/>
              <span>{it.l}</span>
              {it.badge && (
                <span style={{ marginLeft: 'auto', background: isA ? 'rgba(255,255,255,.25)' : T.accent, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>{it.badge}</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, fontFamily: T.display }}>JT</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>José Torres</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Admin general</div>
        </div>
        <I.gear size={16} color="rgba(255,255,255,.5)"/>
      </div>
    </div>
  );
}
