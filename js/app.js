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
      this.settingMap(latitude, longitude);
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
          this.settingMap(data.coord.lat, data.coord.lon);
        })
        .catch(console.err);

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
      .catch(console.err);
  }

  displayWeather(data) {
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
            <p>Day: ${parseInt(day.temp.day)} &#8451;</p>
            <p>Night: ${parseInt(day.temp.night)} &#8451;</p>
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
            <p>Day: ${parseInt(day.temp.day)} &#8451;</p>
            <p>Night: ${parseInt(day.temp.night)} &#8451;</p>
          </div>
        `;
      }
    });
    this.weatherForecast.innerHTML = forecast;
  }

  settingMap(latitude, longitude) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGFtemFjaDk3IiwiYSI6ImNrcWxiMHRxcDBibzgyb3BkaDd5ZDZ6ajgifQ.RM8SP3S1UcuUnX7W81OGuQ";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [ longitude, latitude ],
      zoom: 4.5,
    });
  }
}

const weather = new App();

weather.currentPosition();
weather.form.addEventListener("submit", function(ev) {
  ev.preventDefault();
  weather.getDataByCityName();
});
