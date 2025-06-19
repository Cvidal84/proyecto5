import "./Home.css";
import { DailyPanel } from "../../components/DailyPanel/DailyPanel";
import { TaskBoard } from "../../components/task/TaskBoard/TaskBoard";

export const Home = () => {
    const home = document.createElement("section");
    home.id = "home";
    home.appendChild(DailyPanel());
    home.appendChild(TaskBoard("board"));

    return home;
};