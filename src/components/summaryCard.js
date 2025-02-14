import summaryCardStruc from "./summaryCard.html";

export const newSummaryCardComponent = function (weatherData) {
  const component = document.createElement("div");
  component.innerHTML = summaryCardStruc;

  return component;
};
