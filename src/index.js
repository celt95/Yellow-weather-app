function callCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${searchInput.value} `;
  function displayTemperature(response) {
    console.log(response);
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
    let fahrenheitValue = document.querySelector("#fahrenheit-value");
    fahrenheitValue.addEventListener("click", provideFarenheitValue);
    function provideFarenheitValue() {
      todayTemperature.innerHTML = Math.round((temperatureResult * 9) / 5 + 32);
    }
    let celsiusValue = document.querySelector("#celsius-value");
    celsiusValue.addEventListener("click", provideCelsiusValue);
    function provideCelsiusValue() {
      todayTemperature.innerHTML = temperatureResult;
    }
  }
  let apiKey = "f8076bd4bc37c523b0e21539b245eabc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
let form = document.querySelector("form");
form.addEventListener("submit", callCity);
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
let minutes = now.getMinutes();
let theDate = document.querySelector("#date-and-time");
theDate.innerHTML = `${day} ${hour}:${minutes}`;

let button = document.querySelector("button");
button.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(function retrieveCurrentPosition(
    position
  ) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiGeolocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=f8076bd4bc37c523b0e21539b245eabc&units=metric`;
    axios.get(apiGeolocationUrl).then(displayGeolocationTemperature);
    function displayGeolocationTemperature(response) {
      let currentGeolocationTemperature =
        document.querySelector("#today-temperature");
      currentGeolocationTemperature.innerHTML = Math.round(
        response.data.main.temp
      );
      let celsius = document.querySelector("#celsius-value");
      celsius.addEventListener("click", changeUnitTocelsius);
      function changeUnitTocelsius() {
        currentGeolocationTemperature.innerHTML = Math.round(
          response.data.main.temp
        );
      }

      let fahrenheit = document.querySelector("#fahrenheit-value");
      fahrenheit.addEventListener("click", changeUnitToFahrenheit);
      function changeUnitToFahrenheit() {
        currentGeolocationTemperature.innerHTML = Math.round(
          (response.data.main.temp * 9) / 5 + 32
        );
      }

      let currentCity = document.querySelector("h1");
      currentCity.innerHTML = response.data.name;
    }
  });
});
