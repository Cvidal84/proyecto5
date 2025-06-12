import "./Footer.css";

export const Footer = () => {
    const footer = document.createElement("footer");
    
    const p = document.createElement("p");
    p.innerHTML = "&copy; 2025 Dootzy - Created by <strong>Yria Forjan</strong> and <strong>Carlos Vidal</strong>. All rights reserved.";

    footer.appendChild(p);
    
    return footer;
};