const searchForm = document.getElementById("client-search-form");
const clearButton = document.getElementById("clear-client-search");

const nameInput = document.getElementById("client-name");
const surnameInput = document.getElementById("client-surname");

const tableBody = document.getElementById("client-table-body");
const clientCount = document.getElementById("client-count");

// Consultar clientes en la base de datos
async function buscarClientes(nombre = "", apellido = "") {
    try {
        const parametros = new URLSearchParams();

        if (nombre) parametros.append("nombre", nombre);
        if (apellido) parametros.append("apellido", apellido);

        const respuesta = await fetch(
            `http://127.0.0.1:5000/clientes?${parametros.toString()}`
                    );

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los clientes.");
        }

        const clientes = await respuesta.json();

        tableBody.innerHTML = "";

        if (clientes.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-message">
                        No se encontraron clientes.
                    </td>
                </tr>
            `;
        } else {
            clientes.forEach(cliente => {
                const fila = document.createElement("tr");

                [
                    cliente.cod_cliente,
                    cliente.nombre,
                    cliente.apellido,
                    cliente.num_tel,
                    cliente.email
                ].forEach(valor => {
                    const celda = document.createElement("td");
                    celda.textContent = valor ?? "";
                    fila.appendChild(celda);
                });

                tableBody.appendChild(fila);
            });
        }

        clientCount.textContent =
            `${clientes.length} ${clientes.length === 1 ? "cliente" : "clientes"}`;

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los clientes. Verificá que Flask esté funcionando.");
    }
}

// Buscar al enviar el formulario
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const nombre = nameInput.value.trim();
    const apellido = surnameInput.value.trim();

    if (!nombre && !apellido) {
        alert("Ingresá un nombre, un apellido o ambos.");
        return;
    }

    buscarClientes(nombre, apellido);
});

// Limpiar los campos y volver al listado inicial
clearButton.addEventListener("click", () => {
    searchForm.reset();
    buscarClientes();
});