export const div = function (...classnames) {
  const newDiv = document.createElement("div");
  newDiv.classList.add(...classnames);
  return newDiv;
};
