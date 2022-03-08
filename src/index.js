function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours} `;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes} `;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return days[day];
}
function getWeatherIcon(description) {
  if (description === "Clear") {
    return "media/sunnyday.png";
  }
  if (
    description === "Drizzle" ||
    description === "Thunderstorm" ||
    description === "Rain"
  ) {
    return "media/rainyday.png";
  }
  if (description === "Snow") {
    return "media/nicesnowyday.png";
  }
  return "media/earthweather.png";
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastBlock = `<div class="row previsions">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastBlock =
        forecastBlock +
        `<div class="col day-weather">
            <div class="day">${formatDay(forecastDay.dt)}</div>
            <div class="emoji"> 
            <img class="forecast-icon" src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"/>
            </div>
            <div>${Math.round(forecastDay.temp.day)}°C</div>
          </div>
        `;
    }
  });
  forecastBlock = forecastBlock + `</div> `;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastBlock;
}
function getForecast(coordinates) {
  let apiKey = "f8076bd4bc37c523b0e21539b245eabc";
  let oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(oneCallApi).then(displayForecast);
}
function searchCity(city) {
  let apiKey = "f8076bd4bc37c523b0e21539b245eabc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  searchCity(searchInput.value);
}
function displayTemperature(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  document.querySelector("#date-and-time").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity-value").innerHTML =
    response.data.main.humidity;
  let temperatureResult = Math.round(response.data.main.temp);
  let todayTemperature = document.querySelector("#today-temperature");
  todayTemperature.innerHTML = temperatureResult;
  document
    .querySelector("#main-icon")
    .setAttribute("src", getWeatherIcon(response.data.weather[0].main));

  let fahrenheitValue = document.querySelector("#fahrenheit-value");
  fahrenheitValue.addEventListener("click", provideFarenheitValue);
  function provideFarenheitValue() {
    todayTemperature.innerHTML = Math.round((temperatureResult * 9) / 5 + 32);
    document.querySelector("#celsius-value").classList.remove("active");
    document.querySelector("#fahrenheit-value").classList.add("active");
  }
  let celsiusValue = document.querySelector("#celsius-value");
  celsiusValue.addEventListener("click", provideCelsiusValue);
  function provideCelsiusValue() {
    todayTemperature.innerHTML = temperatureResult;
    document.querySelector("#celsius-value").classList.add("active");
    document.querySelector("#fahrenheit-value").classList.remove("active");
  }
  getForecast(response.data.coord);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);
function displayGeolocationTemperature(response) {
  document.querySelector("#today-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity-value").innerHTML =
    response.data.main.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  let celsius = document.querySelector("#celsius-value");
  celsius.addEventListener("click", changeUnitTocelsius);
  function changeUnitTocelsius() {
    document.querySelector("#today-temperature").innerHTML = Math.round(
      response.data.main.temp
    );
    celsius.classList.add("active");
    fahrenheit.classList.remove("active");
  }
  let fahrenheit = document.querySelector("#fahrenheit-value");
  fahrenheit.addEventListener("click", changeUnitToFahrenheit);
  function changeUnitToFahrenheit() {
    document.querySelector("#today-temperature").innerHTML = Math.round(
      (response.data.main.temp * 9) / 5 + 32
    );
    celsius.classList.remove("active");
    fahrenheit.classList.add("active");
  }
}
function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiGeolocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f8076bd4bc37c523b0e21539b245eabc&units=metric`;
  axios.get(apiGeolocationUrl).then(displayGeolocationTemperature);
}
function reactToButton() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
let button = document.querySelector("button");
button.addEventListener("click", reactToButton);
searchCity("Madrid");
