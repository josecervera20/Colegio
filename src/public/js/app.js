import { validarCredenciales } from "./modules/auth/validarCredenciales.js";

document.addEventListener("DOMContentLoaded", () => {
  // Referencias al formulario y campos
  const formulario = document.querySelector("form");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const botonEnviar = formulario.querySelector('button[type="submit"]');

  // Evento para manejar el envío del formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    validarCredenciales(formulario, usuarioInput, passwordInput, botonEnviar);
  });
});
