// src/App.tsx
import { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import { useToggle } from './hooks/useToggle';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import VentasCounter from './components/VentasCounter';
import Card from './components/Card';
import type { Producto, ItemCarrito } from './types/tienda';

type EstadoEnvio = 'listo' | 'enviando' | 'enviado';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

  // R9: el carrito vive en App (ancestro común entre ProductDetail y Cart)
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('listo');

  const [mostrarCarrito, alternarCarrito] = useToggle(true);

  // R1, R4, R5: carga + búsqueda + debounce, todo encapsulado en el hook
  const { productos, cargando, error, actualizarProducto } = useProducts(busqueda);

  // R7: guardamos solo el id (Principio 4), el objeto se busca al renderizar
  const seleccionado = productos.find((prod) => prod.id === seleccionadoId) ?? null;

  const unidades = items.reduce((acum, it) => acum + it.cantidad, 0);

  // R10: efecto de sincronización con un sistema externo (el título de la pestaña)
  useEffect(() => {
    document.title = unidades > 0 ? `(${unidades}) TiendaExpress` : 'TiendaExpress';
  }, [unidades]);

  // R8: al guardar, se actualiza el arreglo del hook de forma inmutable
  const guardarProducto = (editado: Producto) => {
    actualizarProducto(editado);
  };

  // R9: agregar al carrito desde el detalle
  const agregarAlCarrito = (producto: Producto) => {
    setItems((anteriores) => {
      const existente = anteriores.find((it) => it.productoId === producto.id);
      if (existente) {
        return anteriores.map((it) =>
          it.productoId === producto.id ? { ...it, cantidad: it.cantidad + 1 } : it
        );
      }
      return [
        ...anteriores,
        { productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 },
      ];
    });
  };

  const cambiarCantidad = (productoId: number, delta: number) => {
    setItems((anteriores) =>
      anteriores
        .map((it) => (it.productoId === productoId ? { ...it, cantidad: it.cantidad + delta } : it))
        .filter((it) => it.cantidad > 0)
    );
  };

  const quitarDelCarrito = (productoId: number) => {
    setItems((anteriores) => anteriores.filter((it) => it.productoId !== productoId));
  };

  const vaciarCarrito = () => setItems([]);

  const enviarVenta = () => {
    setEstadoEnvio('enviando');
    setTimeout(() => setEstadoEnvio('enviado'), 1500);
  };

  // R3: reintentar la MISMA búsqueda. Cambiamos el término y lo devolvemos
  // en el siguiente tick para forzar que useProducts vuelva a ejecutar el
  // efecto con el mismo valor (un mismo string no dispara el efecto de nuevo).
  const reintentar = () => {
    const terminoActual = busqueda;
    setBusqueda('');
    setTimeout(() => setBusqueda(terminoActual), 0);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3">Tablero TiendaExpress</h3>

      <Card>
        <VentasCounter />
      </Card>

      <br />

      <input
        className="form-control mb-3"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <button className="btn btn-outline-primary mb-3" onClick={alternarCarrito}>
        {mostrarCarrito ? 'Ocultar carrito' : 'Mostrar carrito'}
      </button>

      {cargando && <p className="text-muted">Cargando productos…</p>}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-4">
          <ProductList
            productos={productos}
            seleccionadoId={seleccionadoId}
            onSeleccionar={setSeleccionadoId}
          />
        </div>

        <div className="col-md-4">
          {seleccionado ? (
            <ProductDetail
              producto={seleccionado}
              onGuardar={guardarProducto}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          ) : (
            <p className="text-muted">Seleccione un producto de la lista.</p>
          )}
        </div>

        <div className="col-md-4">
          {mostrarCarrito && (
            <Cart
              items={items}
              estado={estadoEnvio}
              onCambiarCantidad={cambiarCantidad}
              onQuitar={quitarDelCarrito}
              onVaciar={vaciarCarrito}
              onEnviar={enviarVenta}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
