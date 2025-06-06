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

    // Event listener para cancelar
    modal.querySelector("#cancel-btn").addEventListener("click", () => {
        modal.remove();
    });

    // Event listener para crear una lista
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
            isShoppingList: false
        };

        const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        storedLists.push(newList);
        localStorage.setItem("taskLists", JSON.stringify(storedLists));

        const container = document.querySelector(".task-lists");
        if (container) {
            TaskList(newList, container);
        } else {
            console.error("No se encontró el contenedor .task-lists");
        }

        modal.remove();
    });

    // Event listener para Enter en el input
    modal.querySelector("#list-name").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            modal.querySelector("#add-list-btn").click();
        }
    });

    // Hacer foco en el input para que cuando se abra el modal podamos escribir sin tener que hacer click en el input
    setTimeout(() => {
        modal.querySelector("#list-name").focus();
    }, 100);

    return modal;
};