document.addEventListener('DOMContentLoaded', () => {
  const apiKey = "1c84d753b7554a0389741852252006";

  const locationEl = document.getElementById('location');
  const tempEl = document.getElementById('current-temp');
  const humidityEl = document.getElementById('humidity');
  const forecastEl = document.querySelector('.forecast');
  const dateEl = document.getElementById('current-date');
  const dayEl = document.getElementById('current-day');
  const timeEl = document.getElementById('time');
  const container = document.querySelector('.weather-container');
  const conditionTextEl = document.getElementById('condition-text');

  let currentCity = "Visakhapatnam";
  let isFahrenheit = false;

  const fullDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const weatherBgColors = {
    'Sunny': '#4FC3F7',
    'Clear': '#81D4FA',
    'Partly Cloudy': '#90CAF9',
    'Partly cloudy': '#90caf9',
    'Cloudy': '#64B5F6',
    'Overcast': '#5C6BC0',
    'Patchy rain nearby': '#bedcf3',
    'Mist': '#75a2b7',
    'Fog': '#455A64',
    'Patchy rain possible': '#42A5F5',
    'Light rain shower': '#aecpdf',
    'Moderate rain': '#1976D2',
    'Heavy rain': '#1565C0',
    'Thunderstorm': '#37474F',
    'Snow': '#B3E5FC',
    'Patchy snow possible': '#B3E5FC',
    'Blizzard': '#90A4AE',
    'Moderate or heavy rain with thunder': '#5d6163',
    'default': '#6acaf8'
  };

  function updateDateTime() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
    dayEl.textContent = fullDays[now.getDay()];

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    timeEl.textContent = `Current Weather ${formattedHours}:${minutes < 10 ? '0' + minutes : minutes}${ampm}`;
  }

  function fetchWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        currentCity = data.location.name;
        locationEl.textContent = currentCity;
        document.getElementById('location-details').textContent = `${data.location.region}, ${data.location.country}`;


        const temp = isFahrenheit ? data.current.temp_f : data.current.temp_c;
        tempEl.textContent = `${temp}°${isFahrenheit ? 'F' : 'C'}`;
        humidityEl.textContent = `${data.current.humidity}% humidity`;

        const condition = data.current.condition.text;
        conditionTextEl.textContent = condition;

        const bgColor = weatherBgColors[condition] || weatherBgColors['default'];
        container.style.backgroundColor = bgColor;

        // Weather icon
        const iconUrl = "https:" + data.current.condition.icon;
        let existingIcon = document.querySelector('.current-weather img');
        if (!existingIcon) {
          existingIcon = document.createElement('img');
          document.querySelector('.current-weather').appendChild(existingIcon);
        }
        existingIcon.src = iconUrl;
        existingIcon.alt = condition;

        // Forecast
        forecastEl.innerHTML = '';
        data.forecast.forecastday.forEach(day => {
          const date = new Date(day.date);
          const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
          const forecastTemp = isFahrenheit ? day.day.avgtemp_f : day.day.avgtemp_c;
          const forecastIcon = "https:" + day.day.condition.icon;

          const div = document.createElement('div');
          div.className = 'forecast-day';
          div.innerHTML = `
            <p>${dayShort} <img src="${forecastIcon}" alt=""></p>
            <p>${forecastTemp}°</p>
          `;
          forecastEl.appendChild(div);
        });
      })
      .catch(err => {
        alert("Couldn't fetch weather. Try a valid city name.");
        console.error(err);
      });
  }

  locationEl.addEventListener('click', () => {
    const newCity = prompt("Enter city name:");
    if (newCity && newCity.trim()) {
      fetchWeather(newCity.trim());
    }
  });

  tempEl.addEventListener('click', () => {
    isFahrenheit = !isFahrenheit;
    fetchWeather(currentCity);
  });

  updateDateTime();
  setInterval(updateDateTime, 60000);
  fetchWeather(currentCity);
});
