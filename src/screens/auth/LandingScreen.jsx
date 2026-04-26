import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRIMARY = '#0E5A3D';
const ACCENT = '#F26B1D';
const INK = '#0F1A17';
const BODY = "'Inter', system-ui, sans-serif";
const DISPLAY = "'Archivo', 'Inter', system-ui, sans-serif";

const PRODUCTOS = [
  { emoji: '🏖️', nombre: 'Arena gruesa', unidad: 'por m³', precio: 'S/380', tipo: 'Agregado' },
  { emoji: '🪨', nombre: 'Piedra chancada', unidad: 'por m³', precio: 'S/420', tipo: 'Agregado' },
  { emoji: '🧱', nombre: 'Cemento Sol 42.5', unidad: 'por bolsa', precio: 'S/28.50', tipo: 'Cemento' },
  { emoji: '🟫', nombre: 'Ladrillo King Kong', unidad: 'por millar', precio: 'S/680', tipo: 'Ladrillo' },
  { emoji: '🔩', nombre: 'Fierro 1/2"', unidad: 'por varilla', precio: 'S/42', tipo: 'Fierro' },
  { emoji: '💧', nombre: 'Hormigón', unidad: 'por m³', precio: 'S/350', tipo: 'Agregado' },
];

const BENEFICIOS = [
  { icon: '🚚', titulo: 'Entrega el mismo día', desc: 'Volquetes propios disponibles en Lima. Sin esperas ni excusas.' },
  { icon: '📍', titulo: 'Directo a tu obra', desc: 'Descargamos exactamente donde necesitas. Coordinamos con tu maestro.' },
  { icon: '💰', titulo: 'Precio de cantera', desc: 'Sin intermediarios. Compra directo al distribuidor con precios justos.' },
];

export function LandingScreen() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const onLogin = () => navigate('/login');
  const onRegister = () => navigate('/register');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function scrollToProductos() {
    const el = document.getElementById('productos-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ fontFamily: BODY }}>
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(15,26,23,.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.08)' : 'none',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background .3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 13, fontFamily: DISPLAY }}>JB</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: DISPLAY }}>JBT DIBO S.A.C</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>RUC 20615017770</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onLogin}
            style={{ padding: '8px 18px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: BODY }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={onRegister}
            style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
          >
            Registrarse gratis
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', background: `linear-gradient(135deg, #0A1410 0%, #0E5A3D 60%, #0A3D29 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(242,107,29,.06)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 760, width: '100%', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(242,107,29,.15)', border: '1px solid rgba(242,107,29,.3)', borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }}/>
            <span style={{ fontSize: 12, color: '#F2A06D', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>Materiales de construcción · Lima</span>
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900, color: '#fff', fontFamily: DISPLAY, lineHeight: 1.05, letterSpacing: '-.03em', margin: '0 0 16px' }}>
            Tu obra nunca<br/><span style={{ color: ACCENT }}>para.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'rgba(255,255,255,.7)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Arena, piedra, cemento y más — directo de cantera a tu obra. Entrega el mismo día en Lima, sin excusas.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onRegister}
              style={{ padding: '16px 32px', borderRadius: 14, border: 'none', background: ACCENT, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: BODY, boxShadow: `0 8px 24px -6px ${ACCENT}80` }}
            >
              Crear cuenta gratis →
            </button>
            <button
              onClick={scrollToProductos}
              style={{ padding: '16px 32px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
            >
              Ver materiales
            </button>
          </div>

          <div style={{ display: 'flex', marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.1)', justifyContent: 'center' }}>
            {[
              { n: '+500', l: 'obras atendidas' },
              { n: '5,000 m³', l: 'despachados/mes' },
              { n: 'Mismo día', l: 'entrega garantizada' },
            ].map((s, i, arr) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 16px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#fff', fontFamily: DISPLAY }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beneficios ─────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>¿Por qué JBT DIBO?</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: INK, fontFamily: DISPLAY, letterSpacing: '-.02em', margin: 0 }}>
              Construye sin interrupciones
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {BENEFICIOS.map((b, i) => (
              <div key={i} style={{ background: '#F6F8F5', borderRadius: 18, padding: 24, border: '1px solid #DCE4DF' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: INK, fontFamily: DISPLAY, marginBottom: 8 }}>{b.titulo}</div>
                <div style={{ fontSize: 14, color: '#67746F', lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos ──────────────────────────────────── */}
      <section id="productos-section" style={{ background: '#F6F8F5', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Catálogo</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: INK, fontFamily: DISPLAY, letterSpacing: '-.02em', margin: 0 }}>
                Nuestros materiales
              </h2>
            </div>
            <button
              onClick={onRegister}
              style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: PRIMARY, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
            >
              Ver precios completos →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {PRODUCTOS.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 18, border: '1px solid #DCE4DF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontSize: 38 }}>{p.emoji}</span>
                  <span style={{ background: '#E8F2EC', color: PRIMARY, fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>{p.tipo}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: INK, fontFamily: DISPLAY }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: '#67746F', marginTop: 3, marginBottom: 12 }}>{p.unidad}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: PRIMARY, fontFamily: DISPLAY }}>{p.precio}</div>
                  <button
                    onClick={onRegister}
                    style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: ACCENT, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
                  >
                    Pedir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #DCE4DF' }}>
            <div style={{ fontSize: 14, color: '#67746F' }}>¿Necesitas cantidad exacta o cotización especial?</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginTop: 4 }}>Regístrate y cotiza en segundos. <span style={{ color: PRIMARY }}>Es gratis.</span></div>
          </div>
        </div>
      </section>

      {/* ── Tipos de cuenta ────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>Elige tu cuenta</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: INK, fontFamily: DISPLAY, letterSpacing: '-.02em', margin: 0 }}>
              Tenemos una opción para ti
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
            {/* Cliente directo */}
            <div style={{ background: '#E8F2EC', borderRadius: 20, padding: 24, border: `2px solid ${PRIMARY}20` }}>
              <div style={{ display: 'inline-block', background: PRIMARY, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '.08em', padding: '4px 10px', borderRadius: 6, marginBottom: 14 }}>CLIENTE DIRECTO</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: INK, fontFamily: DISPLAY, marginBottom: 16 }}>Para tu casa o proyecto</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {['🛒 Pedidos al por menor', '📍 Dirección con GPS desde tu cel', '💬 Atención directa por WhatsApp', '📦 Entrega programada a tu obra'].map((p, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#3B4A44' }}>{p}</div>
                ))}
              </div>
              <button
                onClick={onRegister}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: PRIMARY, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
              >
                Crear cuenta como cliente →
              </button>
            </div>

            {/* Maestro de obras */}
            <div style={{ background: '#FFE9D8', borderRadius: 20, padding: 24, border: `2px solid ${ACCENT}20` }}>
              <div style={{ display: 'inline-block', background: ACCENT, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '.08em', padding: '4px 10px', borderRadius: 6, marginBottom: 14 }}>MAESTRO DE OBRAS</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: INK, fontFamily: DISPLAY, marginBottom: 16 }}>Para constructores frecuentes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {['💲 Precios especiales por volumen', '🏗️ Descuentos por cantidad de obras', '📋 Cuenta verificada con beneficios', '🤝 Atención prioritaria y crédito'].map((p, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#3B4A44' }}>{p}</div>
                ))}
              </div>
              <button
                onClick={onRegister}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: ACCENT, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: BODY }}
              >
                Crear cuenta como maestro →
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#67746F' }}>
            ¿Ya tienes cuenta?{' '}
            <span
              onClick={onLogin}
              style={{ color: PRIMARY, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Inicia sesión aquí
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: '#0A1410', padding: '40px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 11, fontFamily: DISPLAY }}>JB</div>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: DISPLAY }}>JBT DIBO S.A.C</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>RUC: 20615017770</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>Lima, Perú · Materiales de construcción</div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
            © 2025 JBT DIBO S.A.C. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
