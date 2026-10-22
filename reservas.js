const filterButtons = document.querySelectorAll(".search-option");
const filterFields = document.getElementById("filter-fields");
const searchForm = document.getElementById("reservation-search-form");
const clearButton = document.getElementById("clear-button");
const tableBody = document.getElementById("reservation-table-body");
const reservationCount = document.getElementById("reservation-count");

let currentFilter = "cliente";

function showFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });

    if (filter === "cliente") {
        filterFields.innerHTML = `
            <div class="client-search-fields">
                <div class="filter-field">
                    <label for="search-name">Nombre</label>
                    <input type="text" id="search-name"
                           placeholder="Ingresá el nombre">
                </div>
                <div class="filter-field">
                    <label for="search-surname">Apellido</label>
                    <input type="text" id="search-surname"
                           placeholder="Ingresá el apellido">
                </div>
            </div>`;
    } else if (filter === "fecha") {
        filterFields.innerHTML = `
            <div class="filter-field">
                <label for="search-date">Fecha de llegada</label>
                <input type="date" id="search-date">
            </div>`;
    } else if (filter === "estado") {
        filterFields.innerHTML = `
            <div class="filter-field">
                <label for="search-status">Estado de la reserva</label>
                <select id="search-status">
                    <option value="todas">Todas las reservas</option>
                    <option value="no">No canceladas</option>
                    <option value="si">Canceladas</option>
                </select>
            </div>`;
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        showFilter(button.dataset.filter);
    });
});

function mostrarReservas(reservas) {
    tableBody.replaceChildren();

    reservationCount.textContent =
       ` ${reservas.length} ${reservas.length === 1 ? "reserva" : "reservas"};`

    if (reservas.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 6;
        celda.className = "empty-message";
        celda.textContent = "No se encontraron reservas.";
        fila.appendChild(celda);
        tableBody.appendChild(fila);
        return;
    }

    reservas.forEach(reserva => {
        const fila = document.createElement("tr");
        const cancelada =
            Number(reserva.cancelado) === 1 ||
            reserva.cancelado === true;

        const valores = [
            reserva.codigo,
            reserva.cliente,
            reserva.hotel,
            reserva.llegada,
            reserva.habitacion ?? "Sin asignar",
            cancelada ? "Cancelada" : "No cancelada"
        ];

        valores.forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor ?? "—";
            fila.appendChild(celda);
        });

        tableBody.appendChild(fila);
    });
}

searchForm.addEventListener("submit", async event => {
    event.preventDefault();

    const parametros = new URLSearchParams();

    if (currentFilter === "cliente") {
        const nombre = document.getElementById("search-name").value.trim();
        const apellido = document.getElementById("search-surname").value.trim();

        if (!nombre && !apellido) {
            alert("Ingresá un nombre, un apellido o ambos.");
            return;
        }

        parametros.set("nombre", nombre);
        parametros.set("apellido", apellido);
    } else if (currentFilter === "fecha") {
        const fecha = document.getElementById("search-date").value;

        if (!fecha) {
            alert("Seleccioná una fecha de llegada.");
            return;
        }

        parametros.set("fecha", fecha);
    } else if (currentFilter === "estado") {
        const estado = document.getElementById("search-status").value;

        if (estado === "si") {
            parametros.set("estado", "cancelada");
        } else if (estado === "no") {
            parametros.set("estado", "activa");
        }
    }

    tableBody.innerHTML = `
        <tr><td colspan="6">Buscando reservas...</td></tr>`;

    try {
        const respuesta = await fetch(
            `http://127.0.0.1:5000/reservas?${parametros.toString()}`
        );

        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        const reservas = await respuesta.json();
        mostrarReservas(reservas);
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No se pudieron cargar las reservas. Revisá Flask.
                </td>
            </tr>`;
        reservationCount.textContent = "Error";
    }
});

clearButton.addEventListener("click", () => {
    showFilter(currentFilter);
});

showFilter("cliente");