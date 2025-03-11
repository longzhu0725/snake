const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop;
let isPaused = true;

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp': if(direction !== 'down') nextDirection = 'up'; break;
    case 'ArrowDown': if(direction !== 'up') nextDirection = 'down'; break;
    case 'ArrowLeft': if(direction !== 'right') nextDirection = 'left'; break;
    case 'ArrowRight': if(direction !== 'left') nextDirection = 'right'; break;
  }
});

// 添加触摸控制
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== 'left') nextDirection = 'right';
    else if (dx < 0 && direction !== 'right') nextDirection = 'left';
  } else {
    if (dy > 0 && direction !== 'up') nextDirection = 'down';
    else if (dy < 0 && direction !== 'down') nextDirection = 'up';
  }
  e.preventDefault();
}, { passive: false });

document.getElementById('startBtn').addEventListener('click', () => {
  if(isPaused) {
    startGame();
    document.getElementById('startBtn').disabled = true;
  }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  if(!isPaused) {
    gameLoop = setInterval(moveSnake, 100);
  } else {
    clearInterval(gameLoop);
  }
});

function startGame() {
  snake = [{x: 10, y: 10}];
  score = 0;
  document.getElementById('score').textContent = score;
  isPaused = false;
  gameLoop = setInterval(moveSnake, 100);
}

function moveSnake() {
  direction = nextDirection;
  const head = {...snake[0]};

  switch(direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // 碰撞检测
  if(head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE 
    || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃食物检测
  if(head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById('score').textContent = score;
    food = generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制食物
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);

  // 绘制蛇
  ctx.fillStyle = '#4CAF50';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
  });
}

function generateFood() {
  while(true) {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    if(!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return newFood;
    }
  }
}

function gameOver() {
  clearInterval(gameLoop);
  isPaused = true;
  alert(`游戏结束！得分：${score}`);
  document.getElementById('startBtn').disabled = false;
}

draw();