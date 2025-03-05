// import data from "./data/mock-data.json";
import "./styles.css";
import { askForGeolocation, convertTemp } from "./util";
import { startWeatherUpdates } from "./data/dataHandler";
import { hideMessage, showMessage, initSearch } from "./uiHandler";

const userLocationLatLon = await askForGeolocation();

const optionBtn = document.querySelector(".pending-icon");
const optionDiv = document.querySelector(".options");
const celsiusDiv = document.querySelector(".celsius");
const fDiv = document.querySelector(".fahrenheit");
const mphDiv = document.querySelector(".mph");
const meterphDiv = document.querySelector(".meter-per-h");
const mps = document.querySelector(".meter-per-sec");
let tempUnit, speedUnit;
let prevTempUnit = "f";

let isOptionOpen = false;
optionBtn.addEventListener("click", () => {
  optionDiv.showModal();
});

optionDiv.addEventListener("click", (event) => {
  if (event.target === optionDiv) {
    optionDiv.close();
  }
});

celsiusDiv.addEventListener("click", (event) => {
  celsiusDiv.querySelector("span").classList.remove("transparent");
  fDiv.querySelector("span").classList.add("transparent");
  localStorage.setItem("tempUnit", "c");
  if (tempUnit === "f") {
    convertTemp("c");
  }
  tempUnit = "c";
});

fDiv.addEventListener("click", (event) => {
  fDiv.querySelector("span").classList.remove("transparent");
  celsiusDiv.querySelector("span").classList.add("transparent");
  localStorage.setItem("tempUnit", "f");
  if (tempUnit === "c") {
    convertTemp("f");
  }
  tempUnit = "f";
});

mphDiv.addEventListener("click", (event) => {
  mphDiv.querySelector("span").classList.remove("transparent");
  meterphDiv.querySelector("span").classList.add("transparent");
  mps.querySelector("span").classList.add("transparent");
  localStorage.setItem("speedUnit", "mph");
});

meterphDiv.addEventListener("click", (event) => {
  meterphDiv.querySelector("span").classList.remove("transparent");
  mphDiv.querySelector("span").classList.add("transparent");
  mps.querySelector("span").classList.add("transparent");
  localStorage.setItem("speedUnit", "meterph");
});

mps.addEventListener("click", (event) => {
  mps.querySelector("span").classList.remove("transparent");
  meterphDiv.querySelector("span").classList.add("transparent");
  mphDiv.querySelector("span").classList.add("transparent");
  localStorage.setItem("speedUnit", "mps");
});

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
