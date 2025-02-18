import { Application, Assets, Sprite } from "pixi.js";
import sun from "../assets/sprites/sun.png";
import moon from "../assets/sprites/moon.png";
import sun_orb from "../assets/sprites/sun_orb.png";
import { convertToDate } from "../util";
import { puffyCloud } from "./modules/puffy-clouds";
import puffy1 from "../assets/sprites/puffy1.png";

export const setAnimation = async function (div, weatherData) {
  console.log(weatherData);
  const time = weatherData.time;
  const currentConditions = weatherData.currentConditions;
  //   const
  const app = new Application();
  const cardContent = div.nextElementSibling;
  await app.init({
    resizeTo: cardContent,
  });
  setBackgroundColor(app, time, currentConditions);
  setSunMoonPosition(app, time);
  setClouds(app, currentConditions);
  //   puffyCloud(app);
  div.appendChild(app.canvas);
};

const setBackgroundColor = function (app, time, currentConditions) {
  const curTime = convertToDate(time);
  const sunriseTime = convertToDate("7:00 AM");
  const sunsetTime = convertToDate("7:00 PM");

  let baseColor;

  // 🌅 Determine Base Color Based on Time of Day
  if (curTime >= sunriseTime && curTime <= sunsetTime) {
    baseColor = "#87CEEB"; // Daytime sky (light blue)
    if (
      curTime < convertToDate("8:00 AM") ||
      curTime > convertToDate("5:00 PM")
    ) {
      baseColor = "#c0b9ff"; // Soft peach near sunrise/sunset
    }
  } else {
    baseColor = "#1B263B"; // Deep blue night sky
  }

  // 🌦 Modify Base Color Based on Weather Conditions
  const condition = currentConditions.toLowerCase();

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

  // Apply the background color
  app.renderer.background.color = baseColor;
};

const setSunMoonPosition = async function (app, time) {
  await Promise.all([
    Assets.load(sun),
    Assets.load(moon),
    Assets.load(sun_orb),
  ]);
  const sunSprite = Sprite.from(sun);
  const moonSprite = Sprite.from(moon);
  const sunOrb = Sprite.from(sun_orb);

  const rendererWidth = app.renderer.width;
  const rendererHeight = app.renderer.height;

  const sunrise = "7:00 AM";
  const sunset = "7:00 PM";

  const curTime = convertToDate(time);
  const sunriseTime = convertToDate(sunrise);
  const sunsetTime = convertToDate(sunset);

  if (curTime > convertToDate(sunrise) && curTime < convertToDate(sunset)) {
    const progress = (curTime - sunriseTime) / (sunsetTime - sunriseTime);
    sunOrb.scale.set(0.022, 0.022);
    sunOrb.anchor.set(0.5, 0.5);
    sunOrb.position.set(progress * rendererWidth, 30);
    sunSprite.scale.set(0.03, 0.03);
    sunSprite.anchor.set(0.5, 0.5);
    sunSprite.position.set(progress * rendererWidth, 30);

    let rotationSpeed = 0.0002; // Adjust for smoother or faster movement
    let rotationDirection = 1; // 1 = forward, -1 = backward
    const maxRotation = 1; // Max angle for the swinging effect (radians)

    app.ticker.add(() => {
      sunSprite.rotation += rotationSpeed * rotationDirection;
      sunOrb.rotation += rotationSpeed * rotationDirection;

      // Reverse direction if rotation exceeds max range
      if (
        sunSprite.rotation > maxRotation ||
        sunSprite.rotation < -maxRotation
      ) {
        rotationDirection *= -1;
      }
    });
    app.stage.addChild(sunSprite, sunOrb);
  } else {
    moonSprite.scale.set(0.015, 0.015);
    const nightStart = convertToDate("7:00 PM");
    const nightEnd = convertToDate("7:00 AM"); // Next day

    let progress;
    if (curTime >= nightStart) {
      progress =
        (curTime - nightStart) / (convertToDate("11:59 PM") - nightStart);
    } else {
      progress =
        (curTime - convertToDate("12:00 AM")) /
        (nightEnd - convertToDate("12:00 AM"));
    }

    moonSprite.position.set(progress * rendererWidth, 10);
    app.stage.addChild(moonSprite);
  }
};

const setClouds = function (app, currentConditions) {};

const setRain = function (app) {};

const setSnow = function (app) {};

const setLightning = function (app) {};
