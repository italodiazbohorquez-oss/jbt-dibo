import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROL_LABEL = { cliente: 'Cliente', maestro: 'Maestro de obras', ferreteria: 'Ferretería B2B', admin: 'Administrador', repartidor: 'Repartidor' };
const ROL_COLOR = { cliente: '#2563EB', maestro: '#D97706', ferreteria: '#7C3AED', admin: '#DC2626', repartidor: '#059669' };

export function ScreenCuenta({ theme: T }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const inicial = profile.nombre?.charAt(0)?.toUpperCase() || '?';
  const rolColor = ROL_COLOR[profile.rol] || T.primary;
  const rolLabel = ROL_LABEL[profile.rol] || profile.rol;
  const waNumber = '51965432100'; // número de soporte JBT DIBO

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: T.bg, fontFamily: T.body, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: T.primary, padding: '40px 0 60px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: '3px solid rgba(255,255,255,.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: T.display, marginBottom: 14 }}>
            {inicial}
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: T.display }}>{profile.nombre}</div>
          <div style={{ display: 'inline-block', marginTop: 8, padding: '4px 14px', borderRadius: 20, background: rolColor, fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>
            {rolLabel}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '-28px auto 0', padding: '0 20px' }}>
        {/* Info card */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Información de cuenta</div>
          {[
            { icon: '👤', label: 'Nombre', value: profile.nombre },
            profile.empresa && { icon: '🏢', label: 'Empresa', value: profile.empresa },
            profile.celular && { icon: '📱', label: 'Celular', value: profile.celular },
            { icon: '🔖', label: 'Rol', value: rolLabel },
          ].filter(Boolean).map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.line2 || T.line}` : 'none' }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Accesos rápidos */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em', padding: '16px 20px 10px' }}>Accesos rápidos</div>
          {[
            { icon: '📦', label: 'Mis pedidos', desc: 'Ver historial de compras', action: () => navigate('/cliente/pedidos') },
            { icon: '🧮', label: 'Cotizador de obra', desc: 'Calcula materiales para tu proyecto', action: () => navigate('/cliente/cotizador') },
            { icon: '🛒', label: 'Ir a la tienda', desc: 'Explorar catálogo de materiales', action: () => navigate('/cliente/home') },
          ].map((item, i, arr) => (
            <div key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: `1px solid ${T.line2 || T.line}`, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = T.bg}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{item.label}</div>
                <div style={{ fontSize: 12, color: T.ink3 }}>{item.desc}</div>
              </div>
              <span style={{ color: T.ink3, fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>

        {/* Soporte */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${T.line}`, padding: 20, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Soporte</div>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola JBT DIBO, necesito ayuda con mi pedido.')}`}
            target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', padding: '12px 14px', background: '#E7F5E9', borderRadius: 12, border: '1px solid #4CAF50' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💬</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1B5E20' }}>Contactar por WhatsApp</div>
              <div style={{ fontSize: 12, color: '#388E3C', marginTop: 1 }}>Respuesta rápida · Lun–Sáb 7am–5pm</div>
            </div>
          </a>
        </div>

        {/* Cerrar sesión */}
        <button onClick={signOut} style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1.5px solid ${T.danger}`, background: '#fff', color: T.danger, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: T.body }}>
          Cerrar sesión
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: T.ink3 }}>
          JBT DIBO S.A.C · RUC 20615017770 · v2.0
        </div>
      </div>
    </div>
  );
}
