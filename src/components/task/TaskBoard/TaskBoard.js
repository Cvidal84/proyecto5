import "./TaskBoard.css";
import { Modal } from "../../Modal/Modal";
import { TaskList } from "../TaskList/TaskList";

export const TaskBoard = (page) => {
    const taskBoard = document.createElement("section");
    taskBoard.id = `${page}-section`;

    const taskLists = document.createElement("ul");
    taskLists.classList.add("task-lists");
    taskBoard.appendChild(taskLists);

    const allLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    const normalLists = allLists.filter(list => !list.isShoppingList);
    const shoppingLists = allLists.filter(list => list.isShoppingList);

    if(page === "board"){
        const newListBtn = document.createElement("button");
        newListBtn.textContent = "+ Nueva Lista";
        newListBtn.classList.add("new-list-btn");
        taskBoard.insertBefore(newListBtn, taskLists);

        /* Cargas las listas */
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
    }else if (page === "cart"){
        taskLists.classList.add("shopping-list-container");
        // Comprobar si ya hay listas de la compra guardadas
        if (shoppingLists.length === 0) {
            // No hay listas de la compra, crear una por defecto
            const defaultCart = {
                id: crypto.randomUUID(),
                name: "Lista de la compra",
                color: "#67c6bb",
                tasks: [],
                isShoppingList: true
            };

            // Guardar la lista de la compra por defecto junto con las listas normales
            const allListsUpdated = [...normalLists, defaultCart];
            localStorage.setItem("taskLists", JSON.stringify(allListsUpdated));

            // Mostrar la lista por defecto
            TaskList(defaultCart, taskLists);
        } else {
            // Ya hay listas de la compra, cargarlas todas
            shoppingLists.forEach(listData => {
                TaskList(listData, taskLists);
            });
        }
    }
    return taskBoard;
};