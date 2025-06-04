import "./style.css";
import { Header } from "./components/Header/Header.js";
import { toggleTheme } from "./components/ThemeBtn/ThemeBtn.js";
import { Main } from "./components/Main/Main.js";
import { Footer } from "./components/Footer/Footer.js";

const init = () => {
  document.body.innerHTML += Header();
  Main("home");
  /* document.body.innerHTML += Footer(); */
};

document.addEventListener("DOMContentLoaded", () => {
    init();
    toggleTheme();
});