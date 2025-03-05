import { getTimeFromTimezone, getCurrentDate, getLocationName } from "../util";
import { updateSummaryCard } from "../uiHandler";
import { hideMessage } from "../uiHandler";
import {
  createWeatherData,
  getLocalData,
  storeWeatherData,
  updateWeatherData,
} from "./localStorageHandler";
import { differenceInMinutes, sub } from "date-fns";

export const startWeatherUpdates = async function (
  query,
  unit,
  isLatLon,
  isTracked,
) {
  try {
    let weatherResponse, weatherData;
    if (isTracked) {
      weatherResponse = await getResponseFromLatLon(query, unit);
      weatherData = await weatherResponse.json();
    } else {
      const localData = JSON.parse(localStorage.getItem("weatherData"));
      if (localData) {
        let localWeatherData;
        if (query.lat) {
          localWeatherData = localData[`${query.lat},${query.lon}`];
        } else {
          localWeatherData = localData[`${query}`];
        }
        if (localWeatherData) {
          // see if need to be updated (every 30 mins)
          if (
            differenceInMinutes(new Date().getTime(), localData.lastUpdate) > 30
          ) {
            console.log("get new data");
            weatherResponse = await getResponseFromName(query, unit);
            weatherData = await weatherResponse.json();
            updateWeatherData(query, weatherData);
          } else {
            console.log("use local data");
            weatherData = JSON.parse(localWeatherData.data);
          }
        } else {
          if (query.lat) {
            weatherResponse = await getResponseFromLatLon(query, unit);
          } else {
            weatherResponse = await getResponseFromName(query, unit);
          }
          weatherData = await weatherResponse.json();

          storeWeatherData(query, weatherData);
        }
      } else {
        localStorage.setItem("weatherData", JSON.stringify({}));
      }
    }
    await updateSummaryCard(weatherData, query, true);
  } catch (error) {
    throw error;
  }
};

const getPlaceAutoComplete = async function (input, lat, lon) {
  const api_key = "06eda13645be42749d5881d37cc7fe18";
  let url;
  if (lat && lon) {
    url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&lang=en&limit=10&bias=proximity:${lat},${lon}|countrycode:none&format=json&apiKey=${api_key}`;
  } else {
    url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&lang=en&limit=10&format=json&apiKey=${api_key}`;
  }
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
  try {
    const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
    const lat = latlon.lat;
    const lon = latlon.lon;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}?unitGroup=${unit}&key=${api_key}&contentType=json&elements=%2Baqius`;
    return await fetch(url);
  } catch (error) {
    throw error;
  }
};

export const getResponseFromName = async function (location, unit) {
  try {
    const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
    const lat = location.lat;
    const lon = location.lon;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${api_key}&contentType=json&elements=%2Baqius`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`In getResponseFromName ${await response.text()}`);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const filterDataForSummaryCards = async function (response, query) {
  `query can by a latlon object or a location string`;
  let location;
  if (query.lat) {
    location = await getLocationName(query.lat, query.lon);
  } else {
    location = response.address.split(",")[0];
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
