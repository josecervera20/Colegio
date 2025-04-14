document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el token existe, si no, redirigir al login
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "../index.html");

  // Obtener referencias a elementos del DOM
  const filtroFechaForm = document.getElementById("filtro-fecha");
  const fechaSeleccionadaInput = document.getElementById("fecha-seleccionada");

  // IDs de los canvas de las gráficas
  const canvasIds = {
    entradas: "entradas-por-dia-chart",
    tipos: "tipos-visitante-chart",
    departamentos: "departamentos-visitados-chart",
  };

  const charts = {}; // Almacena instancias de gráficas Chart.js

  // Establecer la fecha actual como valor predeterminado del input
  const today = new Date().toISOString().split("T")[0];
  if (fechaSeleccionadaInput) fechaSeleccionadaInput.value = today;

  // Función para realizar una petición con fetch y manejo de errores
  const fetchData = async (url, errorMessage) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`${errorMessage}: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Crea una gráfica Chart.js si el canvas existe
  const createChart = (id, type, data, options) => {
    const ctx = document.getElementById(id)?.getContext("2d");
    return ctx ? new Chart(ctx, { type, data, options }) : null;
  };

  // Genera una lista de colores aleatorios en formato rgba
  const generateColors = (count, opacity = 0.7) =>
    Array.from({ length: count }, () => {
      const [r, g, b] = [0, 0, 0].map(() => Math.floor(Math.random() * 255));
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });

  // Formatea una fecha a dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d)
      ? date
      : `${String(d.getDate()).padStart(2, "0")}/${String(
          d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  /**
   * Renderiza una gráfica reutilizable con Chart.js
   * @param {Object} config - Configuración para renderizar la gráfica
   */
  const renderChart = async ({
    id,
    url,
    type,
    label,
    labelKey,
    valueKey,
    options,
    formatLabels = false, // Indicador opcional para formatear etiquetas
  }) => {
    const data = await fetchData(url, `Error al obtener datos para ${id}`);

    const bg = generateColors(data.length); // Colores de fondo
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

    // Destruir gráfica previa si existe
    if (charts[id]) charts[id].destroy();

    // Crear y guardar nueva instancia de la gráfica
    charts[id] = createChart(id, type, chartData, options);
  };

  /**
   * Renderiza todas las gráficas con o sin filtro de fecha
   * @param {string} fecha - Fecha opcional para filtrar datos
   */
  const renderAllCharts = (fecha = "") => {
    const q = fecha ? `?fecha=${fecha}` : "";

    // Gráfica de entradas por día
    renderChart({
      id: canvasIds.entradas,
      url: `http://localhost:3000/api/estadisticas/entradas-por-dia${q}`,
      type: "bar",
      label: "Número de Entradas",
      labelKey: "dia",
      valueKey: "total",
      formatLabels: true, // Formatear fechas para eje X
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

    // Gráfica de tipos de visitante
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

    // Gráfica de departamentos más visitados
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

  // Escuchar el envío del formulario para filtrar por fecha
  if (filtroFechaForm) {
    filtroFechaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderAllCharts(fechaSeleccionadaInput.value);
    });
  }

  // Renderizar todas las gráficas al cargar la página (sin filtro)
  renderAllCharts();
});
