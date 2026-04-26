import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { Chip } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { TabBar } from './TabBar';
import { getProductos } from '../../lib/api';
import { useCart } from '../../context/CartContext';

export function ScreenHome({ theme: T }) {
  const navigate = useNavigate();
  const { agregar, totalItems } = useCart();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [agregado, setAgregado] = useState(null);

  function handleAgregar(e, p) {
    e.stopPropagation();
    agregar(p, 1);
    setAgregado(p.id);
    setTimeout(() => setAgregado(null), 1200);
  }

  useEffect(() => { getProductos().then(({ data }) => setProductos(data)); }, []);

  const categorias = ['Todos', 'Agregados', 'Cementos', 'Ladrillos', 'Fierros'];
  const tipoMap = { Agregados: ['arena','piedra','hormigon'], Cementos: ['cemento'], Ladrillos: ['ladrillo'], Fierros: ['fierro'] };
  const productosFiltrados = filtro === 'Todos' ? productos : productos.filter(p => (tipoMap[filtro] || []).includes(p.tipo));

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ background: T.primary, padding: '12px 16px 18px', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .75, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Entregar en</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <I.pin size={15} color="#fff"/>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Obra Las Flores, Mz B Lt 14</div>
              <I.chevD size={14} color="#fff"/>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.bell size={18} color="#fff"/>
            </div>
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: T.accent, border: '2px solid ' + T.primary }}/>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <I.search size={18} color={T.ink3}/>
          <span style={{ color: T.ink3, fontSize: 14 }}>Buscar material, código, marca...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ margin: '14px 16px 0', background: T.accent, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,.12)' }}/>
          <div style={{ position: 'absolute', right: 8, bottom: 8, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }}/>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <I.truck size={26} color={T.accent}/>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ fontSize: 11, color: '#fff', opacity: .85, fontWeight: 700, letterSpacing: '.06em' }}>ENVÍO GRATIS</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginTop: 2 }}>En pedidos +S/500 en Lima Sur</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '16px 16px 4px' }}>
          {[
            { i: 'calc', l: 'Cotizar', path: '/cliente/cotizador' },
            { i: 'doc', l: 'Pedidos', path: '/cliente/pedidos' },
            { i: 'truck', l: 'Rastrear', path: '/cliente/tracking' },
            { i: 'chat', l: 'Ayuda', path: '#' },
          ].map((x, i) => {
            const Ic = I[x.i];
            return (
              <div key={i} onClick={() => x.path !== '#' && navigate(x.path)}
                style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, padding: '12px 6px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                  <Ic size={18} color={T.primary}/>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.ink }}>{x.l}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '14px 16px 4px', overflowX: 'auto' }}>
          {categorias.map((c) => (
            <Chip key={c} theme={T} active={filtro === c} onClick={() => setFiltro(c)}>{c}</Chip>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '16px 16px 10px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, letterSpacing: '-.01em', fontFamily: T.display }}>Más pedidos</div>
          <div style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>Ver todo</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 20px' }}>
          {productosFiltrados.slice(0, 6).map((p) => (
            <div key={p.id} onClick={() => navigate('/cliente/detalle', { state: { producto: p } })}
              style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 10, position: 'relative', cursor: 'pointer' }}>
              {p.stock_actual <= p.stock_minimo && (
                <div style={{ position: 'absolute', top: 8, left: 8, background: '#E5B100', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 6px', borderRadius: 4 }}>BAJO STOCK</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 6px' }}>
                <ProductIcon kind={p.tipo} size={64} theme={T}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{p.nombre}</div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{p.descripcion?.slice(0, 30)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.display }}>S/{p.precio}</div>
                  <div style={{ fontSize: 10, color: T.ink3, marginTop: -2 }}>por {p.unidad}</div>
                </div>
                <button onClick={(e) => handleAgregar(e, p)} style={{ width: 30, height: 30, borderRadius: 9, background: agregado === p.id ? T.ok : T.accent, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .2s' }}>
                  {agregado === p.id ? <I.check size={16} color="#fff"/> : <I.plus size={16} color="#fff"/>}
                </button>
              </div>
            </div>
          ))}
          {productosFiltrados.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: T.ink3, fontSize: 13 }}>Cargando productos...</div>
          )}
        </div>
        <div style={{ height: 80 }}/>
      </div>

      {totalItems > 0 && (
        <div onClick={() => navigate('/cliente/checkout')} style={{
          position: 'absolute', bottom: 72, left: 16, right: 16,
          background: T.accent, borderRadius: 14, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', boxShadow: `0 8px 20px ${T.accent}60`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,.25)', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{totalItems}</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Ver pedido</span>
          </div>
          <I.chevR size={18} color="#fff"/>
        </div>
      )}

      <TabBar active="home" T={T}/>
    </div>
  );
}
