import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

// Guardar también el aviso en minutos
const saveEventsToLocalStorage = (events) => {
    const rawEvents = events.map(event => ({
        title: event.title,
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : null,
        allDay: event.allDay,
        alertMinutes: event.extendedProps?.alertMinutes ?? 5
    }));
    localStorage.setItem("calendarEvents", JSON.stringify(rawEvents));
};

const loadEventsFromLocalStorage = () => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
};

export const initCalendar = (selector) => {
    const calendarEl = document.querySelector(selector);

    let clickTimeout = null;

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        locale: esLocale,
        firstDay: 1,
        allDaySlot: false,
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        selectable: true,
        selectMirror: true,
        editable: true,
        height: 750,
        events: loadEventsFromLocalStorage().map(ev => ({
            ...ev,
            extendedProps: { alertMinutes: ev.alertMinutes ?? 5 }
        })),

        select(info) {
            const title = prompt("Introduce el título del evento:");
            if (!title) {
                calendar.unselect();
                return;
            }

            const startHour = prompt("Introduce la hora de inicio (formato HH:MM):", "09:00");
            const endHour = prompt("Introduce la hora de fin (formato HH:MM):", "10:00");
            const alertMinutes = parseInt(prompt("¿Cuántos minutos antes quieres que te avise?", "5"), 10);

            if (!startHour || !endHour || isNaN(alertMinutes)) {
                alert("Evento cancelado por datos inválidos.");
                calendar.unselect();
                return;
            }

            const [startH, startM] = startHour.split(":").map(Number);
            const [endH, endM] = endHour.split(":").map(Number);

            const startDate = new Date(info.start);
            startDate.setHours(startH, startM, 0, 0);

            const endDate = new Date(info.start);
            endDate.setHours(endH, endM, 0, 0);

            if (endDate <= startDate) {
                alert("La hora de fin debe ser posterior a la de inicio.");
                calendar.unselect();
                return;
            }

            const newEvent = calendar.addEvent({
                title,
                start: startDate,
                end: endDate,
                allDay: false,
                extendedProps: {
                    alertMinutes
                }
            });

            saveEventsToLocalStorage(calendar.getEvents());
            calendar.unselect();
        },

        eventClick(info) {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            } else {
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    if (confirm(`¿Quieres eliminar el evento "${info.event.title}"?`)) {
                        info.event.remove();
                        saveEventsToLocalStorage(calendar.getEvents());
                    }
                }, 250);
            }
        },

        eventDidMount(info) {
            // Editar con doble clic
            info.el.addEventListener("dblclick", () => {
                const newTitle = prompt("Editar título del evento:", info.event.title);
                if (newTitle) {
                    info.event.setProp("title", newTitle);
                    saveEventsToLocalStorage(info.event.calendar.getEvents());
                }
            });

            // Alerta personalizada
            const alertMinutes = info.event.extendedProps?.alertMinutes ?? 5;
            const now = new Date();
            const start = new Date(info.event.start);
            const timeUntilEvent = start.getTime() - now.getTime();
            const alertTime = timeUntilEvent - (alertMinutes * 60 * 1000);

            if (alertTime > 0) {
                setTimeout(() => {
                    alert(`🔔 El evento "${info.event.title}" empieza en ${alertMinutes} minuto(s).`);
                }, alertTime);
            }
        }
    });

    calendar.render();
};

export const initMiniCalendar = (selector) => {
    const calendarEl = document.querySelector(selector);

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        locale: esLocale,
        firstDay: 1,
        events: [],
        dayCellDidMount: (info) => {
            const dayStr = info.date.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" });
            const events = loadEventsFromLocalStorage();

            const hasEvent = events.some(event => {
                const eventDate = new Date(event.start).toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" });
                return eventDate === dayStr;
            });

            if (hasEvent) {
                const dayNumber = info.el.querySelector(".fc-daygrid-day-number");
                if (dayNumber) {
                    const dot = document.createElement("span");
                    dot.classList.add("event-dot");
                    dayNumber.appendChild(dot);
                }
            }
        }
    });

    calendar.render();
};
