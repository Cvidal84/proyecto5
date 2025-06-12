import "./Modal.css";
import { TaskList } from "../task/TaskList/TaskList";

export const Modal = (page, info, calendar) => {
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");

    if (page === "board") {
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Nueva Lista</h3>
                <input type="text" id="list-name" placeholder="Nombre de la lista" />
                <label for="list-color">Color de fondo:</label>
                <input type="color" name="list-color" id="list-color" value="#67c6bb" />
                <div class="modal-btns">
                    <button id="add-list-btn">Crear</button>
                    <button id="cancel-btn">Cancelar</button>
                </div>
            </div>
        `;

        modal.querySelector("#cancel-btn").addEventListener("click", () => {
            modal.remove();
        });

        modal.querySelector("#add-list-btn").addEventListener("click", () => {
            const listName = modal.querySelector("#list-name").value.trim();
            const listColor = modal.querySelector("#list-color").value;

            if (!listName) {
                alert("Por favor introduce un nombre para la lista.");
                return;
            }

            const newList = {
                id: crypto.randomUUID(),
                name: listName,
                color: listColor,
                tasks: [],
                isShoppingList: false
            };

            const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
            storedLists.push(newList);
            localStorage.setItem("taskLists", JSON.stringify(storedLists));

            const container = document.querySelector(".task-lists");
            if (container) {
                TaskList(newList, container);
            } else {
                console.error("No se encontró el contenedor .task-lists");
            }

            modal.remove();
        });

        modal.querySelector("#list-name").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                modal.querySelector("#add-list-btn").click();
            }
        });

        setTimeout(() => {
            modal.querySelector("#list-name").focus();
        }, 100);

    } else if (page === "calendar") {
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Nuevo evento</h3>
                <input type="text" id="event-title" placeholder="Título del evento" />
                <label for="start-hour">Hora de inicio:</label>
                <input type="time" id="start-hour" name="startHour" />
                <label for="end-hour">Hora de fin:</label>
                <input type="time" id="end-hour" name="endHour" />
                <label for="alert-minutes">Minutos de aviso antes:</label>
                <input type="number" id="alert-minutes" name="alert-minutes" min="1" value="5" />
                <div class="modal-btns">
                    <button id="add-event-btn">Crear</button>
                    <button id="cancel-event-btn">Cancelar</button>
                </div>
            </div>
        `;

        modal.querySelector("#cancel-event-btn").addEventListener("click", () => {
            modal.remove();
        });

        modal.querySelector("#add-event-btn").addEventListener("click", () => {
            const eventTitle = modal.querySelector("#event-title").value.trim();
            const startHour = modal.querySelector("#start-hour").value;
            const endHour = modal.querySelector("#end-hour").value;
            const alertMinutes = parseInt(modal.querySelector("#alert-minutes").value, 10);

            if (!eventTitle || !startHour || !endHour || isNaN(alertMinutes)) {
                alert("Por favor, rellena adecuadamente los campos.");
                return;
            }

            const startDate = new Date(info.start);
            const endDate = new Date(info.start);
            const [startH, startM] = startHour.split(":").map(Number);
            const [endH, endM] = endHour.split(":").map(Number);

            startDate.setHours(startH, startM, 0, 0);
            endDate.setHours(endH, endM, 0, 0);

            if (endDate <= startDate) {
                alert("La hora de fin debe ser posterior a la de inicio.");
                return;
            }

            calendar.addEvent({
                title: eventTitle,
                start: startDate,
                end: endDate,
                allDay: false,
                extendedProps: { alertMinutes }
            });

            const event = new CustomEvent("eventAdded", {
                detail: { calendar }
            });
            document.dispatchEvent(event);

            modal.remove();
        });

        setTimeout(() => {
            modal.querySelector("#event-title").focus();
        }, 100);
    }

    return modal;
};