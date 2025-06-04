import "./DailyPanel.css";

export const DailyPanel = () => {
    const aside = document.createElement("aside");
    aside.id = "daily-panel";
    aside.innerHTML = `
        <p>Día, hora, clima...</p>
    `;
    return aside;
};