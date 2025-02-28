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
import compass from "../assets/sprites/compassRose.png";
import { div } from "../domStruct/newDomStructs";
import { Application } from "pixi.js";

export const weatherDetailCard = async function (weatherData, summaryData) {
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
    <div class="forcast-10days long-card"></div>
    <div class="air-quality long-card"></div>
    <div class="feels-like short-card"></div>
    <div class="uv-index short-card"></div>
    <div class="wind short-card"></div>
    <div class="sunset short-card" id="sunset-card"></div>
    <div class="precipitation short-card"></div>
    <div class="visibility short-card"></div>
    <div class="humidity short-card"></div>
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
  const feelsLikeDiv = component.querySelector(".feels-like");
  populateFeelsLike(data, feelsLikeDiv);

  // uv-index

  const uvDiv = component.querySelector(".uv-index");
  populateUvDiv(data, uvDiv);
  // wind

  const windDiv = component.querySelector(".wind");
  populateWind(data, windDiv);
  // sunset
  const sunsetDiv = component.querySelector(".sunset");
  await populateSunset(data, sunsetDiv);
  // precipitation

  const precipitationDiv = component.querySelector(".precipitation");
  populatePrecip(data, precipitationDiv);
  // visibility
  const visibilityDiv = component.querySelector(".visibility");
  populateVisibility(data, visibilityDiv);
  // humidity
  const humidityDiv = component.querySelector(".humidity");
  populateHumidity(data, humidityDiv);

  // background animation
  const animationCanvas = component.querySelector(".card-animation");
  setTimeout(() => {
    setAnimation(animationCanvas, summaryData);
  }, 0);

  return component;
};

function populateHumidity(data, component) {
  const vis = data.currentCond.humidity;
  const cardTitle = createCardTitle("HUMIDITY", "water");
  component.append(cardTitle);
}
function populateVisibility(data, component) {
  const vis = data.currentCond.visibility;
  const cardTitle = createCardTitle("VISIBILITY", "visibility");
  component.append(cardTitle);
}
function populatePrecip(data, component) {
  const precip = data.next10days.filter((entry) => {
    return entry.dayOfWeek === "Today";
  })[0].precip;
  const cardTitle = createCardTitle("PRECIPITATION", "water_drop");
  component.append(cardTitle);
}

async function populateSunset(data, component) {
  const midnight = `2025-01-01 00:00:00`;
  const midnight2 = `2025-01-02 00:00:00`;
  const sst = `2025-01-01 ${data.currentCond.sunset}`;
  const srt = `2025-01-01 ${data.currentCond.sunrise}`;
  // const ctime = "2025-01-01 03:00:00";
  const ctime = `2025-01-01 ${data.currentCond.datetime}`;

  const sunset = format(sst, "h:ma");
  const sunrise = format(srt, "h:ma");
  const sunriseTimeDiv = div("sunrise-time");
  const sunriseTime = document.createElement("p");
  const sunriseAmPmSpan = document.createElement("span");
  sunriseAmPmSpan.classList.add("ampm");
  sunriseAmPmSpan.textContent = sunrise.slice(-2);
  sunriseTime.textContent = `Sunrise: ${sunrise.slice(0, -2)}`;
  sunriseTimeDiv.append(sunriseTime, sunriseAmPmSpan);

  const sunsetTimeDiv = div("sunset-time");
  const sunsetTime = document.createElement("p");
  const sunsetAmPmSpan = document.createElement("span");
  sunsetAmPmSpan.classList.add("ampm");
  sunsetAmPmSpan.textContent = sunset.slice(-2);
  sunsetTime.textContent = sunset.slice(0, -2);
  sunsetTimeDiv.append(sunsetTime, sunsetAmPmSpan);

  const canvasWrapper = div("canvas-wrap");
  canvasWrapper.style.width = "100%";
  canvasWrapper.style.height = "60%";

  const cardContent = div("sunset-content");
  const canvas = sunCanvas(sst, srt, ctime, midnight, midnight2);
  canvasWrapper.append(canvas);
  cardContent.append(sunsetTimeDiv, canvasWrapper, sunriseTimeDiv);

  const cardTitle = createCardTitle("SUNSET", "wb_twilight");
  component.append(cardTitle, cardContent);
}

function sunCanvas(sst, srt, ctime, midnight, midnight2) {
  const sunCanvas = document.createElement("canvas");

  sunCanvas.style.width = "100%";
  sunCanvas.style.height = "100%";

  const ctx = sunCanvas.getContext("2d");
  const h = sunCanvas.height;
  const w = sunCanvas.width;
  const horiLineY = h * 0.5;
  const waveHeight = 30;
  const shiftPixels = 70;
  let sunXBeforeRise, sunXDay, sunXAfterSet;
  // draw the sun
  let [sunriseX, sunsetX] = findIntersections(shiftPixels, w);
  let xRange, sunX;
  if (ctime >= midnight && ctime < srt) {
    xRange = sunriseX - 0;
    sunX =
      ((Date.parse(ctime) - Date.parse(midnight)) /
        (Date.parse(srt) - Date.parse(midnight))) *
      xRange;
  } else if (ctime > srt && ctime < sst) {
    xRange = sunsetX - sunriseX;
    // console.log(Date.parse(ctime));
    sunX =
      ((Date.parse(ctime) - Date.parse(srt)) /
        (Date.parse(sst) - Date.parse(srt))) *
        xRange +
      sunriseX;
  } else if (ctime > sst && ctime <= midnight2) {
    xRange = w - sunsetX;
    sunX =
      ((Date.parse(ctime) - Date.parse(sst)) /
        (Date.parse(midnight2) - Date.parse(sst))) *
        xRange +
      sunsetX;
  } else if (ctime === srt) {
    sunX = sunriseX;
  } else if (ctime === sst) {
    sunX = sunsetX;
  }

  // clip the top to draw day curve
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, horiLineY);
  ctx.clip();

  // draw day curve
  ctx.beginPath();
  ctx.moveTo(0, waveY(0));
  for (let x = 0; x <= w; x++) {
    const y = waveY(horiLineY, waveHeight, x, shiftPixels, w);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    sunX,
    waveY(horiLineY, waveHeight, sunX, shiftPixels, w),
    9,
    0,
    2 * Math.PI,
  );

  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = "1";
  ctx.fill();
  ctx.stroke();

  // restore canvas to before clipping
  ctx.restore();

  // bottom night curve
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, horiLineY, w, horiLineY);
  ctx.clip();

  //draw night curve
  ctx.beginPath();
  ctx.moveTo(0, waveY(0));
  for (let x = 0; x <= w; x++) {
    const y = waveY(horiLineY, waveHeight, x, shiftPixels, w);
    ctx.lineTo(x, y);
  }
  ctx.filter = "invert(1)";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#cacaca";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    sunX,
    waveY(horiLineY, waveHeight, sunX, shiftPixels, w),
    9,
    0,
    2 * Math.PI,
  );
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = "1";
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // draw center line
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, horiLineY);
  ctx.lineTo(w, horiLineY);
  ctx.stroke();
  // console.log(sunX, waveY(horiLineY, waveHeight, sunX, shiftPixels, w));
  ctx.beginPath();
  // ctx.moveTo(sunX, horiLineY);

  // ctx.stroke();

  // drawOnSunCanvas(sunCanvas);
  return sunCanvas;
}
// AI generated math for drawing sun
// I don't like math...
function waveY(lineY, waveHeight, x, shiftPixels, w) {
  return lineY - waveHeight * Math.sin((2 * Math.PI * (x - shiftPixels)) / w);
}

// more math
function findIntersections(shiftPixels, w) {
  // We know x = shiftPixels + n*(w/2) and want 0 <= x <= w
  const intersections = [];
  // Choose a small range of n that covers at least [0, w].
  // For most typical uses, n in [-2..2] is enough to catch
  // all intersections within a single period from 0..w:
  for (let n = -2; n <= 2; n++) {
    const xCandidate = shiftPixels + n * (w / 2);
    if (0 <= xCandidate && xCandidate <= w) {
      intersections.push(xCandidate);
    }
  }

  // Sort them in ascending order:
  intersections.sort((a, b) => a - b);

  return intersections; // e.g. [x1, x2] or more, depending on wave position
}

function populateWind(data, component) {
  const winddir = data.currentCond.winddir;
  const windgust = Math.round(data.currentCond.windgust);
  const windspeed = Math.round(data.currentCond.windspeed);

  const cardTitle = createCardTitle("WIND", "air");
  const cardContent = div("wind-content");
  const windInfo = div("wind-info");
  const windDiv = div("wind-speed");
  const windDivName = div("wind-div-name");
  const windDivVal = div("wind-div-val");
  windDivName.textContent = "Wind";
  windDivVal.textContent = `${windspeed} mph`;
  windDiv.append(windDivName, windDivVal);
  const gustsDiv = div("gusts");
  const gustsDivName = div("gusts-div-name");
  const gustsDivVal = div("gusts-div-val");
  gustsDivName.textContent = "Gusts";
  gustsDivVal.textContent = `${windgust} mph`;
  gustsDiv.append(gustsDivName, gustsDivVal);
  const dirDiv = div("direction");
  const dirDivName = div("direction-div-name");
  const dirDivVal = div("direction-div-val");
  dirDivName.textContent = "Direction";
  dirDivVal.textContent = `${winddir}\u00B0 ${getWindDirection(winddir)}`;
  dirDiv.append(dirDivName, dirDivVal);

  windInfo.append(windDiv, gustsDiv, dirDiv);

  cardContent.append(windInfo);

  component.append(cardTitle, cardContent);
}

function populateUvDiv(data, component) {
  const uv = data.uvindex;
  let category;
  if (uv <= 2) {
    category = "Low";
  } else if (uv >= 3 && uv <= 5) {
    category = "Moderate";
  } else if (uv >= 6 && uv <= 7) {
    category = "High";
  } else if (uv >= 8 && uv <= 10) {
    category = "Very High";
  } else {
    category = "Extreme";
  }
  const uvNumDiv = div("uv-num");
  uvNumDiv.textContent = uv;
  const uvCat = div("uv-cat");
  uvCat.textContent = category;
  const uvBar = div("uv-bar");
  const uvPoint = div("uv-dot");
  uvBar.append(uvPoint);
  const uvPointPos = ((uv - 0) / (12 - 0)) * 100;
  uvPoint.style.left = `${uvPointPos}%`;

  const uvDesc = div("uv-desc");
  const uvDescArr = [
    "Limit your time in the sun between 10:00 a.m. and 4:00 p.m.",
    `Use sun protection until ${format(`2015-1-1 ${data.currentCond.sunset}`, "ha")}`,
  ];
  uvDesc.textContent = uvDescArr[Math.floor(Math.random() * (1 - 0 + 1) + 0)];
  const cardTitle = createCardTitle("UV INDEX", "wb_sunny");
  const cardContent = div("uv-content");
  cardContent.append(uvNumDiv, uvCat, uvBar, uvDesc);
  component.append(cardTitle, cardContent);
}

function populateFeelsLike(data, component) {
  console.log(data);
  const feelsLike = data.feelsLike;
  const curTemp = data.currentTemp;
  const cardTitle = createCardTitle("FEELS LIKE", "thermostat");
  // const cardContent = div("feelslike-content");
  const feelsLikeDiv = div("feelslike-num");
  feelsLikeDiv.textContent = `${feelsLike}\u00B0`;
  const feelsLikeDescDiv = div("feelslike-desc");
  if (feelsLike < curTemp) {
    feelsLikeDescDiv.textContent = "Wind is making it feel colder.";
  } else if (feelsLike > curTemp) {
    feelsLikeDescDiv.textContent =
      "It feels warmer than the actual temperature.";
  } else {
    feelsLikeDescDiv.textContent = "Similar to the actual temperature.";
  }

  // cardContent.append();

  component.append(cardTitle, feelsLikeDiv, feelsLikeDescDiv);
}

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
  const aqDotPos = ((aq - 0) / (301 - 0)) * 100;
  aqDot.style.left = `${aqDotPos}%`;
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
  const uvindex = weatherData.currentConditions.uvindex;
  const currentCond = weatherData.currentConditions;
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
      const precip = day.precip;
      return { dayOfWeek, condition, low, high, precipprob, precip };
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
    uvindex,
    currentCond,
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

function getWindDirection(degrees) {
  const directions = [
    { angle: 0, name: "N" },
    { angle: 22.5, name: "NNE" },
    { angle: 45, name: "NE" },
    { angle: 67.5, name: "ENE" },
    { angle: 90, name: "E" },
    { angle: 112.5, name: "ESE" },
    { angle: 135, name: "SE" },
    { angle: 157.5, name: "SSE" },
    { angle: 180, name: "S" },
    { angle: 202.5, name: "SSW" },
    { angle: 225, name: "SW" },
    { angle: 247.5, name: "WSW" },
    { angle: 270, name: "W" },
    { angle: 292.5, name: "WNW" },
    { angle: 315, name: "NW" },
    { angle: 337.5, name: "NNW" },
    { angle: 360, name: "N" }, // 360° wraps back to North
  ];

  // Find the closest direction
  return directions.reduce((closest, dir) =>
    Math.abs(degrees - dir.angle) < Math.abs(degrees - closest.angle)
      ? dir
      : closest,
  ).name;
}
