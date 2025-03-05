import { newSummaryCardComponent } from "./components/summaryCard";
import {
  filterDataForSummaryCards,
  startWeatherUpdates,
} from "./data/dataHandler";
import { weatherDetailCard } from "./components/weatherDetailCard";
import { div } from "./domStruct/newDomStructs";
import { debouncePlaceAutoComplete } from "./data/dataHandler";
import { convertTemp } from "./util";
export const appendSearchResults = function (results, unit, tempUnit) {
  const searchInput = document.querySelector("#search");
  const searchBar = document.querySelector(".search-bar");
  const searchPage = document.querySelector(".search-page");
  const optionBtn = document.querySelector(".menu-btn");
  const searchBarWrap = document.querySelector(".search-bar-wrap");
  const cancelBtn = document.querySelector(".cancel-btn");
  const sideContent = document.querySelector(".side-bar > .content");
  const resultsDiv = document.querySelector(".results");
  results.forEach((res) => {
    const resDiv = div("res");
    resDiv.textContent = res.address_long;
    resultsDiv.append(resDiv);
    resDiv.addEventListener("click", async () => {
      try {
        console.log("address form");
        await startWeatherUpdates(
          res.address_long,
          unit,
          false,
          false,
          localStorage.getItem("tempUnit"),
          true,
        );
      } catch (error) {
        console.log(error);
        try {
          console.log("lat lon form");

          await startWeatherUpdates(
            { lat: res.lat, lon: res.lon },
            unit,
            true,
            false,
            localStorage.getItem("tempUnit"),
            true,
          );
        } catch (error) {
          alert("Area currently has no weather data");
        }
      }
      resultsDiv.innerHTML = "";
      searchBarWrap.style.display = "block";
      searchPage.style.height = "100%";
      searchPage.style.zIndex = "0";
      searchBar.style.width = "100%";
      cancelBtn.classList.add("hidden");
      optionBtn.classList.remove("hidden");
      sideContent.classList.remove("hidden");
      searchInput.value = "";
    });
  });
};
export const initSearch = function (userLocationLatLon, unit, tempUnit) {
  const searchInput = document.querySelector("#search");
  const searchBar = document.querySelector(".search-bar");
  const cancelIcon = document.querySelector(".cancel-icon");
  const searchPage = document.querySelector(".search-page");
  const optionBtn = document.querySelector(".menu-btn");
  const searchBarWrap = document.querySelector(".search-bar-wrap");
  const cancelBtn = document.querySelector(".cancel-btn");
  const results = document.querySelector(".results");
  const sideContent = document.querySelector(".side-bar > .content");
  cancelBtn.addEventListener("click", () => {
    results.innerHTML = "";
    searchBarWrap.style.display = "block";
    searchPage.style.height = "100%";
    searchPage.style.zIndex = "0";
    searchBar.style.width = "100%";
    cancelBtn.classList.add("hidden");
    optionBtn.classList.remove("hidden");
    sideContent.classList.remove("hidden");
    searchInput.value = "";
  });
  cancelIcon.addEventListener("mousedown", () => {
    searchInput.value = "";
    searchInput.focus();
  });
  searchInput.addEventListener("focusin", () => {
    // optionBtn.classList.add("hidden");
    sideContent.classList.add("hidden");
    searchBarWrap.style.display = "flex";
    searchPage.style.height = "100dvh";
    searchPage.style.zIndex = "10000";
    searchBar.style.width = "80%";
    cancelBtn.classList.remove("hidden");
    optionBtn.classList.add("hidden");
  });
  searchInput.addEventListener("input", async (event) => {
    results.innerHTML = "";
    let inputStr = event.target.value;
    if (inputStr.length >= 4) {
      const autoResponse = await debouncePlaceAutoComplete(
        inputStr,
        userLocationLatLon.lat,
        userLocationLatLon.lon,
      );
      const data = await autoResponse.json();
      const results = data.results.map((res) => {
        const address_long = res.formatted;
        const lat = res.lat;
        const lon = res.lon;
        return { address_long, lat, lon };
      });
      appendSearchResults(results, unit, tempUnit);
    }

    if (inputStr.length === 0) {
      cancelIcon.classList.add("hidden");
    } else {
      cancelIcon.classList.remove("hidden");
    }
  });
  searchInput.addEventListener("focusout", () => {
    cancelIcon.classList.add("hidden");
  });
};
export const createWeatherCard = function (
  weatherData,
  summaryData,
  divCenter,
  tempUnit,
) {
  const mainContent = document.querySelector(".main-content");
  const component = weatherDetailCard(weatherData, summaryData, tempUnit);
  mainContent.append(component);
  const sideBar = document.querySelector(".side-bar");
  mainContent.style.zIndex = "10";
  return component;
};

export const updateSummaryCard = async function (
  weatherData,
  query,
  isTracked,
  tempUnit,
  onLoad,
  dataId,
) {
  const contentDiv = document.querySelector(".side-bar > .content");
  const summaryCard = await newSummaryCardComponent(
    weatherData,
    query,
    tempUnit,
    dataId,
    isTracked,
  );
  if (isTracked) {
    console.log("prepend");
    contentDiv.prepend(summaryCard);
  } else {
    console.log("append");
    contentDiv.append(summaryCard);
  }
  if (!(onLoad && tempUnit === "f")) {
    convertTemp(summaryCard, tempUnit);
  }
};

export const onGeolocationRefuse = function () {
  const contentDiv = document.querySelector(".side-bar > .content");
};

export const hideMessage = function (className) {
  const noContentMsg = document.querySelector(`.${className}`);
  noContentMsg.classList.add("hidden");
};

export const showMessage = function (className) {
  const noContentMsg = document.querySelector(`.${className}`);
  noContentMsg.classList.remove("hidden");
};
