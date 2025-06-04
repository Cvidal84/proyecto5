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

    return modal;
}