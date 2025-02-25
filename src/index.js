// import data from "./data/mock-data.json";
import "./styles.css";
import sumData from "./data/mock-summary.json";
import { getUserLocation, getLocationName, askForGeolocation } from "./util";
import {
  filterDataForSummaryCards,
  getResponseFromLatLon,
  startWeatherUpdates,
} from "./data/dataHandler";
import {
  appendSummaryCard,
  createWeatherCard,
  hideMessage,
  showMessage,
} from "./uiHandler";

// const realData = await getData("san jose", "us");
// const summaryData = await filterDataForSummaryCard(await realData.json());
const userLocationLatLon = await askForGeolocation();
const weatherResponse = await getResponseFromLatLon(userLocationLatLon, "us");
const weatherData = await weatherResponse.json();
const summaryData = await filterDataForSummaryCards(
  weatherData,
  userLocationLatLon,
);
if (userLocationLatLon) {
  createWeatherCard(weatherData, summaryData);
  startWeatherUpdates(userLocationLatLon, "us", true);
  hideMessage("no-content-msg");
} else if (!userLocationLatLon && !document.querySelectorAll(".summary-card")) {
  showMessage("no-content-msg");
}
