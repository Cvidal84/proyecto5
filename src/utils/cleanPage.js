/* export const cleanPage = (container) => {
  container.innerHTML = "";
}; */

/* export const cleanPage = (container) => {
    // Usar replaceChildren que es más moderno
    container.replaceChildren();
}; */

export const cleanPage = (container) => {
    // En lugar de innerHTML = "", usa removeChild para cada elemento
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};