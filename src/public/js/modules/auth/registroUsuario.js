/**
 * Función principal que realiza la validación de datos
 * y envía la petición de registro al backend
 * @param {HTMLFormElement} formulario - Elemento del formulario de registro
 * @param {Object} inputs - Valores de los inputs: usuario, password y confirmarPassword
 * @param {HTMLElement} boton - Botón de envío del formulario
 */
export async function registrarUsuario(formulario, inputs, boton) {
  const { usuario, password, confirmarPassword } = inputs;

  // Validación de campos vacíos
  if (!usuario || !password || !confirmarPassword) {
    mostrarMensajeRegistro(
      "¡Completa todos los campos!",
      "danger",
      formulario,
      boton
    );
    return;
  }

  // Validación de coincidencia entre contraseñas
  if (password !== confirmarPassword) {
    mostrarMensajeRegistro(
      "¡Las contraseñas no coinciden!",
      "danger",
      formulario,
      boton
    );
    return;
  }

  // Mostrar spinner mientras se envía la solicitud
  const spinner = crearSpinnerRegistro();
  formulario.insertBefore(spinner, boton);

  try {
    // Enviar solicitud al servidor para registrar al usuario
    const respuesta = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    // Esperar un breve retraso para mostrar el spinner de forma visible
    await new Promise((resolve) => setTimeout(resolve, 500));
    spinner.remove();

    const datos = await respuesta.json();

    // Si la respuesta es exitosa
    if (respuesta.ok) {
      mostrarMensajeRegistro(datos.message, "success", formulario, boton);
      formulario.reset(); // Limpiar campos del formulario
    } else {
      // Mostrar mensaje de error devuelto por el servidor
      mostrarMensajeRegistro(
        datos.error || "¡No se pudo registrar el usuario!",
        "danger",
        formulario,
        boton
      );
    }
  } catch (error) {
    // En caso de error de red o servidor
    await new Promise((resolve) => setTimeout(resolve, 500));
    spinner.remove();
    mostrarMensajeRegistro(
      "¡Error al conectar con el servidor!",
      "danger",
      formulario,
      boton
    );
  }
}

/**
 * Crea un spinner de carga con clases de Bootstrap
 * @returns {HTMLElement} Spinner
 */
function crearSpinnerRegistro() {
  const spinner = document.createElement("div");
  spinner.classList.add(
    "spinner-border",
    "text-secondary",
    "mx-auto",
    "my-3",
    "d-flex",
    "justify-content-center"
  );
  spinner.setAttribute("role", "status");
  spinner.innerHTML = '<span class="visually-hidden">Cargando...</span>';
  return spinner;
}

/**
 * Muestra un mensaje de alerta debajo del botón de registro
 * @param {string} mensaje - Texto del mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success o danger)
 * @param {HTMLFormElement} formulario - Elemento del formulario
 * @param {HTMLElement} boton - Botón debajo del cual se inserta el mensaje
 */
function mostrarMensajeRegistro(mensaje, tipo, formulario, boton) {
  const clasesMensaje = { success: "alert-success", danger: "alert-danger" };
  const mensajeDiv = document.createElement("div");
  mensajeDiv.classList.add(
    "alert",
    clasesMensaje[tipo],
    "fade",
    "show",
    "text-center"
  );
  mensajeDiv.textContent = mensaje;
  formulario.insertBefore(mensajeDiv, boton);

  // Ocultar mensaje automáticamente después de 3 segundos
  setTimeout(() => {
    mensajeDiv.remove();
  }, 3000);
}
