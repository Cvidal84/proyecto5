import "./DailyPanel.css";

export const DailyPanel = () => {
  const aside = document.createElement("aside");
  aside.id = "daily-panel";
  aside.innerHTML = `
    <p>Día, hora, clima...</p>
    <div id='calendar'></div>
  `;

  // Inicializa el calendario cuando el aside ya está listo
  setTimeout(() => {
    const calendarEl = aside.querySelector('#calendar');
    if (calendarEl) {
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
      });
      calendar.render();
    }
  }, 0);

  return aside;
};