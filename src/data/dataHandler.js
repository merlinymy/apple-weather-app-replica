import { getTimeFromTimezone, getCurrentDate } from "../util";

export const getData = async function (location, unit) {
  const api_key = "UFGA2UZ292DF95ZP7TNJQEYGD";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=${api_key}&contentType=json`;
  console.log(url);
  return await fetch(url);
};

export const filterDataForSummaryCard = async function (response) {
  const location = response.resolvedAddress.split(",")[0];
  const time = getTimeFromTimezone(response.timezone); // refresh every minute
  const currentTemp = response.currentConditions.temp;
  const currentConditions = response.currentConditions.conditions;
  const maxTemp = response.days.find((day) => {
    return day.datetime === getCurrentDate(response.timezone);
  }).tempmax;
  const minTemp = response.days.find((day) => {
    return day.datetime === getCurrentDate(response.timezone);
  }).tempmin;

  return { location, time, currentTemp, currentConditions, maxTemp, minTemp };
};
