import { onGeolocationRefuse } from "./uiHandler";

export const getDivPos = function (div) {
  const rect = div.getBoundingClientRect();
  const centerX = rect.left;
  const centerY = rect.top;

  return { x: centerX, y: centerY };
};

export const setBackgroundColor = function (time, currentConditions) {
  const curTime = convertToDate(time);
  const sunriseTime = convertToDate("7:00 AM");
  const sunsetTime = convertToDate("7:00 PM");
  const condition = currentConditions.toLowerCase();

  let baseColor;

  if (curTime >= sunriseTime && curTime <= sunsetTime) {
    baseColor = "#87CEEB"; // Daytime sky (light blue)
    if (condition.includes("clear")) {
      baseColor = baseColor; // No change, sky remains as per time
    } else if (condition.includes("partially cloudy")) {
      baseColor = "#A0C4FF"; // Light blue with a subtle cloudy tint
    } else if (condition.includes("overcast") || condition.includes("fog")) {
      baseColor = "#A9A9A9"; // Grayish sky for cloudy/overcast conditions
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      baseColor = "#708090"; // Grayish blue for rainy weather
    } else if (condition.includes("thunderstorm")) {
      baseColor = "#4B0082"; // Deep purple for stormy atmosphere
    } else if (condition.includes("snow")) {
      baseColor = "#DDEEFF"; // Very light blue to reflect snowy brightness
    }
    if (
      curTime < convertToDate("8:00 AM") ||
      curTime > convertToDate("5:00 PM")
    ) {
      baseColor = "#c0b9ff"; // Soft peach near sunrise/sunset
    }
  } else {
    baseColor = "#1B263B"; // Deep blue night sky
  }

  return baseColor;
};

export const getTimeFromTimezone = function (tzString) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tzString, // Correct property name
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

export const updateTime = function (div, timezone) {
  // console.log(getTimeFromTimezone(timezone));
  div.innerHTML = getTimeFromTimezone(timezone);
  setTimeout(() => updateTime(div, timezone), 1000);
};

export const getCurrentDate = function (tzString) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tzString,
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
