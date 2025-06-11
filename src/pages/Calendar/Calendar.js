import "./Calendar.css";
import { initCalendar } from "../../components/FullCalendar/FullCalendar";

export const MyCalendar = () => {
    const myCalendar = document.createElement("section");
    myCalendar.id = "my-calendar";

    const calendar = document.createElement("div");
    calendar.id = "calendar";

    myCalendar.appendChild(calendar);

    setTimeout(() => {
        initCalendar("#calendar");
    }, 0);
    
    return myCalendar;
};