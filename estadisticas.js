// 1. Gráfico de hoteles más elegidos
const ctxHotels = document.getElementById("chart-hotels");

new Chart(ctxHotels, {
    type: "bar",
    data: {
        labels: ["City Hotel", "Resort Hotel"],
        datasets: [{
            label: "Reservas",
            data: [79330, 40060],
            backgroundColor: ["#b9a5c9", "#9bc9b0"],
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});


// 2. Gráfico de países de origen
const ctxCountries = document.getElementById("chart-countries");

new Chart(ctxCountries, {
    type: "doughnut",
    data: {
        labels: ["Portugal", "Reino Unido", "Francia", "España", "Otros"],
        datasets: [{
            label: "Reservas",
            data: [485, 1213, 1042, 856, 3000],
            backgroundColor: [
                "#b9a5c9",
                "#9bc9b0",
                "#e8a6ad",
                "#e7c99b",
                "#a9c5dc"
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" }
        }
    }
});


// 3. Gráfico de tipos de habitación
const ctxRooms = document.getElementById("chart-rooms");

new Chart(ctxRooms, {
    type: "bar",
    data: {
        labels: ["A", "D", "E", "F", "G", "Otros"],
        datasets: [{
            label: "Reservas",
            data: [1500, 2000, 900, 700, 600, 1200],
            backgroundColor: "#b9a5c9",
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { beginAtZero: true }
        }
    }
});


// 4. Gráfico de segmentos de mercado
const ctxSegments = document.getElementById("chart-segments");

new Chart(ctxSegments, {
    type: "pie",
    data: {
        labels: [
            "Online TA",
            "Offline TA/TO",
            "Direct",
            "Corporate",
            "Otros"
        ],
        datasets: [{
            data: [5000, 2500, 1200, 700, 600],
            backgroundColor: [
                "#b9a5c9",
                "#9bc9b0",
                "#e8a6ad",
                "#e7c99b",
                "#a9c5dc"
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" }
        }
    }
});