import { Application, Assets, Sprite } from "pixi.js";
import puffy1 from "./assets/sprites/puffy1.png";
import puffy2 from "./assets/sprites/puffy2.png";
import puffy3 from "./assets/sprites/puffy3.png";

export const puffyCloud = async function (numberofCloud, hue) {
  const app = new Application();
  await app.init({ width: 640, height: 360 });
  const cardAnimationWrap = document.querySelector(".card-animation");
  cardAnimationWrap.appendChild(app.canvas);

  await Promise.all([
    Assets.load(puffy1),
    Assets.load(puffy2),
    Assets.load(puffy3),
  ]);
  // const spritePath = "./assets/sprites/";
  const puffyCloud1 = Sprite.from(puffy1);
  puffyCloud1.scale.set(0.25, 0.25);

  app.stage.addChild(puffyCloud1);

  // Add a variable to count up the seconds our demo has been running
  let elapsed = 0.0;
  // Tell our application's ticker to run a new callback every frame, passing
  // in the amount of time that has passed since the last tick
  app.ticker.add((ticker) => {
    // Add the time to our total elapsed time
    elapsed += ticker.deltaTime;
    // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    // by 50 to slow the animation down a bit...
    puffyCloud1.x -= 0.1;
    const puffy1Bound = puffyCloud1.getBounds();
    if (puffyCloud1.x < -puffyCloud1.width) {
      // If cloud fully exits the screen
      puffyCloud1.x = app.renderer.width; // Reset to enter from the right
    }
  });
};
