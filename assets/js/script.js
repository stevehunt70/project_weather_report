const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

document.getElementById("getWeather").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  if (!city) return;

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((geoData) => {
      if (geoData.length === 0)
        throw new Error("Location not found, try again. Be more specific!");

      const { lat, lon, name, country } = geoData[0];
      document.getElementById("titleForCity").textContent =
        `Your 5-day forecast for ${name}, ${country}`;

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      return fetch(forecastUrl);
    })
    .then((response) => {
      if (!response.ok) throw new Error("Forecast data not available");
      return response.json();
    })
    .then((weatherData) => {
      const dailyGroups = {};

      weatherData.list.forEach((forecast) => {
        const dateStr = forecast.dt_txt.split(" ")[0];
        if (!dailyGroups[dateStr]) {
          dailyGroups[dateStr] = [];
        }
        dailyGroups[dateStr].push(forecast);
      });

      const dateKeys = Object.keys(dailyGroups).slice(0, 5);

      dateKeys.forEach((dateStr, i) => {
        const dayData = dailyGroups[dateStr];
        const summary = dayData[0];
        const day = new Date(summary.dt_txt).toDateString();
        const temp = summary.main.temp;
        const desc = summary.weather[0].description;
        const icon = summary.weather[0].icon;
        const humidity = summary.main.humidity;

        document.getElementById(`WeatherResult${i}`).innerHTML = `
          <p><strong>Date: </strong>${day}</p>
          <p><strong>Temp: </strong>${temp} °C</p>
          <p><strong>Condition: </strong>${desc}</p>
          <p><strong>Humidity: </strong>${humidity}%</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
          <button onclick="showDetail(${i})" style="margin-left:10px;margin-bottom:10px">Show Details</button>
        `;

        const hourlyHtml = `
          <h4>3 Hourly Forecast for ${day}</h4>
          <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;">
            ${dayData.map(hour => {
              const time = new Date(hour.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
              return `
                <div class="weather-detail-box">
                  <strong>${time}</strong>
                  <img src="${iconUrl}" alt="${hour.weather[0].description}" /> <br>
                  <span>${hour.main.temp} °C</span> <br>
                  <small>${hour.weather[0].description}</small>
                </div>
              `;
            }).join("")}
          </div>
        `;

        const detailContainer = document.getElementById(`WeatherDetail${i}`);
        if (detailContainer) {
          detailContainer.innerHTML = hourlyHtml;
          detailContainer.style.display = "none";
        }
      });
    })
    .catch((error) => {
      document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
      document.getElementById("weatherResult").style.color = "red";
    });
});

function showDetail(dayIndex) {
  for (let i = 0; i < 5; i++) {
    const el = document.getElementById(`WeatherDetail${i}`);
    if (el) el.style.display = (i === dayIndex) ? "block" : "none";
  }
}
