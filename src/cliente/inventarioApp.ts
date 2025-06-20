import Utils from './utils.js';
import { APIService, Producto } from './APIService.js';

type Traducciones = {
  [clave: string]: string;
};

export default class InventarioApp {
  static productoEditandoId: string | null = null;
  static traducciones: Traducciones = {};

  static setTraducciones(trads: Traducciones): void {
    this.traducciones = trads;
  }

  static async crearOActualizarProducto(): Promise<void> {
    const producto: Producto = {
      name: Utils.sanitizeInput((document.getElementById("nombre") as HTMLInputElement).value),
      price: parseFloat((document.getElementById("precio") as HTMLInputElement).value),
      quantity: parseInt((document.getElementById("cantidad") as HTMLInputElement).value),
      description: Utils.sanitizeInput((document.getElementById("descripcion") as HTMLInputElement).value),
    };

    if (!Utils.isSafeInput(producto.name) || !Utils.isSafeInput(producto.description)) {
      alert(this.traducciones.specialCharsWarning || "Por favor, evita caracteres especiales en el nombre o descripción.");
      return;
    }

    if (producto.price <= 0 || producto.quantity < 0) {
      alert(this.traducciones.invalidValues || "El precio y la cantidad deben ser números positivos.");
      return;
    }

    if (this.productoEditandoId) {
      await APIService.actualizarProducto(this.productoEditandoId, producto);
      alert(this.traducciones.productUpdated || "Producto actualizado con éxito!");
      const crearBtn = document.getElementById("crear");
      if (crearBtn) crearBtn.textContent = this.traducciones.create || "Crear";
      this.productoEditandoId = null;
    } else {
      await APIService.crearProducto(producto);
      alert(this.traducciones.productCreated || "Producto creado con éxito!");
    }

    Utils.limpiarFormulario();
    this.listaProductos();
  }

  static async listaProductos(): Promise<void> {
    const contenedor = document.getElementById("listaProductos") as HTMLElement;
    contenedor.className = "product-list";
    contenedor.innerHTML = `<center><p class='text'>${this.traducciones.loading || "Cargando..."}</p></center>`;

    if (!(await APIService.verificarConexion())) {
      contenedor.innerHTML = `<p class='text' style='color:red;'>${this.traducciones.apiError || "No se pudo conectar con la API."}</p>`;
      return;
    }

    const data = await APIService.obtenerProductos();
    contenedor.innerHTML = "";

    data.forEach((producto: Producto) => {
      const card = document.createElement("div");

      const entradaBtn = document.createElement("button");
      entradaBtn.className = "button";
      entradaBtn.textContent = this.traducciones.entry || "Entrada";
      entradaBtn.addEventListener("click", () => this.entradaProducto(producto._id!));

      const salidaBtn = document.createElement("button");
      salidaBtn.className = "button";
      salidaBtn.textContent = this.traducciones.exit || "Salida";
      salidaBtn.addEventListener("click", () => this.salidaProducto(producto._id!));

      const editarBtn = document.createElement("button");
      editarBtn.className = "button";
      editarBtn.textContent = this.traducciones.edit || "Editar";
      editarBtn.addEventListener("click", () => this.editarProducto(producto._id!));

      const eliminarBtn = document.createElement("button");
      eliminarBtn.className = "button";
      eliminarBtn.textContent = this.traducciones.delete || "Eliminar";
      eliminarBtn.addEventListener("click", () => this.eliminarProducto(producto._id!));

      card.innerHTML = `
        <h3 class="text text--heading-3">${producto.name}</h3>
        <p class="text"><strong>${this.traducciones.price || "Precio"}:</strong> ${producto.price}</p>
        <p class="text"><strong>${this.traducciones.quantity || "Cantidad"}:</strong> ${producto.quantity}</p>
        <p class="text"><strong>${this.traducciones.description || "Descripción"}:</strong> ${producto.description}</p>
      `;
      card.appendChild(entradaBtn);
      card.appendChild(salidaBtn);
      card.appendChild(editarBtn);
      card.appendChild(eliminarBtn);

      contenedor.appendChild(card);
    });
  }

   // Muestra el modal de confirmación y guarda el id a eliminar
static async eliminarProducto(id: string): Promise<void> {
  const producto = await APIService.obtenerProductoPorId(id);

  if (!producto) {
    alert(this.traducciones.notFound || "Producto no encontrado.");
    return;
  }

  this.productoEditandoId = id;

  const modal = document.getElementById("modalEliminar");
  const texto = document.getElementById("modalEliminarTexto");

  if (modal) modal.classList.remove("hidden");
  if (texto) {
    texto.textContent = (this.traducciones.confirmDelete || "¿Eliminar el producto \"{name}\"?")
      .replace("{name}", producto.name);
  }
}

  // Elimina el producto si hay un id guardado
  static async confirmarEliminacion(): Promise<void> {
    if (!this.productoEditandoId) {
      alert(this.traducciones.noProductSelected || "No se ha seleccionado un producto para eliminar.");
      return;
    }

    await APIService.eliminarProducto(this.productoEditandoId);
    alert(this.traducciones.productDeleted || "Producto eliminado con éxito!");
    this.productoEditandoId = null;

    const modal = document.getElementById("modalEliminar");
    if (modal) modal.classList.add("hidden");

    this.listaProductos();
  }


 static async editarProducto(id: string): Promise<void> {
  const producto = await APIService.obtenerProductoPorId(id);

  if (!producto) {
    alert(this.traducciones.notFound || "Producto no encontrado.");
    return;
  }

  (document.getElementById("modal-nombre") as HTMLInputElement).value = producto.name;
  (document.getElementById("modal-precio") as HTMLInputElement).value = producto.price.toString();
  (document.getElementById("modal-cantidad") as HTMLInputElement).value = producto.quantity.toString();
  (document.getElementById("modal-descripcion") as HTMLInputElement).value = producto.description;

  this.productoEditandoId = id;

  document.getElementById("modalEditar")?.classList.remove("hidden");
}

  static async guardarEdicionDesdeModal(): Promise<void> {
    if (!this.productoEditandoId) {
      alert(this.traducciones.noProductSelected || "No se ha seleccionado un producto para editar.");
      return;
    }

    const productoActualizado: Producto = {
      name: Utils.sanitizeInput((document.getElementById("modal-nombre") as HTMLInputElement).value),
      price: parseFloat((document.getElementById("modal-precio") as HTMLInputElement).value),
      quantity: parseInt((document.getElementById("modal-cantidad") as HTMLInputElement).value),
      description: Utils.sanitizeInput((document.getElementById("modal-descripcion") as HTMLInputElement).value),
    };

    if (!Utils.isSafeInput(productoActualizado.name) ||
      !Utils.isSafeInput(productoActualizado.description)) {

      alert(this.traducciones.specialCharsWarning || "Por favor, evita caracteres especiales en el nombre o descripción.");
      return;
    }

    if (productoActualizado.price <= 0 || productoActualizado.quantity < 0) {
      alert(this.traducciones.invalidValues || "El precio y la cantidad deben ser números positivos.");
      return;
    }

    await APIService.actualizarProducto(this.productoEditandoId, productoActualizado);
    alert(this.traducciones.productUpdated || "Producto actualizado con éxito!");

    document.getElementById("modalEditar")?.classList.add("hidden");

    this.productoEditandoId = null;
    this.listaProductos();
  }

static async entradaProducto(id: string): Promise<void> {
  const producto = await APIService.obtenerProductoPorId(id);

  if (!producto) {
    alert(this.traducciones.notFound || "Producto no encontrado.");
    return;
  }

  producto.quantity += 1;
  await APIService.actualizarProducto(id, producto);
  this.listaProductos();
}

static async salidaProducto(id: string): Promise<void> {
  const producto = await APIService.obtenerProductoPorId(id);

  if (!producto) {
    alert(this.traducciones.notFound || "Producto no encontrado.");
    return;
  }

  if (producto.quantity > 0) {
    producto.quantity -= 1;
    await APIService.actualizarProducto(id, producto);
    this.listaProductos();
  } else {
    alert(this.traducciones.noMoreQuantity || "La cantidad ya es 0. No se puede disminuir más.");
  }
}
}
