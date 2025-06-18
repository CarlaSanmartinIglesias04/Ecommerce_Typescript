import 'dotenv/config';

const API_URL = "https://inventario-bhkd.api.codehooks.io/dev/productos";

const HEADERS: HeadersInit = {
  'x-apikey': process.env.APIKEYECOMMERCE || '',
  'Content-Type': 'application/json'
};

export interface Producto {
  _id?: string;
  nombre: string;
  precio: number;
  stock: number;
}

export class APIService {
  static async obtenerProductos(): Promise<Producto[]> {
    const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
    return await response.json();
  }

  static async obtenerProductoPorId(id: string): Promise<Producto> {
    const response = await fetch(`${API_URL}/${id}`, { method: "GET", headers: HEADERS });
    return await response.json();
  }

  static async crearProducto(data: Producto): Promise<void> {
    await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(data)
    });
  }

  static async actualizarProducto(id: string, data: Partial<Producto>): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(data)
    });
  }

  static async eliminarProducto(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: HEADERS });
  }
}
