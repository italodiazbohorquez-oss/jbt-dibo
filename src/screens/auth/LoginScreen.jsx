import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TOKENS } from '../../tokens';

const T = TOKENS.cantera;

const TIPOS_CLIENTE = [
  {
    id: 'cliente',
    icon: '🏠',
    titulo: 'Cliente directo',
    desc: 'Pedidos al por menor para tu casa u obra pequeña',
    beneficios: ['Pedidos desde 1 unidad', 'Dirección con GPS', 'Pago por Yape / Transferencia'],
    color: T.primary,
    bg: T.primarySoft,
  },
  {
    id: 'maestro',
    icon: '🏗️',
    titulo: 'Maestro de obras',
    desc: 'Precios especiales por volumen para constructores frecuentes',
    beneficios: ['Precios de mayorista', 'Crédito y descuentos', 'Atención prioritaria'],
    color: T.accent,
    bg: T.accentSoft,
  },
];

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: `1.5px solid ${T.line}`, fontSize: 14, fontFamily: T.body,
  color: T.ink, outline: 'none', boxSizing: 'border-box', background: '#fff',
};

function StepIndicator({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 4, borderRadius: 4, background: i < step ? T.accent : T.line, flex: i < step ? 2 : 1, transition: 'all .3s' }}/>
      ))}
    </div>
  );
}

export function LoginScreen({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [step, setStep] = useState(1); // registro en pasos
  const [rol, setRol] = useState('cliente');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', celular: '', empresa: '', ruc_empresa: '', cant_obras: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [ubicacion, setUbicacion] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  function handleGPS() {
    if (!navigator.geolocation) { setError('Tu dispositivo no soporta GPS'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const addr = data.display_name?.split(',').slice(0, 3).join(',') || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setUbicacion(addr);
        } catch {
          setUbicacion(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setGpsLoading(false);
      },
      () => { setError('No se pudo obtener la ubicación'); setGpsLoading(false); }
    );
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { error } = await signIn({ email: form.email, password: form.password });
      if (error) throw error;
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : (err.message || 'Error al iniciar sesión'));
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setError(''); setLoading(true);
    try {
      const extraData = rol === 'maestro'
        ? { empresa: form.empresa, ruc_empresa: form.ruc_empresa, cant_obras: form.cant_obras, verificado: false }
        : { ubicacion_default: ubicacion };
      const { error } = await signUp({ ...form, rol, ...extraData });
      if (error) throw error;
      setError('✓ Revisa tu email para confirmar tu cuenta, luego inicia sesión.');
      setMode('login'); setStep(1);
    } catch (err) {
      setError(err.message || 'Error al registrar. Intenta de nuevo.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh', background: `linear-gradient(160deg, #0A1410 0%, #0E5A3D 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', fontFamily: T.body,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Volver al inicio */}
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0, fontFamily: T.body }}>
          ← Volver al inicio
        </button>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: T.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, fontFamily: T.display }}>JB</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: T.display, letterSpacing: '-.01em' }}>JBT DIBO S.A.C</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 3 }}>Materiales de construcción · Lima, Perú</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 22, padding: '24px 24px 28px', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: T.chip, borderRadius: 12, padding: 4, marginBottom: 22 }}>
            {[['login','Iniciar sesión'], ['register','Registrarse']].map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }} style={{
                flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: T.body,
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? T.ink : T.ink3,
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                transition: 'all .2s',
              }}>{l}</button>
            ))}
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Correo electrónico</label>
                <input style={inputStyle} type="email" placeholder="tucorreo@email.com" value={form.email} onChange={set('email')} required/>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Contraseña</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6}/>
              </div>

              {error && <ErrorBox error={error}/>}

              <button type="submit" disabled={loading} style={{
                padding: '14px', borderRadius: 12, border: 'none',
                background: loading ? T.ink3 : T.accent, color: '#fff',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body, marginTop: 4,
              }}>
                {loading ? 'Entrando...' : 'Entrar a mi cuenta'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 12, color: T.ink3, marginTop: 4 }}>
                ¿No tienes cuenta?{' '}
                <span onClick={() => setMode('register')} style={{ color: T.accent, fontWeight: 700, cursor: 'pointer' }}>Regístrate gratis</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {step === 1 && (
                <>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>¿Cómo usarás la app?</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {TIPOS_CLIENTE.map((t) => (
                        <div key={t.id} onClick={() => setRol(t.id)} style={{
                          padding: '14px', borderRadius: 14,
                          border: `2px solid ${rol === t.id ? t.color : T.line}`,
                          background: rol === t.id ? t.bg : '#fff',
                          cursor: 'pointer', transition: 'all .15s',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 22 }}>{t.icon}</span>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>{t.titulo}</div>
                              <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{t.desc}</div>
                            </div>
                            {rol === t.id && (
                              <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                            )}
                          </div>
                          {rol === t.id && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                              {t.beneficios.map((b, i) => (
                                <span key={i} style={{ fontSize: 11, color: t.color, background: '#fff', border: `1px solid ${t.color}30`, borderRadius: 6, padding: '3px 8px', fontWeight: 600 }}>{b}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && <ErrorBox error={error}/>}

                  <button type="submit" style={{ padding: '14px', borderRadius: 12, border: 'none', background: T.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: T.body, marginTop: 4 }}>
                    Continuar →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <StepIndicator step={2} total={2}/>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
                    {rol === 'maestro' ? '🏗️ Datos de maestro de obras' : '🏠 Datos personales'}
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Nombre completo</label>
                    <input style={inputStyle} placeholder="Ej. Juan Carlos Torres" value={form.nombre} onChange={set('nombre')} required/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Correo electrónico</label>
                    <input style={inputStyle} type="email" placeholder="tucorreo@email.com" value={form.email} onChange={set('email')} required/>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Celular</label>
                    <input style={inputStyle} type="tel" placeholder="Ej. 987 654 321" value={form.celular} onChange={set('celular')}/>
                  </div>

                  {rol === 'maestro' && (
                    <>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Empresa / Razón social <span style={{ color: T.ink3, fontWeight: 400 }}>(opcional)</span></label>
                        <input style={inputStyle} placeholder="Ej. Constructora Torres SAC" value={form.empresa} onChange={set('empresa')}/>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>RUC de empresa <span style={{ color: T.ink3, fontWeight: 400 }}>(opcional)</span></label>
                        <input style={inputStyle} placeholder="Ej. 20512345678" value={form.ruc_empresa} onChange={set('ruc_empresa')} maxLength={11}/>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Obras activas actualmente</label>
                        <select style={{ ...inputStyle }} value={form.cant_obras} onChange={set('cant_obras')}>
                          <option value="">Selecciona...</option>
                          <option value="1">1 obra</option>
                          <option value="2-3">2 a 3 obras</option>
                          <option value="4-6">4 a 6 obras</option>
                          <option value="7+">7 o más obras</option>
                        </select>
                      </div>
                      <div style={{ background: T.accentSoft, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: T.accentDark, fontWeight: 600 }}>
                        🔍 Tu cuenta será verificada en 24h para activar precios de maestro. Mientras tanto, puedes navegar la app normalmente.
                      </div>
                    </>
                  )}

                  {rol === 'cliente' && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Dirección principal <span style={{ color: T.ink3, fontWeight: 400 }}>(opcional)</span></label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input style={{ ...inputStyle, flex: 1 }} placeholder="Ej. Av. Las Flores 123, VES" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}/>
                        <button type="button" onClick={handleGPS} disabled={gpsLoading} title="Usar mi ubicación GPS"
                          style={{ padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, background: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                          {gpsLoading ? '⏳' : '📍'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Contraseña</label>
                    <input style={inputStyle} type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} required minLength={6}/>
                  </div>

                  {error && <ErrorBox error={error}/>}

                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button type="button" onClick={() => setStep(1)} style={{ padding: '14px', borderRadius: 12, border: `1.5px solid ${T.line}`, background: '#fff', color: T.ink2, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.body }}>
                      ← Atrás
                    </button>
                    <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: loading ? T.ink3 : T.accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.body }}>
                      {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
          JBT DIBO S.A.C · RUC 20615017770 · Lima Sur, Perú
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ error }) {
  const isOk = error.startsWith('✓');
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8, fontSize: 13, lineHeight: 1.4,
      background: isOk ? '#E6F4EA' : '#FCE7E2',
      color: isOk ? T.ok : T.danger,
      fontWeight: 600, border: `1px solid ${isOk ? '#C3E6CB' : '#F5C6CB'}`,
    }}>{error}</div>
  );
}
