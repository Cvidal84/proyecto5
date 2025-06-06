import "./style.css";
import { Header } from "./components/layout/Header/Header.js";
import { toggleTheme } from "./components/layout/ThemeBtn/ThemeBtn.js";
import { Main } from "./components/layout/Main/Main.js";
import { Footer } from "./components/layout/Footer/Footer.js";

const init = () => {
  document.body.innerHTML += Header();
  Main("home");

  /* POR FINNNNNN :)
  Si hacemos document.body.innerHTML += Footer(); lo que pasa es que se destruye y recrea todo el body...y se pierden los eventos 
  Con el header no pasa nada porque está antes de la función Main */
  document.body.appendChild(Footer());
};

document.addEventListener("DOMContentLoaded", () => {
    init();
    toggleTheme();
});