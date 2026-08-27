// src/components/Cart.tsx
import type { ItemCarrito } from '../types/tienda';

type EstadoEnvio = 'listo' | 'enviando' | 'enviado';

interface Props {
  items: ItemCarrito[];
  estado: EstadoEnvio;
  onCambiarCantidad: (productoId: number, delta: number) => void;
  onQuitar: (productoId: number) => void;
  onVaciar: () => void;
  onEnviar: () => void;
}

function Cart({ items, estado, onCambiarCantidad, onQuitar, onVaciar, onEnviar }: Props) {
  // R7 y R8: valores DERIVADOS, nunca estados (Principio 3)
  const total = items.reduce((acum, it) => acum + it.precio * it.cantidad, 0);
  const unidades = items.reduce((acum, it) => acum + it.cantidad, 0);
  const articulosDistintos = items.length;

  const deshabilitado = estado === 'enviando';

  return (
    <div className="p-3">
      <h5>Venta actual</h5>

      <ul className="list-group mb-3">
        {items.map((item) => (
          <li
            key={item.productoId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{item.nombre}</span>
            <span>
              <button
                className="btn btn-sm btn-outline-secondary me-1"
                disabled={deshabilitado}
                onClick={() => onCambiarCantidad(item.productoId, -1)}
              >
                −
              </button>
              {item.cantidad}
              <button
                className="btn btn-sm btn-outline-secondary ms-1"
                disabled={deshabilitado}
                onClick={() => onCambiarCantidad(item.productoId, 1)}
              >
                +
              </button>
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                disabled={deshabilitado}
                onClick={() => onQuitar(item.productoId)}
              >
                Quitar
              </button>
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="list-group-item text-muted">Carrito vacío</li>
        )}
      </ul>

      <p className="mb-1">Artículos distintos: {articulosDistintos}</p>
      <p className="mb-1">Unidades totales: {unidades}</p>
      <p className="fw-bold">Total: ${total.toLocaleString('es-CO')}</p>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-secondary" disabled={deshabilitado} onClick={onVaciar}>
          Vaciar carrito
        </button>
        <button
          className="btn btn-success"
          disabled={deshabilitado || items.length === 0}
          onClick={onEnviar}
        >
          {estado === 'enviando' ? 'Enviando...' : estado === 'enviado' ? 'Enviado ✓' : 'Enviar venta'}
        </button>
      </div>
    </div>
  );
}

export default Cart;
