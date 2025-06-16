import "./Navbar.css";
import { ThemeBtn } from "../ThemeBtn/ThemeBtn";

export const Navbar = () => `
  <nav>
    <div id="logoContainer">
        <img src="/logos/logo-dark.png" alt="Dootzy logo" />
    </div>
    <ul id="menu">
        <li>
          <a href="#" id="boardLink">Tablero</a>
        </li>
        <li>
          <a href="#" id="cartLink">Compra</a>
        </li>
        <li>
          <a href="#" id="calendarLink">Calendario</a>
        </li>
    </ul>
    <div id="burger-menu">
        <button id="burger-menu-btn">
          <img src="/icons/menu.png" alt="menu icon" />
        </button>
    </div>
    ${ThemeBtn()}
  </nav>
`;

export const toggleLogo = () => {
  const logo = document.querySelector("#logoContainer > img");
  if (!logo) return;
  logo.src = document.body.classList.contains("light") 
    ? "/logos/logo-light.png"
    : "/logos/logo-dark.png";
};