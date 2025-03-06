import summaryCardStruc from "./summaryCard.html";
import {
  setAnimation,
  playExpandAnimation,
} from "../canvasAnimation/animationHandler";
import { converDetailWeatherTemp, getDivPos, updateTime } from "../util";
import { filterDataForSummaryCards } from "../data/dataHandler";
import { createWeatherCard } from "../uiHandler";
import { deleteByDataId } from "../data/localStorageHandler";

export const newSummaryCardComponent = async function (
  weatherData,
  query,
  tempUnit,
  dataId,
  isTracked,
) {
  const summaryData = await filterDataForSummaryCards(weatherData, query); // no issue
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
    <div class="remove-icon-wrap hidden"><span class="material-symbols-outlined remove-icon">
remove
</span></div>
  
  `;

  const component = document.createElement("div");
  component.classList.add("summary-card", `id-${dataId}`);
  component.innerHTML = struct;
  const deleteBtn = component.querySelector(".remove-icon-wrap");
  if (isTracked) {
    deleteBtn.remove();
    const locationName = component.querySelector(".location-name");
    locationName.innerHTML = `${summaryData.location}<span class="material-symbols-outlined">
location_on
</span>`;
  }
  deleteBtn.addEventListener("click", () => {
    component.remove();
    deleteByDataId(dataId);
  });

  const timeDiv = component.querySelector(".time");
  updateTime(timeDiv, summaryData.timezone);
  const animationCanvas = component.querySelector(".card-animation");
  setTimeout(() => {
    setAnimation(animationCanvas, summaryData);
  }, 0);
  component.addEventListener("click", (event) => {
    if (document.body.getAttribute("is-editing") === "true") {
      return;
    }
    if (event.target !== deleteBtn && !deleteBtn.contains(event.target)) {
      console.log(event.target);
      const sideBar = document.querySelector(".side-bar");
      const cardContent = document.querySelector(".card-content");
      const summaryCardPos = getDivPos(cardContent);
      const detailCard = createWeatherCard(
        weatherData,
        summaryData,
        summaryCardPos,
        tempUnit,
      );
      if (localStorage.getItem("tempUnit") === "c") {
        converDetailWeatherTemp(detailCard, localStorage.getItem("tempUnit"));
      }
    }
  });
  return component;
};
