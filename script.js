// ===== ELEMENTS =====
const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const music = document.getElementById("music");

const startMenu = document.getElementById("startMenu");
const pauseOverlay = document.getElementById("pauseOverlay");
const hearts = document.querySelectorAll(".heart");

const endScreen = document.getElementById("endScreen");
const endLogo = document.getElementById("endLogo");
const finalScore = document.getElementById("finalScore");

const vomit = document.getElementById("vomit");

const VOMIT_TIMES = [58.349896640944216, 118.61218085459575, 127.24234341205103];
const VOMIT_DURATION = 900;
let vomitTriggered = [false, false, false];


// ===== GAME STATE =====
let gameRunning = false;
let gamePaused = false;

let score = 0;
let lives = 3;

let playerX = 150;
const SPEED = 45;

let foodInterval;
let fallSpeed = 3; 


document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;

  // START
  if (!gameRunning) {
    startMenu.style.display = "none";
    gameRunning = true;
    music.currentTime = 0;
    music.play();

    foodInterval = setInterval(createFood, 900);
    return;
  }


  if (gameRunning && !endScreen.style.display.includes("flex")) {
    gamePaused = !gamePaused;

    if (gamePaused) {
      pauseOverlay.style.display = "flex";
      music.pause();
    } else {
      pauseOverlay.style.display = "none";
      music.play();
    }
  }
});

music.addEventListener("timeupdate", () => {
    if (!gameRunning) return;
  
    VOMIT_TIMES.forEach((time, index) => {
      if (
        music.currentTime >= time &&
        !vomitTriggered[index]
      ) {
        triggerVomit();
        vomitTriggered[index] = true;
      }
    });
  });
  
  


document.addEventListener("keydown", (e) => {
  if (!gameRunning || gamePaused) return;

  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= SPEED;
  }

  if (e.key === "ArrowRight" && playerX < 296) {
    playerX += SPEED;
  }

  player.style.left = playerX + "px";
});


function createFood() {
  if (gamePaused) return;

  const food = document.createElement("img");
  food.classList.add("food");

  food.src = Math.random() > 0.5
    ? "assets/spaghetti.png"
    : "assets/meatball.png";

  food.style.left = Math.random() * 328 + "px";
  game.appendChild(food);

  let foodY = -40;

  const fallInterval = setInterval(() => {
    if (gamePaused) return;

    foodY += fallSpeed;
    food.style.top = foodY + "px";


    if (isColliding(food, player)) {
      score++;
      scoreDisplay.textContent = "Score: " + score;

      player.src = "assets/character_eat.png";
      setTimeout(() => {
        player.src = "assets/character_idle.png";
      }, 200);

      food.remove();
      clearInterval(fallInterval);
    }

    // MISSED FOOD
    if (foodY > 640) {
      loseLife();
      food.remove();
      clearInterval(fallInterval);
    }

  }, 20);
}


function loseLife() {
  lives--;

  hearts[lives].src = "assets/heart_empty.png";

  if (lives === 0) {
    endGame(false);
  }
}


function endGame(won) {
  gameRunning = false;
  gamePaused = true;

  clearInterval(foodInterval);
  music.pause();

  endScreen.style.display = "flex";
  endLogo.src = won
    ? "assets/win_logo.png"
    : "assets/gameover_logo.png";

  finalScore.textContent = "Score: " + score;
}


music.addEventListener("ended", () => {
  if (lives > 0) {
    endGame(true);
  }
});


function isColliding(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.top > r2.bottom ||
    r1.bottom < r2.top ||
    r1.left > r2.right ||
    r1.right < r2.left
  );
}


setInterval(() => {
  if (gameRunning && !gamePaused) {
    fallSpeed += 0.2; // gradually faster
  }
}, 5000);


function triggerVomit() {
    vomit.style.display = "block";
  
    setTimeout(() => {
      vomit.style.display = "none";
    }, VOMIT_DURATION);
  }
  