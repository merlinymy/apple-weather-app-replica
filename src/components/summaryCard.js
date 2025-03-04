import summaryCardStruc from "./summaryCard.html";
import {
  setAnimation,
  playExpandAnimation,
} from "../canvasAnimation/animationHandler";
import { getDivPos, updateTime } from "../util";
import { filterDataForSummaryCards } from "../data/dataHandler";
import { createWeatherCard } from "../uiHandler";

export const newSummaryCardComponent = async function (weatherData, query) {
  const summaryData = await filterDataForSummaryCards(weatherData, query);
  const struct = `

    <div class="card-animation">
    </div>
    <div class="card-content">
        <div class="top">
            <div class="name-and-time">
                <div class="location-name bold-grey-shadow">${summaryData.location}</div>
                <div class="time"></div>
            </div>
            <div class="current-temp bold-grey-shadow">${summaryData.currentTemp}\u00B0</div>
        </div>
        <div class="bottom">
            <div class="text-summary">${summaryData.currentConditions}</div>
            <div class="temp-wrap bold-grey-shadow">
                <div class="temp-high">H:${summaryData.maxTemp}\u00B0</div>
                <div class="temp-low">L:${summaryData.minTemp}\u00B0</div>
            </div>
        </div>
    </div>
  
  `;

  const component = document.createElement("div");
  component.classList.add("summary-card");

  component.innerHTML = struct;
  const timeDiv = component.querySelector(".time");
  updateTime(timeDiv, summaryData.timezone);
  const animationCanvas = component.querySelector(".card-animation");
  setTimeout(() => {
    setAnimation(animationCanvas, summaryData);
  }, 0);

  component.addEventListener("click", () => {
    const weatherDataFromStorage = JSON.parse(
      localStorage.getItem("weatherData"),
    )[`${weatherData.address}`];
    const sideBar = document.querySelector(".side-bar");
    const cardContent = document.querySelector(".card-content");
    const summaryCardPos = getDivPos(cardContent);

    const mainContent = createWeatherCard(
      weatherDataFromStorage || weatherData,
      summaryData,
      summaryCardPos,
    );

    mainContent.style.height = `100dvh`;
    mainContent.style.zIndex = "10";
    // mainContent.style.overflow = "auto";
    // mainContent.style.transform = "translateX(-100%)";

    // console.log(summaryCardPos.x, summaryCardPos.y);
    // mainContent.style.top = `${summaryCardPos.x}px`;
    // mainContent.style.left = `${summaryCardPos.y}px`;
    // mainContent.style.transform = "scaleY(1)";
    // sideBar.style.opacity = 0;
  });
  return component;
};
