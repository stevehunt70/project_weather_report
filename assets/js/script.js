const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

document.getElementById("getWeather").addEventListener("click", function(){
    const city = document.getElementById("city").value;
    const weatherResult = document.getElementById("weatherResult");

    //make current results disappear
    weatherResult.innerHTML = "";

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
            const weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            return fetch(weatherForecastUrl);
        })
        .then(weatherData => {
            let j = 0;
            for(let i=0; i<5; i++){
                const forecast = weatherData.list[j];
                const date = new Date(forecast.dt_txt).toDateString();
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                j += 8;

                var mainContentEl = document.querySelector(".weatherResult");
                var newDivEl = document.createElement("div");
                newDivEl.className = "weather-cards";
                newDivEl.innerHTML = `<p><strong>${date}</strong>:${temp} C,${description}</p>`;
                // append the new div to the main content
                 mainContentEl.appendChild(newDivEl);
            }  
        })
        .catch((error) => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
});

