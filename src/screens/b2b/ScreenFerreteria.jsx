import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const quickActions = [
  { emoji: '🔄', l: 'Repetir pedido',  sub: 'Últimos 30 días' },
  { emoji: '🧾', l: 'Mis facturas',    sub: 'Ver historial'   },
  { emoji: '📊', l: 'Mis compras',     sub: 'Ver reportes'    },
];

const mayorista = [
  { k: 'cemento',  id: 'b2b-cemento',  n: 'Cemento Sol 42.5kg',  pm: 23,   pu: 28,  min: 50,  unidad: 'bolsas',   tipo: 'cemento'  },
  { k: 'ladrillo', id: 'b2b-ladrillo', n: 'Ladrillo KK 18h',     pm: 0.95, pu: 1.2, min: 1000, unidad: 'unidades', tipo: 'ladrillo' },
  { k: 'fierro',   id: 'b2b-fierro',   n: 'Fierro 1/2" x 9m',   pm: 32,   pu: 38,  min: 20,  unidad: 'varillas',  tipo: 'fierro'   },
  { k: 'arena',    id: 'b2b-arena',    n: 'Arena gruesa',        pm: 62,   pu: 75,  min: 10,  unidad: 'm³',        tipo: 'arena'    },
];

export function ScreenFerreteria({ theme: T }) {
  const navigate = useNavigate();
  const { agregar, totalItems } = useCart();
  const { profile } = useAuth();
  const [cantidades, setCantidades] = useState(
    Object.fromEntries(mayorista.map(p => [p.id, p.min]))
  );
  const [agregados, setAgregados] = useState({});

  function setCant(id, val) {
    const num = Math.max(1, parseInt(val) || 1);
    setCantidades(prev => ({ ...prev, [id]: num }));
  }

  function handleAgregar(prod) {
    const cant = cantidades[prod.id];
    agregar({
      id: prod.id,
      nombre: prod.n,
      tipo: prod.tipo,
      unidad: prod.unidad,
      precio: prod.pm,
    }, cant);
    setAgregados(prev => ({ ...prev, [prod.id]: true }));
    setTimeout(() => setAgregados(prev => ({ ...prev, [prod.id]: false })), 1500);
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      {/* Header */}
      <div style={{ background: T.ink, padding: '32px 0 40px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, opacity: .65, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Portal</div>
              <div style={{ fontSize: 28, fontWeight: 900, fontFamily: T.display }}>
                {profile?.empresa || profile?.nombre || 'Canal Mayorista'}
              </div>
              <div style={{ fontSize: 14, opacity: .7, marginTop: 4 }}>Canal mayorista B2B · Precios especiales</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Badge theme={T} tone="accent">B2B MAYORISTA</Badge>
              {totalItems > 0 && (
                <button
                  onClick={() => navigate('/cliente/checkout')}
                  style={{ padding: '8px 16px', background: T.accent, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  🛒 Ver carrito ({totalItems})
                </button>
              )}
            </div>
          </div>

          {/* Info banner */}
          <div style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark || T.primary} 100%)`, borderRadius: 20, padding: '20px 24px', marginTop: 24, position: 'relative', overflow: 'hidden', maxWidth: 480 }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: .75, letterSpacing: '.06em', textTransform: 'uppercase' }}>Beneficio mayorista activo</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: T.display }}>−18%</span>
              <span style={{ fontSize: 14, opacity: .7 }}>vs precio público</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, opacity: .8 }}>
              Descuento aplicado automáticamente en todos los productos
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {quickActions.map((x, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontSize: 28 }}>{x.emoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{x.l}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{x.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Precio mayorista</div>
          <Badge theme={T} tone="primary">−18% vs precio público</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mayorista.map((x) => {
            const agregado = agregados[x.id];
            return (
              <div key={x.id} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <ProductIcon kind={x.k} size={56} theme={T}/>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{x.n}</div>
                  <div style={{ fontSize: 13, color: T.ink3, marginTop: 3 }}>Compra mínima: {x.min} {x.unidad}</div>
                </div>

                {/* Precios */}
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <div style={{ fontSize: 12, color: T.ink3, textDecoration: 'line-through' }}>S/{x.pu} / {x.unidad}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.primary, fontFamily: T.display }}>S/{x.pm}</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>por {x.unidad.replace('s', '')}</div>
                </div>

                {/* Cantidad + botón */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${T.line}`, borderRadius: 10, overflow: 'hidden' }}>
                    <button
                      onClick={() => setCant(x.id, cantidades[x.id] - (x.id === 'b2b-ladrillo' ? 100 : 1))}
                      style={{ width: 36, height: 40, background: T.bg, border: 'none', cursor: 'pointer', fontSize: 18, color: T.ink, fontWeight: 700 }}
                    >−</button>
                    <input
                      type="number"
                      value={cantidades[x.id]}
                      onChange={e => setCant(x.id, e.target.value)}
                      min={x.min}
                      style={{ width: 64, textAlign: 'center', border: 'none', fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: T.body, padding: '0 4px', height: 40, outline: 'none' }}
                    />
                    <button
                      onClick={() => setCant(x.id, cantidades[x.id] + (x.id === 'b2b-ladrillo' ? 100 : 1))}
                      style={{ width: 36, height: 40, background: T.bg, border: 'none', cursor: 'pointer', fontSize: 18, color: T.ink, fontWeight: 700 }}
                    >+</button>
                  </div>

                  <button
                    onClick={() => handleAgregar(x)}
                    style={{
                      height: 44, padding: '0 16px', borderRadius: 12,
                      background: agregado ? T.ok : T.primary,
                      border: 'none', color: '#fff', fontWeight: 700,
                      fontSize: 13, cursor: 'pointer', fontFamily: T.body,
                      transition: 'background .2s', whiteSpace: 'nowrap',
                    }}
                  >
                    {agregado ? '✓ Agregado' : '+ Agregar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtotal flotante si hay items */}
        {totalItems > 0 && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, background: T.accent, color: '#fff', borderRadius: 16, padding: '14px 20px', boxShadow: '0 8px 30px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', gap: 14, zIndex: 50 }}>
            <div>
              <div style={{ fontSize: 12, opacity: .8 }}>{totalItems} productos en carrito</div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: T.display }}>Ver resumen del pedido</div>
            </div>
            <button
              onClick={() => navigate('/cliente/checkout')}
              style={{ padding: '10px 18px', background: '#fff', color: T.accent, border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}
            >
              Ir al carrito →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
