import { getTimeFromTimezone, getCurrentDate, getLocationName } from "../util";
import { updateSummaryCard } from "../uiHandler";
import { hideMessage } from "../uiHandler";

export const startWeatherUpdates = async function (
  query,
  unit,
  isLatLon,
  isTracked,
) {
  async function fetchAndUpdate() {
    let weatherData;
    try {
      const weatherResponse = isLatLon
        ? await getResponseFromLatLon(query, unit)
        : await getResponseFromName(query, unit);

      weatherData = await weatherResponse.json();
      const localWeatherData = JSON.parse(localStorage.getItem("weatherData"));
      if (!isTracked) {
        if (localWeatherData) {
          localWeatherData[`${weatherData.address}`] = weatherData;
          localStorage.setItem("weatherData", JSON.stringify(localWeatherData));
        } else {
          localStorage.setItem(
            "weatherData",
            JSON.stringify({ [`${weatherData.address}`]: weatherData }),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching weather:", error);

      weatherData = JSON.parse(localStorage.getItem("weatherData"));
    } finally {
      if (weatherData) {
        console.log(query);
        await updateSummaryCard(weatherData, query, isTracked);
        hideMessage("no-content-msg");
      }
    }
    setTimeout(fetchAndUpdate, 30 * 60 * 1000);
  }

  fetchAndUpdate();
};

const getPlaceAutoComplete = async function (input, lat, lon) {
  const api_key = "06eda13645be42749d5881d37cc7fe18";
  let url;
  if (lat && lon) {
    console.log("lat lon exist");
    url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&lang=en&limit=10&bias=proximity:${lat},${lon}|countrycode:none&format=json&apiKey=${api_key}`;
  } else {
    url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&lang=en&limit=10&format=json&apiKey=${api_key}`;
  }
  console.log(url);
  const response = await fetch(url);
  return response;
};

const debounce = function (func, delay) {
  let timeout;
  return function (...args) {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
};

export const debouncePlaceAutoComplete = debounce(getPlaceAutoComplete, 300);

export const getResponseFromLatLon = async function (latlon, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = latlon.lat;
  const lon = latlon.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}?unitGroup=${unit}&key=${api_key}&contentType=json&elements=%2Baqius`;
  return await fetch(url);
};

export const getResponseFromName = async function (location, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = location.lat;
  const lon = location.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${api_key}&contentType=json&elements=%2Baqius`;
  return await fetch(url);
};

export const filterDataForSummaryCards = async function (response, query) {
  `query can by a latlon object or a location string`;
  let location;
  if (query.lat) {
    location = await getLocationName(query.lat, query.lon);
  } else {
    location = response.resolvedAddress.split(",")[0];
  }
  const timezone = response.timezone;
  const currentTemp = Math.round(response.currentConditions.temp);
  const currentConditions = response.currentConditions.conditions;
  const tempRes = response.days.find((day) => {
    return day.datetime === getCurrentDate(response.timezone);
  });
  const maxTemp = Math.round(
    response.days.find((day) => {
      return day.datetime === getCurrentDate(response.timezone);
    }).tempmax,
  );
  const minTemp = Math.round(
    response.days.find((day) => {
      return day.datetime === getCurrentDate(response.timezone);
    }).tempmin,
  );

  return {
    location,
    timezone,
    currentTemp,
    currentConditions,
    maxTemp,
    minTemp,
  };
};
