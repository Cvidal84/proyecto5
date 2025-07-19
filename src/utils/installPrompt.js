import { Modal } from "../components/Modal/Modal.js";

const isIos = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

const isInStandaloneMode = () => {
  const isIosStandalone = window.navigator.standalone === true;
  const isStandaloneDisplay = window.matchMedia("(display-mode: standalone)").matches;
  return isIosStandalone || isStandaloneDisplay;
};

export const setupInstallPrompt = () => {
  let deferredPrompt;

  // Si ya está instalada, no hacemos nada
  if (isInStandaloneMode()) return;

  if (isIos()) {
    // En iOS, mostrar directamente el modal si no está instalada
    if (!document.querySelector(".modal-overlay")) {
      const modal = Modal("iosInstall");
      document.body.appendChild(modal);

      modal.querySelector("#ios-install-close-btn").addEventListener("click", () => {
        modal.remove();
      });
    }
  } else {
    // En navegadores que soportan beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.body.classList.add("show-install-banner");
      const installButton = document.getElementById("btn-install");
      if (installButton) {
        installButton.style.display = "block";
      }
    });

    const installButton = document.getElementById("btn-install");
    installButton?.addEventListener("click", () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Instalación aceptada");
        } else {
          console.log("Instalación rechazada");
        }
        deferredPrompt = null;
        document.body.classList.remove("show-install-banner");
        installButton.style.display = "none";
      });
    });

    window.addEventListener("appinstalled", () => {
      document.body.classList.remove("show-install-banner");
      const installButton = document.getElementById("btn-install");
      if (installButton) installButton.style.display = "none";
    });
  }
};
