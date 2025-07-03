const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

document.getElementById("getWeather").addEventListener("click", function(){
    const city = document.getElementById("city").value;

    // display  title for city selected 
    const titleForCity = document.getElementById("titleForCity"); 
    titleForCity.innerHTML = "5 day forecast for " + city;

    // displays  the dashboad after city has been selected 
    const weatherDashboard = document.getElementById("weather-dashboard");
    weatherDashboard.style.display="flex";
    
    // get the latitude and longitude for the city
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;

    fetch(geoUrl)
        .then((response) => {
            return response.json();
        })
        .then((geoData) =>{
            //error if no city found
            if(geoData.length === 0) throw new Error("Location not found, try again. Be more specific!!")
            const {lat, lon, name, country} = geoData[0];            
            const weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=f23ee9deb4e1a7450f3157c44ed020e1`;
            return fetch(weatherForecastUrl);
        })
        .then((response) => {
            if(!response.ok)throw new Error("Forecast data not available");
                return response.json();
        })
        .then((weatherData) => {
            let j = 0;
            for(let i=0; i<5; i++){
                const forecast = weatherData.list[j];
                const date = new Date(forecast.dt_txt).toDateString();
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                const icon = forecast.weather[0].icon;
                const humidity = forecast.humidity;
                j += 8;

                /*var mainContentEl = document.querySelector(".weatherResult");
                var newDivEl = document.createElement("div");
                newDivEl.className = "weather-cards";
                newDivEl.innerHTML = `<p><strong>${date}</strong>:${temp} C,${description}</p>`;
                alert(newDivEl.innerHTML);
                append the new div to the main content
                mainContentEl.appendChild(newDivEl);
                var newH2El = document.createElement("h2");
                newH2El.textContent = newDivEl.innerHTML;
                newDivEl.appendChild(newH2El);
                mainContentEl.appendChild(newDivEl);*/
                document.getElementById(`WeatherResult${i}`).innerHTML = `
                <p><strong>Date: </strong>${date}</p>
                <p><strong>Temp: </strong>${temp} C</P>
                <P><strong>Condition: </strong>${description}</p>
                <p><strong>Humidity: </strong>${humidity}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                `;
                
            }  
        })
        .catch((error) => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
});

