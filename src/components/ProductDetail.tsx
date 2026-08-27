// src/components/ProductDetail.tsx
import ProductForm from './ProductForm';
import type { Producto } from '../types/tienda';

interface Props {
  producto: Producto;
  onGuardar: (producto: Producto) => void;
  onAgregarAlCarrito: (producto: Producto) => void;
}

function ProductDetail({ producto, onGuardar, onAgregarAlCarrito }: Props) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Detalle del producto</h5>
        <ProductForm productoInicial={producto} onGuardar={onGuardar} />
        <button
          className="btn btn-success w-100"
          onClick={() => onAgregarAlCarrito(producto)}
        >
          Agregar a la venta
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
