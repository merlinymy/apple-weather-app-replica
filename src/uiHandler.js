import { newSummaryCardComponent } from "./components/summaryCard";
import { filterDataForSummaryCards } from "./data/dataHandler";
export const updateSummaryCard = async function (weatherData, query) {
  const summaryData = await filterDataForSummaryCards(weatherData, query);

  const contentDiv = document.querySelector(".side-bar > .content");
  const existingCard = contentDiv.querySelector(`.${summaryData.location}`); // Find existing card

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
