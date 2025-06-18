import InventarioApp from './inventarioApp.js';

// Tipado de traducciones
type Traducciones = { [clave: string]: string };


// Funciones de idioma con tipado
function getLang(): string {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  const cookieLang = getCookie('lang');
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();

  const lang = paramLang || cookieLang || (['es', 'en'].includes(browserLang) ? browserLang : 'en');

  if (paramLang || !cookieLang) {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`; // 1 año
  }

  return lang;
}

function getCookie(nombre: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === nombre) return value;
  }
  return null;
}

function getTraducciones(trads: { [key: string]: string }, lang: string): Traducciones {
  const traducciones: Traducciones = {};
  for (const key in trads) {
  if (lang === 'es' || !Object.prototype.hasOwnProperty.call(trads, `${key}_en`)) {
    traducciones[key] = trads[key];
  } else if (lang === 'en' && Object.prototype.hasOwnProperty.call(trads, `${key}_en`)) {
    traducciones[key] = trads[`${key}_en`];
  }
}
  return traducciones;
}

// DOM Ready
document.addEventListener("DOMContentLoaded", async () => {
  const lang = getLang();

  const traduccionesJson: Traducciones = await fetch('/assets/languages/textos.json')
    .then(res => res.json())
    .catch(err => {
      console.error("Error al cargar textos.json", err);
      return {};
    });

  const t = getTraducciones(traduccionesJson, lang);
  InventarioApp.setTraducciones(t);

  const crearBtn = document.getElementById("crear");
  if (crearBtn && crearBtn instanceof HTMLButtonElement) {
    crearBtn.textContent = t.create || "Crear";
    crearBtn.addEventListener("click", () => {
      InventarioApp.crearOActualizarProducto();
    });
  }

  const botonMostrar = document.getElementById("mostrar") as HTMLButtonElement | null;
  const lista = document.getElementById("listaProductos") as HTMLElement | null;
  let mostrando = false;

  if (botonMostrar && lista) {
    botonMostrar.addEventListener("click", async () => {
      mostrando = !mostrando;

      if (mostrando) {
        botonMostrar.textContent = t.hideProducts || "Ocultar productos";
        await InventarioApp.listaProductos();
      } else {
        botonMostrar.textContent = t.showProducts || "Mostrar productos";
        lista.textContent = "";
      }
    });
  }

  const guardarBtn = document.getElementById("modal-guardar") as HTMLButtonElement | null;
  guardarBtn?.addEventListener("click", () => {
    InventarioApp.guardarEdicionDesdeModal();
  });

  const cerrarBtn = document.getElementById("modal-cerrar") as HTMLButtonElement | null;
  cerrarBtn?.addEventListener("click", () => {
    const modal = document.getElementById("modalEditar");
    modal?.classList.add("hidden");
    InventarioApp.productoEditandoId = null;
  });
});
