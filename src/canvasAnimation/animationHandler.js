import { Application, Assets, Sprite } from "pixi.js";
import sun from "../assets/sprites/sun.png";
import moon from "../assets/sprites/moon.png";
import sun_orb from "../assets/sprites/sun_orb.png";
import {
  convertToDate,
  getTimeFromTimezone,
  setBackgroundColor,
} from "../util";

export const setAnimation = async function (div, weatherData) {
  console.log(weatherData);
  const timezone = weatherData.timezone;
  const time = getTimeFromTimezone(timezone);
  console.log(time);
  const currentConditions = weatherData.currentConditions;

  const app = new Application();
  const cardContent = div.nextElementSibling;
  await app.init({
    resizeTo: cardContent,
  });
  const baseColor = setBackgroundColor(time, currentConditions);
  app.renderer.background.color = baseColor;
  // setBodyBackgroundColor(baseColor);

  setSunMoonPosition(app, time);
  setClouds(app, currentConditions);
  //   puffyCloud(app);
  div.appendChild(app.canvas);
};

function setBodyBackgroundColor(baseColor) {
  const body = document.querySelector("body");
  body.style.backgroundColor = baseColor;
}

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
