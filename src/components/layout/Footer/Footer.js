import "./Footer.css";

export const Footer = () => {
  const footer = document.createElement("footer");

  const p = document.createElement("p");
  p.innerHTML =
    "&copy; 2025 Dootzy – Desarrollado por Yria Forján y Carlos Vidal. Todos los derechos reservados.";

  footer.appendChild(p);

  return footer;
};
