-- ============================================================
-- JBT DIBO SAC — Schema completo
-- Ejecutar en Supabase: SQL Editor → New query → Run
-- ============================================================

-- 1. PERFILES (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'ferreteria', 'admin')),
  empresa TEXT,
  direccion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTOS / CATÁLOGO
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('arena', 'piedra', 'hormigon', 'cemento', 'ladrillo', 'fierro')),
  unidad TEXT NOT NULL CHECK (unidad IN ('m3', 'bolsa', 'und', 'tonelada')),
  precio DECIMAL(10,2) NOT NULL,
  precio_mayorista DECIMAL(10,2),
  stock_actual DECIMAL(10,2) DEFAULT 0,
  stock_minimo DECIMAL(10,2) DEFAULT 0,
  sku TEXT UNIQUE,
  ubicacion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES profiles(id),
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmado','cargando','en_ruta','entregado','cancelado')),
  direccion_entrega TEXT,
  referencia TEXT,
  fecha_entrega DATE,
  ventana_inicio TIME,
  ventana_fin TIME,
  metodo_pago TEXT CHECK (metodo_pago IN ('yape','transferencia','tarjeta','contra_entrega')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ITEMS DEL PEDIDO
CREATE TABLE IF NOT EXISTS pedido_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- 5. CHOFERES
CREATE TABLE IF NOT EXISTS choferes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  placa TEXT NOT NULL UNIQUE,
  estado TEXT DEFAULT 'libre' CHECK (estado IN ('libre','cargando','en_ruta','retornando')),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  rating DECIMAL(3,2) DEFAULT 5.0,
  entregas_completadas INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RUTAS DE DESPACHO
CREATE TABLE IF NOT EXISTS rutas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id),
  chofer_id UUID REFERENCES choferes(id),
  fecha DATE DEFAULT CURRENT_DATE,
  estado TEXT DEFAULT 'programado' CHECK (estado IN ('programado','en_ruta','completado','cancelado')),
  hora_salida TIME,
  hora_llegada_estimada TIME,
  hora_llegada_real TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CAJA DIARIA
CREATE TABLE IF NOT EXISTS caja (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso','egreso')),
  concepto TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  pedido_id UUID REFERENCES pedidos(id),
  fecha DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE choferes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE caja ENABLE ROW LEVEL SECURITY;

-- Profiles: cada usuario ve su propio perfil; admin ve todos
CREATE POLICY "perfil_propio" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "admin_ve_todos_perfiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Productos: todos pueden ver; solo admin modifica
CREATE POLICY "productos_lectura_publica" ON productos FOR SELECT USING (activo = true);
CREATE POLICY "admin_gestiona_productos" ON productos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Pedidos: cliente ve los suyos; admin ve todos
CREATE POLICY "pedidos_propios" ON pedidos FOR ALL USING (cliente_id = auth.uid());
CREATE POLICY "admin_ve_todos_pedidos" ON pedidos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('admin','ferreteria'))
);

-- Items de pedido: heredan acceso del pedido
CREATE POLICY "items_via_pedido" ON pedido_items FOR ALL USING (
  EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND cliente_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Choferes, rutas, caja: solo admin
CREATE POLICY "admin_choferes" ON choferes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "admin_rutas" ON rutas FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "admin_caja" ON caja FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ============================================================
-- DATOS INICIALES (seed)
-- ============================================================

INSERT INTO productos (nombre, tipo, unidad, precio, precio_mayorista, stock_actual, stock_minimo, sku, ubicacion, descripcion) VALUES
  ('Arena gruesa lavada',   'arena',    'm3',    75,   62,   27,  40,  'AGR-001',    'Patio A',    'Origen: Río Lurín · Granulometría 0–5mm'),
  ('Piedra chancada 1/2"',  'piedra',   'm3',    88,   72,   68,  30,  'PCH-012',    'Patio A',    'Piedra chancada de 1/2 pulgada y 3/4 pulgada'),
  ('Hormigón',              'hormigon', 'm3',    95,   78,   42,  25,  'HRM-005',    'Patio B',    'Listo para vaciar, mezcla balanceada'),
  ('Cemento Sol Tipo I',    'cemento',  'bolsa', 28,   23,   42, 350,  'CEM-SOL-I',  'Almacén 1',  'Bolsa 42.5kg · Alta resistencia'),
  ('Ladrillo King Kong 18', 'ladrillo', 'und',   1.20, 0.95, 8400, 3000, 'LAD-KK-18', 'Patio C',  '18 huecos · 9x13x24cm'),
  ('Fierro corrugado 1/2"', 'fierro',   'und',   38,   32,  112, 400,  'FIE-12',     'Almacén 2',  'Varilla 9m · Corrugado');

INSERT INTO choferes (nombre, telefono, placa, estado, rating, entregas_completadas) VALUES
  ('Manuel Castro',  '987654321', 'AQG-472', 'en_ruta',    4.9, 124),
  ('Luis Mendoza',   '987654322', 'BNY-103', 'cargando',   4.7,  98),
  ('Raúl Quispe',    '987654323', 'AXC-889', 'en_ruta',    4.8, 156),
  ('Diego Pérez',    '987654324', 'CLM-215', 'retornando', 4.6,  87),
  ('Víctor Ríos',    '987654325', 'BTG-507', 'libre',       4.9, 201);

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: crea perfil al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
