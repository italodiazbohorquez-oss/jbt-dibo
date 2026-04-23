import { useNavigate } from 'react-router-dom';
import { I } from '../../components/Icons';
import { BtnPrimary } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';

const orderItems = [
  { k: 'arena', n: 'Arena gruesa', q: '1 viaje · 10 m³', p: 750 },
  { k: 'piedra', n: 'Piedra chancada 1/2"', q: '1 viaje · 10 m³', p: 880 },
  { k: 'cemento', n: 'Cemento Sol', q: '20 bolsas', p: 560 },
];

const payMethods = [
  { l: 'Yape', sub: 'QR · al instante', sel: true, logo: 'Y', color: '#6B2FA5' },
  { l: 'Transferencia', sub: 'BCP / Interbank', sel: false, logo: '$', color: null },
  { l: 'Tarjeta', sub: 'Visa / Mastercard', sel: false, logo: 'C', color: null },
  { l: 'Contra entrega', sub: 'Efectivo al chofer', sel: false, logo: '✓', color: null },
];

export function ScreenCheckout({ theme: T }) {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, background: T.surface, borderBottom: `1px solid ${T.line}`, flexShrink: 0 }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <I.chevL size={20} color={T.ink}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontFamily: T.display }}>Confirmar pedido</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 90px' }}>
        <div style={{ background: T.surface, borderRadius: 14, padding: 12, border: `1px solid ${T.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.pin size={18} color={T.primary}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Entregar en Obra Las Flores</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>Mz B Lt 14, Villa El Salvador · Ref. portón azul</div>
            </div>
            <I.chevR size={18} color={T.ink3}/>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 14, padding: 12, border: `1px solid ${T.line}`, marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: T.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.cal size={18} color={T.accentDark}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Mañana · Mie 23 Abril</div>
            <div style={{ fontSize: 11, color: T.ink3 }}>Ventana: 8:00 AM – 12:00 PM</div>
          </div>
          <I.chevR size={18} color={T.ink3}/>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Tu pedido (3)</div>
        <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, marginTop: 8 }}>
          {orderItems.map((x, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
              <ProductIcon kind={x.k} size={44} theme={T}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{x.n}</div>
                <div style={{ fontSize: 11, color: T.ink3 }}>{x.q}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, fontFamily: T.display }}>S/{x.p}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>Método de pago</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {payMethods.map((m, i) => (
            <div key={i} style={{ background: T.surface, border: `1.5px solid ${m.sel ? T.primary : T.line}`, borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: m.color || (i === 1 ? T.primary : i === 2 ? T.ink : T.accent), color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: T.display }}>{m.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{m.l}</div>
                <div style={{ fontSize: 10, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
              </div>
              {m.sel && <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I.check size={10} color="#fff"/></div>}
            </div>
          ))}
        </div>

        <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, padding: 12, marginTop: 16 }}>
          {[
            { l: 'Subtotal', v: 'S/2,190' },
            { l: 'Despacho (2 volquetes)', v: 'Gratis', ok: true },
            { l: 'IGV (18%)', v: 'Incluido' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: T.ink2 }}>
              <span>{r.l}</span>
              <span style={{ fontWeight: 700, color: r.ok ? T.ok : T.ink }}>{r.v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: T.line, margin: '8px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Total a pagar</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: T.ink, fontFamily: T.display }}>S/2,190</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 14px', background: T.surface, borderTop: `1px solid ${T.line}`, flexShrink: 0 }}>
        <BtnPrimary theme={T} full icon={I.shield}
          onClick={() => navigate('/cliente/tracking')}>Pagar S/2,190 con Yape</BtnPrimary>
      </div>
    </div>
  );
}
