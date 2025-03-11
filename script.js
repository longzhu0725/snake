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

// 初始化加载历史记录
function initHighScores() {
  const stored = localStorage.getItem('snakeScores');
  window.highScores = stored ? JSON.parse(stored) : [];
  renderHighScores();
}

// 保存分数（带时间戳）
function saveScore(score) {
  const record = {
    score: score,
    timestamp: new Date().toISOString()
  };
  highScores.push(record);
  highScores.sort((a, b) => 
    b.score - a.score || Date.parse(a.timestamp) - Date.parse(b.timestamp)
  );
  localStorage.setItem('snakeScores', JSON.stringify(highScores));
}

// 渲染排行榜
function renderHighScores() {
  const list = document.getElementById('highScores');
  list.innerHTML = highScores
    .slice(0, 10)
    .map((r, i) => `<li>${i+1}. ${r.score}分 (${new Date(r.timestamp).toLocaleString()})</li>`)
    .join('');
}

// 初始化时加载
initHighScores();

// 修改游戏结束函数
function gameOver() {
  clearInterval(gameLoop);
  isPaused = true;
  saveScore(score);
  renderHighScores();
  alert(`游戏结束！得分：${score}`);
  document.getElementById('startBtn').disabled = false;
}

// 添加重置按钮事件监听
document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem('snakeScores');
  window.highScores = [];
  renderHighScores();
});

draw();