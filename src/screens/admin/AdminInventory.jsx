import { I } from '../../components/Icons';
import { BtnPrimary, BtnSecondary, Chip, Badge } from '../../components/UI';
import { ProductIcon } from '../../components/ProductIcon';
import { AdminSidebar } from './AdminSidebar';

const rows = [
  { k: 'arena', sku: 'AGR-001', n: 'Arena gruesa lavada', cat: 'Agregados', u: 'm³', st: 27, min: 40, price: 75, cost: 52, loc: 'Patio A', status: 'low' },
  { k: 'piedra', sku: 'PCH-012', n: 'Piedra chancada 1/2"', cat: 'Agregados', u: 'm³', st: 68, min: 30, price: 88, cost: 60, loc: 'Patio A', status: 'ok' },
  { k: 'hormigon', sku: 'HRM-005', n: 'Hormigón', cat: 'Agregados', u: 'm³', st: 42, min: 25, price: 95, cost: 68, loc: 'Patio B', status: 'ok' },
  { k: 'cemento', sku: 'CEM-SOL-I', n: 'Cemento Sol Tipo I · 42.5kg', cat: 'Cementos', u: 'bolsa', st: 42, min: 350, price: 28, cost: 23, loc: 'Almacén 1', status: 'crit' },
  { k: 'ladrillo', sku: 'LAD-KK-18', n: 'Ladrillo KK 18 huecos', cat: 'Ladrillos', u: 'und', st: 8400, min: 3000, price: 1.2, cost: 0.85, loc: 'Patio C', status: 'ok' },
  { k: 'fierro', sku: 'FIE-12', n: 'Fierro corrugado 1/2"', cat: 'Fierros', u: 'und', st: 112, min: 400, price: 38, cost: 28, loc: 'Almacén 2', status: 'low' },
];

const statusMap = {
  ok: { l: 'Normal', tn: 'ok' },
  low: { l: 'Bajo', tn: 'warn' },
  crit: { l: 'Crítico', tn: 'danger' },
};

export function AdminInventory({ theme: T }) {
  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg, fontFamily: T.body, overflow: 'hidden' }}>
      <AdminSidebar T={T}/>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: T.surface, padding: '14px 28px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Almacén</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, fontFamily: T.display, letterSpacing: '-.02em' }}>Inventario</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <BtnSecondary theme={T} icon={I.download}>Exportar</BtnSecondary>
            <BtnPrimary theme={T} icon={I.plus}>Registrar entrada</BtnPrimary>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Chip theme={T} active>Todos · 6</Chip>
            <Chip theme={T}>Agregados · 3</Chip>
            <Chip theme={T}>Cementos · 1</Chip>
            <Chip theme={T}>Ladrillos · 1</Chip>
            <Chip theme={T}>Fierros · 1</Chip>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Chip theme={T} icon={I.filter}>Estado</Chip>
              <Chip theme={T} icon={I.sort}>Stock</Chip>
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.4fr 1fr 1fr 1fr .5fr', padding: '12px 18px', background: T.chip, fontSize: 11, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              <div>Producto</div><div>SKU</div><div>Stock actual</div><div>Precio</div><div>Costo</div><div>Ubicación</div><div></div>
            </div>
            {rows.map((r, i) => {
              const pct = Math.min(100, (r.st / r.min) * 100);
              const st = statusMap[r.status];
              return (
                <div key={r.sku} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.4fr 1fr 1fr 1fr .5fr', padding: '14px 18px', borderTop: i > 0 ? `1px solid ${T.line2}` : 'none', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ProductIcon kind={r.k} size={40} theme={T}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{r.cat}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: T.mono, color: T.ink2 }}>{r.sku}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, fontFamily: T.display }}>{r.st.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{r.u} · mín {r.min}</div>
                    </div>
                    <div style={{ height: 4, background: T.chip, borderRadius: 2, marginTop: 4, maxWidth: 120 }}>
                      <div style={{ height: '100%', width: pct + '%', background: r.status === 'crit' ? T.danger : r.status === 'low' ? '#E5B100' : T.ok, borderRadius: 2 }}/>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Badge theme={T} tone={st.tn} style={{ fontSize: 9 }}>{st.l}</Badge>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: T.display }}>S/{r.price}</div>
                  <div style={{ fontSize: 13, color: T.ink2, fontFamily: T.display }}>S/{r.cost}</div>
                  <div style={{ fontSize: 12, color: T.ink2 }}>{r.loc}</div>
                  <div><I.dots size={18} color={T.ink3}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
