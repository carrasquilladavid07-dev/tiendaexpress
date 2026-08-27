// src/components/ProductForm.tsx
import { useState } from 'react';
import type { Producto } from '../types/tienda';

interface Props {
  productoInicial: Producto;
  onGuardar: (producto: Producto) => void;
}

function ProductForm({ productoInicial, onGuardar }: Props) {
  const [producto, setProducto] = useState<Producto>(productoInicial);

  // R8: valor DERIVADO, no un estado nuevo (Principio 3, Bloque 3)
  const hayCambios = JSON.stringify(producto) !== JSON.stringify(productoInicial);

  // R4: manejador genérico para nombre / categoría (texto)
  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // R5: precio y stock deben guardarse como número
    const esNumero = name === 'precio' || name === 'stock';
    setProducto({ ...producto, [name]: esNumero ? Number(value) : value });
  };

  // R3: spread de tres niveles para proveedor.contacto.*
  const manejarCambioContacto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name: 'telefono' | 'ciudad'
    setProducto({
      ...producto,
      proveedor: {
        ...producto.proveedor,
        contacto: { ...producto.proveedor.contacto, [name]: value },
      },
    });
  };

  // R3: nombre del proveedor (nivel 2)
  const manejarCambioProveedor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProducto({
      ...producto,
      proveedor: { ...producto.proveedor, nombre: value },
    });
  };

  // R6: descartar cambios -> vuelve al producto original
  const descartar = () => {
    setProducto(productoInicial);
  };

  return (
    <div className="p-3">
      <div className="mb-2">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          name="nombre"
          value={producto.nombre}
          onChange={manejarCambio}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          name="precio"
          value={producto.precio}
          onChange={manejarCambio}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          name="stock"
          value={producto.stock}
          onChange={manejarCambio}
        />
      </div>

      {/* R2: select de categoría con los tipos literales */}
      <div className="mb-2">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          name="categoria"
          value={producto.categoria}
          onChange={manejarCambio}
        >
          <option value="abarrotes">Abarrotes</option>
          <option value="aseo">Aseo</option>
          <option value="bebidas">Bebidas</option>
        </select>
      </div>

      <hr />
      <h6>Proveedor</h6>

      <div className="mb-2">
        <label className="form-label">Nombre del proveedor</label>
        <input
          className="form-control"
          name="nombreProveedor"
          value={producto.proveedor.nombre}
          onChange={manejarCambioProveedor}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Teléfono</label>
        <input
          className="form-control"
          name="telefono"
          value={producto.proveedor.contacto.telefono}
          onChange={manejarCambioContacto}
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Ciudad</label>
        <input
          className="form-control"
          name="ciudad"
          value={producto.proveedor.contacto.ciudad}
          onChange={manejarCambioContacto}
        />
      </div>

      <div className="d-flex gap-2 mt-3">
        <button
          className="btn btn-primary"
          disabled={!hayCambios}
          onClick={() => onGuardar(producto)}
        >
          Guardar
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!hayCambios}
          onClick={descartar}
        >
          Descartar cambios
        </button>
      </div>

      <pre className="bg-light p-2 mt-3 small">
        {JSON.stringify(producto, null, 2)}
      </pre>
    </div>
  );
}

export default ProductForm;
