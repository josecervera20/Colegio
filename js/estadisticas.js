document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el token existe, si no, redirigir al login
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "../index.html");

  // Elementos del formulario de filtro por fecha
  const filtroFechaForm = document.getElementById("filtro-fecha");
  const fechaSeleccionadaInput = document.getElementById("fecha-seleccionada");

  // IDs de los canvas para las gráficas
  const canvasIds = {
    entradas: "entradas-por-dia-chart",
    tipos: "tipos-visitante-chart",
    departamentos: "departamentos-visitados-chart",
  };

  // Objeto para almacenar las instancias de las gráficas
  const charts = {};

  // Establecer fecha de hoy por defecto en el input de fecha
  const today = new Date().toISOString().split("T")[0];
  if (fechaSeleccionadaInput) fechaSeleccionadaInput.value = today;

  // Crea un spinner centrado dentro de la card
  const crearSpinner = () => {
    const spinnerWrapper = document.createElement("div");
    spinnerWrapper.className =
      "d-flex justify-content-center align-items-center w-100 h-100 position-absolute top-0 start-0 bg-white bg-opacity-75";
    spinnerWrapper.style.zIndex = 10;

    const spinner = document.createElement("div");
    spinner.className = "spinner-border text-secondary";
    spinner.setAttribute("role", "status");
    spinner.innerHTML = '<span class="visually-hidden">Cargando...</span>';

    spinnerWrapper.appendChild(spinner);
    return spinnerWrapper;
  };

  // Crea un mensaje de alerta centrado dentro de la card
  const crearMensaje = (mensaje, tipo = "info") => {
    const mensajeWrapper = document.createElement("div");
    mensajeWrapper.className = `alert alert-${tipo} text-center position-absolute top-50 start-50 translate-middle w-75`;
    mensajeWrapper.textContent = mensaje;
    mensajeWrapper.style.zIndex = 10;
    return mensajeWrapper;
  };

  // Función para obtener datos desde el backend
  const fetchData = async (url, errorMessage, container) => {
    const spinner = crearSpinner();
    container.appendChild(spinner);

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Simula un tiempo de espera para mostrar el spinner
      await new Promise((r) => setTimeout(r, 700));
      spinner.remove();

      if (!response.ok) throw new Error(`${errorMessage}: ${response.status}`);

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      spinner.remove();

      const alert = crearMensaje(
        "¡Error al conectar con el servidor!",
        "danger"
      );
      container.appendChild(alert);
      return null;
    }
  };

  // Crea el gráfico con Chart.js
  const createChart = (id, type, data, options) => {
    const ctx = document.getElementById(id)?.getContext("2d");
    return ctx ? new Chart(ctx, { type, data, options }) : null;
  };

  // Genera colores aleatorios para los gráficos
  const generateColors = (count, opacity = 0.7) =>
    Array.from({ length: count }, () => {
      const [r, g, b] = [0, 0, 0].map(() => Math.floor(Math.random() * 255));
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });

  // Formatea la fecha en formato dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d)
      ? date
      : `${String(d.getDate()).padStart(2, "0")}/${String(
          d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Renderiza un gráfico individual
  const renderChart = async ({
    id,
    url,
    type,
    label,
    labelKey,
    valueKey,
    options,
    formatLabels = false,
  }) => {
    const canvas = document.getElementById(id);
    const container = canvas.closest(".card");

    // Eliminar cualquier spinner o mensaje previo
    container.querySelectorAll(".position-absolute").forEach((e) => e.remove());

    // Destruir gráfico anterior si existe
    if (charts[id]) {
      charts[id].destroy();
      charts[id] = null;
    }

    // Obtener los datos de la API
    const data = await fetchData(
      url,
      `Error al obtener datos para ${id}`,
      container
    );
    if (data === null) return;

    // Mostrar mensaje si no hay datos
    if (!data.length) {
      const mensaje = crearMensaje("No hay datos para esta fecha.", "danger");
      container.appendChild(mensaje);
      return;
    }

    // Construir los datos y colores para el gráfico
    const bg = generateColors(data.length);
    const labels = data.map((d) =>
      formatLabels ? formatDate(d[labelKey]) : d[labelKey]
    );

    const chartData = {
      labels,
      datasets: [
        {
          label,
          data: data.map((d) => d[valueKey]),
          backgroundColor: bg,
          borderColor: bg.map((c) => c.replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    };

    // Crear y guardar la instancia del gráfico
    charts[id] = createChart(id, type, chartData, options);
  };

  // Renderiza todos los gráficos según la fecha
  const renderAllCharts = (fecha = "") => {
    const q = fecha ? `?fecha=${fecha}` : "";

    // Gráfico de entradas por día
    renderChart({
      id: canvasIds.entradas,
      url: `http://localhost:3000/api/estadisticas/entradas-por-dia${q}`,
      type: "bar",
      label: "Número de Entradas",
      labelKey: "dia",
      valueKey: "total",
      formatLabels: true,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: ([ctx]) => `Fecha: ${ctx.label}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Número de Entradas" },
          },
          x: {
            title: { display: true, text: "Fecha" },
            ticks: {
              autoSkip: true,
              maxRotation: 90,
            },
          },
        },
      },
    });

    // Gráfico de tipos de visitante
    renderChart({
      id: canvasIds.tipos,
      url: `http://localhost:3000/api/estadisticas/tipos-visitante${q}`,
      type: "bar",
      label: "Número de Visitantes",
      labelKey: "tipo_visita",
      valueKey: "total",
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: "Número de Visitantes" },
          },
          y: {
            title: { display: true, text: "Tipo de Visitante" },
          },
        },
      },
    });

    // Gráfico de departamentos visitados
    renderChart({
      id: canvasIds.departamentos,
      url: `http://localhost:3000/api/estadisticas/departamentos-visitados${q}`,
      type: "bar",
      label: "Número de Visitas",
      labelKey: "departamento",
      valueKey: "total",
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Número de Visitas" },
          },
          x: {
            title: { display: true, text: "Departamento" },
          },
        },
      },
    });
  };

  // Escucha el formulario de filtrado por fecha
  if (filtroFechaForm) {
    filtroFechaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderAllCharts(fechaSeleccionadaInput.value);
    });
  }

  // Renderizar gráficas al cargar la página
  renderAllCharts();
});
