import "./TaskBoard.css";
import { Modal } from "../../Modal/Modal";
import { TaskList, saveLists } from "../TaskList/TaskList";
import { Welcome } from "../../Welcome/Welcome";

export const TaskBoard = (page) => {
  const taskBoard = document.createElement("section");
  taskBoard.id = `${page}-section`;

  const allLists = JSON.parse(localStorage.getItem("taskLists")) || [];
  const normalLists = allLists.filter((list) => !list.isShoppingList);
  const shoppingList = allLists.filter((list) => list.isShoppingList);

  const taskLists = document.createElement("ul");
  taskLists.classList.add("task-lists");
  taskBoard.appendChild(taskLists);

  // Configuración de Drag and Drop para la ordenación de las listas
  const getDragAfterList = (container, x, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".task-list:not(.dragging-list)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const distance = Math.hypot(x - centerX, y - centerY);
        if (distance < closest.distance) {
          return { distance: distance, element: child, box: box };
        } else {
          return closest;
        }
      },
      { distance: Number.POSITIVE_INFINITY }
    );
  };

  taskLists.addEventListener("dragover", (e) => {
    const draggingList = taskLists.querySelector(".dragging-list");
    if (!draggingList) return;

    e.preventDefault();

    const result = getDragAfterList(taskLists, e.clientX, e.clientY);

    if (result.element) {
      const { element, box } = result;
      
      // Determinar si la pantalla es móvil para usar eje vertical, si no, horizontal
      const isMobile = window.innerWidth <= 480;
      const isBefore = isMobile
        ? (e.clientY < box.top + box.height / 2)
        : (e.clientX < box.left + box.width / 2);

      if (isBefore) {
        if (draggingList !== element) {
          taskLists.insertBefore(draggingList, element);
        }
      } else {
        if (draggingList !== element.nextSibling) {
          taskLists.insertBefore(draggingList, element.nextSibling);
        }
      }
    } else {
      if (taskLists.lastChild !== draggingList) {
        taskLists.appendChild(draggingList);
      }
    }
  });

  taskLists.addEventListener("drop", (e) => {
    const draggingList = taskLists.querySelector(".dragging-list");
    if (!draggingList) return;

    e.preventDefault();
    saveLists();
  });

  if (page === "board") {
    const newListBtn = document.createElement("button");
    newListBtn.textContent = "+ Nueva Lista";
    newListBtn.classList.add("new-list-btn");
    taskBoard.insertBefore(newListBtn, taskLists);

    if (normalLists.length === 0) {
      const welcome = Welcome();
      taskBoard.insertBefore(welcome, taskLists);
    }

    /* Se cargan las listas */
    normalLists.forEach((list) => {
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
    const shoppingList = savedLists.find((list) => list.isShoppingList);

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
        isShoppingList: true,
      };

      const allListsUpdated = [...savedLists, defaultCart];
      localStorage.setItem("taskLists", JSON.stringify(allListsUpdated));

      TaskList(defaultCart, taskLists);
    }
  }

  return taskBoard;
};
