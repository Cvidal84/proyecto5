import { Modal } from "../components/Modal/Modal.js";

const isIos = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const isInStandaloneMode = () => {
  const isIosStandalone = window.navigator.standalone === true;
  const isStandaloneDisplay = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
  return isIosStandalone || isStandaloneDisplay;
};

let deferredPrompt = null;

export const setupInstallPrompt = () => {
  // No mostrar nada si ya está instalada
  if (isInStandaloneMode()) return;

  if (isIos() && !isInStandaloneMode()) {
    // iOS: muestra modal propio
    if (!document.querySelector(".modal-overlay")) {
      const modal = Modal("iosInstall");
      document.body.appendChild(modal);

      modal
        .querySelector("#ios-install-close-btn")
        .addEventListener("click", () => {
          modal.remove();
        });
    }
  } else {
    // Otros navegadores
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Mostrar banner automáticamente
      showInstallBanner();
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
        hideInstallBanner();
      });
    });

    window.addEventListener("appinstalled", () => {
      hideInstallBanner();
    });

    // Opcional: si la página recarga y ya tienes deferredPrompt guardado
    // (por ejemplo si es SPA, puedes mostrar el banner aquí)
    if (deferredPrompt) {
      showInstallBanner();
    }
  }
};

const showInstallBanner = () => {
  document.body.classList.add("show-install-banner");
  const installButton = document.getElementById("btn-install");
  if (installButton) installButton.style.display = "block";
};

const hideInstallBanner = () => {
  document.body.classList.remove("show-install-banner");
  const installButton = document.getElementById("btn-install");
  if (installButton) installButton.style.display = "none";
};
