class App {
  constructor() {
    this.form = document.querySelector("form");
    this.searchInput = document.getElementById("search");
    this.todayWeather = document.getElementById("today-weather");
    this.weatherForecast = document.getElementById("weather-forecast");
    this.key = "2a52edbb2af941ad8cc08ee23866301c";
    this.lang = "en";
    this.units = "metric";
  }

  currentPosition() {
    navigator.geolocation.getCurrentPosition(success => {
      let { latitude, longitude } = success.coords;
      this.fetchWeather(latitude, longitude);
    });
  }

  getDataByCityName() {
    let location = this.searchInput.value;
    if (location !== "") {
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this
        .key}&units=${this.units}&lang=${this.lang}`;

      fetch(url)
        .then(resp => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then(data => {
          this.fetchWeather(data.coord.lat, data.coord.lon);
        })
        .catch(console.error("Something went wrong"));

      this.searchInput.value = "";
    }
  }

  fetchWeather(latitude, longitude) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=2a52edbb2af941ad8cc08ee23866301c&units=${this
      .units}&lang=${this.lang}`;

    fetch(url)
      .then(resp => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then(data => {
        this.displayWeather(data);
      })
      .catch(console.error("Something went wrong"));
  }

  displayWeather(data) {
    console.log(data);
    let forecast = "";
    data.daily.map((day, index) => {
      let date = new Date(day.dt * 1000);
      if (index == 0) {
        this.todayWeather.innerHTML = `
        <div class="weather">
          <div class="details">
            <h1>${data.timezone}</h1>
            <img src="http://openweathermap.org/img/wn/${day.weather[0]
              .icon}@2x.png" alt=${day.weather[0].description}>
            <h2>${date.toDateString()}</h2>
            <p>Day - ${parseInt(day.temp.day)} &#8451;</p>
            <p>Night - ${parseInt(day.temp.night)} &#8451;</p>
          </div>
        </div>
        <a href="#weather-forecast" class="btn">next 7 days forecast</a>
        `;
      } else {
        forecast += `
          <div class="weather-forecast-item">
            <h2>${date.toDateString()}</h2>
            <img src="http://openweathermap.org/img/wn/${day.weather[0]
              .icon}@2x.png" alt=${day.weather[0].description}@>
            <p>Day - ${parseInt(day.temp.day)} &#8451;</p>
            <p>Night - ${parseInt(day.temp.night)} &#8451;</p>
          </div>
        `;
      }
    });
    this.weatherForecast.innerHTML = forecast;
  }
}

function eventListeners() {
  const weather = new App();

  // Weather
  weather.currentPosition();
  weather.form.addEventListener("submit", function(ev) {
    ev.preventDefault();
    weather.getDataByCityName();
  });
}

document.addEventListener("DOMContentLoaded", eventListeners);
