'use strict';

const image = document.querySelector('img');
const autolocateBtn = document.querySelector('.autolocate');
const manlocate = document.getElementById('submit-btn');
const navSec = document.querySelector('.choose');
const sec2 = document.querySelector('.choices');
const container = document.querySelector('.container');
const input = document.querySelector('.input');
const temp = document.querySelector('.temperature');
const time = document.querySelector('.time');
const timeZone = document.querySelector('.timeZone');
const townname = document.querySelector('.town');
const country = document.querySelector('.country');
const weatherState = document.querySelector('.weather-state');
const yourRegion = document.querySelector('.region');
const upcomingDays = document.querySelector('.upcoming--days');
const form = document.querySelector('.form');
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getWeatherInfo(town = '') {
  try {
    await document.body.style.backgroundImage = "url('images/default.jpg')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    let weather;
    let url;
    if (town === '') {
      const position = await getPosition();
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      url = `https://api.weatherapi.com/v1/forecast.json?key=0affc45ee7194beeb04131500252505&q=${lat},${lon}&days=5`;
    } else {
      url = `https://api.weatherapi.com/v1/forecast.json?key=0affc45ee7194beeb04131500252505&q=${town}&days=5`;
    }
    weather = await fetch(url, { mode: 'cors' });
    const weatherData = await weather.json();
    console.log(weatherData);

    // Current weather
    const icon = weatherData.current.condition.icon;
    image.src = icon;
    const locationName = weatherData.location.name;
    townname.textContent = 'Town: ' + locationName;
    const region = weatherData.location.region;
    yourRegion.textContent = 'Region: ' + region;
    const countryz = weatherData.location.country;
    country.textContent = 'Country: ' + countryz;
    const localtime = weatherData.location.localtime;
    time.textContent = 'Time: ' + localtime;
    const zone = weatherData.current.temp_c;
    const zoneF = weatherData.current.temp_f;
    temp.textContent =
      'Temperature: \n' + zone + ' Degrees/ \n' + zoneF + ' Farenheit';
    const state = weatherData.current.condition.text;
    // Update the background based on weather condition
    if (state.toLowerCase().includes('rain')) {
      document.body.style.backgroundImage = "url('images/rainy.jpg')";
    } else if (state.toLowerCase().includes('sunny')) {
      document.body.style.backgroundImage = "url('images/sunny.jpg')";
    } else if (state.toLowerCase().includes('cloudy')) {
      document.body.style.backgroundImage = "url('images/cloudy.jpg')";
    } else if (state.toLowerCase().includes('snow')) {
      document.body.style.backgroundImage = "url('images/snowy.jpg')";
    } else if (state.toLowerCase().includes('fog')) {
      document.body.style.backgroundImage = "url('images/misty.jpg')";
    }
    // Update the weather state text

    weatherState.textContent = state;
    const timezone = weatherData.location.tz_id;
    timeZone.textContent = 'Time Zone: ' + timezone;
    // Forecast for next days (example for 3 days)
    let daysHtml = '';
    weatherData.forecast.forecastday.forEach((day) => {
      const dateStr = day.date;
      const dayName = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const iconUrl = day.day.condition.icon;

      daysHtml += `
    <div class="day">
      <p class="actualDay">${dayName}</p>
      <img class="smallIcon" src="${iconUrl}" alt="" />
      <p class="date">${dateStr}</p>
    </div>
  `;
    });
    upcomingDays.innerHTML = ''; // Clear previous content
    // Insert the new HTML
    if (daysHtml === '') {
      daysHtml = '<p class="wait">No upcoming days available.</p>';
    }
    upcomingDays.innerHTML = daysHtml;
  } catch (error) {
    console.error('Geolocation error:', error);
  }
}
// Function about the other days

function switchUI() {
  sec2.classList.add('hidden');
  navSec.classList.add('hidden');
  container.classList.remove('hidden');
}
autolocateBtn.addEventListener('click', () => {
  switchUI();
  getWeatherInfo('');
});
manlocate.addEventListener('click', (e) => {
  e.preventDefault();
  switchUI();
  const value = input.value;
  if (value === '') {
    getWeatherInfo('');
  } else {
    console.log(value);
    getWeatherInfo(value);
  }
  form.reset();
});
