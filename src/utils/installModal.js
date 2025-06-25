import { Modal } from "../components/Modal/Modal";

const isIos = () => {
    const ua = navigator.userAgent.toLowerCase();
    // Detecta iPhone, iPad, iPod y también iPad con iOS 13+ (que identifica como Mac)
    return /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isInStandaloneMode = () => {
  return ('standalone' in navigator) && navigator.standalone === true;
};

export const showIosInstallModal = () => {
  console.log("showIosInstallModal ejecutado");
  
  if (localStorage.getItem("iosInstallModalShown")) {
    return;
  }

  if (isIos() && !isInStandaloneMode()) {
    console.log("Es iOS y no está en modo standalone");
    
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) {
      console.log("Modal ya existe, no se crea otro");
      return;
    }
    
    const modal = Modal("iosInstall");
    modal.style.display = "flex";
    document.body.appendChild(modal);

    localStorage.setItem("iosInstallModalShown", "true");
    console.log("Modal insertado en el DOM");
  } else {
    console.log("Condiciones no cumplidas para mostrar modal");
  }
};
