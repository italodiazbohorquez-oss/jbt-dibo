import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ScreenRegistro({ theme: T }) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegistro(e) {
    e.preventDefault();
    if (!nombre.trim()) { setError('Ingresa tu nombre completo.'); return; }
    if (!email.trim()) { setError('Ingresa tu correo electrónico.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true); setError('');
    const { error: err } = await signUp({ email, password, nombre: nombre.trim(), empresa: empresa.trim() || null, telefono: telefono.trim() || null, rol: 'cliente' });
    setLoading(false);
    if (err) { setError(err.message || 'Error al registrarse. Intenta de nuevo.'); return; }
    navigate('/cliente/home');
  }

  const inp = (val, set, ph, type = 'text') => (
    <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 14, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box', background: '#fff' }}/>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: T.body }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 }}>🧱</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: T.ink, fontFamily: T.display }}>Crear cuenta</div>
          <div style={{ fontSize: 14, color: T.ink3, marginTop: 4 }}>Regístrate para hacer pedidos en JBT DIBO</div>
        </div>

        <form onSubmit={handleRegistro} style={{ background: '#fff', borderRadius: 20, padding: 28, border: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Nombre completo *</label>
            {inp(nombre, setNombre, 'Ej: Luis Quispe Mendoza')}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Teléfono / WhatsApp</label>
            {inp(telefono, setTelefono, 'Ej: 987654321', 'tel')}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Empresa u obra (opcional)</label>
            {inp(empresa, setEmpresa, 'Ej: Constructora Vega, Obra Las Flores')}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Correo electrónico *</label>
            {inp(email, setEmail, 'correo@ejemplo.com', 'email')}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Contraseña *</label>
            {inp(password, setPassword, 'Mínimo 6 caracteres', 'password')}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 5 }}>Confirmar contraseña *</label>
            {inp(confirm, setConfirm, 'Repite tu contraseña', 'password')}
          </div>

          {error && (
            <div style={{ background: '#FCE7E2', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: T.danger, fontWeight: 600 }}>{error}</div>
          )}

          <button type="submit" disabled={loading}
            style={{ padding: '14px 0', background: loading ? T.ink3 : T.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.display, marginTop: 4 }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 13, color: T.ink3 }}>
            ¿Ya tienes cuenta?{' '}
            <span onClick={() => navigate('/login')} style={{ color: T.primary, fontWeight: 700, cursor: 'pointer' }}>Inicia sesión</span>
          </div>
        </form>
      </div>
    </div>
  );
}
