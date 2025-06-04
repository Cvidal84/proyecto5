import "./style.css";
import { Header } from "./components/layout/Header/Header.js";
import { toggleTheme } from "./components/layout/ThemeBtn/ThemeBtn.js";
import { Main } from "./components/layout/Main/Main.js";
import { Footer } from "./components/layout/Footer/Footer.js";

const init = () => {
  document.body.innerHTML += Header();
  Main("home");
  /* document.body.innerHTML += Footer(); */
};

document.addEventListener("DOMContentLoaded", () => {
    init();
    toggleTheme();
});