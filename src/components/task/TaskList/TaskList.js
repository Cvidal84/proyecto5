import "./TaskList.css";
import { rgbToHex, getTextColor } from "../../../utils/colorUtils";
import { Welcome } from "../../Welcome/Welcome";
import { Modal } from "../../Modal/Modal";

// Drag and drop
const makeTaskDraggable = (li) => {
    li.draggable = true;
    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", li.textContent);
        li.classList.add("dragging");
    });
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
    });
};

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

//Añadir tarea
const addTask = (input, container, onSave) => {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task-btn");
    const img = document.createElement("img");
    img.src = "/icons/trash.png";
    img.alt = "Eliminar tarea";
    img.width = 20;

deleteBtn.appendChild(img);

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        li.remove();
        onSave();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    makeTaskDraggable(li);
    container.appendChild(li);

    input.value = "";
    onSave();
};


// Crear lista
export const TaskList = (listData, container) => {
    const { id, name, color, tasks = [], isShoppingList = false } = listData;

    if (!container) {
        console.error("Container not found");
        return;
    }

    const list = document.createElement("li");
    list.classList.add("task-list");
    if (isShoppingList) {
        list.classList.add("shopping-list");
    }
    list.dataset.id = id;
    list.innerHTML = `
        <div class="list-header">
            <div class="list-buttons">
                <button class="delete-list-btn">
                    <img src="/icons/trash.png" alt="trash icon">
                </button>
                <button class="send-list-btn">
                    <img src="/icons/email.png" alt="email icon">
                </button>
            </div>
            <h3>${name}</h3>
        </div>
        <div class="list-controls">
            <input type="text" name="add-task-input" class="add-task-input" placeholder="Nueva tarea..." />
            <button class="add-task-btn">+</button>
        </div>
        <ul class="list-items"></ul>
    `;
    list.style.backgroundColor = color;
    const hexColor = color.startsWith("#") ? color : rgbToHex(color);
    const textColor = getTextColor(hexColor);
    list.querySelector("h3").style.color = textColor;
    list.querySelector(".add-task-btn").style.color = textColor;
    const trashIcon = list.querySelector(".delete-list-btn img");
    if (trashIcon) {
        trashIcon.style.filter = textColor === "white" ? "invert(1)" : "invert(0)";
    }
    const sendIcon = list.querySelector(".send-list-btn img");
    if (sendIcon) {
        sendIcon.style.filter = textColor === "white" ? "invert(1)" : "invert(0)";
    }

    container.appendChild(list);

    const input = list.querySelector(".add-task-input");
    const addBtn = list.querySelector(".add-task-btn");
    const taskContainer = list.querySelector(".list-items");

    const dropIndicator = document.createElement("div");
    dropIndicator.classList.add("drop-indicator");

    // Se guardan las listas creadas
    const saveLists = () => {
        const currentLists = Array.from(document.querySelectorAll(".task-list")).map(el => {
            const id = el.dataset.id;
            const name = el.querySelector("h3").textContent;
            const color = el.style.backgroundColor;
            const tasks = Array.from(el.querySelectorAll(".list-items li")).map(li => li.textContent);
            const isShoppingList = el.classList.contains("shopping-list");
            return { id, name, color, tasks, isShoppingList };
        });

        // Leemos las listas que existen en el localStorage
        const existing = JSON.parse(localStorage.getItem("taskLists")) || [];

        // Fusionamos:
        const updated = [...existing];

        currentLists.forEach(newList => {
            const index = updated.findIndex(l => l.id === newList.id);
            if (index !== -1) {
                updated[index] = newList; // actualizamos
            } else {
                updated.push(newList); // añadimos nueva
            }
        });

        localStorage.setItem("taskLists", JSON.stringify(updated));
    };

    // Añadir tareas ya guardadas
    // Añadir tareas ya guardadas
tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("delete-task-btn");

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que se dispare el drag o cualquier otro evento
        li.remove();
        saveLists();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    makeTaskDraggable(li);
    taskContainer.appendChild(li);
});


    // Para hacer el drag and drop fluido
    taskContainer.addEventListener("dragenter", (e) => {
        e.preventDefault();
        if (!taskContainer.querySelector("li") && !taskContainer.querySelector(".drop-indicator")) {
            taskContainer.appendChild(dropIndicator);
        }
    });

    taskContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskContainer, e.clientY);
        if (dropIndicator.parentElement) {
            dropIndicator.remove();
        }
        if (!afterElement) {
            taskContainer.appendChild(dropIndicator);
        } else {
            taskContainer.insertBefore(dropIndicator, afterElement);
        }
    });

    taskContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(taskContainer, e.clientY);
        if (dropIndicator.parentElement) {
            dropIndicator.remove();
        }
        if (!dragging) return;
        if (!afterElement) {
            taskContainer.appendChild(dragging);
        } else {
            taskContainer.insertBefore(dragging, afterElement);
        }
        saveLists();
    });

    taskContainer.addEventListener("dragleave", (e) => {
        if (!taskContainer.contains(e.relatedTarget)) {
            if (dropIndicator.parentElement) {
                dropIndicator.remove();
            }
        }
    });

    addBtn.addEventListener("click", () => {
        addTask(input, taskContainer, saveLists);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTask(input, taskContainer, saveLists);
        }
    });

    const deleteBtn = list.querySelector(".delete-list-btn");
    const sendBtn = list.querySelector(".send-list-btn");

    // Mostrar botón de enviar en todas las listas
    sendBtn.style.display = "inline-block";
    sendBtn.addEventListener("click", () => {
        const tasks = Array.from(taskContainer.querySelectorAll("li")).map(li => li.textContent);
        const modal = Modal("sendList", {
            list: {
                name,
                tasks
            }
        });
        document.body.appendChild(modal);
    });

    if (!isShoppingList) {
        deleteBtn.addEventListener("click", () => {
            if (confirm("¿Eliminar esta lista?")) {
                const idToDelete = list.dataset.id;

                // Eliminamos la lista del DOM
                list.remove();

                // Eliminamos del localStorage
                const existing = JSON.parse(localStorage.getItem("taskLists")) || [];
                const updated = existing.filter(list => list.id !== idToDelete);
                localStorage.setItem("taskLists", JSON.stringify(updated));

                // Comprobamos si hay listas visibles
                const taskBoard = document.querySelector("#board-section");
                if (container.querySelectorAll(".task-list:not(.shopping-list)").length === 0) {
                    if (!taskBoard.querySelector("#welcome-message")) {
                        taskBoard.insertBefore(Welcome(), container);
                    }
                }
            }
        });
    } else {
        deleteBtn.style.display = "none";
    }
    
    return list;
};
