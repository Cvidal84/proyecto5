import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const saveEventsToLocalStorage = (events) => {
    const rawEvents = events.map(event => ({
        title: event.title,
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : null,
        allDay: event.allDay
    }));
    localStorage.setItem("calendarEvents", JSON.stringify(rawEvents));
};

const loadEventsFromLocalStorage = () => {
    const stored = localStorage.getItem("calendarEvents");
    return stored ? JSON.parse(stored) : [];
};

export const initCalendar = (selector) => {
    const calendarEl = document.querySelector(selector);

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        locale: esLocale,
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
        events: loadEventsFromLocalStorage(),
        select(info) {
            const title = prompt("Introduce el título del evento:");
            if (title) {
                const newEvent = calendar.addEvent({
                    title,
                    start: info.start,
                    end: info.end,
                    allDay: false
                });
                // Guardar en localStorage
                saveEventsToLocalStorage(calendar.getEvents());
            }
            calendar.unselect();
        },
        eventClick(info) {
            if (confirm(`¿Quieres eliminar el evento "${info.event.title}"?`)) {
                info.event.remove();
                // Guardar cambios
                saveEventsToLocalStorage(calendar.getEvents());
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
        locale: esLocale
    });

    calendar.render();
};