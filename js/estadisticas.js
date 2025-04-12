document.addEventListener('DOMContentLoaded', () => {
    // Obtener el token almacenado en el localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html'; // Redirigir si no hay token
        return;
    }

    // Obtener elementos del DOM
    const filtroFechaForm = document.getElementById('filtro-fecha');
    const fechaSeleccionadaInput = document.getElementById('fecha-seleccionada');

    // IDs de los canvas de las gráficas
    const canvasIds = {
        entradasPorDia: 'entradas-por-dia-chart',
        tiposVisitante: 'tipos-visitante-chart',
        departamentosVisitados: 'departamentos-visitados-chart',
    };

    let charts = {}; // Objeto para guardar instancias de las gráficas

    // Establecer la fecha actual por defecto en el input
    const today = new Date().toISOString().split('T')[0];
    if (fechaSeleccionadaInput) {
        fechaSeleccionadaInput.value = today;
    }

    // Función para realizar peticiones fetch con manejo de errores
    const fetchData = async (url, errorMessage) => {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error(`${errorMessage}: ${response.status}`);
        const json = await response.json();
        return json;
    };

    // Función para crear una gráfica con Chart.js
    const createChart = (canvasId, type, data, options) => {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        return ctx ? new Chart(ctx, { type, data, options }) : null;
    };

    // Generar colores aleatorios para las gráficas
    const generateRandomColors = (count, opacity = 0.7) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 255;
            const g = Math.random() * 255;
            const b = Math.random() * 255;
            colors.push(`rgba(${r}, ${g}, ${b}, ${opacity})`);
        }
        return colors;
    };

    // Formatear fecha a formato dd/mm/yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? dateString : `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Función general para renderizar cualquier gráfica
    const renderChart = async (canvasId, apiUrl, chartType, dataLabel, labelProperty, valueProperty, options) => {
        try {
            const data = await fetchData(apiUrl, `Error al obtener datos para ${canvasId}`);

            // Generar colores y estructura de datos
            const backgroundColors = generateRandomColors(data.length);
            const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

            const chartData = {
                labels: data.map(item => item[labelProperty]),
                datasets: [{
                    label: dataLabel,
                    data: data.map(item => item[valueProperty]),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                }],
            };

            // Destruir gráfica anterior si ya existe
            if (charts[canvasId]) charts[canvasId].destroy();

            // Crear nueva gráfica
            charts[canvasId] = createChart(canvasId, chartType, chartData, options);
        } catch (error) {
            console.error(error);
        }
    };

    // Renderizar gráfica de entradas por día (con o sin fecha)
    const renderEntradasPorDiaChart = (fecha = '') => {
        let apiUrl = 'http://localhost:3000/api/estadisticas/entradas-por-dia';
        if (fecha) {
            apiUrl += `?fecha=${fecha}`;
        }

        renderChart(canvasIds.entradasPorDia, apiUrl, 'bar', 'Número de Entradas', 'dia', 'total', {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (context) => `Fecha: ${formatDate(context[0].label)}`,
                    },
                },
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Número de Entradas' } },
                x: {
                    title: { display: true, text: 'Fecha' },
                    ticks: {
                        autoSkip: true,
                        maxRotation: 90,
                        callback: function (value) {
                            const dateString = this.getLabelForValue(value);
                            return formatDate(dateString);
                        },
                    },
                },
            },
        });
    };

    // Renderizar gráfica de tipos de visitante
    const renderTiposVisitanteChart = () => {
        renderChart(canvasIds.tiposVisitante, 'http://localhost:3000/api/estadisticas/tipos-visitante', 'bar', 'Número de Visitantes', 'tipo_visita', 'total', {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Número de Visitantes' } },
                y: { title: { display: true, text: 'Tipo de Visitante' } },
            },
        });
    };

    // Renderizar gráfica de departamentos más visitados
    const renderDepartamentosVisitadosChart = () => {
        renderChart(canvasIds.departamentosVisitados, 'http://localhost:3000/api/estadisticas/departamentos-visitados', 'bar', 'Número de Visitas', 'departamento', 'total', {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Número de Visitas' } },
                x: { title: { display: true, text: 'Departamento' } },
            },
        });
    };

    // Escuchar evento del formulario para filtrar por fecha
    if (filtroFechaForm) {
        filtroFechaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const fechaSeleccionada = fechaSeleccionadaInput.value;
            renderEntradasPorDiaChart(fechaSeleccionada); // Mostrar solo la fecha seleccionada
        });
    }

    // Renderizado inicial de las gráficas
    renderEntradasPorDiaChart(); // Mostrar todas las fechas al inicio
    renderTiposVisitanteChart();
    renderDepartamentosVisitadosChart();
});
