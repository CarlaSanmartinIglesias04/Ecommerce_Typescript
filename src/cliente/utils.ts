export default class Utils {
  static sanitizeInput(str: string): string {
    return str.replace(/<[^>]*>?/gm, '').trim();
  }

  static isSafeInput(str: string): boolean {
    const pattern = /^[a-zA-Z0-9\s.,¡!¿?()'-]*$/;
    return pattern.test(str);
  }

  static limpiarFormulario(): void {
    const nombre = document.getElementById("nombre") as HTMLInputElement | null;
    const precio = document.getElementById("precio") as HTMLInputElement | null;
    const cantidad = document.getElementById("cantidad") as HTMLInputElement | null;
    const descripcion = document.getElementById("descripcion") as HTMLInputElement | null;

    if (nombre) nombre.value = "";
    if (precio) precio.value = "";
    if (cantidad) cantidad.value = "";
    if (descripcion) descripcion.value = "";
  }
}
