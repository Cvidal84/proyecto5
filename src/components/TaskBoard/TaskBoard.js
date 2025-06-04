import "./TaskBoard.css";
import { Modal } from "../Modal/Modal";

export const TaskBoard = (taskList) => {
    const taskBoard = document.createElement("section");
    taskBoard.id = `${taskList} section`;

    const newListBtn = document.createElement("button");
    newListBtn.textContent = "+ Nueva Lista";
    newListBtn.classList.add("new-list-btn");
    taskBoard.appendChild(newListBtn);

    newListBtn.addEventListener("click", () => {
        const modal = Modal();
        document.body.appendChild(modal);
    });

    return taskBoard;
}

