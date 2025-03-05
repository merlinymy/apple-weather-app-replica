// import data from "./data/mock-data.json";
import "./styles.css";
import { askForGeolocation } from "./util";
import { startWeatherUpdates } from "./data/dataHandler";
import { hideMessage, showMessage, initSearch } from "./uiHandler";

const userLocationLatLon = await askForGeolocation();

let unit = "us";
if (userLocationLatLon) {
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
