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
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            return fetch(weatherUrl);

        })
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            const {
                name,
                main: {temp, humidity},
                weather,
                wind: {speed},
            } = weatherData;

            const weatherHTML = `
            <h2>Weather in ${name}</h2>
            <p><strong>Temperature:</strong> ${temp} °C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${speed} m/s</p>
            `;

            weatherResult.innerHTML = weatherHTML                               
        })
        .catch((error) => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
});

