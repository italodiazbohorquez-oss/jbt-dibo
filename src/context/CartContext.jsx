import { createContext, useContext, useState } from 'react';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function agregar(producto, cantidad = 1) {
    setItems(prev => {
      const existe = prev.find(i => i.producto_id === producto.id);
      if (existe) {
        return prev.map(i => i.producto_id === producto.id
          ? { ...i, cantidad: i.cantidad + cantidad, subtotal: (i.cantidad + cantidad) * i.precio_unitario }
          : i
        );
      }
      return [...prev, {
        producto_id: producto.id,
        nombre: producto.nombre,
        tipo: producto.tipo,
        unidad: producto.unidad,
        precio_unitario: producto.precio,
        cantidad,
        subtotal: producto.precio * cantidad,
      }];
    });
  }

  function quitar(productoId) {
    setItems(prev => prev.filter(i => i.producto_id !== productoId));
  }

  function actualizarCantidad(productoId, cantidad) {
    if (cantidad <= 0) { quitar(productoId); return; }
    setItems(prev => prev.map(i => i.producto_id === productoId
      ? { ...i, cantidad, subtotal: cantidad * i.precio_unitario }
      : i
    ));
  }

  function vaciar() { setItems([]); }

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <CartCtx.Provider value={{ items, agregar, quitar, actualizarCantidad, vaciar, total, totalItems }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
