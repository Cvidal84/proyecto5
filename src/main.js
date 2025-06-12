import "./style.css";
import { Header } from "./components/layout/Header/Header.js";
import { toggleTheme } from "./components/layout/ThemeBtn/ThemeBtn.js";
import { Main } from "./components/layout/Main/Main.js";
import { Footer } from "./components/layout/Footer/Footer.js";
import { linkPage } from "./utils/linkPage.js";

const init = () => {
  document.body.innerHTML += Header();
  Main("home");
  document.body.appendChild(Footer());

  linkPage("boardLink", () => Main("home"));
  linkPage("cartLink", () => Main("cart"));
  linkPage("calendarLink", () => Main("my-calendar"));
};

document.addEventListener("DOMContentLoaded", () => {
    init();
    toggleTheme();
});