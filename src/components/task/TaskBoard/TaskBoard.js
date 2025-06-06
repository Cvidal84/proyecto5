import "./TaskBoard.css";
import { Modal } from "../../Modal/Modal";
import { TaskList } from "../TaskList/TaskList";

export const TaskBoard = (board) => {
    const taskBoard = document.createElement("section");
    taskBoard.id = `${board}-section`;

    const newListBtn = document.createElement("button");
    newListBtn.textContent = "+ Nueva Lista";
    newListBtn.classList.add("new-list-btn");
    taskBoard.appendChild(newListBtn);

    const taskLists = document.createElement("ul");
    taskLists.classList.add("task-lists");
    taskBoard.appendChild(taskLists);

    // Cargar las listas guardadas en local
    const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    storedLists.forEach(list => {
        setTimeout(() => {
            TaskList(list);
        }, 0);
    });

    // Event listener para el botón
    newListBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        
        const modal = Modal();
    
        document.body.appendChild(modal);
            
    });

    return taskBoard;
}