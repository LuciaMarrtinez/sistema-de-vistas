const API = "http://127.0.0.1:5000";

const reportForm = document.getElementById("report-form");
const reportType = document.getElementById("report-type");
const reportFilters = document.getElementById("report-filters");
const clearReport = document.getElementById("clear-report");

const reportDescription = document.getElementById("report-description");
const reportCount = document.getElementById("report-count");
const reportTableHead = document.getElementById("report-table-head");
const reportTableBody = document.getElementById("report-table-body");

function mostrarMensaje(mensaje) {
    reportTableHead.innerHTML = "<tr><th>Resultados del listado</th></tr>";
    reportTableBody.innerHTML = "";

    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.className = "empty-message";
    celda.textContent = mensaje;

    fila.appendChild(celda);
    reportTableBody.appendChild(fila);
}

function showReportFilters() {
    const tipo = reportType.value;
    reportFilters.innerHTML = "";

    const descripciones = {
        periodo: "Consultá las reservas dentro de un período.",
        canceladas: "Consultá las reservas que fueron canceladas.",
        habitaciones: "Consultá las reservas según el tipo de habitación solicitada.",
        clientes: "Consultá los clientes y las reservas asociadas.",
        vista_cancelaciones: "Compará el total de cancelaciones de cada hotel.",
        vista_estadias: "Consultá las reservas de cinco noches o más.",
        vista_meses: "Consultá la cantidad de reservas por mes y año.",
        vista_adr: "Consultá las reservas cuyo ADR es superior a 100."
    };

    reportDescription.textContent =
        descripciones[tipo] ||
        "Seleccioná un listado para consultar sus resultados.";

    if (tipo === "periodo") {
        reportFilters.innerHTML = `
            <div class="report-date-fields">
                <div class="filter-field">
                    <label for="date-from">Fecha desde</label>
                    <input type="date" id="date-from" required>
                </div>
                <div class="filter-field">
                    <label for="date-to">Fecha hasta</label>
                    <input type="date" id="date-to" required>
                </div>
            </div>
        `;
    }
}

async function consultar(ruta) {
    const respuesta = await fetch(API + ruta);

    if (!respuesta.ok) {
        throw new Error("Error HTTP " + respuesta.status);
    }

    return await respuesta.json();
}

async function generarListado() {
    const tipo = reportType.value;
    let ruta = "";
    let descripcion = "";

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

        ruta = "/buscar/rango?desde=" +
            encodeURIComponent(desde) +
            "&hasta=" +
            encodeURIComponent(hasta);

        descripcion = "Reservas entre " + desde + " y " + hasta;

    } else if (tipo === "canceladas") {
        ruta = "/reservas?cancelado=1";
        descripcion = "Reservas canceladas";

    } else if (tipo === "habitaciones") {
        ruta = "/habitaciones";
        descripcion = "Reservas por tipo de habitación";

    } else if (tipo === "clientes") {
        ruta = "/clientes";
        descripcion = "Clientes registrados";

    } else if (tipo === "vista_cancelaciones") {
        ruta = "/listados/cancelaciones-hotel";
        descripcion = "Cancelaciones por hotel";

    } else if (tipo === "vista_estadias") {
        ruta = "/listados/estadias-largas";
        descripcion = "Estadías de cinco noches o más";

    } else if (tipo === "vista_meses") {
        ruta = "/listados/reservas-mes";
        descripcion = "Reservas por mes";

    } else if (tipo === "vista_adr") {
        ruta = "/listados/adr-alto";
        descripcion = "Reservas con ADR superior a 100";

    } else {
        alert("Seleccioná un tipo de listado.");
        return;
    }

    mostrarMensaje("Cargando resultados...");
    reportCount.textContent = "Consultando...";

    try {
        const datos = await consultar(ruta);
        mostrarTabla(datos);
        reportDescription.textContent = descripcion;

    } catch (error) {
        console.error("Error al generar el listado:", error);
        reportCount.textContent = "Error";
        mostrarMensaje(
            "No se pudieron cargar los resultados. Revisá Flask y la ruta solicitada."
        );
    }
}

function mostrarTabla(datos) {
    reportTableHead.innerHTML = "";
    reportTableBody.innerHTML = "";

    if (!Array.isArray(datos) || datos.length === 0) {
        reportCount.textContent = "0 resultados";
        mostrarMensaje("No se encontraron resultados.");
        return;
    }

    const columnas = Object.keys(datos[0]);
    const encabezado = document.createElement("tr");

    columnas.forEach(columna => {
        const th = document.createElement("th");
        th.textContent = columna.replaceAll("_", " ");
        encabezado.appendChild(th);
    });

    reportTableHead.appendChild(encabezado);

    datos.forEach(registro => {
        const fila = document.createElement("tr");

        columnas.forEach(columna => {
            const td = document.createElement("td");
            const valor = registro[columna];

            td.textContent = valor === null || valor === undefined
                ? ""
                : String(valor);

            fila.appendChild(td);
        });

        reportTableBody.appendChild(fila);
    });

    reportCount.textContent =
        datos.length + (datos.length === 1 ? " resultado" : " resultados");
}

reportType.addEventListener("change", showReportFilters);

reportForm.addEventListener("submit", event => {
    event.preventDefault();
    generarListado();
});

clearReport.addEventListener("click", () => {
    reportForm.reset();
    showReportFilters();
    reportCount.textContent = "0 resultados";
    mostrarMensaje("Seleccioná un listado para consultar sus resultados.");
});

showReportFilters();