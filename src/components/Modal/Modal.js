import "./Modal.css";
import { TaskList } from "../task/TaskList/TaskList";

export const Modal = () => {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Nueva Lista</h3>
            <input type="text" id="list-name" placeholder="Nombre de la lista" />
            <label for="list-color">Color de fondo:</label>
            <input type="color" name="list-color" id="list-color" value="#ffffff" />
            <div class="modal-btns">
                <button id="add-list-btn">Crear</button>
                <button id="cancel-btn">Cancelar</button>
            </div>
        </div>
    `;

    modal.querySelector("#cancel-btn").addEventListener("click", () => modal.remove());

    modal.querySelector("#add-list-btn").addEventListener("click", () => {
        const listName = modal.querySelector("#list-name").value.trim();
        const listColor = modal.querySelector("#list-color").value;

        if (!listName) {
            alert("Por favor introduce un nombre para la lista.");
            return;
        }

        const newList = {
        id: crypto.randomUUID(),
        name: listName,
        color: listColor,
        tasks: [],
        };

        const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        storedLists.push(newList);
        localStorage.setItem("taskLists", JSON.stringify(storedLists));

        TaskList(newList);
        modal.remove();
    });

    return modal;
};