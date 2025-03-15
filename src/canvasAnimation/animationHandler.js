import {
  Application,
  Assets,
  Sprite,
  Container,
  Graphics,
  Color,
  Texture,
} from "pixi.js";
import sun from "../assets/sprites/sun.png";
import moon from "../assets/sprites/moon.png";
import sun_orb from "../assets/sprites/sun_orb.png";
import {
  convertToDate,
  getTimeFromTimezone,
  setBackgroundColor,
} from "../util";
import { differenceInHours } from "date-fns";

export const setAnimation = async function (div, weatherData, summaryData) {
  console.log(weatherData);
  console.log(summaryData);
  const timezone = summaryData.timezone;
  const sunrise = `2025-01-01 ${weatherData.currentConditions.sunrise}`;
  const sunset = `2025-01-01 ${weatherData.currentConditions.sunset}`;
  const curtime = `2025-01-01 ${weatherData.currentConditions.datetime}`;
  const currentConditions = summaryData.currentConditions;

  const app = new Application();
  const cardContent = div.nextElementSibling;
  await app.init({
    resizeTo: cardContent,
  });
  const baseColor = setBackgroundColor(
    curtime,
    sunrise,
    sunset,
    currentConditions,
  );
  app.renderer.background.color = baseColor;
  // setBodyBackgroundColor(baseColor);

  setSunMoonPosition(app, curtime, sunrise, sunset);
  setClouds(app, currentConditions);

  div.appendChild(app.canvas);
};

const setSunMoonPosition = async function (app, curtime, sunrise, sunset) {
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

  if (curtime > sunrise && curtime < sunset) {
    const progress =
      Math.abs(differenceInHours(curtime, sunrise)) /
      Math.abs(differenceInHours(sunset, sunrise));

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
  }
};

const setClouds = function (app, currentConditions) {};

const setRain = function (app) {};

const setSnow = function (app) {};

const setLightning = function (app) {};
