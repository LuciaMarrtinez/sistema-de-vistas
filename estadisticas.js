const API = "http://127.0.0.1:5000";

// Obtener los datos de una ruta del backend
async function obtenerDatos(ruta) {
    const respuesta = await fetch(API + ruta);

    if (!respuesta.ok) {
        throw new Error("Error al consultar " + ruta);
    }

    return await respuesta.json();
}
// Crear un gráfico con datos reales
function crearGrafico(id, tipo, etiquetas, valores, titulo, horizontal = false) {
    const canvas = document.getElementById(id);

    if (!canvas) {
        console.warn(`No se encontró el canvas: ${id}`);
        return;
    }

    new Chart(canvas, {
        type: tipo,
        data: {
            labels: etiquetas,
            datasets: [{
                label: titulo,
                data: valores,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: horizontal ? "y" : "x",
            plugins: {
                legend: {
                    display: tipo === "pie" || tipo === "doughnut"
                }
            },
            scales: (tipo === "pie" || tipo === "doughnut")
                ? {}
                : {
                    y: {
                        beginAtZero: true
                    }
                }
        }
    });
}

// Cargar todos los gráficos
async function cargarEstadisticas() {
    try {
        const [
            hoteles,
            paises,
            habitaciones,
            segmentos,
            dias,
            cancelaciones,
            noches,
            comidas,
            cumplimiento
        ] = await Promise.all([
            obtenerDatos("/estadisticas/hoteles"),
            obtenerDatos("/estadisticas/paises"),
            obtenerDatos("/estadisticas/habitaciones"),
            obtenerDatos("/estadisticas/segmentos"),
            obtenerDatos("/estadisticas/dias"),
            obtenerDatos("/estadisticas/cancelaciones"),
            obtenerDatos("/estadisticas/noches"),
            obtenerDatos("/estadisticas/comida"),
            obtenerDatos("/estadisticas/cumplio-habitaciones")
        ]);

        // 1. Hoteles más elegidos
        crearGrafico(
            "chart-hotels",
            "bar",
            hoteles.map(d => d.hotel),
            hoteles.map(d => Number(d.total)),
            "Cantidad de reservas",
            true
        );

        // 2. Países de origen
        crearGrafico(
            "chart-countries",
            "bar",
            paises.map(d => d.pais),
            paises.map(d => Number(d.total)),
            "Cantidad de reservas",
            true
        );

        // 3. Tipos de habitación solicitados
        crearGrafico(
            "chart-rooms",
            "bar",
            habitaciones.map(d => d.habitacion),
            habitaciones.map(d => Number(d.total)),
            "Cantidad de reservas"
        );

        // 4. Segmentos de mercado
        crearGrafico(
            "chart-segments",
            "doughnut",
            segmentos.map(d => d.segmento),
            segmentos.map(d => Number(d.total)),
            "Reservas por segmento"
        );

        // 5. Días de llegada más elegidos
        crearGrafico(
            "chart-dias",
            "bar",
            dias.map(d => d.dia),
            dias.map(d => Number(d.total)),
            "Cantidad de reservas"
        );

        // 6. Reservas canceladas y no canceladas
        crearGrafico(
            "chart-cancelaciones",
            "doughnut",
            cancelaciones.map(d => d.estado),
            cancelaciones.map(d => Number(d.total)),
            "Estado de las reservas"
        );

        // 7. Comparación entre noches de semana y de fin de semana
        const datosNoches = noches[0];

        crearGrafico(
            "chart-noches",
            "bar",
            ["Entre semana", "Fin de semana"],
            [
                Number(datosNoches.noches_semana),
                Number(datosNoches.noches_finde)
            ],
            "Total de noches"
        );

        // 8. Tipos de comida
        crearGrafico(
            "chart-comida",
            "doughnut",
            comidas.map(d => d.comida),
            comidas.map(d => Number(d.total)),
            "Reservas por tipo de comida"
        );

        // 9. Habitaciones solicitadas y recibidas
        crearGrafico(
            "chart-cumplimiento",
            "doughnut",
            cumplimiento.map(d => d.resultado),
            cumplimiento.map(d => Number(d.total)),
            "Cantidad de reservas"
        );

    } catch (error) {
        console.error("No se pudieron cargar las estadísticas:", error);
        alert(
            "No se pudieron cargar los gráficos. " +
            "Verificá que Flask esté funcionando y revisá la consola."
        );
    }
}

document.addEventListener("DOMContentLoaded", cargarEstadisticas);