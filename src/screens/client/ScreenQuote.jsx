import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductIcon } from '../../components/ProductIcon';
import { useCart } from '../../context/CartContext';
import { useIsMobile } from '../../hooks/useIsMobile';

// Fórmulas de mezcla por m³ de concreto o m² de área
const FORMULAS = {
  columna: {
    label: 'Columna', icon: '🏛️', desc: 'Vertical estructural',
    dim3: true,
    calcular: ({ ancho, largo, alto, cantidad, precios }) => {
      const vol = ancho * largo * alto * cantidad;
      const items = [
        { tipo: 'cemento', nombre: 'Cemento Sol 42.5kg', cantidad: Math.ceil(vol * 8.5), unidad: 'bolsas', precio: precios.cemento },
        { tipo: 'arena', nombre: 'Arena gruesa', cantidad: parseFloat((vol * 0.4).toFixed(2)), unidad: 'm³', precio: precios.arena },
        { tipo: 'piedra', nombre: 'Piedra chancada 1/2"', cantidad: parseFloat((vol * 0.6).toFixed(2)), unidad: 'm³', precio: precios.piedra },
        { tipo: 'fierro', nombre: 'Fierro 1/2" corrugado (9m)', cantidad: Math.ceil(alto * cantidad * 4 / 9) + Math.ceil(cantidad * 4), unidad: 'varillas', precio: precios.fierro },
      ];
      return items.map(i => ({ ...i, subtotal: i.cantidad * i.precio }));
    },
  },
  cimiento: {
    label: 'Cimiento', icon: '🏗️', desc: 'Zapatas y vigas de cimentación',
    dim3: true,
    calcular: ({ ancho, largo, alto, cantidad, precios }) => {
      const vol = ancho * largo * alto * cantidad;
      return [
        { tipo: 'cemento', nombre: 'Cemento Sol 42.5kg', cantidad: Math.ceil(vol * 7), unidad: 'bolsas', precio: precios.cemento, subtotal: Math.ceil(vol * 7) * precios.cemento },
        { tipo: 'arena', nombre: 'Arena gruesa', cantidad: parseFloat((vol * 0.6).toFixed(2)), unidad: 'm³', precio: precios.arena, subtotal: parseFloat((vol * 0.6).toFixed(2)) * precios.arena },
        { tipo: 'piedra', nombre: 'Piedra chancada 1/2"', cantidad: parseFloat((vol * 0.8).toFixed(2)), unidad: 'm³', precio: precios.piedra, subtotal: parseFloat((vol * 0.8).toFixed(2)) * precios.piedra },
        { tipo: 'fierro', nombre: 'Fierro 1/2" corrugado (9m)', cantidad: Math.ceil(cantidad * 8), unidad: 'varillas', precio: precios.fierro, subtotal: Math.ceil(cantidad * 8) * precios.fierro },
      ];
    },
  },
  losa: {
    label: 'Losa', icon: '🟫', desc: 'Aligerada o maciza',
    dim3: false,
    calcular: ({ ancho, largo, cantidad, precios }) => {
      const area = ancho * largo * cantidad;
      return [
        { tipo: 'cemento', nombre: 'Cemento Sol 42.5kg', cantidad: Math.ceil(area * 0.5), unidad: 'bolsas', precio: precios.cemento, subtotal: Math.ceil(area * 0.5) * precios.cemento },
        { tipo: 'arena', nombre: 'Arena gruesa', cantidad: parseFloat((area * 0.03).toFixed(2)), unidad: 'm³', precio: precios.arena, subtotal: parseFloat((area * 0.03).toFixed(2)) * precios.arena },
        { tipo: 'piedra', nombre: 'Piedra chancada 1/2"', cantidad: parseFloat((area * 0.04).toFixed(2)), unidad: 'm³', precio: precios.piedra, subtotal: parseFloat((area * 0.04).toFixed(2)) * precios.piedra },
        { tipo: 'ladrillo', nombre: 'Ladrillo hueco 15x30x30', cantidad: Math.ceil(area * 8), unidad: 'und', precio: precios.ladrillo, subtotal: Math.ceil(area * 8) * precios.ladrillo },
        { tipo: 'fierro', nombre: 'Fierro 3/8" (9m)', cantidad: Math.ceil(area * 0.5), unidad: 'varillas', precio: precios.fierro38, subtotal: Math.ceil(area * 0.5) * precios.fierro38 },
      ];
    },
  },
  muro: {
    label: 'Muro', icon: '🧱', desc: 'Ladrillo + mortero',
    dim3: false,
    calcular: ({ ancho: largo, largo: alto, cantidad, precios }) => {
      const area = largo * alto * cantidad;
      return [
        { tipo: 'ladrillo', nombre: 'Ladrillo KK 18 huecos', cantidad: Math.ceil(area * 36), unidad: 'und', precio: precios.ladrillo, subtotal: Math.ceil(area * 36) * precios.ladrillo },
        { tipo: 'cemento', nombre: 'Cemento Sol 42.5kg', cantidad: Math.ceil(area * 0.2), unidad: 'bolsas', precio: precios.cemento, subtotal: Math.ceil(area * 0.2) * precios.cemento },
        { tipo: 'arena', nombre: 'Arena fina', cantidad: parseFloat((area * 0.025).toFixed(2)), unidad: 'm³', precio: precios.arena, subtotal: parseFloat((area * 0.025).toFixed(2)) * precios.arena },
      ];
    },
  },
};

const PRECIOS_DEFAULT = { cemento: 28, arena: 75, piedra: 88, ladrillo: 1.20, fierro: 38, fierro38: 25 };

export function ScreenQuote({ theme: T }) {
  const navigate = useNavigate();
  const { agregar } = useCart();
  const isMobile = useIsMobile();

  const [tipo, setTipo] = useState('columna');
  const [dims, setDims] = useState({ ancho: '0.30', largo: '0.30', alto: '2.80' });
  const [cantidad, setCantidad] = useState(1);
  const [resultado, setResultado] = useState(null);
  const [agregados, setAgregados] = useState(false);

  const formula = FORMULAS[tipo];
  const setDim = (k) => (e) => setDims(d => ({ ...d, [k]: e.target.value }));

  function calcular() {
    const ancho = parseFloat(dims.ancho) || 0;
    const largo = parseFloat(dims.largo) || 0;
    const alto = parseFloat(dims.alto) || 0;
    if (ancho <= 0 || largo <= 0) return;
    const items = formula.calcular({ ancho, largo, alto, cantidad, precios: PRECIOS_DEFAULT });
    setResultado(items);
    setAgregados(false);
  }

  function agregarTodo() {
    resultado.forEach(item => {
      agregar({
        id: item.tipo + '_quote',
        producto_id: null,
        nombre: item.nombre,
        tipo: item.tipo,
        unidad: item.unidad,
        precio_unitario: item.precio,
        subtotal: item.subtotal,
      }, item.cantidad);
    });
    setAgregados(true);
  }

  const total = resultado?.reduce((s, i) => s + i.subtotal, 0) || 0;
  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0 });

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body }}>
      <div style={{ background: T.primary, padding: isMobile ? '20px 0 28px' : '32px 0 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 14px' : '0 24px' }}>
          {!isMobile && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>Herramienta gratuita</div>}
          <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color: '#fff', fontFamily: T.display }}>Cotizador de obra</div>
          <div style={{ fontSize: isMobile ? 13 : 15, color: 'rgba(255,255,255,.75)', marginTop: 4 }}>Cantidades exactas de materiales para tu proyecto</div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '16px 14px' : '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: isMobile ? 16 : 24, alignItems: 'start' }}>
          {/* Left: inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Tipo de elemento */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>¿Qué vas a construir?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(FORMULAS).map(([k, f]) => (
                  <div key={k} onClick={() => { setTipo(k); setResultado(null); }} style={{
                    background: tipo === k ? T.primary : T.bg, border: `2px solid ${tipo === k ? T.primary : T.line}`,
                    borderRadius: 14, padding: 16, cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 24 }}>{f.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: tipo === k ? '#fff' : T.ink, marginTop: 8 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: tipo === k ? 'rgba(255,255,255,.75)' : T.ink3, marginTop: 2 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensiones */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>
                Dimensiones {tipo === 'muro' ? '(Largo × Alto)' : tipo === 'losa' ? '(Ancho × Largo)' : '(Ancho × Largo × Alto)'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: formula.dim3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
                {[
                  { k: 'ancho', l: tipo === 'muro' ? 'Largo (m)' : 'Ancho (m)', placeholder: '0.30' },
                  { k: 'largo', l: tipo === 'muro' ? 'Alto (m)' : 'Largo (m)', placeholder: tipo === 'losa' ? '5.00' : '0.30' },
                  ...(formula.dim3 ? [{ k: 'alto', l: 'Alto (m)', placeholder: '2.80' }] : []),
                ].map(d => (
                  <div key={d.k}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>{d.l}</label>
                    <input
                      type="number" step="0.01" value={dims[d.k]}
                      onChange={setDim(d.k)} placeholder={d.placeholder}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 16, fontFamily: T.display, fontWeight: 800, color: T.ink, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: '12px 16px', background: T.bg, borderRadius: 12, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink2 }}>Cantidad de {formula.label.toLowerCase()}s</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setCantidad(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.line}`, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>−</button>
                  <span style={{ fontSize: 20, fontWeight: 900, fontFamily: T.display, color: T.ink, minWidth: 32, textAlign: 'center' }}>{cantidad}</span>
                  <button onClick={() => setCantidad(q => q + 1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: `1px solid ${T.line}`, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>+</button>
                </div>
              </div>

              <button onClick={calcular} style={{
                width: '100%', marginTop: 16, padding: '14px', borderRadius: 12, border: 'none',
                background: T.primary, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: T.body,
              }}>
                Calcular materiales →
              </button>
            </div>
          </div>

          {/* Right: results */}
          <div style={isMobile ? {} : { position: 'sticky', top: 72 }}>
            {!resultado ? (
              <div style={{ background: '#fff', borderRadius: 16, border: `1px dashed ${T.line}`, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 40 }}>📐</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginTop: 12, fontFamily: T.display }}>Ingresa las dimensiones</div>
                <div style={{ fontSize: 13, color: T.ink3, marginTop: 6 }}>El cálculo aparecerá aquí con los materiales exactos</div>
              </div>
            ) : (
              <div style={{ background: T.ink, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Resultado</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: T.display, marginTop: 4 }}>
                    {cantidad} {formula.label.toLowerCase()}{cantidad > 1 ? 's' : ''} · {dims.ancho}×{dims.largo}{formula.dim3 ? `×${dims.alto}` : ''}m
                  </div>
                </div>

                <div style={{ padding: '16px 24px' }}>
                  {resultado.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: i < resultado.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                      <ProductIcon kind={item.tipo} size={40} theme={T}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.nombre}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>
                          {item.cantidad} {item.unidad} × {fmt(item.precio)}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.accent, fontFamily: T.display }}>{fmt(item.subtotal)}</div>
                    </div>
                  ))}

                  <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Total estimado</span>
                    <span style={{ fontSize: 32, fontWeight: 900, color: T.accent, fontFamily: T.display }}>{fmt(total)}</span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
                    * Estimado incluye 10% de desperdicio. Precios pueden variar.
                  </div>

                  <button onClick={agregarTodo} disabled={agregados} style={{
                    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                    background: agregados ? T.ok : T.accent,
                    color: '#fff', fontSize: 15, fontWeight: 800, cursor: agregados ? 'default' : 'pointer', fontFamily: T.body,
                  }}>
                    {agregados ? '✓ Materiales en carrito' : 'Agregar todo al carrito'}
                  </button>
                  {agregados && (
                    <button onClick={() => navigate('/cliente/checkout')} style={{
                      width: '100%', marginTop: 10, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,.2)',
                      background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: T.body,
                    }}>
                      Ver carrito y confirmar pedido →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
