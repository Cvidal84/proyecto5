import "./Cart.css";
import { DailyPanel } from "../../components/DailyPanel/DailyPanel";
import { TaskBoard } from "../../components/task/TaskBoard/TaskBoard";

export const Cart = () => {
  const cart = document.createElement("section");
  cart.id = "cart";
  cart.appendChild(DailyPanel());
  cart.appendChild(TaskBoard("cart"));
  return cart;
};
