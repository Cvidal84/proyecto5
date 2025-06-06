import "./TaskList.css";

const addTask = (input, container, id, onSave) => {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.textContent = text;

    li.addEventListener("click", () => {
        if (confirm("¿Eliminar esta tarea?")) {
            li.remove();
            onSave();
        }
    });

    container.appendChild(li);
    input.value = "";
    onSave();
}

export const TaskList = ({ id, name, color, tasks = [] }) => {
    
    const taskLists = document.querySelector(".task-lists");

    if (!taskLists) {
        console.error("❌ Container .task-lists not found");
        return;
    }

    const list = document.createElement("li");
    list.classList.add("task-list");
    list.dataset.id = id;
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

    taskLists.appendChild(list);

    const input = list.querySelector(".add-task-input");
    const addBtn = list.querySelector(".add-task-btn");
    const taskContainer = list.querySelector(".list-items");

    // Cargar tareas
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        li.addEventListener("click", () => {
            if (confirm("¿Eliminar esta tarea?")) {
                li.remove();
                saveLists();
            }
        });
        taskContainer.appendChild(li);
    });

    const saveLists = () => {
        const allLists = Array.from(document.querySelectorAll(".task-list")).map(el => {
            const id = el.dataset.id;
            const name = el.querySelector("h3").textContent;
            const color = el.style.backgroundColor;
            const tasks = Array.from(el.querySelectorAll(".list-items li")).map(li => li.textContent);
            return { id, name, color, tasks };
        });

        localStorage.setItem("taskLists", JSON.stringify(allLists));
    };

    // Event listeners
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