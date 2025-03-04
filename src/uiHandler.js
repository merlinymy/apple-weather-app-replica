import { newSummaryCardComponent } from "./components/summaryCard";
import {
  filterDataForSummaryCards,
  startWeatherUpdates,
} from "./data/dataHandler";
import { weatherDetailCard } from "./components/weatherDetailCard";
import { div } from "./domStruct/newDomStructs";
import { debouncePlaceAutoComplete } from "./data/dataHandler";
export const appendSearchResults = function (results) {
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
    console.log(res.address_long);
    resDiv.addEventListener("click", () => {
      startWeatherUpdates(res.address_long, "us", false, false);
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
export const initSearch = function (userLocationLatLon) {
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
    console.log("clicked");
    searchInput.focus();
  });
  searchInput.addEventListener("focusin", () => {
    // optionBtn.classList.add("hidden");
    sideContent.classList.add("hidden");
    searchBarWrap.style.display = "flex";
    searchPage.style.height = "100dvh";
    searchPage.style.zIndex = "10";
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
      appendSearchResults(results);
      console.log(results);
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
) {
  const mainContent = document.querySelector(".main-content");
  const component = weatherDetailCard(weatherData, summaryData);
  mainContent.append(component);
  return mainContent;
};

export const updateSummaryCard = async function (weatherData, query) {
  console.log(`working on ${query}`);
  const summaryData = await filterDataForSummaryCards(weatherData, query);
  console.log(summaryData);
  const contentDiv = document.querySelector(".side-bar > .content");
  const existingCard = contentDiv.querySelector(
    `.${summaryData.location.replace(/[^a-zA-Z0-9]/g, "")}`,
  ); // Find existing card

  if (existingCard) {
    console.log("Updating existing summary card...");

    // ✅ Update necessary elements inside the existing summary card
    existingCard.querySelector(".location-name").textContent =
      summaryData.location;
    existingCard.querySelector(".current-temp").textContent =
      `${summaryData.currentTemp}°`;
    existingCard.querySelector(".text-summary").textContent =
      summaryData.currentConditions;
    existingCard.querySelector(".temp-high").textContent =
      `H: ${summaryData.maxTemp}°`;
    existingCard.querySelector(".temp-low").textContent =
      `L: ${summaryData.minTemp}°`;
  } else {
    console.log("No existing card found. Creating a new one...");
    const summaryCard = await newSummaryCardComponent(weatherData, query);
    contentDiv.append(summaryCard);
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
