
console.log("Hotel Booking iniciado correctamente");

const API = "http://127.0.0.1:5000";

async function cargarResumen() {
    const reservasElemento = document.getElementById("total-reservas");
    const clientesElemento = document.getElementById("total-clientes");
    const mensaje = document.getElementById("dashboard-message");

    try {
        const respuesta = await fetch(`${API}/inicio/resumen`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        // Mostrar los totales que vienen desde la base de datos
        reservasElemento.textContent = datos.total_reservas;
        clientesElemento.textContent = datos.total_clientes;

        mensaje.textContent = "";

    } catch (error) {
        console.error("Error al cargar el resumen:", error);

        reservasElemento.textContent = "—";
        clientesElemento.textContent = "—";

        mensaje.textContent =
            "No se pudieron cargar los datos. Verificá que el servidor Flask esté funcionando.";
    }
}

cargarResumen();
