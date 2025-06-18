import 'dotenv/config';
const API_URL = "https://inventario-bhkd.api.codehooks.io/dev/productos";
const HEADERS = {
    'x-apikey': process.env.APIKEYECOMMERCE || '',
    'Content-Type': 'application/json'
};
export class APIService {
    static async obtenerProductos() {
        const response = await fetch(API_URL, { method: "GET", headers: HEADERS });
        return await response.json();
    }
    static async obtenerProductoPorId(id) {
        const response = await fetch(`${API_URL}/${id}`, { method: "GET", headers: HEADERS });
        return await response.json();
    }
    static async crearProducto(data) {
        await fetch(API_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(data)
        });
    }
    static async actualizarProducto(id, data) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(data)
        });
    }
    static async eliminarProducto(id) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: HEADERS });
    }
}
