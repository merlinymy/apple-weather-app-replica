export const storeWeatherData = function (name, data) {
  const localData = JSON.parse(localStorage.getItem("weatherData"));

  if (name.lat) {
    localData[`${name.lat},${name.lon}`] = {};
    localData[`${name.lat},${name.lon}`]["id"] = Date.now();
    localData[`${name.lat},${name.lon}`]["data"] = JSON.stringify(data);
    localData[`${name.lat},${name.lon}`]["lastUpdate"] = new Date().getTime();
  } else {
    localData[`${name}`] = {};
    localData[`${name}`]["id"] = Date.now();
    localData[`${name}`]["data"] = JSON.stringify(data);
    localData[`${name}`]["lastUpdate"] = new Date().getTime();
  }

  localStorage.setItem("weatherData", JSON.stringify(localData));
  const dataEntry =
    localData[`${name.lat},${name.lon}`] || localData[`${name}`];
  return dataEntry["id"];
};

export const deleteByDataId = function (id) {
  const localData = JSON.parse(localStorage.getItem("weatherData"));
  for (const [key, value] of Object.entries(localData)) {
    console.log(value.id, id);
    console.log(value.id == id);
    if (value.id === id) {
      delete localData[key];
      console.log(localData[key]);
      localStorage.setItem("weatherData", JSON.stringify(localData));
    }
  }
};

export const getLocalData = function (name) {
  if (localStorage.getItem("weatherData")) {
    return JSON.parse(localStorage.getItem("weatherData"))[`${name}`];
  }
  return null;
};

export const updateWeatherData = function (name, data) {
  const localData = JSON.parse(localStorage.getItem("weatherData"));
  if (name.lat) {
    localData[`${name.lat},${name.lon}`] = {};
    localData[`${name.lat},${name.lon}`]["data"] = JSON.stringify(data);
    localData[`${name.lat},${name.lon}`]["lastUpdate"] = new Date().getTime();
  } else {
    localData[`${name}`].data = JSON.stringify(data);
    localData[`${name}`].lastUpdate = new Date().getTime();
    localStorage.setItem("weatherData", JSON.stringify(localData));
  }
};
