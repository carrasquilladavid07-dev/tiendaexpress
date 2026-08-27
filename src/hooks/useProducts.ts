// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { getProductos } from '../api/tiendaApi';
import { useDebounce } from './useDebounce';
import type { Producto } from '../types/tienda';

export function useProducts(termino: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terminoDiferido = useDebounce(termino, 400); // hook dentro de hook

  useEffect(() => {
    let ignorar = false; // bandera contra condiciones de carrera

    setCargando(true);
    setError(null);

    getProductos(terminoDiferido)
      .then((datos) => {
        if (!ignorar) setProductos(datos);
      })
      .catch((e: Error) => {
        if (!ignorar) setError(e.message);
      })
      .finally(() => {
        if (!ignorar) setCargando(false);
      });

    return () => {
      ignorar = true;
    };
  }, [terminoDiferido]);

  // Expone una forma de actualizar un producto YA cargado, sin duplicar
  // el estado en otro lugar (Principio 4). El dueño de la lista sigue
  // siendo este hook; App.tsx solo le pide que reemplace una entrada.
  const actualizarProducto = (editado: Producto) => {
    setProductos((anteriores) =>
      anteriores.map((prod) => (prod.id === editado.id ? editado : prod))
    );
  };

  return { productos, cargando, error, actualizarProducto };
}
