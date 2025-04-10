document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const entradasPorDiaCanvas = document.getElementById('entradas-por-dia-chart');
    const tiposVisitanteCanvas = document.getElementById('tipos-visitante-chart');
    const departamentosVisitadosCanvas = document.getElementById('departamentos-visitados-chart');
    const filtroFechaForm = document.getElementById('filtro-fecha');
    const fechaSeleccionadaInput = document.getElementById('fecha-seleccionada');

    let entradasPorDiaChart;
    let tiposVisitanteChart;
    let departamentosVisitadosChart;

    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // Función para obtener y mostrar las entradas por día (gráfico de barras vertical con colores diferentes y sin acción al hacer clic en la leyenda)
    const obtenerYMostrarEntradasPorDia = async () => {
        try {
            const url = 'http://localhost:3000/api/estadisticas/entradas-por-dia';
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Error al obtener las entradas por día:', response.status);
                return;
            }

            const data = await response.json();
            const backgroundColors = data.map((_, index) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);
            const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

            if (entradasPorDiaChart) {
                entradasPorDiaChart.destroy();
            }

            entradasPorDiaChart = new Chart(entradasPorDiaCanvas, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.dia),
                    datasets: [{
                        label: 'Número de Entradas',
                        data: data.map(item => item.total),
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Entradas'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Fecha'
                            },
                            ticks: {
                                autoSkip: true,
                                maxRotation: 90,
                                callback: function (value) {
                                    const fechaOriginal = this.getLabelForValue(value);
                                    if (fechaOriginal) {
                                        const fecha = new Date(fechaOriginal);
                                        if (!isNaN(fecha)) {
                                            const dia = fecha.getDate().toString().padStart(2, '0');
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                            const año = fecha.getFullYear();
                                            return `${dia}/${mes}/${año}`;
                                        }
                                        return fechaOriginal.split('T')[0].replace(/-/g, '/');
                                    }
                                    return fechaOriginal;
                                }
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                boxWidth: 0
                            },
                            onClick: null
                        },
                        tooltip: {
                            callbacks: {
                                title: function (tooltipItems) {
                                    if (tooltipItems.length > 0) {
                                        const fechaOriginal = tooltipItems[0].label;
                                        const fecha = new Date(fechaOriginal);
                                        if (!isNaN(fecha)) {
                                            const dia = fecha.getDate().toString().padStart(2, '0');
                                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                            const año = fecha.getFullYear();
                                            return `${dia}/${mes}/${año}`;
                                        }
                                        return fechaOriginal.split('T')[0].replace(/-/g, '/');
                                    }
                                    return '';
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener y mostrar las entradas por día:', error);
        }
    };

    // Función para obtener y mostrar los tipos de visitante (gráfico de barras horizontal con colores diferentes y sin acción al hacer clic en la leyenda)
    const obtenerYMostrarTiposVisitante = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/estadisticas/tipos-visitante', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Error al obtener los tipos de visitante:', response.status);
                return;
            }

            const data = await response.json();
            const backgroundColors = data.map((_, index) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);
            const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

            if (tiposVisitanteChart) {
                tiposVisitanteChart.destroy();
            }

            tiposVisitanteChart = new Chart(tiposVisitanteCanvas, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.tipo_visita),
                    datasets: [{
                        label: 'Número de Visitantes',
                        data: data.map(item => item.total),
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Visitantes'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Tipo de Visitante'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                boxWidth: 0
                            },
                            onClick: null
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener y mostrar los tipos de visitante:', error);
        }
    };

    // Función para obtener y mostrar los departamentos más visitados (gráfico de barras vertical con colores diferentes y sin acción al hacer clic en la leyenda)
    const obtenerYMostrarDepartamentosVisitados = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/estadisticas/departamentos-visitados', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Error al obtener los departamentos más visitados:', response.status);
                return;
            }

            const data = await response.json();
            const backgroundColors = data.map((_, index) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);
            const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

            if (departamentosVisitadosChart) {
                departamentosVisitadosChart.destroy();
            }

            departamentosVisitadosChart = new Chart(departamentosVisitadosCanvas, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.departamento),
                    datasets: [{
                        label: 'Número de Visitas',
                        data: data.map(item => item.total),
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Visitas'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Departamento'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                boxWidth: 0
                            },
                            onClick: null
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener y mostrar los departamentos más visitados:', error);
        }
    };

    // Evitar la recarga de la página al enviar el formulario
    filtroFechaForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        const fechaSeleccionada = fechaSeleccionadaInput.value;
        obtenerYMostrarEntradasPorDia(fechaSeleccionada);
    });

    // Llamar a las funciones al cargar la página
    obtenerYMostrarEntradasPorDia();
    obtenerYMostrarTiposVisitante();
    obtenerYMostrarDepartamentosVisitados();
});
