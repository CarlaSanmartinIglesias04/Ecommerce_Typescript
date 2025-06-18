const API_URL = "http://localhost/productos";
const HEADERS = {};
export class APIService {
    static async verificarConexion() {
        try {
            const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
            return response.ok;
        }
        catch (error) {
            console.error("Error de conexión con la API:", error);
            return false;
        }
    }
    static async obtenerProductoPorId(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "GET", headers: HEADERS });
            if (!response.ok) {
                return null;
            }
            const producto = await response.json();
            return producto;
        }
        catch (error) {
            console.error("Error al obtener el producto:", error);
            return null;
        }
    }
    static async actualizarProducto(id, data) {
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
        }
        catch (error) {
            console.error("Error al actualizar producto:", error);
            return false;
        }
    }
    static async crearProducto(data) {
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
        }
        catch (error) {
            console.error("Error al crear producto:", error);
            return false;
        }
    }
    static async eliminarProducto(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: HEADERS
            });
            return response.ok;
        }
        catch (error) {
            console.error("Error al eliminar producto:", error);
            return false;
        }
    }
    static async obtenerProductos() {
        try {
            const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
            if (!response.ok) {
                throw new Error("Error al obtener productos");
            }
            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }
}
