const reportForm = document.getElementById("report-form");
const reportType = document.getElementById("report-type");
const reportFilters = document.getElementById("report-filters");
const clearReport = document.getElementById("clear-report");

const reportDescription = document.getElementById("report-description");

function showReportFilters() {
    const tipo = reportType.value;

    reportFilters.innerHTML = "";

    if (tipo === "periodo") {
        reportFilters.innerHTML = `
            <div class="report-date-fields">
                <div class="filter-field">
                    <label for="date-from">Fecha desde</label>
                    <input type="date" id="date-from">
                </div>

                <div class="filter-field">
                    <label for="date-to">Fecha hasta</label>
                    <input type="date" id="date-to">
                </div>
            </div>
        `;

        reportDescription.textContent =
            "Consultá las reservas dentro de un período.";
    } else if (tipo === "canceladas") {
        reportDescription.textContent =
            "Consultá las reservas que fueron canceladas.";
    } else if (tipo === "habitaciones") {
        reportDescription.textContent =
            "Compará las reservas por tipo de habitación.";
    } else if (tipo === "clientes") {
        reportDescription.textContent =
            "Consultá los clientes y las reservas asociadas.";
    } else {
        reportDescription.textContent =
            "Seleccioná un listado para consultar sus resultados.";
    }
}

reportType.addEventListener("change", showReportFilters);

reportForm.addEventListener("submit", event => {
    event.preventDefault();

    const tipo = reportType.value;

    if (!tipo) {
        alert("Seleccioná un tipo de listado.");
        return;
    }

    if (tipo === "periodo") {
        const desde = document.getElementById("date-from").value;
        const hasta = document.getElementById("date-to").value;

        if (!desde || !hasta) {
            alert("Seleccioná ambas fechas.");
            return;
        }

        if (desde > hasta) {
            alert("La fecha inicial no puede ser posterior a la final.");
            return;
        }
    }


});

clearReport.addEventListener("click", () => {
    reportForm.reset();
    showReportFilters();
});

showReportFilters();