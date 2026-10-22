const roomSearchForm = document.getElementById("room-search-form");
const roomTypeSelect = document.getElementById("room-type");
const clearRoomSearch = document.getElementById("clear-room-search");
const roomTableBody = document.getElementById("room-table-body");
const roomCount = document.getElementById("room-count");

const API = "http://127.0.0.1:5000";

// Cargar los tipos de habitación en el selector
async function cargarTiposHabitacion() {
    try {
        const respuesta = await fetch(`${API}/tipo-habitaciones`);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los tipos");
        }

        const tipos = await respuesta.json();

        tipos.forEach(tipo => {
            const opcion = document.createElement("option");
            opcion.value = tipo.descrip;
            opcion.textContent = tipo.descrip;
            roomTypeSelect.appendChild(opcion);
        });

    } catch (error) {
        console.error("Error al cargar los tipos:", error);
        mostrarMensaje("No se pudieron cargar los tipos de habitación.");
    }
}

// Consultar las cantidades reservadas y asignadas
async function cargarHabitaciones(tipoSeleccionado = "") {
    try {
        roomTableBody.innerHTML = `
            <tr>
                <td colspan="3">Cargando habitaciones...</td>
            </tr>
        `;

        const respuesta = await fetch(
            `${API}/estadisticas/comparar-habitaciones`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar las habitaciones");
        }

        const habitaciones = await respuesta.json();

        const filtradas = tipoSeleccionado
            ? habitaciones.filter(h =>
                h.habitacion === tipoSeleccionado
            )
            : habitaciones;

        roomTableBody.innerHTML = "";

        if (filtradas.length === 0) {
            mostrarMensaje("No se encontraron habitaciones.");
            roomCount.textContent = "0 tipos";
            return;
        }

        filtradas.forEach(habitacion => {
            const fila = document.createElement("tr");

            [
                habitacion.habitacion,
                habitacion.reservadas,
                habitacion.asignadas
            ].forEach(valor => {
                const celda = document.createElement("td");
                celda.textContent = valor ?? 0;
                fila.appendChild(celda);
            });

            roomTableBody.appendChild(fila);
        });

        roomCount.textContent =
            `${filtradas.length} ${filtradas.length === 1 ? "tipo" : "tipos"};`

    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        mostrarMensaje(
            "No se pudieron cargar los datos. Verificá que Flask esté funcionando."
        );
        roomCount.textContent = "Error";
    }
}

// Mostrar mensajes en la tabla
function mostrarMensaje(mensaje) {
    roomTableBody.innerHTML = "";

    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 3;
    celda.className = "empty-message";
    celda.textContent = mensaje;

    fila.appendChild(celda);
    roomTableBody.appendChild(fila);
}

// Buscar por tipo de habitación
roomSearchForm.addEventListener("submit", event => {
    event.preventDefault();
    cargarHabitaciones(roomTypeSelect.value);
});

// Limpiar la búsqueda y mostrar todos los tipos
clearRoomSearch.addEventListener("click", () => {
    roomSearchForm.reset();
    cargarHabitaciones();
});

// Inicializar la página
cargarTiposHabitacion();
cargarHabitaciones();