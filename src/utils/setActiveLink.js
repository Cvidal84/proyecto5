export const setActiveLink = (activeId) => {
  const allLinks = document.querySelectorAll("nav a");
  allLinks.forEach((link) => {
    if (link.id === activeId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};
