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

    alert(
        "Elegiste buscar por: " +
        ({
            cliente: "nombre o apellido",
            fecha: "fecha de llegada",
            estado: "estado de cancelación"
        }[currentFilter]) +
        ". En el próximo paso programaremos los resultados."
    );
});

// Limpiar el campo actual
clearButton.addEventListener("click", () => {
    showFilter(currentFilter);
});

// Mostrar Cliente al abrir la página
showFilter("cliente");