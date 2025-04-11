document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración Inicial
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // 2. Elementos del DOM
    const filtroFechaForm = document.getElementById('filtro-fecha');
    const fechaSeleccionadaInput = document.getElementById('fecha-seleccionada');
    const canvasIds = {
        entradasPorDia: 'entradas-por-dia-chart',
        tiposVisitante: 'tipos-visitante-chart',
        departamentosVisitados: 'departamentos-visitados-chart',
    };
    let charts = {};

    // 3. Funciones Auxiliares
    const fetchData = async (url, errorMessage) => {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) throw new Error(`${errorMessage}: ${response.status}`);
        return response.json();
    };

    const createChart = (canvasId, type, data, options) => {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        return ctx ? new Chart(ctx, { type, data, options }) : null;
    };

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

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isNaN(date) ? dateString : `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // 4. Renderizar Gráficos
    const renderChart = async (canvasId, apiUrl, chartType, dataLabel, labelProperty, valueProperty, options) => {
        try {
            const data = await fetchData(apiUrl, `Error al obtener datos para ${canvasId}`);
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

            if (charts[canvasId]) charts[canvasId].destroy();
            charts[canvasId] = createChart(canvasId, chartType, chartData, options);

        } catch (error) {
            // Manejo de errores centralizado en fetchData
        }
    };

    const renderEntradasPorDiaChart = () => {
        renderChart(canvasIds.entradasPorDia, 'http://localhost:3000/api/estadisticas/entradas-por-dia', 'bar', 'Número de Entradas', 'dia', 'total', {
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

    // 5. Manejo de Eventos
    if (filtroFechaForm) {
        filtroFechaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const fechaSeleccionada = fechaSeleccionadaInput.value;
            renderChart(canvasIds.entradasPorDia, `http://localhost:3000/api/estadisticas/entradas-por-dia?fecha=${fechaSeleccionada}`, 'bar', 'Número de Entradas', 'dia', 'total', {
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
        });
    }

    // 6. Inicialización
    renderEntradasPorDiaChart();
    renderTiposVisitanteChart();
    renderDepartamentosVisitadosChart();
});
