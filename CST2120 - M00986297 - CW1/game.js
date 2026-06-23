const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "Images/runner.png";

const foodImg = new Image();
foodImg.src = "Images/food.jpg";

const rockImg = new Image();
rockImg.src = "Images/rock.png";

let player = { x: 180, y: 440, width: 40, height: 40, speed: 5 };
let foods = [];
let rocks = [];
let score = 0;
let time = 0;
let gameOver = false;

// Track whether player is guest
const isGuest = sessionStorage.getItem("isGuest") === "true";

// Controls
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Spawn objects
function spawnObjects() {
  if (Math.random() < 0.03) foods.push({ x: Math.random() * 360, y: -30, size: 30 });
  if (Math.random() < 0.02) rocks.push({ x: Math.random() * 360, y: -30, size: 30 });
}

// Collision check
function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

// Update game
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  spawnObjects();

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Foods
  foods.forEach((food, i) => {
    food.y += 3;
    ctx.drawImage(foodImg, food.x, food.y, food.size, food.size);
    if (isColliding(player, food)) {
      foods.splice(i, 1);
      score += 10;
    }
  });

  // Rocks
  rocks.forEach((rock, i) => {
    rock.y += 4;
    ctx.drawImage(rockImg, rock.x, rock.y, rock.size, rock.size);
    if (isColliding(player, rock)) {
      endGame();
    }
  });

  // Score + Time
  ctx.fillStyle = "#333";
  ctx.font = "18px Darumadrop One";
  ctx.fillText(`Score: ${score}`, 10, 25);
  ctx.fillText(`Time: ${formatTime(time)}`, 300, 25);

  requestAnimationFrame(update);
}

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
}

// Timer
setInterval(() => {
  if (!gameOver) time++;
}, 1000);

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
}

// End game
function endGame() {
  gameOver = true;

  document.getElementById("finalScore").innerText = `Score: ${score}`;
  document.getElementById("finalTime").innerText = `Time: ${formatTime(time)}`;
  document.getElementById("gameOverScreen").style.display = "block";

  if (!isGuest) {
    saveScore();
  }
}

// Save to localStorage
function saveScore() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const username = localStorage.getItem("username") || "Player";
  leaderboard.push({ name: username, score, time: formatTime(time) });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Buttons
document.getElementById("playAgainBtn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("mainMenuBtn").addEventListener("click", () => {
  if (isGuest) {
    window.location.href = "index.html";
  } else {
    window.location.href = "index2.html";
  }
});

update();