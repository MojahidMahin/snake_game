// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScore = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{x:10, y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let currentScore = 0;
let currentHighScore = 0;

// console.log(board);

// Draw the game's map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  if (gameStarted) drawFood();
  updateScore();
}

//Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Generating food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return {x, y};
}

//Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  })
}

// Testing draw function
// draw();

// Draw food
function drawFood() {
  const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Moving the snake
function move() {
  const head = {...snake[0]};
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }
  snake.unshift(head); // Pushing the head into the snake array
  // snake.pop();

  // console.log("here");
  // checkCollision();

  if (checkCollision()) return;

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      // checkCollision();
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    // if (checkCollision()) return;
    snake.pop();
  }
}

// Test moving
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200);

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if((!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.code === ' ')) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown' :
        direction = 'down';
        break;
      case 'ArrowLeft' :
        direction = 'left';
        break;
      case 'ArrowRight' :
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

// Speed logging
function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
  else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
  else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
  else gameSpeedDelay -= 1;
}

// Checking the collision
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    console.log("Collided here");
    resetGame();
    return true;
  }
  else
    for (let i = 1; i < snake.length; i++) {
      if ((head.x === snake[i].x && head.y === snake[i].y)) {
        console.log("Collided");
        resetGame();
        return true;
      }
    }
  return false;
}

// Resetting game
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{x: 10, y: 10}];
  draw();
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
}

// Updating score
function updateScore() {
  currentScore = (snake.length - 1 >= 0 ? snake.length - 1 : 0);
  score.textContent = currentScore.toString().padStart(3, '0');
}

// Updating highScore
function updateHighScore() {
  if (currentScore > currentHighScore) currentHighScore = currentScore ;
  highScore.textContent = currentHighScore.toString().padStart(3, '0');
  highScore.style.display = 'block';
}

// Stopping game
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}
