// src/components/ProductList.tsx
import type { Producto } from '../types/tienda';

interface Props {
  productos: Producto[];
  seleccionadoId: number | null;
  onSeleccionar: (id: number) => void;
}

function ProductList({ productos, seleccionadoId, onSeleccionar }: Props) {
  return (
    <ul className="list-group">
      {productos.map((prod) => (
        <li
          key={prod.id}
          onClick={() => onSeleccionar(prod.id)}
          className={`list-group-item ${prod.id === seleccionadoId ? 'active' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          {prod.nombre} — ${prod.precio.toLocaleString('es-CO')}
        </li>
      ))}
      {productos.length === 0 && (
        <li className="list-group-item text-muted">Sin resultados</li>
      )}
    </ul>
  );
}

export default ProductList;
