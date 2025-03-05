// import data from "./data/mock-data.json";
import "./styles.css";
import sumData from "./data/mock-summary.json";
import { getUserLocation, getLocationName, askForGeolocation } from "./util";
import {
  filterDataForSummaryCards,
  debouncePlaceAutoComplete,
  getResponseFromLatLon,
  startWeatherUpdates,
} from "./data/dataHandler";
import {
  appendSummaryCard,
  createWeatherCard,
  hideMessage,
  showMessage,
  appendSearchResults,
  initSearch,
  updateSummaryCard,
} from "./uiHandler";
import { div } from "./domStruct/newDomStructs";

// const realData = await getData("san jose", "us");
// const summaryData = await filterDataForSummaryCard(await realData.json());
const userLocationLatLon = await askForGeolocation();
// const weatherResponse = await getResponseFromLatLon(userLocationLatLon, "us");
// const weatherData = await weatherResponse.json();
// const summaryData = await filterDataForSummaryCards(
//   weatherData,
//   userLocationLatLon,
// );
let unit = "us";
if (userLocationLatLon) {
  // createWeatherCard(weatherData, summaryData);
  startWeatherUpdates(userLocationLatLon, unit, true, true);
  hideMessage("no-content-msg");
} else if (!userLocationLatLon && !document.querySelectorAll(".summary-card")) {
  showMessage("no-content-msg");
}

const localWeatherData = JSON.parse(localStorage.getItem("weatherData"));
const regex = /-[0-9]*\.[0-9]+,[0-9]*\.[0-9]+/;
if (localWeatherData) {
  for (const [key, value] of Object.entries(localWeatherData)) {
    console.log(key);
    if (regex.test(key)) {
      const [lat, lon] = key.split(",");
      console.log("is lat lon");
      startWeatherUpdates({ lat, lon }, unit, true, false);
    } else {
      startWeatherUpdates(key, unit, false, false);
    }
  }
}

initSearch(userLocationLatLon, unit);
