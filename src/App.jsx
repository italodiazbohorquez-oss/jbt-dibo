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

const T = TOKENS.cantera;

function ClientTopNav({ themeKey, setThemeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const [showThemes, setShowThemes] = useState(false);

  const isClient = location.pathname.startsWith('/cliente');
  const isB2B = location.pathname.startsWith('/b2b');

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', height: 52, fontFamily: T.body,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 28, cursor: 'pointer' }} onClick={() => navigate('/cliente/home')}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, fontFamily: T.display }}>JB</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display, lineHeight: 1.2 }}>JBT DIBO S.A.C</div>
          <div style={{ fontSize: 9, color: T.ink3, lineHeight: 1 }}>RUC 20615017770</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {[
          { path: '/cliente/home', label: 'Tienda', icon: '🏠', active: isClient },
          { path: '/b2b', label: 'Ferretería B2B', icon: '🏪', active: isB2B },
        ].map((s) => (
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
        {/* Cart button */}
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

        {/* Pedidos */}
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
  if (profile.rol === 'admin') return <Navigate to="/admin" replace/>;
  if (profile.rol === 'ferreteria') return <Navigate to="/b2b" replace/>;
  return <Navigate to="/cliente/home" replace/>;
}

function AppContent() {
  const [themeKey, setThemeKey] = useState('cantera');
  const location = useLocation();
  const { user, profile, loading } = useAuth();

  const isAdmin = location.pathname.startsWith('/admin');

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

  if (isAdmin) {
    if (profile && profile.rol !== 'admin') return <Navigate to="/cliente/home" replace/>;
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

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <ClientTopNav themeKey={themeKey} setThemeKey={setThemeKey}/>
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
