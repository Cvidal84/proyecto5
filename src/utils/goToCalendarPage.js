import { MyCalendar } from "../pages/Calendar/Calendar";

export const goToCalendarPage = () => {
  const main = document.querySelector("main");
  main.innerHTML = "";
  main.appendChild(MyCalendar());
};