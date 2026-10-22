const searchForm = document.getElementById("client-search-form");
const clearButton = document.getElementById("clear-client-search");

const nameInput = document.getElementById("client-name");
const surnameInput = document.getElementById("client-surname");

searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const nombre = nameInput.value.trim();
    const apellido = surnameInput.value.trim();

    if (nombre === "" && apellido === "") {
        alert("Ingresá un nombre, un apellido o ambos.");
        return;
    }

    // La búsqueda real se implementará al conectar el backend.
});

clearButton.addEventListener("click", () => {
    searchForm.reset();
    nameInput.focus();
});