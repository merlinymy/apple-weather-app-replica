// import data from "./data/mock-data.json";
import "./styles.css";
import sumData from "./data/mock-summary.json";
import { getUserLocation, getLocationName, askForGeolocation } from "./util";
import { startWeatherUpdates } from "./data/dataHandler";
import { appendSummaryCard, hideMessage, showMessage } from "./uiHandler";

// const realData = await getData("san jose", "us");
// const summaryData = await filterDataForSummaryCard(await realData.json());
const userLocationLatLon = await askForGeolocation();
if (userLocationLatLon) {
  startWeatherUpdates(userLocationLatLon, "us", true);
  hideMessage("no-content-msg");
} else if (!userLocationLatLon && !document.querySelectorAll(".summary-card")) {
  showMessage("no-content-msg");
}
