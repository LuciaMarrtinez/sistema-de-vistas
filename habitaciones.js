const roomSearchForm = document.getElementById("room-search-form");
const roomTypeSelect = document.getElementById("room-type");
const clearRoomSearch = document.getElementById("clear-room-search");

roomSearchForm.addEventListener("submit", event => {
    event.preventDefault();

    const tipo = roomTypeSelect.value;

    // La búsqueda se implementará al conectar el backend.
    // El valor seleccionado queda disponible en "tipo".
});

clearRoomSearch.addEventListener("click", () => {
    roomSearchForm.reset();
    roomTypeSelect.focus();
});