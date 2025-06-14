import "./TaskBoard.css";
import { Modal } from "../../Modal/Modal";
import { TaskList } from "../TaskList/TaskList";
import { Welcome } from "../../Welcome/Welcome";
import { getShoppingList } from "../../GoogleSheets/GoogleSheets";

export const TaskBoard = (page) => {
    const taskBoard = document.createElement("section");
    taskBoard.id = `${page}-section`;

    const allLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    const normalLists = allLists.filter(list => !list.isShoppingList);
    const shoppingList = allLists.filter(list => list.isShoppingList);

    const taskLists = document.createElement("ul");
    taskLists.classList.add("task-lists");
    taskBoard.appendChild(taskLists);

    if(page === "board"){
        const newListBtn = document.createElement("button");
        newListBtn.textContent = "+ Nueva Lista";
        newListBtn.classList.add("new-list-btn");
        taskBoard.insertBefore(newListBtn, taskLists);

        if (normalLists.length === 0) {
            const welcome = Welcome();
            taskBoard.insertBefore(welcome, taskLists);
        }

        /* Se cargan las listas */
        normalLists.forEach(list => {
            setTimeout(() => TaskList(list, taskLists), 0);
        });

        // Event listener para el botón
        newListBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            
            const modal = Modal("board");
            document.body.appendChild(modal);
                
        });

    } else if (page === "cart") {
        taskLists.classList.add("shopping-list-container");

        // Obtener todas las listas
        const savedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        const shoppingList = savedLists.find(list => list.isShoppingList);

        if (shoppingList) {
            // Mostrar la lista existente
            TaskList(shoppingList, taskLists);
        } else {
            // Crear una lista por defecto (esto lo hacemos solo la primera vez...)
            const defaultCart = {
                id: crypto.randomUUID(),
                name: "Lista de la compra",
                color: "#67c6bb",
                tasks: [],
                isShoppingList: true
            };

            const allListsUpdated = [...savedLists, defaultCart];
            localStorage.setItem("taskLists", JSON.stringify(allListsUpdated));

            TaskList(defaultCart, taskLists);
        }

        // Ahora cargamos tareas desde Google Sheets
        loadGoogleTasks(taskLists);
    }

    return taskBoard;
};

const loadGoogleTasks = async (taskLists) => {
    try {
        const googleTasks = await getShoppingList();

        // Actualizar localStorage con las tareas de Google Sheets (evitando duplicados)
        const updatedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
        const shoppingListIndex = updatedLists.findIndex(l => l.isShoppingList);

        if (shoppingListIndex !== -1) {
            const currentTasks = updatedLists[shoppingListIndex].tasks || [];
            googleTasks.forEach(task => {
            if (!currentTasks.includes(task)) {
                currentTasks.push(task);
            }
            });
            updatedLists[shoppingListIndex].tasks = currentTasks;
            localStorage.setItem("taskLists", JSON.stringify(updatedLists));

            // Limpiar UI y renderizar de nuevo con la lista actualizada
            taskLists.innerHTML = "";
            TaskList(updatedLists[shoppingListIndex], taskLists);
        }
    } catch (error) {
        console.error("Error al cargar la lista externa:", error);
    }
}