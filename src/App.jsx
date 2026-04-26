import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/auth/LoginScreen';
import { LandingScreen } from './screens/auth/LandingScreen';
import { TOKENS } from './tokens';
import { Phone } from './components/UI';
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

function MobileWrapper({ children }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#f0eee9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Phone theme={T}>{children}</Phone>
    </div>
  );
}

// Solo visible para clientes — sin acceso al panel admin
function ClientTopNav({ themeKey, setThemeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 28 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, fontFamily: T.display }}>JB</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, fontFamily: T.display, lineHeight: 1.2 }}>JBT DIBO S.A.C</div>
          <div style={{ fontSize: 9, color: T.ink3, lineHeight: 1 }}>RUC 20615017770</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {[
          { path: '/cliente/home', label: 'App Cliente', icon: '📱', active: isClient },
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
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowThemes(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, border: '1px solid #DCE4DF', background: '#fff', cursor: 'pointer', fontFamily: T.body, fontSize: 12 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              <div style={{ width: 8, height: 14, borderRadius: 2, background: T.primary }}/>
              <div style={{ width: 8, height: 14, borderRadius: 2, background: T.accent }}/>
            </div>
            <span style={{ color: T.ink, fontWeight: 600 }}>{T.name}</span>
          </button>
          {showThemes && (
            <>
              <div onClick={() => setShowThemes(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }}/>
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', borderRadius: 10, padding: 6, boxShadow: '0 8px 24px rgba(0,0,0,.12)', minWidth: 180, zIndex: 100 }}>
                {Object.entries(TOKENS).map(([k, t]) => (
                  <div key={k} onClick={() => { setThemeKey(k); setShowThemes(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, cursor: 'pointer', background: k === themeKey ? '#f5f5f5' : 'transparent' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      <div style={{ width: 10, height: 16, borderRadius: 2, background: t.primary }}/>
                      <div style={{ width: 10, height: 16, borderRadius: 2, background: t.accent }}/>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1A17' }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
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
  const [authView, setAuthView] = useState('landing');
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

  // No autenticado → landing o login
  if (!user) {
    if (authView === 'landing') {
      return (
        <LandingScreen
          onLogin={() => setAuthView('login')}
          onRegister={() => setAuthView('register')}
        />
      );
    }
    return <LoginScreen onBack={() => setAuthView('landing')} initialMode={authView}/>;
  }

  // Admin → pantalla completa sin TopNav de clientes
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

  // Cliente / B2B → TopNav + Phone frame
  return (
    <div style={{ minHeight: '100vh', background: '#f0eee9' }}>
      <ClientTopNav themeKey={themeKey} setThemeKey={setThemeKey}/>
      <div style={{ marginTop: 52 }}>
        <Routes>
          <Route path="/" element={<SmartRedirect/>}/>
          <Route path="/cliente/home" element={<MobileWrapper><ScreenHome theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/detalle" element={<MobileWrapper><ScreenDetail theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/cotizador" element={<MobileWrapper><ScreenQuote theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/checkout" element={<MobileWrapper><ScreenCheckout theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/pedidos" element={<MobileWrapper><ScreenPedidos theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/tracking" element={<MobileWrapper><ScreenTracking theme={T}/></MobileWrapper>}/>
          <Route path="/b2b" element={<MobileWrapper><ScreenFerreteria theme={T}/></MobileWrapper>}/>
          <Route path="*" element={<SmartRedirect/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;
