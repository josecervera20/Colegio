/**
 * Crea y devuelve un spinner de carga con clases de Bootstrap
 */
export default function crearSpinner() {
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
