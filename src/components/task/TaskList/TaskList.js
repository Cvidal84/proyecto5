import "./TaskList.css";

export const TaskList = ({id, name, color}) => {
    const taskLists = document.querySelector(".task-lists");

    if (!taskLists) {
        console.error("No se encontró el contenedor .task-lists");
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
        <div class="nueva-tarea">
            <input type="text" placeholder="Nueva tarea..." />
            <button class="btn-anadir">+</button>
        </div>
        <ul class="tasks"></ul>
    `;
    list.style.backgroundColor = color;

    taskLists.appendChild(list);

    list.querySelector(".delete-list-btn").addEventListener("click", () => {
        list.remove();
        const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        const updatedLists = storedLists.filter(list => list.id !== id);
        localStorage.setItem("taskLists", JSON.stringify(updatedLists));
    });

    return list;
};