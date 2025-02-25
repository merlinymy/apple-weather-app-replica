import { getTimeFromTimezone, getCurrentDate, getLocationName } from "../util";
import { updateSummaryCard } from "../uiHandler";
import { hideMessage } from "../uiHandler";

export const startWeatherUpdates = async function (query, unit, isLatLon) {
  async function fetchAndUpdate() {
    try {
      const weatherResponse = isLatLon
        ? await getResponseFromLatLon(query, unit)
        : await getResponseFromName(query, unit);

      const weatherData = await weatherResponse.json();

      await updateSummaryCard(weatherData, query);

      hideMessage("no-content-msg");
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
    setTimeout(fetchAndUpdate, 30 * 60 * 1000);
  }

  fetchAndUpdate();
};

export const getResponseFromLatLon = async function (latlon, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = latlon.lat;
  const lon = latlon.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}?unitGroup=${unit}&key=${api_key}&contentType=json`;
  return await fetch(url);
};

export const getResponseFromName = async function (location, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = location.lat;
  const lon = location.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${api_key}&contentType=json`;
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
