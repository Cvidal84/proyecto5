import "./Navbar.css";
import { ThemeBtn } from "../ThemeBtn/ThemeBtn";

export const Navbar = () => `
  <nav>
    <div id="logoContainer">
        <img src="/logos/logo-dark.png" alt="Dootzy logo" id="logoLink" />
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

export const burgerMenu = () => {
  const menu = document.querySelector("#menu");
  const burgerBtn = document.querySelector("#burger-menu-btn");
  const burgerIcon = burgerBtn?.querySelector("img");

  if (!menu || !burgerBtn || !burgerIcon) {
    console.warn("Burger menu elements not found");
    return;
  }

  const openIcon = "/icons/menu.png";
  const closeIcon = "/icons/close.png";

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");

    const isActive = menu.classList.contains("active");
    burgerIcon.src = isActive ? closeIcon : openIcon;
    burgerIcon.alt = isActive ? "close icon" : "menu icon";
  });

  document.addEventListener("click", (e) => {
    if (!burgerBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("active");
      burgerIcon.src = openIcon;
      burgerIcon.alt = "menu icon";
    }
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      burgerIcon.src = openIcon;
      burgerIcon.alt = "menu icon";
    });
  });
};