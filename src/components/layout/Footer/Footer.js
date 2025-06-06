import "./Footer.css";

/* export const Footer = () => `
<div class="footer-div">
    <img src="/icons/full-dootzy.png" alt="Logo" class="footer-logo"/>
    <p>&copy; 2025 To-Do List created by Yria Forjan and Carlos Vidal. All rights reserved.</p>
</div>
`; */

export const Footer = () => {
    const footerDiv = document.createElement("div");
    footerDiv.classList.add("footer-div");
    
    const logo = document.createElement("img");
    logo.src = "/icons/full-dootzy.png";
    logo.alt = "Logo";
    logo.classList.add("footer-logo");
    
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "&copy; 2025 To-Do List created by Yria Forjan and Carlos Vidal. All rights reserved.";
    
    footerDiv.appendChild(logo);
    footerDiv.appendChild(paragraph);
    
    return footerDiv;
};