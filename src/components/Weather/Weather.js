import "./Weather.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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
  };
  printData(weather);
};

const printData = (data) => {
  const container = document.querySelector("#container-weather");
  if (!container) {
    console.warn("No se encontró el contenedor #container-weather");
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

export const Weather = () => {
   if (!("geolocation" in navigator)) {
    getWeather("Madrid");
    return;
  }

  const savedLocation = localStorage.getItem("userLocation");

  if (savedLocation) {
    getWeather(savedLocation);
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = position.coords.latitude + "," + position.coords.longitude;
        localStorage.setItem("userLocation", location); // Guardamos solo si acepta
        getWeather(location);
      },
      (error) => {
        console.warn("No se pudo obtener ubicación, carga default:", error.message);
        // No guardamos nada para que vuelva a preguntar la próxima vez
        getWeather("Madrid");
      }
    );
  }
};