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
        const isEdit = !!info.event; // convertimos el valor en un booleano

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${isEdit ? "Editar evento" : "Nuevo evento"}</h3>
                <input type="text" id="event-title" placeholder="Título del evento" />
                <div>
                    <label for="start-hour">Hora de inicio:</label>
                    <input type="time" id="start-hour" name="startHour" />
                </div>
                <div>
                    <label for="end-hour">Hora de fin:</label>
                    <input type="time" id="end-hour" name="endHour" />
                </div>
                <div>
                    <label for="alert-minutes">Minutos de aviso:</label>
                    <input type="number" id="alert-minutes" name="alert-minutes" min="1" value="5" />
                </div>
                <div class="modal-btns">
                    <button id="add-event-btn">${isEdit ? "Guardar" : "Crear"}</button>
                    <button id="cancel-event-btn">Cancelar</button>
                </div>
            </div>
        `;

        const titleInput = modal.querySelector("#event-title");
        const startInput = modal.querySelector("#start-hour");
        const endInput = modal.querySelector("#end-hour");
        const alertInput = modal.querySelector("#alert-minutes");

        if (isEdit) {
            const event = info.event;
            const startDate = new Date(info.event.start);
            const endDate = new Date(info.event.end);

            // Ajustamos la zona horaria sumando el offset local:
            const offset = startDate.getTimezoneOffset() / -60;

            titleInput.value = info.event.title;
            startInput.value = new Date(startDate.setHours(startDate.getHours() + offset)).toISOString().slice(11, 16); //aquí se ajusta
            endInput.value = new Date(endDate.setHours(endDate.getHours() + offset)).toISOString().slice(11, 16); // =
            alertInput.value = info.event.extendedProps?.alertMinutes ?? 5;

            console.log("Datos en el modal:", {
                title: titleInput.value,
                start: startInput.value,
                end: endInput.value,
                alertMinutes: alertInput.value
            });

        } else {
            const start = new Date(info.start);
            const end = new Date(info.end);

            startInput.value = start.toISOString().slice(11, 16);
            endInput.value = end.toISOString().slice(11, 16);
            alertInput.value = 5;
        }

        modal.querySelector("#cancel-event-btn").addEventListener("click", () => {
            modal.remove();
        });

        modal.querySelector("#add-event-btn").addEventListener("click", () => {
            const title = titleInput.value.trim();
            const startHour = startInput.value;
            const endHour = endInput.value;
            const alertMinutes = parseInt(alertInput.value, 10);

            if (!title || !startHour || !endHour || isNaN(alertMinutes)) {
                alert("Por favor, rellena adecuadamente los campos.");
                return;
            }

            const baseDate = new Date(isEdit ? info.event.start : info.start);
            const [sh, sm] = startHour.split(":").map(Number);
            const [eh, em] = endHour.split(":").map(Number);

            const startDate = new Date(baseDate);
            const endDate = new Date(baseDate);
            startDate.setHours(sh, sm, 0, 0);
            endDate.setHours(eh, em, 0, 0);

            if (endDate <= startDate) {
                alert("La hora de fin debe ser posterior a la de inicio.");
                return;
            }

            if (isEdit) {
                info.event.setProp("title", title);
                info.event.setStart(startDate);
                info.event.setEnd(endDate);
                info.event.setExtendedProp("alertMinutes", alertMinutes);

                const updated = calendar.getEvents().map(e => ({
                    title: e.title,
                    start: e.start.toISOString(),
                    end: e.end?.toISOString(),
                    allDay: e.allDay,
                    alertMinutes: e.extendedProps?.alertMinutes ?? 5
                }));
                localStorage.setItem("calendarEvents", JSON.stringify(updated));
            } else {
                calendar.addEvent({
                    title,
                    start: startDate,
                    end: endDate,
                    allDay: false,
                    extendedProps: { alertMinutes }
                });

                document.dispatchEvent(new CustomEvent("eventAdded", {
                    detail: { calendar }
                }));
                
            }
            modal.remove();
        });

        setTimeout(() => {
            titleInput.focus();
        }, 100);

        modal.querySelectorAll("input").forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    modal.querySelector("#add-event-btn").click();
                }
            });
        });
    }

    return modal;
};