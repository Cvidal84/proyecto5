import "./Modal.css";

export const Modal = () => {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Nueva Lista</h3>
            <input type="text" id="list-name" placeholder="Nombre de la lista" />
            <label for="list-color">Color de fondo:</label>
            <input type="color" name="list-color" id="listColor" value="#ffffff" />
            <div class="modal-btns">
                <button id="add-list-btn">Crear</button>
                <button id="cancel-btn">Cancelar</button>
            </div>
        </div>
    `;

    modal.querySelector("#cancel-btn").addEventListener("click", () => modal.remove());

    //crear nueva lista desde el modal (ultimo cambio carlos)
    modal.querySelector("#add-list-btn").addEventListener("click", () => {
        const listName = modal.querySelector("#list-name").value.trim();
        const listColor = modal.querySelector("#listColor").value;

        if (!listName) {
            alert("Por favor introduce un nombre para la lista.");
            return;
        }

        // Crear la lista
        const list = document.createElement("div");
        list.classList.add("lista");
        list.textContent = listName;
        list.style.backgroundColor = listColor;

        // Añadir la lista al taskBoard
        const taskBoard = document.querySelector("section"); // Puedes ser más específico si hay varios
        taskBoard.appendChild(list);

        // Cerrar modal
        modal.remove();
    });
    //hasta aqui

    return modal;
}
