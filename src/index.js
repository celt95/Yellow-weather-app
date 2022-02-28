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

function callCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${searchInput.value} `;
  function displayTemperature(response) {
    console.log(response);
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
    if (temperatureResult < 0) {
      document
        .querySelector("#main-icon")
        .setAttribute("src", (src = "media/Snow_Two Color.png"));
    } else {
      document
        .querySelector("#main-icon")
        .setAttribute("src", (src = "media/rainyday.png"));
    }
    let fahrenheitValue = document.querySelector("#fahrenheit-value");
    fahrenheitValue.addEventListener("click", provideFarenheitValue);
    function provideFarenheitValue() {
      todayTemperature.innerHTML = Math.round((temperatureResult * 9) / 5 + 32);
      document.querySelector("#celsius-value").classList.add("active");
      document.querySelector("#fahrenheit-value").classList.remove("active");
    }
    let celsiusValue = document.querySelector("#celsius-value");
    celsiusValue.addEventListener("click", provideCelsiusValue);
    function provideCelsiusValue() {
      todayTemperature.innerHTML = temperatureResult;
      document.querySelector("#celsius-value").classList.remove("active");
      document.querySelector("#fahrenheit-value").classList.add("active");
    }
  }
  let apiKey = "f8076bd4bc37c523b0e21539b245eabc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
let form = document.querySelector("form");
form.addEventListener("submit", callCity);

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
      document.querySelector("#weather-description").innerHTML =
        response.data.weather[0].description;
      document.querySelector("#wind-speed").innerHTML = Math.round(
        response.data.wind.speed
      );
      document.querySelector("#humidity-value").innerHTML =
        response.data.main.humidity;

      let celsius = document.querySelector("#celsius-value");
      celsius.addEventListener("click", changeUnitTocelsius);
      function changeUnitTocelsius() {
        currentGeolocationTemperature.innerHTML = Math.round(
          response.data.main.temp
        );
        celsius.classList.remove("active");
        fahrenheit.classList.add("active");
      }

      let fahrenheit = document.querySelector("#fahrenheit-value");
      fahrenheit.addEventListener("click", changeUnitToFahrenheit);
      function changeUnitToFahrenheit() {
        currentGeolocationTemperature.innerHTML = Math.round(
          (response.data.main.temp * 9) / 5 + 32
        );
        celsius.classList.add("active");
        fahrenheit.classList.remove("active");
      }

      let currentCity = document.querySelector("h1");
      currentCity.innerHTML = response.data.name;
    }
  });
});
