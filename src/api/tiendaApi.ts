// src/api/tiendaApi.ts
import type { Producto } from '../types/tienda';

const CATALOGO: Producto[] = [
  { id: 1, nombre: 'Arroz Diana 500g', categoria: 'abarrotes', precio: 2800, stock: 40,
    proveedor: { nombre: 'Distrisur', contacto: { telefono: '3115550001', ciudad: 'Pitalito' } } },
  { id: 2, nombre: 'Panela redonda', categoria: 'abarrotes', precio: 3500, stock: 25,
    proveedor: { nombre: 'Trapiche La Esperanza', contacto: { telefono: '3115550002', ciudad: 'Timaná' } } },
  { id: 3, nombre: 'Jabón Rey 300g', categoria: 'aseo', precio: 2200, stock: 60,
    proveedor: { nombre: 'Distrisur', contacto: { telefono: '3115550001', ciudad: 'Pitalito' } } },
  { id: 4, nombre: 'Café Huila 250g', categoria: 'bebidas', precio: 9800, stock: 18,
    proveedor: { nombre: 'Cooperativa Macizo', contacto: { telefono: '3115550003', ciudad: 'Pitalito' } } },
  { id: 5, nombre: 'Gaseosa 1.5L', categoria: 'bebidas', precio: 4200, stock: 30,
    proveedor: { nombre: 'Distrisur', contacto: { telefono: '3115550001', ciudad: 'Pitalito' } } },
  { id: 6, nombre: 'Detergente 1kg', categoria: 'aseo', precio: 7600, stock: 12,
    proveedor: { nombre: 'Aseo del Sur', contacto: { telefono: '3115550004', ciudad: 'Neiva' } } },
];

// Simula la latencia de la red. 'termino' filtra por nombre.
export function getProductos(termino = ''): Promise<Producto[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (termino === 'error') {
        reject(new Error('No se pudo conectar con el servidor'));
        return;
      }
      const t = termino.trim().toLowerCase();
      const datos = t === ''
        ? CATALOGO
        : CATALOGO.filter((prod) => prod.nombre.toLowerCase().includes(t));
      resolve(structuredClone(datos));
    }, 900);
  });
}
