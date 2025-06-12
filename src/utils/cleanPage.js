export const cleanPage = (container) => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};