import "./Welcome.css";

export const Welcome = () => {
  const welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcome-message";
  welcomeDiv.innerHTML = `
        <img src="/icons/full-dootzy.png" alt="Dootzy mascota" />
        <p>Todo gran plan empieza con una lista.</p>
        <p>Aquí verás tus tareas, ideas, objetivos...</p>
        <p>¡Pulsa <strong>+ Nueva Lista</strong> y empieza tu viaje con Dootzy!</p>
    `;
  return welcomeDiv;
};
