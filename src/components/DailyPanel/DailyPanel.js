import "./DailyPanel.css";
import { Weather } from "../Weather/Weather.js";
import { initMiniCalendar } from "../FullCalendar/FullCalendar.js";

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

  setTimeout(() => {
    initMiniCalendar("#mini-calendar");
  }, 0);
  

  return aside;
};