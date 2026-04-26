import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TOKENS } from '../../tokens';

const T = TOKENS.cantera;

export function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [rol, setRol] = useState('cliente');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn({ email: form.email, password: form.password });
        if (error) throw error;
        navigate(rol === 'admin' ? '/admin' : '/cliente/home');
      } else {
        const { error } = await signUp({ ...form, rol });
        if (error) throw error;
        setError('✓ Revisa tu email para confirmar la cuenta, luego inicia sesión.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Error al procesar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${T.line}`, fontSize: 14, fontFamily: T.body,
    color: T.ink, outline: 'none', boxSizing: 'border-box',
    background: '#fff',
  };

  const roles = [
    { id: 'cliente', label: 'Cliente / Maestro de obra', icon: '👷' },
    { id: 'ferreteria', label: 'Ferretería (B2B)', icon: '🏪' },
    { id: 'admin', label: 'Administrador JBT', icon: '🖥️' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#f0eee9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: T.body,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: T.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22, fontFamily: T.display }}>JB</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>JBT DIBO SAC</div>
          <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Materiales de construcción · Lima, Perú</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: T.chip, borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {[['login','Iniciar sesión'], ['register','Registrarse']].map(([m, l]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: T.body,
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? T.ink : T.ink3,
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
              }}>{l}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Selector de rol */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Tipo de cuenta</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {roles.map((r) => (
                  <div key={r.id} onClick={() => setRol(r.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 10, border: `1.5px solid ${rol === r.id ? T.primary : T.line}`,
                    background: rol === r.id ? T.primarySoft : '#fff',
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{r.label}</span>
                    {rol === r.id && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>}
                  </div>
                ))}
              </div>
            </div>

            {mode === 'register' && (
              <input style={inputStyle} placeholder="Nombre completo" value={form.nombre} onChange={set('nombre')} required/>
            )}
            {mode === 'register' && rol === 'ferreteria' && (
              <input style={inputStyle} placeholder="Nombre de la ferretería" value={form.empresa} onChange={set('empresa')}/>
            )}
            <input style={inputStyle} type="email" placeholder="Correo electrónico" value={form.email} onChange={set('email')} required/>
            <input style={inputStyle} type="password" placeholder="Contraseña" value={form.password} onChange={set('password')} required minLength={6}/>

            {error && (
              <div style={{
                padding: '10px 12px', borderRadius: 8, fontSize: 13,
                background: error.startsWith('✓') ? '#E6F4EA' : '#FCE7E2',
                color: error.startsWith('✓') ? T.ok : T.danger,
                fontWeight: 600,
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? T.ink3 : T.accent, color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: T.body, marginTop: 4,
            }}>
              {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: T.ink3 }}>
          JBT DIBO SAC · RUC registrado · Lima Sur, Perú
        </div>
      </div>
    </div>
  );
}
