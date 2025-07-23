import "./Header.css";
import { Navbar } from "../Navbar/Navbar";

export const Header = () => `
    <header>
        <button id="btn-install">Instalar aplicación</button>
        ${Navbar()}
    </header>
`;
