const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.6;

let aiSpeed = 2.5; // Default speed
let gameStarted = false;
let playerScore = 0;
let aiScore = 0;

// Game objects
const puck = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 3, dy: 3 };
const paddle1 = { x: 20, y: canvas.height / 2 - 50, width: 10, height: 80, dy: 0 };
const paddle2 = { x: canvas.width - 30, y: canvas.height / 2 - 50, width: 10, height: 80 };

// Start game with difficulty selection
function startGame(difficulty) {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("mobile-controls").style.display = "flex";
  document.getElementById("scoreboard").style.display = "block";
  
  // Set AI difficulty speed
  if (difficulty === "easy") aiSpeed = 2;
  else if (difficulty === "medium") aiSpeed = 3.5;
  else if (difficulty === "hard") aiSpeed = 5;
  
  gameStarted = true;
  gameLoop();
}

// Game loop
function update() {
  if (!gameStarted) return;
  
  // Move player paddle
  paddle1.y += paddle1.dy;
  
  // Move AI paddle
  if (puck.dx > 0) {
    if (puck.y < paddle2.y + paddle2.height / 2) {
      paddle2.y -= aiSpeed;
    } else if (puck.y > paddle2.y + paddle2.height / 2) {
      paddle2.y += aiSpeed;
    }
  }
  
  // Prevent paddles from going out of bounds
  paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, paddle1.y));
  paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.height, paddle2.y));
  
  // Move puck
  puck.x += puck.dx;
  puck.y += puck.dy;
  
  // Bounce off walls
  if (puck.y - puck.radius < 0 || puck.y + puck.radius > canvas.height) {
    puck.dy *= -1;
  }
  
  // Paddle collision
  if (
    (puck.x - puck.radius < paddle1.x + paddle1.width &&
      puck.y > paddle1.y &&
      puck.y < paddle1.y + paddle1.height) ||
    (puck.x + puck.radius > paddle2.x &&
      puck.y > paddle2.y &&
      puck.y < paddle2.y + paddle2.height)
  ) {
    puck.dx *= -1;
  }
  
  // Score update
  if (puck.x < 0) {
    aiScore++;
    resetPuck();
  } else if (puck.x > canvas.width) {
    playerScore++;
    resetPuck();
  }
  
  // Update score display
  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;
}

// Reset puck after scoring
function resetPuck() {
  puck.x = canvas.width / 2;
  puck.y = canvas.height / 2;
  puck.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
  puck.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Mobile Button Controls
upBtn.addEventListener("touchstart", () => (paddle1.dy = -5));
upBtn.addEventListener("touchend", () => (paddle1.dy = 0));

downBtn.addEventListener("touchstart", () => (paddle1.dy = 5));
downBtn.addEventListener("touchend", () => (paddle1.dy = 0));

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw puck
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw paddles
  ctx.fillStyle = "white";
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}