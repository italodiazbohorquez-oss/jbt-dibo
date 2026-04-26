import { useEffect, useState } from 'react';
import { I } from '../../components/Icons';
import { AdminSidebar } from './AdminSidebar';
import { getCajaHoy, registrarMovimientoCaja } from '../../lib/api';

const CONCEPTOS_INGRESO = ['Cobro pedido', 'Adelanto cliente', 'Devolución proveedor', 'Otro ingreso'];
const CONCEPTOS_EGRESO  = ['Combustible', 'Mantenimiento volquete', 'Pago proveedor', 'Sueldo personal', 'Gastos varios', 'Otro egreso'];

export function AdminCaja({ theme: T }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState('ingreso');
  const [concepto, setConcepto] = useState('');
  const [conceptoCustom, setConceptoCustom] = useState('');
  const [monto, setMonto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const fmt = (n) => 'S/' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2 });
  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  async function load() {
    setLoading(true);
    const { data } = await getCajaHoy();
    setMovimientos(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + Number(m.monto), 0);
  const egresos  = movimientos.filter(m => m.tipo === 'egreso').reduce((s, m) => s + Number(m.monto), 0);
  const saldo    = ingresos - egresos;

  async function handleGuardar() {
    const conceptoFinal = concepto === 'otro' ? conceptoCustom.trim() : concepto;
    if (!conceptoFinal) { setError('Selecciona o escribe un concepto.'); return; }
    if (!monto || Number(monto) <= 0) { setError('Ingresa un monto válido.'); return; }
    setGuardando(true); setError('');
    const { error: err } = await registrarMovimientoCaja({ tipo, concepto: conceptoFinal, monto: Number(monto) });
    setGuardando(false);
    if (err) { setError(err.message || 'Error al registrar.'); return; }
    setShowForm(false);
    setConcepto(''); setConceptoCustom(''); setMonto('');
    load();
  }

  const conceptos = tipo === 'ingreso' ? CONCEPTOS_INGRESO : CONCEPTOS_EGRESO;

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Finanzas</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Caja diaria</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2, textTransform: 'capitalize' }}>{today}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.refresh size={16} color={T.ink3}/>
            </button>
            <button onClick={() => { setShowForm(true); setTipo('ingreso'); setConcepto(''); setMonto(''); }}
              style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: T.ok, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.body }}>
              <I.plus size={15} color="#fff"/> Ingreso
            </button>
            <button onClick={() => { setShowForm(true); setTipo('egreso'); setConcepto(''); setMonto(''); }}
              style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: T.danger, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.body }}>
              <I.minus size={15} color="#fff"/> Egreso
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
            <div style={{ background: '#E6F4EA', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#2D6A4F', fontWeight: 700 }}>Total ingresos</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#2D6A4F', fontFamily: T.display, marginTop: 6 }}>+ {fmt(ingresos)}</div>
              <div style={{ fontSize: 11, color: '#52796F', marginTop: 4 }}>{movimientos.filter(m => m.tipo === 'ingreso').length} movimientos</div>
            </div>
            <div style={{ background: '#FCE7E2', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#9B1C1C', fontWeight: 700 }}>Total egresos</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#9B1C1C', fontFamily: T.display, marginTop: 6 }}>− {fmt(egresos)}</div>
              <div style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>{movimientos.filter(m => m.tipo === 'egreso').length} movimientos</div>
            </div>
            <div style={{ background: saldo >= 0 ? T.primarySoft : '#FCE7E2', borderRadius: 14, padding: 20, border: `2px solid ${saldo >= 0 ? T.primary : T.danger}` }}>
              <div style={{ fontSize: 12, color: saldo >= 0 ? T.primary : T.danger, fontWeight: 700 }}>Saldo del día</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: saldo >= 0 ? T.primary : T.danger, fontFamily: T.display, marginTop: 6 }}>{fmt(saldo)}</div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 4 }}>{movimientos.length} movimientos totales</div>
            </div>
          </div>

          {/* Tabla de movimientos */}
          <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.line}`, fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>
              Movimientos de hoy
            </div>
            {loading && <div style={{ padding: 40, textAlign: 'center', color: T.ink3 }}>Cargando...</div>}
            {!loading && movimientos.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: T.ink3 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Sin movimientos hoy</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Registra el primer ingreso o egreso del día</div>
              </div>
            )}
            {movimientos.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < movimientos.length - 1 ? `1px solid ${T.line2}` : 'none', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.tipo === 'ingreso' ? '#E6F4EA' : '#FCE7E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {m.tipo === 'ingreso' ? '↑' : '↓'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{m.concepto}</div>
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>
                    {new Date(m.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    {m.pedido_id && ' · Vinculado a pedido'}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.tipo === 'ingreso' ? T.ok : T.danger, fontFamily: T.display }}>
                  {m.tipo === 'ingreso' ? '+' : '−'} {fmt(m.monto)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal nuevo movimiento */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420, fontFamily: T.body }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>
                {tipo === 'ingreso' ? '💰 Registrar ingreso' : '💸 Registrar egreso'}
              </div>
              <button onClick={() => setShowForm(false)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: T.ink3 }}>×</button>
            </div>

            {/* Tipo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {['ingreso', 'egreso'].map(t => (
                <button key={t} onClick={() => { setTipo(t); setConcepto(''); }} style={{
                  padding: '10px 0', borderRadius: 10, border: `2px solid ${tipo === t ? (t === 'ingreso' ? T.ok : T.danger) : T.line}`,
                  background: tipo === t ? (t === 'ingreso' ? '#E6F4EA' : '#FCE7E2') : '#fff',
                  color: tipo === t ? (t === 'ingreso' ? T.ok : T.danger) : T.ink3,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.body, textTransform: 'capitalize',
                }}>{t === 'ingreso' ? '↑ Ingreso' : '↓ Egreso'}</button>
              ))}
            </div>

            {/* Concepto */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 6 }}>Concepto</label>
              <select value={concepto} onChange={e => setConcepto(e.target.value)}
                style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Seleccionar...</option>
                {conceptos.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                <option value="otro">Otro (personalizado)</option>
              </select>
            </div>

            {concepto === 'otro' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 6 }}>Descripción</label>
                <input value={conceptoCustom} onChange={e => setConceptoCustom(e.target.value)}
                  placeholder="Describe el movimiento..."
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 13, fontFamily: T.body, color: T.ink, outline: 'none', boxSizing: 'border-box' }}/>
              </div>
            )}

            {/* Monto */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.ink3, marginBottom: 6 }}>Monto (S/)</label>
              <input type="number" min="0" step="0.01" value={monto} onChange={e => setMonto(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.line}`, fontSize: 18, fontWeight: 700, fontFamily: T.display, color: T.ink, outline: 'none', boxSizing: 'border-box' }}/>
            </div>

            {error && <div style={{ background: '#FCE7E2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: T.danger, marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `1.5px solid ${T.line}`, background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: T.ink3, fontFamily: T.body }}>
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: guardando ? T.ink3 : (tipo === 'ingreso' ? T.ok : T.danger), color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: T.body }}>
                {guardando ? 'Registrando...' : `Registrar ${tipo}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
