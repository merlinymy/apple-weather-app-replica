// import data from "./data/mock-data.json";
import "./styles.css";
import { askForGeolocation, convertTemp, initOptions } from "./util";
import { startWeatherUpdates } from "./data/dataHandler";
import { hideMessage, showMessage, initSearch } from "./uiHandler";
import { intervalWithOptions } from "date-fns/fp";

const userLocationLatLon = await askForGeolocation();

let unit = "us";
let tempUnit = initOptions();
const onLoad = true;
if (userLocationLatLon) {
  await startWeatherUpdates(
    userLocationLatLon,
    unit,
    true,
    true,
    tempUnit,
    onLoad,
  );
  hideMessage("no-content-msg");
} else if (!userLocationLatLon && !document.querySelectorAll(".summary-card")) {
  showMessage("no-content-msg");
}

const localWeatherData = JSON.parse(localStorage.getItem("weatherData"));
const regex =
  /([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?,([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/;
if (localWeatherData) {
  for (const [key, value] of Object.entries(localWeatherData)) {
    if (regex.test(key)) {
      const [lat, lon] = key.split(",");
      await startWeatherUpdates(
        { lat, lon },
        unit,
        true,
        false,
        tempUnit,
        onLoad,
      );
    } else {
      await startWeatherUpdates(key, unit, false, false, tempUnit, onLoad);
    }
  }
}

// convertTemp(null, tempUnit);

initSearch(userLocationLatLon, unit, tempUnit);
