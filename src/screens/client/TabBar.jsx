import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';

const items = [
  { id: 'home', path: '/cliente/home', l: 'Inicio', i: 'home' },
  { id: 'quote', path: '/cliente/cotizador', l: 'Cotizar', i: 'calc' },
  { id: 'orders', path: '/cliente/pedidos', l: 'Pedidos', i: 'doc' },
  { id: 'me', path: '/cliente/cuenta', l: 'Cuenta', i: 'user' },
];

export function TabBar({ active, T }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
      background: T.surface, borderTop: `1px solid ${T.line}`,
      display: 'flex', padding: '8px 8px 10px',
    }}>
      {items.map((it) => {
        const Ic = I[it.i];
        const isActive = it.id === active;
        return (
          <div key={it.id} onClick={() => navigate(it.path)}
            style={{ flex: 1, textAlign: 'center', paddingTop: 2, cursor: 'pointer' }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Ic size={22} color={isActive ? T.accent : T.ink3}/>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? T.accent : T.ink3, marginTop: 3 }}>{it.l}</div>
          </div>
        );
      })}
    </div>
  );
}
