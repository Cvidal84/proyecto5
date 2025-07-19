import "./Calendar.css";
import { initCalendar } from "../../components/FullCalendar/FullCalendar";
import { setActiveLink } from "../../utils/setActiveLink";

export const MyCalendar = () => {
  const myCalendar = document.createElement("section");
  myCalendar.id = "my-calendar";

  const calendar = document.createElement("div");
  calendar.id = "calendar";

  myCalendar.appendChild(calendar);

  setTimeout(() => {
    const calendarInstance = initCalendar("#calendar");

    const selectedDateStr = localStorage.getItem("selectedDate");
    if (selectedDateStr) {
      const selectedDate = new Date(selectedDateStr);
      calendarInstance.changeView("timeGridDay", selectedDate);
      calendarInstance.gotoDate(selectedDate);
      localStorage.removeItem("selectedDate");
      setActiveLink("calendarLink");
    }
  }, 0);

  return myCalendar;
};
