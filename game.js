// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameActive = false;
let gameLoop;

// Display high score on load
document.getElementById('highScore').textContent = highScore;

// Generate random food position
function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    
    return newFood;
}

// Update game state
function update() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = snake[0];
    const newHead = {
        x: (head.x + direction.x + tileCount) % tileCount,
        y: (head.y + direction.y + tileCount) % tileCount
    };
    
    // Check collision with self
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        food = generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (optional, for visual clarity)
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - brighter color
            ctx.fillStyle = '#00ff00';
        } else {
            // Body - slightly darker
            ctx.fillStyle = '#00cc00';
        }
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Game loop
function gameStep() {
    update();
    draw();
}

// Start/Stop game
function toggleGame() {
    if (gameActive) {
        clearInterval(gameLoop);
        gameActive = false;
    } else {
        gameActive = true;
        gameLoop = setInterval(gameStep, 100);
    }
}

// Reset game
function resetGame() {
    clearInterval(gameLoop);
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    food = generateFood();
    gameActive = false;
    document.getElementById('score').textContent = score;
    draw();
}

// End game
function endGame() {
    clearInterval(gameLoop);
    gameActive = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    alert(`Game Over! Your Score: ${score}\nHigh Score: ${highScore}`);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Prevent default arrow key behavior
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
    }
    
    // Update direction based on arrow keys
    if (key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
    if (key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
    if (key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
    if (key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
});

// Initial draw
draw();
