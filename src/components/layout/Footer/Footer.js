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
    
    
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "&copy; 2025 To-Do List created by <strong>Yria Forjan</strong> and <strong>Carlos Vidal</strong>. All rights reserved.";

    footerDiv.appendChild(paragraph);
    
    return footerDiv;
};