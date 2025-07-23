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
  const draggableElements = [
    ...container.querySelectorAll("li:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

// Crear tarea
const createTaskItem = (
  text,
  completed,
  onSave,
  updateCompletedVisibility,
  sortTasks
) => {
  const li = document.createElement("li");
  li.classList.add("task-item");
  if (completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-complete-checkbox");
  checkbox.checked = completed;

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      li.classList.add("completed");
    } else {
      li.classList.remove("completed");
    }
    sortTasks();
    updateCompletedVisibility();
    onSave();
  });

  const spanText = document.createElement("span");
  spanText.textContent = text;

  li.appendChild(checkbox);
  li.appendChild(spanText);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-task-btn");
  const img = document.createElement("img");
  img.src = "/icons/trash.png";
  img.alt = "Eliminar tarea";
  deleteBtn.appendChild(img);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateCompletedVisibility();
    onSave();
  });

  li.appendChild(deleteBtn);
  makeTaskDraggable(li);

  return li;
};

// Añadir tarea nueva
const addTask = (
  input,
  container,
  onSave,
  updateCompletedVisibility,
  sortTasks
) => {
  const text = input.value.trim();
  if (!text) return;

  const li = createTaskItem(
    text,
    false,
    onSave,
    updateCompletedVisibility,
    sortTasks
  );
  container.appendChild(li);

  sortTasks();

  input.value = "";
  onSave();
  updateCompletedVisibility();
};

// Crear lista completa
export const TaskList = (listData, container) => {
  const { id, name, color, tasks = [], isShoppingList = false } = listData;

  if (!container) {
    console.error("Container not found");
    return;
  }

  const list = document.createElement("li");
  list.classList.add("task-list");
  if (isShoppingList) list.classList.add("shopping-list");
  list.dataset.id = id;

  list.innerHTML = `
    <div class="list-header">
      <div class="list-buttons">
        <button class="delete-list-btn" title="Eliminar lista">
          <img src="/icons/trash.png" alt="trash icon" />
        </button>
        <button class="send-list-btn" title="Enviar lista">
          <img src="/icons/email.png" alt="email icon" />
        </button>
      </div>
      <button class="completed-btn" title="Mostrar/Ocultar tareas completadas">
        <img src="/icons/eye.png" alt="visible icon" />
      </button>
    </div>
    <h3>${name}</h3>
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
  const completedBtn = list.querySelector(".completed-btn");

  const dropIndicator = document.createElement("div");
  dropIndicator.classList.add("drop-indicator");

  // Variable para controlar visibilidad tareas completadas
  let showCompleted = false;

  // Función para ordenar tareas: no completadas primero, completadas después
  const sortTasks = () => {
    const tasks = Array.from(taskContainer.querySelectorAll("li.task-item"));
    tasks.sort((a, b) => {
      const aCompleted = a.classList.contains("completed");
      const bCompleted = b.classList.contains("completed");
      return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
    });
    tasks.forEach((task) => taskContainer.appendChild(task));
  };

  const updateCompletedVisibility = () => {
    const completedTasks = taskContainer.querySelectorAll(
      ".task-item.completed"
    );
    completedTasks.forEach((task) => {
      task.style.display = showCompleted ? "" : "none";
    });
    completedBtn.style.opacity = showCompleted ? "1" : "0.5";
  };

  // Guardar listas
  const saveLists = () => {
    const currentLists = Array.from(
      document.querySelectorAll(".task-list")
    ).map((el) => {
      const id = el.dataset.id;
      const name = el.querySelector("h3").textContent;
      const color = el.style.backgroundColor;
      const tasks = Array.from(el.querySelectorAll(".list-items li")).map(
        (li) => {
          const completed = li.classList.contains("completed");
          const textSpan = li.querySelector("span");
          const text = textSpan ? textSpan.textContent : li.textContent;
          return { text, completed };
        }
      );
      const isShoppingList = el.classList.contains("shopping-list");
      return { id, name, color, tasks, isShoppingList };
    });

    const existing = JSON.parse(localStorage.getItem("taskLists")) || [];
    const updated = [...existing];

    currentLists.forEach((newList) => {
      const index = updated.findIndex((l) => l.id === newList.id);
      if (index !== -1) {
        updated[index] = newList;
      } else {
        updated.push(newList);
      }
    });

    localStorage.setItem("taskLists", JSON.stringify(updated));
  };

  // Cargar tareas guardadas
  tasks.forEach((task) => {
    const li = createTaskItem(
      task.text || task,
      task.completed || false,
      saveLists,
      updateCompletedVisibility,
      sortTasks
    );
    taskContainer.appendChild(li);
  });

  sortTasks();

  updateCompletedVisibility();

  // Drag and drop eventos
  taskContainer.addEventListener("dragenter", (e) => {
    e.preventDefault();
    if (
      !taskContainer.querySelector("li") &&
      !taskContainer.querySelector(".drop-indicator")
    ) {
      taskContainer.appendChild(dropIndicator);
    }
  });

  taskContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskContainer, e.clientY);
    if (dropIndicator.parentElement) dropIndicator.remove();
    if (!afterElement) taskContainer.appendChild(dropIndicator);
    else taskContainer.insertBefore(dropIndicator, afterElement);
  });

  taskContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(taskContainer, e.clientY);
    if (dropIndicator.parentElement) dropIndicator.remove();
    if (!dragging) return;
    if (!afterElement) taskContainer.appendChild(dragging);
    else taskContainer.insertBefore(dragging, afterElement);
    saveLists();
  });

  taskContainer.addEventListener("dragleave", (e) => {
    if (
      !taskContainer.contains(e.relatedTarget) &&
      dropIndicator.parentElement
    ) {
      dropIndicator.remove();
    }
  });

  addBtn.addEventListener("click", () => {
    addTask(
      input,
      taskContainer,
      saveLists,
      updateCompletedVisibility,
      sortTasks
    );
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask(
        input,
        taskContainer,
        saveLists,
        updateCompletedVisibility,
        sortTasks
      );
    }
  });

  const deleteBtn = list.querySelector(".delete-list-btn");
  const sendBtn = list.querySelector(".send-list-btn");

  sendBtn.style.display = "inline-block";
  sendBtn.addEventListener("click", () => {
    const tasks = Array.from(taskContainer.querySelectorAll("li")).map((li) => {
      const textSpan = li.querySelector("span");
      const text = textSpan ? textSpan.textContent : li.textContent;
      return text;
    });
    const modal = Modal("sendList", {
      list: {
        name,
        tasks,
      },
    });
    document.body.appendChild(modal);
  });

  if (!isShoppingList) {
    deleteBtn.addEventListener("click", () => {
      if (confirm("¿Eliminar esta lista?")) {
        const idToDelete = list.dataset.id;
        list.remove();

        const existing = JSON.parse(localStorage.getItem("taskLists")) || [];
        const updated = existing.filter((list) => list.id !== idToDelete);
        localStorage.setItem("taskLists", JSON.stringify(updated));

        const taskBoard = document.querySelector("#board-section");
        if (
          container.querySelectorAll(".task-list:not(.shopping-list)")
            .length === 0
        ) {
          if (!taskBoard.querySelector("#welcome-message")) {
            taskBoard.insertBefore(Welcome(), container);
          }
        }
      }
    });
  } else {
    deleteBtn.style.display = "none";
  }

  document.addEventListener("click", (e) => {
    // Si clicas dentro del botón completado, alterna el estado
    if (completedBtn.contains(e.target)) {
      showCompleted = !showCompleted;
      updateCompletedVisibility();
      return;
    }

    // Si clicas fuera de toda la lista, ocultar tareas completadas si están visibles
    if (!list.contains(e.target)) {
      if (showCompleted) {
        showCompleted = false;
        updateCompletedVisibility();
      }
    }
  });

  return list;
};
