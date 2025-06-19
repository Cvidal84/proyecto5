import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Modal } from "../Modal/Modal";

const saveEventsToLocalStorage = (events) => {
    const rawEvents = events.map(event => ({
        id: event.id,
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
        longPressDelay: 500,
        editable: true,
        height: 720,
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
                // Doble click detectado: borrar evento
                clearTimeout(clickTimeout);
                clickTimeout = null;

                if (confirm(`¿Quieres eliminar el evento "${info.event.title}"?`)) {
                    info.event.remove();
                    saveEventsToLocalStorage(calendar.getEvents());
                }
            } else {
                // Click simple: espera a ver si hay doble click
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    const modal = Modal("calendar", info, calendar);
                    document.body.appendChild(modal);
                }, 300);
            }
        },
        eventDidMount(info) {
            info.el.setAttribute("data-event-id", info.event.id);

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

    // Pulsación larga para borrar evento en móvil:
    let pressTimer = null;

    calendarEl.addEventListener("touchstart", (e) => {
        const targetEventEl = e.target.closest(".fc-event");
        if (!targetEventEl) return;

        pressTimer = setTimeout(() => {
            const eventId = targetEventEl.getAttribute("data-event-id");
            const event = calendar.getEventById(eventId);
            if (event && confirm(`¿Eliminar evento "${event.title}"?`)) {
                event.remove();
                saveEventsToLocalStorage(calendar.getEvents());
            }
        }, 700);
    });
    calendarEl.addEventListener("touchend", () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });
    calendarEl.addEventListener("touchcancel", () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });
    calendarEl.addEventListener("touchmove", () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });

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