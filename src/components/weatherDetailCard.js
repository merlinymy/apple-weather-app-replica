import { TZDate } from "@date-fns/tz";
import { addDays, addHours, format, isAfter, isBefore, sub } from "date-fns";
import { setAnimation } from "../canvasAnimation/animationHandler";
import blizzard from "../assets/icons/blizzard.png";
import clear from "../assets/icons/clear.png";
import clearnight from "../assets/icons/clearnight.png";
import cloudy from "../assets/icons/cloudy.png";
import drizzle from "../assets/icons/drizzle.png";
import drizzlenight from "../assets/icons/drizzlenight.png";
import fog from "../assets/icons/fog.png";
import haze from "../assets/icons/haze.png";
import heavyrain from "../assets/icons/heavyrain.png";
import partly_cloudy from "../assets/icons/partly_cloudy.png";
import partlycloudynight from "../assets/icons/partlycloudynight.png";
import rain from "../assets/icons/rain.png";
import sleet from "../assets/icons/sleet.png";
import snow from "../assets/icons/snow.png";
import sunrise from "../assets/icons/sunrise.png";
import sunset from "../assets/icons/sunset.png";
import thunderstorm from "../assets/icons/thunderstorm.png";
import windy from "../assets/icons/windy.png";
import { div } from "../domStruct/newDomStructs";

export const weatherDetailCard = function (weatherData, summaryData) {
  const data = aggregateData(weatherData, summaryData);
  const struct = `
  <div class="card-animation">
  </div>
  <div class="weather-page">
  <div class="overview-wrap">
    <div class="overview">
        <p class="location">${data.location}</p>
        <p class="current-temp">${data.currentTemp}\u00B0</p>
        <p class="condition">${data.summary}</p>
        <div class="lowhigh">
            <p class="high">H:${data.high}\u00B0</p>
            <p class="low">L:${data.low}\u00B0</p>
        </div>
    </div>
    </div>

    <div class="forcast-24-wrap">
    <div class="forcast-24hr">
        <div class="desc">${data.description}</div>
        <div class="hour24"></div>
    </div>
    </div>
    <div class="forcast-10days"></div>
    <div class="air-quality"></div>
    <div class="feels-like"></div>
    <div class="uv-index"></div>
    <div class="wind"></div>
    <div class="sunset"></div>
    <div class="precipitation"></div>
    <div class="visibility"></div>
    <div class="humidity"></div>
    <div class="moon-phase"></div>
</div>`;
  const component = document.createElement("div");
  component.innerHTML = struct;
  component.classList.add("detailcard");

  // 24 hour forcast
  const hour24Scroll = component.querySelector(".hour24");
  populateScroll(data, hour24Scroll);

  // 10 days forcast
  const tenDayForcastWrap = component.querySelector(".forcast-10days");
  populateTenDay(data, tenDayForcastWrap);

  // air quality
  const airQualityDiv = component.querySelector(".air-quality");
  populateAirQuality(data, airQualityDiv);

  // feels-like
  // uv-index
  // wind
  // sunset
  // precipitation
  // visibility
  // humidity
  // moon-phase

  // background animation
  const animationCanvas = component.querySelector(".card-animation");
  setTimeout(() => {
    setAnimation(animationCanvas, summaryData);
  }, 0);

  return component;
};

function populateAirQuality(data, component) {
  const aq = data.airQuality;
  let aqConcern, aqDesc;
  if (aq <= 50) {
    aqConcern = "Good";
    aqDesc =
      "Air quality is satisfactory, and air pollution poses little or no risk.";
  } else if (aq >= 51 && aq <= 100) {
    aqConcern = "Moderate";
    aqDesc =
      "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
  } else if (aq >= 101 && aq <= 150) {
    aqConcern = "Unhealthy for Sensitive Groups";
    aqDesc =
      "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
  } else if (aq >= 151 && aq <= 200) {
    aqConcern = "Unhealthy";
    aqDesc =
      "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
  } else if (aq >= 201 && aq <= 300) {
    aqConcern = "Very Unhealthy";
    aqDesc =
      "Health alert: The risk of health effects is increased for everyone.";
  } else {
    aqConcern = "Hazardous";
    aqDesc =
      "Health warning of emergency conditions: everyone is more likely to be affected.";
  }

  const cardTitle = createCardTitle("AIR QUALITY", "blur_on");
  const cardContent = div("aq-content");
  const aqNum = div("aq-num");
  aqNum.textContent = aq;
  const aqConcernDiv = div("aq-concern");
  aqConcernDiv.textContent = aqConcern;
  const aqBar = div("aq-bar");
  const aqDot = div("aq-dot");
  const aqDotPos = ((aq - 0) / (301 - 0)) * 330;
  console.log(aqDotPos);
  aqDot.style.left = `${aqDotPos}px`;
  aqBar.append(aqDot);
  const aqDescDiv = div("aq-desc");
  aqDescDiv.textContent = aqDesc;
  cardContent.append(aqNum, aqConcernDiv, aqBar, aqDescDiv);

  component.append(cardTitle, cardContent);
}

function createCardTitle(title, symbol) {
  const cardTitle = document.createElement("div");
  cardTitle.classList.add("card-title");
  const titleP = document.createElement("p");
  const cardIcon = document.createElement("span");
  cardIcon.classList.add("material-symbols-outlined", "card-title-symbol");
  cardIcon.textContent = symbol;
  titleP.textContent = title;
  cardTitle.append(cardIcon, titleP);
  return cardTitle;
}

function populateTenDay(data, component) {
  const cardTitle = createCardTitle("10-DAY FORECAST", "calendar_month");

  const cardContent = document.createElement("div");

  const tenDaysData = data.next10days;
  const tenDaysLow = Math.min(...tenDaysData.map((data) => data.low));
  const tenDaysHigh = Math.max(...tenDaysData.map((data) => data.high));

  tenDaysData.forEach((entry) => {
    const dayInfoSec = document.createElement("div");
    dayInfoSec.classList.add("day-info-list");
    const day = document.createElement("div");
    day.classList.add("day-of-week");
    const iconInfo = document.createElement("div");
    iconInfo.classList.add("iconInfo");

    const conditionIcon = document.createElement("img");
    conditionIcon.classList.add("condition-icon");

    conditionIcon.src = chooseWeatherIcon(entry.condition.toLowerCase(), true);
    iconInfo.append(conditionIcon);

    // precip prob
    if (
      entry.condition.toLowerCase().includes("rain") ||
      entry.condition.toLowerCase().includes("snow") ||
      entry.condition.toLowerCase().includes("drizzle") ||
      entry.condition.toLowerCase().includes("thunderstorm") ||
      entry.condition.toLowerCase().includes("sleet") ||
      entry.condition.toLowerCase().includes("bnlizzard")
    ) {
      const precipProb = document.createElement("div");
      precipProb.classList.add("precip-prob");
      precipProb.textContent = `${entry.precipprob}%`;
      iconInfo.append(precipProb);
    }

    const tempInfo = document.createElement("div");
    tempInfo.classList.add("temp-range-info");
    const dayLow = document.createElement("div");
    dayLow.classList.add("temp-range-low");
    const tempBars = document.createElement("div");
    tempBars.classList.add("temp-bars");
    const tempBar10 = document.createElement("div");
    tempBar10.classList.add("tempbar-10");
    const tempBarToday = document.createElement("div");
    tempBarToday.classList.add("tempbar-today");

    tempBar10.append(tempBarToday);

    // customize tempbar
    // start and end position in px
    const todayBarStart =
      ((entry.low - tenDaysLow) / (tenDaysHigh - tenDaysLow)) * 100;
    const todayBarEnd =
      ((entry.high - tenDaysLow) / (tenDaysHigh - tenDaysLow)) * 100;

    const startColor = getColorForTemp(entry.low);
    const endColor = getColorForTemp(entry.high);
    const todayBarLength = todayBarEnd - todayBarStart;

    tempBarToday.style.width = `${todayBarLength}px`;
    tempBarToday.style.left = `${todayBarStart}px`;
    tempBarToday.style.background = ` linear-gradient(90deg in hsl ,${startColor}, ${endColor})`;

    if (entry.dayOfWeek === "Today") {
      const currentTempDot = document.createElement("div");
      currentTempDot.classList.add("current-temp-dot");
      const currentTempDotPos =
        ((data.currentTemp - tenDaysLow) / (tenDaysHigh - tenDaysLow)) * 100;
      currentTempDot.style.left = `${currentTempDotPos}px`;
      tempBar10.append(currentTempDot);
    }

    // (tenDaysHigh - tenDaysLow) / 100px * entry.low

    const dayHigh = document.createElement("div");
    dayHigh.classList.add("temp-range-high");

    day.textContent = entry.dayOfWeek;
    dayLow.textContent = `${entry.low}\u00B0`;
    dayHigh.textContent = `${entry.high}\u00B0`;

    tempBars.append(tempBar10);
    tempInfo.append(dayLow, tempBars, dayHigh);
    dayInfoSec.append(day, iconInfo, tempInfo);
    cardContent.append(dayInfoSec);
  });

  component.append(cardTitle, cardContent);
}

// AI Generated Code: Need reviews
function getColorForTemp(temp) {
  const minTemp = -10; // Coldest
  const maxTemp = 110; // Hottest

  // Normalize temp to range 0 - 1
  let ratio = (temp - minTemp) / (maxTemp - minTemp);
  ratio = Math.max(0, Math.min(1, ratio)); // Clamp between 0 and 1

  let hue;

  if (ratio <= 0.5) {
    // First half of the scale (0°F to 50°F): Blue (240°) → Cyan (180°)
    hue = 240 - (ratio / 0.5) * (240 - 180);
  } else if (ratio <= 0.75) {
    // Middle of the scale (50°F to 80°F): Cyan (180°) → Yellow (60°)
    hue = 180 - ((ratio - 0.5) / 0.25) * (180 - 60);
  } else {
    // Last part of the scale (80°F to 110°F): Yellow (60°) → Red (0°)
    hue = 60 - ((ratio - 0.75) / 0.25) * (60 - 0);
  }

  return `hsl(${hue}, 100%, 50%)`;
}

// AI Generated Ends

function populateScroll(data, hour24Scroll) {
  data.next24hrs.forEach((entry) => {
    const hourlyInfo = document.createElement("div");
    const timeInfo = document.createElement("p");
    const ampmSpan = document.createElement("span");
    ampmSpan.classList.add("ampm");
    ampmSpan.textContent = entry.time.slice(-2);

    timeInfo.textContent = entry.time.slice(0, -2);
    timeInfo.append(ampmSpan);
    const iconInfo = document.createElement("div");
    iconInfo.classList.add("iconInfo");

    const conditionIcon = document.createElement("img");
    conditionIcon.classList.add("condition-icon");

    const isSunRaise = entry.isSunRaise;

    conditionIcon.src = chooseWeatherIcon(
      entry.condition.toLowerCase(),
      isSunRaise,
    );
    iconInfo.append(conditionIcon);

    // precip prob
    if (
      entry.condition.toLowerCase().includes("rain") ||
      entry.condition.toLowerCase().includes("snow") ||
      entry.condition.toLowerCase().includes("drizzle") ||
      entry.condition.toLowerCase().includes("thunderstorm") ||
      entry.condition.toLowerCase().includes("sleet") ||
      entry.condition.toLowerCase().includes("bnlizzard")
    ) {
      const precipProb = document.createElement("div");
      precipProb.classList.add("precip-prob");
      precipProb.textContent = `${entry.precipprob}%`;
      iconInfo.append(precipProb);
    }

    // conditionIcon.append(clear);
    const tempInfo = document.createElement("p");
    if (entry.temp === "Sunrise" || entry.temp === "Sunset") {
      tempInfo.textContent = `${entry.temp}`;
    } else {
      tempInfo.textContent = `${entry.temp}\u00B0`;
    }
    hourlyInfo.classList.add("hourly-info");
    hourlyInfo.append(timeInfo, iconInfo, tempInfo);
    hour24Scroll.append(hourlyInfo);
  });
}

function chooseWeatherIcon(condition, isRaise) {
  const cond = categorize(condition);

  switch (cond) {
    case "Clear":
      return isRaise ? clear : clearnight;
    case "Partly cloudy":
      return isRaise ? partly_cloudy : partlycloudynight;
    case "Haze":
    case "Smoke Or Haze":
      return haze;
    case "Fog":
      return fog;
    case "Windy":
      return windy;
    case "Drizzle":
      return isRaise ? drizzle : drizzlenight;
    case "Rain":
      return rain;
    case "Heavy rain":
      return heavyrain;
    case "Snow":
      return snow;
    case "Heavy snow":
    case "Blizzard":
      return blizzard;
    case "Thunderstorm":
      return thunderstorm;
    case "Freezing rain":
    case "Sleet":
      return sleet;
    case "Sunrise":
      return sunrise;
    case "Sunset":
      return sunset;
    default:
      return cloudy; // Default fallback to cloudy icon
  }
}

function isIn24Hours(now, future, timeTocheck) {
  return timeTocheck >= now && timeTocheck <= future;
}

function isIn10Days(today, in10Days, dateTocheck) {
  return dateTocheck >= today && dateTocheck <= in10Days;
}

function aggregateData(weatherData, summaryData) {
  const location = summaryData.location;
  const currentTemp = summaryData.currentTemp;
  const feelsLike = Math.round(weatherData.currentConditions.feelslike);
  const high = summaryData.maxTemp;
  const low = summaryData.minTemp;
  const summary = summaryData.currentConditions;
  const description = weatherData.description;
  const airQuality = weatherData.currentConditions.aqius;
  const timezone = weatherData.timezone;
  // const timezone = "America/Los_Angeles";

  const days = weatherData.days;

  const today = format(TZDate.tz(timezone), "yyyy-MM-dd");
  const tenDaysFromToday = format(addDays(today, 10), "yyyy-MM-dd");
  const next10days = days
    .filter((day) => {
      return isIn10Days(today, tenDaysFromToday, day.datetime);
    })
    .map((day, idx) => {
      let dayOfWeek;

      dayOfWeek = format(addDays(day.datetime, 1), "E");
      if (idx === 0) {
        dayOfWeek = "Today";
      }
      const condition = day.conditions;
      const low = Math.round(day.tempmin);
      const high = Math.round(day.tempmax);
      const precipprob = Math.round(day.precipprob);
      return { dayOfWeek, condition, low, high, precipprob };
    });

  const nowHour = format(
    new TZDate(new Date(), `${timezone}`),
    "yyyy-MM-dd HH:00:00",
  );
  const in24hours = format(addHours(nowHour, 24), "yyyy-MM-dd HH:00:00");

  const next24hrs = days
    .reduce((acc, day) => {
      const date = day.datetime;
      const sunrise = `${date} ${day.sunrise}`;
      const sunset = `${date} ${day.sunset}`;

      const filtered = day.hours
        .filter((hour) => {
          return isIn24Hours(nowHour, in24hours, `${date} ${hour.datetime}`);
        })
        .map((data) => {
          data.datetime = `${date} ${data.datetime}`;

          if (
            isAfter(data.datetime, sunrise) &&
            isBefore(data.datetime, sunset)
          ) {
            data.isSunRaise = true;
          } else {
            data.isSunRaise = false;
          }
          return data;
        });

      if (filtered.length !== 0) {
        for (let i = 0; i < filtered.length - 1; i++) {
          if (
            isAfter(sunrise, filtered[i].datetime) &&
            isBefore(sunrise, filtered[i + 1].datetime)
          ) {
            filtered.splice(i + 1, 0, {
              datetime: sunrise,
              condition: "Sunrise",
            });
          }
          if (
            isAfter(sunset, filtered[i].datetime) &&
            isBefore(sunset, filtered[i + 1].datetime)
          ) {
            filtered.splice(i + 1, 0, {
              datetime: sunset,
              condition: "Sunset",
            });
          }
        }
      }
      return acc.concat(filtered);
    }, [])
    .map((data, idx) => {
      let time = data.datetime;
      if (data.condition === "Sunrise" || data.condition === "Sunset") {
        time = format(data.datetime, "h:ma");
        const temp = data.condition;
        const condition = data.condition;
        return { time, temp, condition };
      }
      if (idx === 0) {
        time = "Now";
      } else {
        time = format(data.datetime, "ha");
      }
      const condition = data.conditions;
      const temp = Math.round(data.temp);
      const precipprob = Math.round(data.precipprob);
      const isSunRaise = data.isSunRaise;
      return { time, condition, temp, precipprob, isSunRaise };
    });

  return {
    location,
    currentTemp,
    feelsLike,
    high,
    low,
    summary,
    next10days,
    next24hrs,
    description,
    airQuality,
  };
}

function categorize(apiCondition) {
  // Always take the first condition before a comma
  const primaryCondition = apiCondition.split(",")[0].trim().toLowerCase();

  // Mapping conditions to icons
  const conditionMapping = {
    clear: "Clear",
    "partially cloudy": "Partly cloudy",
    haze: "Haze",
    "smoke or haze": "Haze",
    fog: "Fog",
    "freezing fog": "Fog",
    "dust storm": "Haze",
    "sky coverage decreasing": "Partly cloudy",
    "sky coverage increasing": "Cloudy",
    "sky unchanged": "Cloudy",
    overcast: "Cloudy",
    windy: "Windy",

    "light drizzle": "Drizzle",
    drizzle: "Drizzle",
    "heavy drizzle": "Drizzle",
    "heavy drizzle/rain": "Drizzle",
    "light drizzle/rain": "Drizzle",

    rain: "Rain",
    "light rain": "Rain",
    "rain showers": "Rain",
    "precipitation in vicinity": "Rain",
    "light rain and snow": "Rain",
    "snow and rain showers": "Rain",
    "heavy rain": "Heavy rain",
    "heavy rain and snow": "Heavy rain",

    snow: "Snow",
    "light snow": "Snow",
    "snow showers": "Snow",
    "blowing or drifting snow": "Snow",
    "heavy snow": "Blizzard",
    squalls: "Blizzard",

    thunderstorm: "Thunderstorm",
    "thunderstorm without precipitation": "Thunderstorm",
    "lightning without thunder": "Thunderstorm",

    "freezing rain": "Sleet",
    "light freezing rain": "Sleet",
    "heavy freezing rain": "Sleet",
    "freezing drizzle/freezing rain": "Sleet",
    "light freezing drizzle/freezing rain": "Sleet",
    "heavy freezing drizzle/freezing rain": "Sleet",
    ice: "Sleet",

    hail: "Sleet",
    "hail showers": "Sleet",
    "diamond dust": "Sleet",

    "funnel cloud/tornado": "Thunderstorm",
    sunset: "Sunset",
    sunrise: "Sunrise",
  };

  // Default to 'Cloudy' if condition not found
  return conditionMapping[primaryCondition] || "clear";
}
