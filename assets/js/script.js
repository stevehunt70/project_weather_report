const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

document.getElementById("city").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    document.getElementById("getWeather").click();
  }
});

document.getElementById("getWeather").addEventListener("click", function () {
 
  const city = document.getElementById("city").value;
  if (!city) return;

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((geoData) => {
      if (geoData.length === 0)
        throw new Error("Location not found, try again. Be more specific!");

      const { lat, lon, name, country, state } = geoData[0];

      //document.getElementById("titleForCity").textContent =
      //  `Your 5-day forecast for ${name}, ${country}`;
      document.getElementById('cityCard').innerHTML = `
        <h4>Your 5-Day Forecast:</h4>
        <p><strong>City: </strong>${name}</p>
        <p><strong>Country: </strong>${country}, ${state}</p>
        <p><strong>Longitude: </strong>${lon}</p>
        <p><strong>Latitude: </strong>${lat}</p>
        `;

      document.querySelector('.detail-for-city').style.visibility = 'visible';

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
        //const icon = summary.weather[0].icon;
        const customIcon = getCustomIcon(desc);
        const humidity = summary.main.humidity;

        document.getElementById(`WeatherResult${i}`).innerHTML = `
          <p><strong>Date: </strong>${day}</p>
          <p><strong>Temp: </strong>${temp} °C</p>
          <p><strong>Condition: </strong>${desc}</p>
          <div><img src="assets/images/${customIcon}" alt="${desc}"></div>
          <p><strong>Humidity: </strong>${humidity}%</p>
          <div class="button-wrapper"><button onclick="showDetail(${i})" style="margin-left:10px;margin-bottom:10px">show 3hr detail</button></div>
        `;
//<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
        document.querySelector('.weather-dashboard').style.visibility = 'visible';

        const hourlyHtml = `
          <h4>3 Hourly Forecast for ${day}</h4>
          <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;">
            ${dayData.map(hour => {

              const dateObj = new Date(hour.dt_txt);
              const time = new Date(hour.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const hourOfDay = dateObj.getHours()
              const iconUrl = getCustomIcon(hour.weather[0].description, hourOfDay);
              
              return `
                <div class="weather-detail-box">
                  <strong>${time}</strong>
                  <img src="assets/images/${iconUrl}" alt="${hour.weather[0].description}"/> <br>
                  <span>${hour.main.temp} °C</span> <br>
                  <small align="center">${hour.weather[0].description}</small>
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

function getCustomIcon(desc, hour) {
    const iconMap = {
        "clear sky": "sunny.png",
        "few clouds": "cloudy-sunny.png",
        "scattered clouds": "scattered-clouds.png",
        "broken clouds": "cloudy-sunny.png",
        "shower rain": "cloudy-showers.png",
        "light rain" : "cloudy-showers.png",
        "rain": "rain.png",
        "thunderstorm": "cloudy-storm-sunny.png",
        "snow": "snow.png",
        "mist": "mist.png",
        "overcast clouds": "scattered-clouds.png",
    }
    const lowerDesc = desc.toLowerCase();
    const key = Object.keys(iconMap).find(k => lowerDesc.includes(k));

    if(lowerDesc === 'clear sky' && (hour < 6 || hour >= 20)) {
      return "clear-night.png";
    } else if((lowerDesc === 'scattered clouds' || lowerDesc ==='broken clouds' 
      || lowerDesc ==='few clouds' || lowerDesc ==='overcast clouds')  
      && (hour < 6 || hour >= 20)) {
        return "cloudy-night.png"
    } else if((lowerDesc === 'light rain' || lowerDesc === 'rain')
      && (hour < 6 || hour >= 20)) {
        return "rain-night.png"
      }
    return iconMap[key] || "sunny.png";
};
