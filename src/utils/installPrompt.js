import { Modal } from "../components/Modal/Modal.js";

const isIos = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

export const setupInstallPrompt = () => {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.body.classList.add("show-install-banner");
  });

  const installButton = document.getElementById("btn-install");

  installButton?.addEventListener("click", () => {
    if (isIos()) {
      if (document.querySelector(".modal-overlay")) return;

      const modal = Modal("iosInstall");
      document.body.appendChild(modal);

      modal.querySelector("#ios-install-close-btn").addEventListener("click", () => {
        modal.remove();
      });

    } else {
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
      });
    }
  });

  window.addEventListener("appinstalled", () => {
    document.body.classList.remove("show-install-banner");
  });
};
