import { getTimeFromTimezone, getCurrentDate, getLocationName } from "../util";

export const getResponseFromLatLon = async function (latlon, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = latlon.lat;
  const lon = latlon.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C${lon}?unitGroup=${unit}&key=${api_key}&contentType=json`;
  console.log(url);
  return await fetch(url);
};

export const getResponseFromName = async function (location, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const lat = location.lat;
  const lon = location.lon;
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${api_key}&contentType=json`;
  console.log(url);
  return await fetch(url);
};

export const filterDataForSummaryCard = async function (response, latlon) {
  let location;
  if (latlon) {
    location = await getLocationName(latlon.lat, latlon.lon);
  } else {
    location = response.resolvedAddress.split(",")[0];
  }
  const time = getTimeFromTimezone(response.timezone); // refresh every minute
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

  return { location, time, currentTemp, currentConditions, maxTemp, minTemp };
};
