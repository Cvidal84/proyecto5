import "./style.css";
import { Header } from "./components/layout/Header/Header.js";
import { toggleTheme } from "./components/layout/ThemeBtn/ThemeBtn.js";
import { burgerMenu } from "./components/layout/Navbar/Navbar.js";
import { setupInstallPrompt } from "./utils/installPrompt.js";
import { Main } from "./components/layout/Main/Main.js";
import { Footer } from "./components/layout/Footer/Footer.js";
import { linkPage } from "./utils/linkPage.js";
import { setActiveLink } from "./utils/setActiveLink.js";
import { setupSWUpdateListener } from "./utils/swUpdateHandler.js";

const init = () => {
  document.body.innerHTML = Header();
  Main("home");
  setActiveLink("boardLink");
  document.body.appendChild(Footer());

  linkPage("boardLink", () => {
    Main("home");
    setActiveLink("boardLink");
  });
  linkPage("logoLink", () => {
    Main("home");
    setActiveLink("boardLink");
  });
  linkPage("cartLink", () => {
    Main("cart");
    setActiveLink("cartLink");
  });
  linkPage("calendarLink", () => {
    Main("my-calendar");
    setActiveLink("calendarLink");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  init();
  toggleTheme();
  burgerMenu();
  setupInstallPrompt();
  setupSWUpdateListener();
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });
});
