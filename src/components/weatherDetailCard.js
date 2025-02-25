import { TZDate } from "@date-fns/tz";
import { addDays, addHours, format } from "date-fns";

export const weatherDetailCard = function (weatherData, summaryData) {
  const data = aggregateData(weatherData, summaryData);
  console.log(weatherData);
  const struct = `
  <div class="card-animation">
  </div>
  <div class="weather-page">
    <div class="overview">
        <p class="location">${data.location}</p>
        <p class="current-temp">${data.currentTemp}</p>
        <p class="condition">${data.summary}</p>
        <div class="lowhigh">
            <p class="high">H:${data.high}\u00B0</p>
            <p class="low">L:${data.low}\u00B0</p>
        </div>
    </div>
    <div class="forcast-24hr">
        <div class="desc">${data.description}</div>
        <div class="24-hour"></div>
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

  return component;
};

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
  // const timezone = weatherData.timezone;
  const timezone = "America/Los_Angeles";

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
  const in24hours = format(addHours(nowHour, 24), "yyyy-MM-dd HH:00:00");

  const next24hrs = days
    .reduce((acc, day) => {
      const date = day.datetime;

      const filtered = day.hours
        .filter((hour) => {
          return isIn24Hours(nowHour, in24hours, `${date} ${hour.datetime}`);
        })
        .map((data) => {
          data.datetime = `${date} ${data.datetime}`;
          return data;
        });
      return acc.concat(filtered);
    }, [])
    .map((data, idx) => {
      let time = data.datetime;
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
  };
}
