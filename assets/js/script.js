// Call getWeather API when the button is clicked

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

            //get weather data
            //const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            const weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            return fetch(weatherForecastUrl);
        })
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            const {
                list.dt_text[0],
                //name,
                list:main[0].temp,
                list:weather[0].description,
                //wind: {speed},
            } = weatherData;

            const weatherHTML = `
            <h2>Weather in ${city}</h2>
            <p><strong>Date:</strong>${dt_text[0]}</p>
            <p><strong>Temperature:</strong> ${main[0].temp} °C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
            `;

            weatherResult0.innerHTML = weatherHTML      
            //moving to next day data
            const {
                list.dt_text[9],
                //name,
                list:main[9].temp,
                list:weather[9].description,
                //wind: {speed},
            } = weatherData;

            const weatherHTML1 = `
            <h2>Weather in ${city}</h2>
            <p><strong>Date:</strong>${dt_text[9]}</p>
            <p><strong>Temperature:</strong> ${main[9].temp} °C</p>
            <p><strong>Condition:</strong> ${weather[9].description}</p>
            `;

            weatherResult1.innerHTML = weatherHTML1   

            const {
                list.dt_text[18],
                //name,
                list:main[18].temp,
                list:weather[18].description,
                //wind: {speed},
            } = weatherData;

            const weatherHTML2 = `
            <h2>Weather in ${city}</h2>
            <p><strong>Date:</strong>${dt_text[18]}</p>
            <p><strong>Temperature:</strong> ${main[18].temp} °C</p>
            <p><strong>Condition:</strong> ${weather[18].description}</p>
            `;

            weatherResult2.innerHTML = weatherHTML2 

            const {
                list.dt_text[27],
                //name,
                list:main[27].temp,
                list:weather[27].description,
                //wind: {speed},
            } = weatherData;

            const weatherHTM3 = `
            <h2>Weather in ${city}</h2>
            <p><strong>Date:</strong>${dt_text[27]}</p>
            <p><strong>Temperature:</strong> ${main[27].temp} °C</p>
            <p><strong>Condition:</strong> ${weather[27].description}</p>
            `;

            weatherResult3.innerHTML = weatherHTML3 

            const {
                list.dt_text[36],
                //name,
                list:main[36].temp,
                list:weather[36].description,
                //wind: {speed},
            } = weatherData;

            const weatherHTML4 = `
            <h2>Weather in ${city}</h2>
            <p><strong>Date:</strong>${dt_text[36]}</p>
            <p><strong>Temperature:</strong> ${main[36].temp} °C</p>
            <p><strong>Condition:</strong> ${weather[36].description}</p>
            `;

            weatherResult4.innerHTML = weatherHTML4 
        })
        .catch((error) => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
});





