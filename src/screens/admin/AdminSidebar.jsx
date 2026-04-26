import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { I } from '../../components/Icons';

const items = [
  { id: 'dash',     path: '/admin',             l: 'Dashboard',   i: 'chart'   },
  { id: 'orders',   path: '/admin/pedidos',     l: 'Pedidos',     i: 'doc'     },
  { id: 'stock',    path: '/admin/inventario',  l: 'Inventario',  i: 'box'     },
  { id: 'routes',   path: '/admin/rutas',       l: 'Rutas',       i: 'route'   },
  { id: 'caja',     path: '/admin/caja',        l: 'Caja diaria', i: 'wallet'  },
  { id: 'clientes', path: '/admin/clientes',    l: 'Clientes',    i: 'users'   },
];

const itemsProximo = [
  { id: 'quotes',  l: 'Cotizaciones',   i: 'calc'     },
  { id: 'invoice', l: 'Facturación',    i: 'file'     },
  { id: 'team',    l: 'Personal',       i: 'hardhat'  },
];

export function AdminSidebar({ T }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const nombre = profile?.nombre?.split(' ')[0] || 'Admin';
  const inicial = (profile?.nombre || 'A').charAt(0).toUpperCase();

  return (
    <div style={{ width: 232, background: T.ink, padding: '18px 0', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontFamily: T.display, fontSize: 14 }}>JB</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-.01em', fontFamily: T.display }}>JBT DIBO</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>Panel Admin</div>
        </div>
      </div>

      <div style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
        {/* Secciones activas */}
        {items.map((it) => {
          const Ic = I[it.i];
          const isA = location.pathname === it.path || (it.path !== '/admin' && location.pathname.startsWith(it.path));
          return (
            <div key={it.id} onClick={() => navigate(it.path)} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              background: isA ? T.accent : 'transparent',
              color: isA ? '#fff' : 'rgba(255,255,255,.68)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <Ic size={17} color={isA ? '#fff' : 'rgba(255,255,255,.68)'}/>
              <span>{it.l}</span>
            </div>
          );
        })}

        {/* Divisor */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '10px 0 8px' }}/>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '0 10px', marginBottom: 6 }}>
          Próximamente
        </div>

        {/* Secciones en desarrollo */}
        {itemsProximo.map((it) => {
          const Ic = I[it.i];
          return (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              color: 'rgba(255,255,255,.3)',
              fontSize: 13, fontWeight: 600, cursor: 'not-allowed',
              opacity: 0.6,
            }}>
              <Ic size={17} color="rgba(255,255,255,.3)"/>
              <span style={{ flex: 1 }}>{it.l}</span>
              <span style={{ fontSize: 9, background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, letterSpacing: '.04em' }}>
                PRONTO
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer con perfil */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, fontFamily: T.display, flexShrink: 0 }}>
            {inicial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Administrador</div>
          </div>
          <button onClick={signOut} title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,.4)', fontSize: 14 }}>⎋</button>
        </div>
      </div>
    </div>
  );
}
