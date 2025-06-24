import "./Header.css";
import { Navbar } from "../Navbar/Navbar";

export const Header = () => `
    <header>
        <button id="btn-install">Instalar aplicación</button>
        ${Navbar()}
    </header>
`;

export const setupInstallPrompt = () => {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installButton = document.getElementById("btn-install");
    if (installButton) {
      installButton.style.display = "block";

      installButton.addEventListener(
        "click",
        () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("Instalación aceptada");
            } else {
              console.log("Instalación rechazada");
            }
            deferredPrompt = null;
            installButton.style.display = "none";
          });
        },
        { once: true } // evita múltiples registros
      );
    }
  });
};

 

