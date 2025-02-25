import { TZDate } from "@date-fns/tz";
import { addDays, addHours, format, isAfter, isBefore, sub } from "date-fns";
import { setAnimation } from "../canvasAnimation/animationHandler";

export const weatherDetailCard = function (weatherData, summaryData) {
  const data = aggregateData(weatherData, summaryData);
  console.log(data);
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
  const hour24Scroll = component.querySelector(".hour24");
  populateScroll(data, hour24Scroll);

  const animationCanvas = component.querySelector(".card-animation");
  setTimeout(() => {
    setAnimation(animationCanvas, summaryData);
  }, 0);

  return component;
};

function populateScroll(data, hour24Scroll) {
  data.next24hrs.forEach((entry) => {
    const hourlyInfo = document.createElement("div");
    const timeInfo = document.createElement("p");
    timeInfo.textContent = entry.time;
    const conditionIcon = document.createElement("div");
    let weatherIcon;
    conditionIcon.append(weatherIcon);
    const tempInfo = document.createElement("p");
    tempInfo.textContent = entry.temp;
    hourlyInfo.classList.add("houly-info");
    hourlyInfo.append(timeInfo, conditionIcon, tempInfo);
    hour24Scroll.append(hourlyInfo);
  });
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
  const sunrise = weatherData;
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
      const precipprob = day.precipprob;
      return { dayOfWeek, condition, low, high, precipprob };
    });

  console.log(next10days);

  const nowHour = format(
    new TZDate(new Date(), `${timezone}`),
    "yyyy-MM-dd HH:00:00",
  );
  console.log(nowHour);
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
          return data;
        });

      // compare sunrise and sunset to the last element of acc and the element in filtered
      // if it's between the two values, prepend to filtered
      // if acc is empty and sunrise/sunset is within one hour of the element in filtered
      // prepend
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
            console.log(sunset);
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
        return { time, temp };
      }
      if (idx === 0) {
        time = "Now";
      } else {
        time = format(data.datetime, "ha");
      }
      const condition = data.conditions;
      const temp = Math.round(data.temp);
      const precipprob = data.precipprob;
      return { time, condition, temp, precipprob };
    });
  console.log(next24hrs);

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
