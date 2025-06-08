import "./Weather.css";

const API_KEY = "81326349fc8e4b4a83b173057250706";

const getWeather = (cityName) => {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&aqi=no`)
    .then((res) => res.json())
    .then((res) => showWeather(res))
    .catch((err) => console.error("Error al obtener el clima:", err));
};

const showWeather = (data) => {
    const weather = {
        city: data.location.name,
        temp: data.current.temp_c+"°",
        text: data.current.condition.text,
        image: data.current.condition.icon,
        hum: data.current.humidity +" %",
        wind: data.current.wind_kph + " k/h"
    }
    printData(weather)
}

const printData = (data) => {
  const container = document.querySelector(".container-weather"); // Asegúrate de que exista en el HTML
  if (!container) {
    console.warn("No se encontró el contenedor .container-weather");
    return;
  }

  container.innerHTML = `
    <h2>${data.city}</h2>
    <p class="temp">Temp: ${data.temp}</p> 
    <img src="${data.image}" alt="${data.text}"/>
    <p>Humedad: ${data.hum}</p>
    <p>Viento: ${data.wind}</p>
  `;
};
if("geolocation" in navigator) {
  //Se solicita la ubicacion
  navigator.geolocation.getCurrentPosition((position) => {
    const location = position.coords.latitude +","+ position.coords.longitude;
    getWeather(location);
  })
} else {
  getWeather("Madrid")
}

// 👇 Exportar correctamente la función que inicializa todo
export const Weather = () => {
  getWeather();
};
