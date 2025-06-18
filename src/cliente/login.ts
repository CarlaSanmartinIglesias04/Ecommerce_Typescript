document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const usuarioInput = document.getElementById("usuario") as HTMLInputElement | null;
  const claveInput = document.getElementById("clave") as HTMLInputElement | null;

  const usuario = usuarioInput?.value.trim() ?? "";
  const clave = claveInput?.value.trim() ?? "";

  if (usuario && clave) {
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave }),
      });

      if (res.ok) {
        alert("¡Has iniciado sesión con éxito!");
        window.location.href = "/index";
      } else {
        alert("Usuario o clave incorrectos.");
      }
    } catch (error) {
      console.error("Error en la solicitud de inicio de sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  } else {
    alert("Por favor, completa todos los campos.");
  }
});
