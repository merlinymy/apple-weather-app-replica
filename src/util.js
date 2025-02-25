import { onGeolocationRefuse } from "./uiHandler";

export const getDivCenter = function (div) {
  const rect = div.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return { x: centerX, y: centerY };
};

export const isIn24Hours = function (datetime) {};

export const getTimeFromTimezone = function (tzString) {
  // https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
  return new Intl.DateTimeFormat("en-US", {
    tzString,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

export const updateTime = function (div, timezone) {
  div.innerHTML = getTimeFromTimezone(timezone);
  setTimeout(() => updateTime(div, timezone), 1000);
};

export const getCurrentDate = function (tzString) {
  return new Intl.DateTimeFormat("en-CA", {
    tzString,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

export const getUserLocation = async function () {
  // returns a string of suburb ?? county ?? city
  const { lat, lon } = await getUserLatLon();
  // const locationName = await getLocationName(lat, lon);
  return { lat, lon };
};

function getUserLatLon() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          return reject(error);
        },
      );
    } else {
      return reject(new Error("Geolocation is not supported by this browser"));
    }
  });
}

export const getLocationName = async function (lat, lon) {
  // returns a string of suburb ?? county ?? city
  const api_url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(api_url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`nominatim api error: ${response.status}`);
    }

    const data = await response.json();
    const { suburb, county, city } = data.address;
    return suburb ?? county ?? city ?? { lat, lon };
  } catch (error) {
    console.error("Error with nominatim api: ", error);
  }
};

export const askForGeolocation = async function () {
  try {
    const userLocationLatLon = await getUserLocation();
    return userLocationLatLon;
  } catch (e) {
    console.log(e);
    onGeolocationRefuse();
  }
};

export const convertToDate = function (timeStr) {
  const date = new Date();
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0; // Midnight edge case
  }

  date.setHours(hours, minutes, 0, 0); // Set hours and minutes on current date
  return date;
};
