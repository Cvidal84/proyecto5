import "./Cart.css";
import { DailyPanel } from "../../components/DailyPanel/DailyPanel";
import { TaskBoard } from "../../components/task/TaskBoard/TaskBoard";
import { cargarLista } from "../../components/Sheets/Sheets";

export const Cart = () => {
    const cart = document.createElement("section");
    cart.id = "cart";
    cart.appendChild(DailyPanel());
    cart.appendChild(TaskBoard("cart"));
    setTimeout(() => cargarLista(), 0);
    return cart;
}