import "./TaskList.css";
import { rgbToHex, getTextColor } from "../../../utils/colorUtils";

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
    li.textContent = text;
    makeTaskDraggable(li);

    li.addEventListener("click", () => {
        if (confirm("¿Eliminar esta tarea?")) {
            li.remove();
            onSave();
        }
    });

    container.appendChild(li);
    input.value = "";
    onSave();
};

// Crear lista
export const TaskList = (listData, container) => {
    const { name, color, tasks = [], isShoppingList = false } = listData;

    if (!container) {
        console.error("Container not found");
        return;
    }

    const list = document.createElement("li");
    list.classList.add("task-list");
    if (isShoppingList) {
        list.classList.add("shopping-list");
    }
    list.innerHTML = `
        <div class="list-header">
            <h3>${name}</h3>
            <button class="delete-list-btn">
                <img src="/icons/trash.png" alt="trash icon">
            </button>
        </div>
        <div class="list-controls">
            <input type="text" name="add-task-input" class="add-task-input" placeholder="Nueva tarea..." />
            <button class="add-task-btn">+</button>
        </div>
        <ul class="list-items"></ul>
    `;
    list.style.backgroundColor = color;
    // Para ajustar el color del texto según el fondo sea claro u oscuro:
    const hexColor = color.startsWith("#") ? color : rgbToHex(color);
    const textColor = getTextColor(hexColor);
    list.querySelector("h3").style.color = textColor;
    list.querySelector(".add-task-btn").style.color = textColor;
    const trashIcon = list.querySelector(".delete-list-btn img");
    if (trashIcon) {
        trashIcon.style.filter = textColor === "white" ? "invert(1)" : "invert(0)";
    }

    container.appendChild(list);

    const input = list.querySelector(".add-task-input");
    const addBtn = list.querySelector(".add-task-btn");
    const taskContainer = list.querySelector(".list-items");

    const dropIndicator = document.createElement("div");
    dropIndicator.classList.add("drop-indicator");

    // Se guardan las listas creadas
    const saveLists = () => {
        const allLists = Array.from(document.querySelectorAll(".task-list")).map(el => {
            const name = el.querySelector("h3").textContent;
            const color = el.style.backgroundColor;
            const tasks = Array.from(el.querySelectorAll(".list-items li")).map(li => li.textContent);
            const isShoppingList = el.classList.contains("shopping-list");
            return { name, color, tasks, isShoppingList };
        });

        localStorage.setItem("taskLists", JSON.stringify(allLists));
    };

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        makeTaskDraggable(li);
        li.addEventListener("click", () => {
            if (confirm("¿Eliminar esta tarea?")) {
                li.remove();
                saveLists();
            }
        });
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
    if (!isShoppingList) {
        deleteBtn.addEventListener("click", () => {
            if (confirm("¿Eliminar esta lista?")) {
                list.remove();
                saveLists();
            }
        });
    } else {
        deleteBtn.style.display = "none";
    }

    return list;
};