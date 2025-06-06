import "./TaskList.css";

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

const addTask = (input, container, id, onSave) => {
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

export const TaskList = (listData, container) => {

    const { id, name, color, tasks = [], isShoppingList = false } = listData;

    if (!container) {
        console.error("Container not found");
        return;
    }

    const list = document.createElement("li");
    list.classList.add("task-list");
    list.dataset.id = id;
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

    container.appendChild(list);

    const input = list.querySelector(".add-task-input");
    const addBtn = list.querySelector(".add-task-btn");
    const taskContainer = list.querySelector(".list-items");

    // Guardar listas
    const saveLists = () => {
        const allLists = Array.from(document.querySelectorAll(".task-list")).map(el => {
            const id = el.dataset.id;
            const name = el.querySelector("h3").textContent;
            const color = el.style.backgroundColor;
            const tasks = Array.from(el.querySelectorAll(".list-items li")).map(li => li.textContent);
            const isShoppingList = el.classList.contains("shopping-list");
            return { id, name, color, tasks, isShoppingList };
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

    // Event listeners
    taskContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(taskContainer, e.clientY);

        if (dragging && dragging !== afterElement) {
            if (afterElement == null) {
                taskContainer.appendChild(dragging);
            } else {
                taskContainer.insertBefore(dragging, afterElement);
            }
        }
    });

    taskContainer.addEventListener("drop", () => {
        saveLists();
    });

    addBtn.addEventListener("click", () => {
        addTask(input, taskContainer, id, saveLists);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTask(input, taskContainer, id, saveLists);
        }
    });

    list.querySelector(".delete-list-btn").addEventListener("click", () => {
        if (confirm("¿Eliminar esta lista?")) {
            list.remove();
            saveLists();
        }
    });

    return list;
};
