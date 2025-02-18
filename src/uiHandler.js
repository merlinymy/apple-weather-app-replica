import { newSummaryCardComponent } from "./components/summaryCard";

export const appendSummaryCard = function (weatherData) {
  const contentDiv = document.querySelector(".side-bar > .content");
  contentDiv.append(newSummaryCardComponent(weatherData));
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
