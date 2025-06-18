export default class Utils {
    static sanitizeInput(str) {
        return str.replace(/<[^>]*>?/gm, '').trim();
    }
    static isSafeInput(str) {
        const pattern = /^[a-zA-Z0-9\s.,¡!¿?()'-]*$/;
        return pattern.test(str);
    }
    static limpiarFormulario() {
        const nombre = document.getElementById("nombre");
        const precio = document.getElementById("precio");
        const cantidad = document.getElementById("cantidad");
        const descripcion = document.getElementById("descripcion");
        if (nombre)
            nombre.value = "";
        if (precio)
            precio.value = "";
        if (cantidad)
            cantidad.value = "";
        if (descripcion)
            descripcion.value = "";
    }
}
