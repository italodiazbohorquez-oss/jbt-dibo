import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LandingScreen } from './screens/auth/LandingScreen';
import { TOKENS } from './tokens';
import { ScreenHome } from './screens/client/ScreenHome';
import { ScreenDetail } from './screens/client/ScreenDetail';
import { ScreenQuote } from './screens/client/ScreenQuote';
import { ScreenCheckout } from './screens/client/ScreenCheckout';
import { ScreenTracking } from './screens/client/ScreenTracking';
import { ScreenPedidos } from './screens/client/ScreenPedidos';
import { ScreenFerreteria } from './screens/b2b/ScreenFerreteria';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { AdminRoutes } from './screens/admin/AdminRoutes';
import { AdminInventory } from './screens/admin/AdminInventory';
import { AdminPedidos } from './screens/admin/AdminPedidos';
import { ScreenRepartidor } from './screens/repartidor/ScreenRepartidor';

const T = TOKENS.cantera;

// ─── Login exclusivo para administradores ────────────────────────────────────
function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { error: err } = await signIn({ email, password });
      if (err) throw err;
      // App re-renders automáticamente cuando AuthContext detecta la sesión
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : (err.message || 'Error al iniciar sesión'));
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1410', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: T.body }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: T.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, fontFamily: T.display }}>JB</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: T.display }}>JBT DIBO S.A.C</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Panel de Administración</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>Correo electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              placeholder="admin@jbtdibo.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: T.body, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: T.body, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(220,50,50,.15)', border: '1px solid rgba(220,50,50,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#FF8080', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: 4, padding: '14px', borderRadius: 12, border: 'none', background: loading ? 'rgba(255,255,255,.1)' : T.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body }}>
            {loading ? 'Verificando...' : 'Acceder al panel'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
          Acceso restringido — solo personal autorizado
        </div>
      </div>
    </div>
  );
}

// ─── Acceso denegado (logueado pero no es admin) ─────────────────────────────
function AdminAccessDenied() {
  const { signOut } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#0A1410', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.body }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: T.display, marginBottom: 8 }}>Sin acceso</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 28 }}>
          Tu cuenta no tiene permisos de administrador. Ingresa con una cuenta admin.
        </div>
        <button onClick={signOut} style={{ padding: '12px 28px', background: T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.body }}>
          Cerrar sesión e intentar con otra cuenta
        </button>
      </div>
    </div>
  );
}

// ─── Navbar de clientes ───────────────────────────────────────────────────────
function ClientTopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { totalItems } = useCart();

  const isClient = location.pathname.startsWith('/cliente');
  const isB2B = location.pathname.startsWith('/b2b');
  const rol = profile?.rol;

  const navItems = [
    rol !== 'ferreteria' && { path: '/cliente/home', label: 'Tienda', icon: '🏠', active: isClient },
    (rol === 'maestro' || rol === 'ferreteria') && { path: '/b2b', label: 'Ferretería B2B', icon: '🏪', active: isB2B },
  ].filter(Boolean);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', height: 52, fontFamily: T.body,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 28, cursor: 'pointer' }} onClick={() => navigate(rol === 'ferreteria' ? '/b2b' : '/cliente/home')}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, fontFamily: T.display }}>JB</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display, lineHeight: 1.2 }}>JBT DIBO S.A.C</div>
          <div style={{ fontSize: 9, color: T.ink3, lineHeight: 1 }}>RUC 20615017770</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {navItems.map((s) => (
          <button key={s.path} onClick={() => navigate(s.path)} style={{
            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: T.body,
            background: s.active ? T.primarySoft : 'transparent',
            color: s.active ? T.primary : '#67746F',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <button onClick={() => navigate('/cliente/checkout')} style={{
          position: 'relative', padding: '6px 14px', borderRadius: 8, border: `1px solid ${T.line}`,
          background: totalItems > 0 ? T.primarySoft : '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.body, fontSize: 13, fontWeight: 600,
          color: totalItems > 0 ? T.primary : T.ink3,
        }}>
          🛒 Carrito
          {totalItems > 0 && (
            <span style={{ background: T.accent, color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{totalItems}</span>
          )}
        </button>

        <button onClick={() => navigate('/cliente/pedidos')} style={{
          padding: '6px 14px', borderRadius: 8, border: `1px solid ${T.line}`,
          background: location.pathname === '/cliente/pedidos' ? T.primarySoft : '#fff',
          color: location.pathname === '/cliente/pedidos' ? T.primary : T.ink3,
          cursor: 'pointer', fontFamily: T.body, fontSize: 13, fontWeight: 600,
        }}>
          Mis pedidos
        </button>

        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: T.primary }}>
              {profile.nombre?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{profile.nombre?.split(' ')[0]}</div>
              {profile.rol === 'maestro' && (
                <div style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: 'uppercase' }}>Maestro de obras</div>
              )}
            </div>
          </div>
        )}
        <button onClick={signOut} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.line}`, background: '#fff', fontSize: 12, fontWeight: 600, color: T.ink3, cursor: 'pointer', fontFamily: T.body }}>
          Salir
        </button>
      </div>
    </nav>
  );
}

function SmartRedirect() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.rol === 'ferreteria') return <Navigate to="/b2b" replace/>;
  return <Navigate to="/cliente/home" replace/>;
}

// ─── App principal ────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const { user, profile, loading } = useAuth();

  const isAdmin = location.pathname.startsWith('/admin');
  const isRepartidor = location.pathname.startsWith('/repartidor');

  // ── Ruta /repartidor — completamente independiente ────────────────────────
  if (isRepartidor) {
    return <ScreenRepartidor />;
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1410', fontFamily: T.body }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: T.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>JB</span>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>Cargando...</div>
      </div>
    </div>
  );

  // ── Rutas /admin — completamente independientes ───────────────────────────
  if (isAdmin) {
    if (!user) return <AdminLogin/>;
    if (profile && profile.rol !== 'admin') return <AdminAccessDenied/>;
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: T.bg, overflow: 'hidden', fontFamily: T.body }}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard theme={T}/>}/>
          <Route path="/admin/pedidos" element={<AdminPedidos theme={T}/>}/>
          <Route path="/admin/rutas" element={<AdminRoutes theme={T}/>}/>
          <Route path="/admin/inventario" element={<AdminInventory theme={T}/>}/>
          <Route path="/admin/*" element={<AdminDashboard theme={T}/>}/>
        </Routes>
      </div>
    );
  }

  // ── Rutas públicas (sin sesión) ───────────────────────────────────────────
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingScreen/>}/>
        <Route path="/login" element={<LoginScreen initialMode="login"/>}/>
        <Route path="/register" element={<LoginScreen initialMode="register"/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    );
  }

  // ── Rutas de clientes ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <ClientTopNav/>
      <div style={{ marginTop: 52 }}>
        <Routes>
          <Route path="/" element={<SmartRedirect/>}/>
          <Route path="/login" element={<SmartRedirect/>}/>
          <Route path="/register" element={<SmartRedirect/>}/>
          <Route path="/cliente/home" element={<ScreenHome theme={T}/>}/>
          <Route path="/cliente/detalle" element={<ScreenDetail theme={T}/>}/>
          <Route path="/cliente/cotizador" element={<ScreenQuote theme={T}/>}/>
          <Route path="/cliente/checkout" element={<ScreenCheckout theme={T}/>}/>
          <Route path="/cliente/pedidos" element={<ScreenPedidos theme={T}/>}/>
          <Route path="/cliente/tracking" element={<ScreenTracking theme={T}/>}/>
          <Route path="/b2b" element={<ScreenFerreteria theme={T}/>}/>
          <Route path="*" element={<SmartRedirect/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;
