import "./DailyPanel.css";
import esLocale from "@fullcalendar/core/locales/es";

export const DailyPanel = () => {
  const aside = document.createElement("aside");
  aside.id = "daily-panel";
  aside.innerHTML = `
    <div id="calendar-section">
      <div id="calendar"></div>
    </div>
  `;

  // Inicializa el calendario cuando el aside ya está listo
  setTimeout(() => {
    const calendarEl = aside.querySelector("#calendar");
    if (calendarEl) {
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: esLocale
      });
      calendar.render();
    }
  }, 0);

  return aside;
};