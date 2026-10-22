console.log("Hotel Booking iniciado correctamente");

// 1. Gráfico de reservas por día de la semana
const grfdias = document.getElementById("chart-dias");

new Chart(grfdias, {
    type: "bar",

    data: {
        labels: [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ],

        datasets: [{
            label: "Cantidad de reservas",
            data: [120, 150, 135, 180, 210, 195, 160],
            backgroundColor: "#b9a5c9",
            borderRadius: 6
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


// 2. Gráfico de reservas canceladas y no canceladas
const grfCancelaciones =
    document.getElementById("chart-cancelaciones");

new Chart(grfCancelaciones, {
    type: "doughnut",

    data: {
        labels: ["No canceladas", "Canceladas"],

        datasets: [{
            data: [70, 30],
            backgroundColor: [
                "#9bc9b0",
                "#e8a6ad"
            ],
            borderWidth: 0
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});