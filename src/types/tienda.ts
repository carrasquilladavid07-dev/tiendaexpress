// src/types/tienda.ts
export type Categoria = 'abarrotes' | 'aseo' | 'bebidas';

export interface Proveedor {
  nombre: string;
  contacto: {
    telefono: string;
    ciudad: string;
  };
}

export interface Producto {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  proveedor: Proveedor;
}

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
