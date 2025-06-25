import { Modal } from "../components/layout/Modal.js"; // Ajusta la ruta según tu estructura

const isIos = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
};

const isInStandaloneMode = () =>
  'standalone' in window.navigator && window.navigator.standalone;

export const showIosInstallModal = () => {
  if (isIos() && !isInStandaloneMode()) {
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) return;

    const modal = Modal("iosInstall");
    document.body.appendChild(modal);
  }
};