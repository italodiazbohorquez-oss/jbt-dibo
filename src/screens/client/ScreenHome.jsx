import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { ProductIcon } from '../../components/ProductIcon';
import { getProductos } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useIsMobile';

export function ScreenHome({ theme: T }) {
  const navigate = useNavigate();
  const { agregar, totalItems, total } = useCart();
  const isMobile = useIsMobile();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [agregado, setAgregado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  function handleAgregar(e, p) {
    e.stopPropagation();
    agregar(p, 1);
    setAgregado(p.id);
    setTimeout(() => setAgregado(null), 1200);
  }

  useEffect(() => {
    getProductos().then(({ data }) => {
      setProductos(data || []);
      setCargando(false);
    });
  }, []);

  const categorias = ['Todos', 'Agregados', 'Cementos', 'Ladrillos', 'Fierros'];
  const tipoMap = { Agregados: ['arena','piedra','hormigon'], Cementos: ['cemento'], Ladrillos: ['ladrillo'], Fierros: ['fierro'] };

  const productosFiltrados = productos
    .filter(p => filtro === 'Todos' || (tipoMap[filtro] || []).includes(p.tipo))
    .filter(p => !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.body }}>
      <div style={{ background: T.primary, padding: isMobile ? '14px 0 24px' : '20px 0 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
          {!isMobile && <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginBottom: 10 }}>Materiales de construcción · Lima</div>}
          <div style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 600, boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}>
            <I.search size={18} color={T.ink3}/>
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar material..."
              style={{ border: 'none', outline: 'none', fontSize: 14, color: T.ink, flex: 1, fontFamily: T.body, background: 'transparent' }}/>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
        <div style={{ background: T.accent, borderRadius: 14, padding: isMobile ? '14px 18px' : '20px 28px', display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20, margin: isMobile ? '14px 0' : '24px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.1)', pointerEvents: 'none' }}/>
          <div style={{ width: isMobile ? 40 : 56, height: isMobile ? 40 : 56, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <I.truck size={isMobile ? 20 : 28} color={T.accent}/>
          </div>
          <div style={{ position: 'relative' }}>
            {!isMobile && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Oferta especial</div>}
            <div style={{ fontSize: isMobile ? 15 : 20, fontWeight: 900, color: '#fff', fontFamily: T.display, marginTop: isMobile ? 0 : 2 }}>Envío gratis +S/500</div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>Lima · Entrega el mismo día</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 20 : 32 }}>
          {[
            { i: 'calc', l: 'Cotizar', desc: 'Calcula tu presupuesto', path: '/cliente/cotizador' },
            { i: 'doc', l: 'Mis pedidos', desc: 'Ver historial', path: '/cliente/pedidos' },
            { i: 'truck', l: 'Rastrear', desc: 'Dónde está tu envío', path: '/cliente/tracking' },
            { i: 'chat', l: 'Soporte', desc: 'WhatsApp y ayuda', path: '#' },
          ].map((x) => {
            const Ic = I[x.i];
            return (
              <div key={x.i} onClick={() => x.path !== '#' && navigate(x.path)}
                style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: isMobile ? '12px 8px' : '16px', cursor: 'pointer', textAlign: isMobile ? 'center' : 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = T.primarySoft}
                onMouseLeave={e => e.currentTarget.style.background = T.surface}>
                <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 10, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 6 : 10, ...(isMobile ? { margin: '0 auto 6px' } : {}) }}>
                  <Ic size={isMobile ? 18 : 22} color={T.primary}/>
                </div>
                <div style={{ fontSize: isMobile ? 11 : 14, fontWeight: 700, color: T.ink }}>{x.l}</div>
                {!isMobile && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{x.desc}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Catálogo de materiales</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categorias.map((c) => (
              <button key={c} onClick={() => setFiltro(c)} style={{
                padding: '7px 16px', borderRadius: 20,
                border: `1.5px solid ${filtro === c ? T.primary : T.line}`,
                background: filtro === c ? T.primary : T.surface,
                color: filtro === c ? '#fff' : T.ink2,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.body,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: T.ink3 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Cargando catálogo...</div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: T.surface, borderRadius: 20, border: `1px dashed ${T.line}`, marginBottom: 40 }}>
            <div style={{ fontSize: 40 }}>🏗️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginTop: 12, fontFamily: T.display }}>
              {busqueda ? `Sin resultados para "${busqueda}"` : 'Catálogo sin productos aún'}
            </div>
            <div style={{ fontSize: 14, color: T.ink3, marginTop: 6 }}>
              {busqueda ? 'Prueba con otro término de búsqueda' : 'Los productos aparecerán aquí una vez se agreguen en el panel de administración'}
            </div>
            {busqueda && (
              <button onClick={() => setBusqueda('')} style={{ marginTop: 16, padding: '10px 24px', background: T.primary, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: T.body }}>
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: isMobile ? 10 : 16, marginBottom: 80 }}>
            {productosFiltrados.map((p) => (
              <div key={p.id} style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.line}`, overflow: 'hidden' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div onClick={() => navigate('/cliente/detalle', { state: { producto: p } })}
                  style={{ padding: isMobile ? '16px 12px 10px' : '24px 20px 16px', display: 'flex', justifyContent: 'center', background: T.bg, position: 'relative', cursor: 'pointer' }}>
                  {p.stock_actual != null && p.stock_minimo != null && p.stock_actual <= p.stock_minimo && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#E5B100', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5 }}>BAJO STOCK</div>
                  )}
                  <ProductIcon kind={p.tipo} size={isMobile ? 60 : 88} theme={T} imagenUrl={p.imagen_url}/>
                </div>
                <div style={{ padding: isMobile ? '10px 12px 14px' : '14px 18px 18px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{p.tipo}</div>
                  <div onClick={() => navigate('/cliente/detalle', { state: { producto: p } })}
                    style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: isMobile ? 6 : 4, cursor: 'pointer' }}>{p.nombre}</div>
                  {!isMobile && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{p.descripcion?.slice(0, 55)}</div>}
                  <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, color: T.ink, fontFamily: T.display, marginBottom: 2 }}>{fmt(p.precio_unitario ?? p.precio ?? 0)}</div>
                  <div style={{ fontSize: 10, color: T.ink3, marginBottom: 10 }}>por {p.unidad}</div>
                  <button onClick={(e) => handleAgregar(e, p)}
                    style={{ width: '100%', padding: isMobile ? '9px 0' : '10px 18px', borderRadius: 10, border: 'none', background: agregado === p.id ? T.ok : T.accent, color: '#fff', fontWeight: 700, fontSize: isMobile ? 12 : 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background .2s', fontFamily: T.body }}>
                    {agregado === p.id
                      ? <><I.check size={13} color="#fff"/> Agregado</>
                      : <><I.plus size={13} color="#fff"/> Agregar</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: isMobile ? 70 : 24, left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}>
          <button onClick={() => navigate('/cliente/checkout')}
            style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: 14, padding: isMobile ? '12px 20px' : '14px 32px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: `0 8px 28px ${T.accent}70`, fontFamily: T.body, whiteSpace: 'nowrap' }}>
            <div style={{ background: 'rgba(255,255,255,.25)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>{totalItems}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Ver carrito · {fmt(total)}</span>
            <I.chevR size={16} color="#fff"/>
          </button>
        </div>
      )}
    </div>
  );
}
