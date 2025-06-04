import "./ThemeBtn.css";
import { toggleLogo } from "../Navbar/Navbar";

export const ThemeBtn = () => `
    <button id="themeBtn">
        <img src="/icons/dark-mode.png" alt="theme icon"/>
    </button>
`;

export const toggleTheme = () => {
    const themeBtn = document.querySelector("#themeBtn");
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggleIcon();
        toggleLogo();
    });
};

export const toggleIcon = () => {
    const themeIcon = document.querySelector("#themeBtn > img");
    themeIcon.src = themeIcon.src.includes("/icons/dark-mode.png")
    ? "/icons/light-mode.png"
    : "/icons/dark-mode.png";
};