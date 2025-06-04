import "./Navbar.css";
import { ThemeBtn } from "../ThemeBtn/ThemeBtn";

export const Navbar = () => `
  <nav>
    <div id="logoContainer">
      <img src="/logos/logo-dark.png" alt="Dootzy logo" />
    </div>
    <ul id="menu">
        <li>
          <a href="#" id="board">Board</a>
        </li>
        <li>
          <a href="#" id="cart">Cart</a>
        </li>
        <li>
          ${ThemeBtn()}
        </li>
    </ul>
  </nav>
`;

export const toggleLogo = () => {
  const logo = document.querySelector("#logoContainer > img");
  if (!logo) return;
  logo.src = document.body.classList.contains("light") 
    ? "/logos/logo-light.png"
    : "/logos/logo-dark.png";
};