import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './screens/auth/LoginScreen';
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

function MobileWrapper({ theme: T, children }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      background: '#f0eee9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <Phone theme={T}>{children}</Phone>
    </div>
  );
}

function TopNav({ theme: T, themeKey, setThemeKey }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showThemes, setShowThemes] = useState(false);
  const { profile, signOut } = useAuth();

  const isClient = location.pathname.startsWith('/cliente');
  const isB2B = location.pathname.startsWith('/b2b');
  const isAdmin = location.pathname.startsWith('/admin');

  const sections = [
    { id: 'cliente', path: '/cliente/home', label: 'App Cliente', icon: '📱' },
    { id: 'b2b', path: '/b2b', label: 'Ferretería B2B', icon: '🏪' },
    { id: 'admin', path: '/admin', label: 'Panel Admin', icon: '🖥️' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,.08)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', height: 52,
      fontFamily: T.body,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 32 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, fontFamily: T.display }}>JB</div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F1A17', fontFamily: T.display }}>JBT DIBO</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {sections.map((s) => {
          const isActive = (s.id === 'cliente' && isClient) || (s.id === 'b2b' && isB2B) || (s.id === 'admin' && isAdmin);
          return (
            <button key={s.id} onClick={() => navigate(s.path)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: T.body,
              background: isActive ? T.primarySoft : 'transparent',
              color: isActive ? T.primary : '#67746F',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Usuario logueado */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: T.primary }}>
              {profile.nombre?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink2 }}>{profile.nombre?.split(' ')[0]}</span>
          </div>
        )}
        <button onClick={signOut} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.line}`, background: '#fff', fontSize: 12, fontWeight: 600, color: T.ink3, cursor: 'pointer', fontFamily: T.body }}>
          Salir
        </button>
      </div>

      <div style={{ marginLeft: 12, position: 'relative' }}>
        <button onClick={() => setShowThemes(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
          borderRadius: 8, border: '1px solid #DCE4DF', background: '#fff',
          cursor: 'pointer', fontFamily: T.body, fontSize: 13, fontWeight: 600,
        }}>
          <div style={{ display: 'flex', gap: 2 }}>
            <div style={{ width: 10, height: 16, borderRadius: 2, background: T.primary }}/>
            <div style={{ width: 10, height: 16, borderRadius: 2, background: T.accent }}/>
          </div>
          <span style={{ color: '#0F1A17' }}>{T.name}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#67746F" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        {showThemes && (
          <>
            <div onClick={() => setShowThemes(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }}/>
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', borderRadius: 12, padding: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06)',
              minWidth: 220, zIndex: 100,
            }}>
              {Object.entries(TOKENS).map(([k, t]) => (
                <div key={k} onClick={() => { setThemeKey(k); setShowThemes(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  borderRadius: 8, cursor: 'pointer',
                  background: k === themeKey ? '#f5f5f5' : 'transparent',
                }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <div style={{ width: 12, height: 20, borderRadius: 3, background: t.primary }}/>
                    <div style={{ width: 12, height: 20, borderRadius: 3, background: t.accent }}/>
                    <div style={{ width: 12, height: 20, borderRadius: 3, background: t.ink }}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1A17', fontFamily: T.display }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: '#67746F' }}>
                      {k === 'cantera' && 'Verde + naranja · delivery'}
                      {k === 'volquete' && 'Negro + amarillo · industrial'}
                      {k === 'arena' && 'Gris + terracota · premium'}
                    </div>
                  </div>
                  {k === themeKey && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const [themeKey, setThemeKey] = useState('cantera');
  const T = TOKENS[themeKey];
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eee9', fontFamily: T.body }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>JB</span>
        </div>
        <div style={{ fontSize: 14, color: T.ink3 }}>Cargando...</div>
      </div>
    </div>
  );

  if (!user) return <LoginScreen/>;

  return (
    <div style={{
      minHeight: '100vh',
      background: isAdmin ? T.bg : '#f0eee9',
      display: isAdmin ? 'flex' : 'block',
      flexDirection: isAdmin ? 'column' : undefined,
    }}>
      <TopNav theme={T} themeKey={themeKey} setThemeKey={setThemeKey}/>
      <div style={{
        marginTop: 52,
        flex: isAdmin ? 1 : undefined,
        height: isAdmin ? 'calc(100vh - 52px)' : undefined,
        overflow: isAdmin ? 'hidden' : undefined,
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/cliente/home" replace/>}/>
          <Route path="/cliente/home" element={<MobileWrapper theme={T}><ScreenHome theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/detalle" element={<MobileWrapper theme={T}><ScreenDetail theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/cotizador" element={<MobileWrapper theme={T}><ScreenQuote theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/checkout" element={<MobileWrapper theme={T}><ScreenCheckout theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/pedidos" element={<MobileWrapper theme={T}><ScreenPedidos theme={T}/></MobileWrapper>}/>
          <Route path="/cliente/tracking" element={<MobileWrapper theme={T}><ScreenTracking theme={T}/></MobileWrapper>}/>
          <Route path="/b2b" element={<MobileWrapper theme={T}><ScreenFerreteria theme={T}/></MobileWrapper>}/>
          <Route path="/admin" element={<AdminDashboard theme={T}/>}/>
          <Route path="/admin/pedidos" element={<AdminPedidos theme={T}/>}/>
          <Route path="/admin/rutas" element={<AdminRoutes theme={T}/>}/>
          <Route path="/admin/inventario" element={<AdminInventory theme={T}/>}/>
          <Route path="/admin/*" element={<AdminDashboard theme={T}/>}/>
          <Route path="*" element={<Navigate to="/cliente/home" replace/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;
