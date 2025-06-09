import "./DailyPanel.css";
import { Weather } from "../Weather/Weather.js"; 
import esLocale from "@fullcalendar/core/locales/es";

export const DailyPanel = () => {
  const aside = document.createElement("aside");
  aside.id = "daily-panel";
  aside.innerHTML = `
    <div id="mini-calendar-section">
      <div id="mini-calendar"></div>
    </div>
    <div class="container-weather"></div>
  `;
 Weather();

  // Inicializa el calendario cuando el aside ya está listo
  setTimeout(() => {
    const calendarEl = aside.querySelector("#mini-calendar");
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