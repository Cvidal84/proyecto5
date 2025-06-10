import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

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
        events: [
            { title: "Cita con cliente", start: "2025-06-10T10:00:00", end: "2025-06-10T11:00:00" },
            { title: "Reunión equipo", start: "2025-06-11T14:00:00", end: "2025-06-11T15:30:00" }
        ],
        select(info) {
            const title = prompt("Introduce el título del evento:");
            if (title) {
                calendar.addEvent({
                    title,
                    start: info.start,
                    end: info.end,
                    allDay: false
                });
            }
            calendar.unselect();
        },
        eventClick(info) {
            if (confirm(`¿Quieres eliminar el evento "${info.event.title}"?`)) {
                info.event.remove();
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
}