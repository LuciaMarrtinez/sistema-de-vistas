const filterButtons = document.querySelectorAll(".search-option");
const filterFields = document.getElementById("filter-fields");
const searchForm = document.getElementById("reservation-search-form");
const clearButton = document.getElementById("clear-button");

let currentFilter = "cliente";

// Cambiar el campo según el botón seleccionado
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
                <input
                    type="text"
                    id="search-name"
                    placeholder="Ingresá el nombre"
                >
            </div>

            <div class="filter-field">
                <label for="search-surname">Apellido</label>
                <input
                    type="text"
                    id="search-surname"
                    placeholder="Ingresá el apellido"
                >
            </div>
        </div>
    `;
}

    if (filter === "fecha") {
        filterFields.innerHTML = `
            <div class="filter-field">
                <label for="search-date">
                    Fecha de llegada
                </label>
                <input type="date" id="search-date">
            </div>
        `;
    }

    if (filter === "estado") {
        filterFields.innerHTML = `
            <div class="filter-field">
                <label for="search-status">
                    Estado de la reserva
                </label>
                <select id="search-status">
                    <option value="todas">Todas las reservas</option>
                    <option value="no">No canceladas</option>
                    <option value="si">Canceladas</option>
                </select>
            </div>
        `;
    }
}

// Escuchar los clics de los tres botones
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        showFilter(button.dataset.filter);
    });
});

// Evitar que el formulario recargue la página.
// La búsqueda se implementará en el próximo paso.
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    if (currentFilter === "cliente") {
        const nombre = document
            .getElementById("search-name")
            .value.trim();

        const apellido = document
            .getElementById("search-surname")
            .value.trim();

        if (nombre === "" && apellido === "") {
            alert("Ingresá un nombre, un apellido o ambos.");
            return;
        }

        alert(
            "Criterios de búsqueda:\n" +
            "Nombre: " + (nombre || "Sin especificar") + "\n" +
            "Apellido: " + (apellido || "Sin especificar") +
            "\n\nLa búsqueda se conectará al backend."
        );
    }

    if (currentFilter === "fecha") {
        const fecha = document.getElementById("search-date").value;

        if (fecha === "") {
            alert("Seleccioná una fecha de llegada.");
            return;
        }

        alert(
            "Fecha seleccionada: " + fecha +
            "\nLa búsqueda se conectará al backend."
        );
    }

    if (currentFilter === "estado") {
        const estado = document.getElementById("search-status").value;

        alert(
            "Estado seleccionado: " + estado +
            "\nLa búsqueda se conectará al backend."
        );
    }
});

// Limpiar el campo actual
clearButton.addEventListener("click", () => {
    showFilter(currentFilter);
});

// Mostrar Cliente al abrir la página
showFilter("cliente");