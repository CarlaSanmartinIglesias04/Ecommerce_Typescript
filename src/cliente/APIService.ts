const API_URL = "http://localhost/productos";
const HEADERS: HeadersInit = {};

export interface Producto {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export class APIService {
  static async verificarConexion(): Promise<boolean> {
    try {
      const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
      return response.ok;
    } catch (error) {
      console.error("Error de conexión con la API:", error);
      return false;
    }
  }

static async obtenerProductoPorId(id: string): Promise<Producto | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "GET", headers: HEADERS });

    if (!response.ok) {
      return null;
    }

    const producto: Producto = await response.json();
    return producto;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return null;
  }
}


  static async actualizarProducto(id: string, data: Partial<Producto>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          ...HEADERS,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return false;
    }
  }

  static async crearProducto(data: Producto): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          ...HEADERS,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error("Error al crear producto:", error);
      return false;
    }
  }

  static async eliminarProducto(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: HEADERS
      });
      return response.ok;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return false;
    }
  }

  static async obtenerProductos(): Promise<Producto[]> {
    try {
      const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  }
}
