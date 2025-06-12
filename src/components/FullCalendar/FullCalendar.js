import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal } from "../Modal/Modal";

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
            const modal = Modal("calendar", info, calendar);
            document.body.appendChild(modal);

            modal.querySelector("#start-hour").value = new Date(info.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            modal.querySelector("#end-hour").value = new Date(info.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            info.el.addEventListener("dblclick", () => {
                console.log(info);
                const modal = Modal("calendar", info, calendar);
                document.body.appendChild(modal);
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

    document.addEventListener("eventAdded", () => {
        saveEventsToLocalStorage(calendar.getEvents());
    });
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