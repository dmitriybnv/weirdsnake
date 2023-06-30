const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const MOVE_DELAY = 200;

let mainInterval;
let gameActiveFlag;
let keypressFlag;
let movingDirection;
let lastAutoMoveTimestamp;
let snake;
let food;

let firstTimeFlag = true;

function resetGame() {
    mainInterval = null;

    gameActiveFlag = false;
    keypressFlag = false;

    movingDirection = DIRECTION_UP;

    lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;

    snake = [
        [9, 16],
        [9, 17],
        [9, 18],
    ];

    food = [9, 9];
}

function updateTimestamp() {
    lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;
}

function pauseGame() {
    alert('paused');

    updateTimestamp();
}

function gameOver() {
    startGame();
}

function grow() {

}

function generateFoodCoords() {
    // min is one, no need to be next to border
    let randomX = randomInteger(1, FIELD_WIDTH - 1);
    let randomY = randomInteger(1, FIELD_HEIGHT - 1);

    // check if pixel occupied by snake
    for (let piece of snake) {
        if (piece[0] === randomX && (piece[1] === randomY)) {
            return generateFoodCoords();
        }
    }

    return [randomX, randomY];
}

function eat() {
    food = generateFoodCoords();
}

function moveSnake(direction, automaticFlag) {
    // prevents additional movement in one direction
    if (movingDirection === direction && (automaticFlag === false)) {
        return;
    }

    // prevents opposite movement
    if (
        (movingDirection === DIRECTION_UP && (direction === DIRECTION_DOWN))
        ||
        (movingDirection === DIRECTION_UP && (direction === DIRECTION_DOWN))
        ||
        (movingDirection === DIRECTION_LEFT && (direction === DIRECTION_RIGHT))
        ||
        (movingDirection === DIRECTION_RIGHT && (direction === DIRECTION_LEFT))
    ) {
        return;
    }

    // slows down automatic movement
    if (automaticFlag === true) {
        if (new Date().getTime() - lastAutoMoveTimestamp < MOVE_DELAY) {
            return;
        }
    }

    let previousX = snake[0][0];
    let previousY = snake[0][1];

    if (direction === DIRECTION_UP) {
        if (snake[0][1] === 0) {
            gameOver();

            return;
        }

        snake[0][1] -= 1;
    }

    if (direction === DIRECTION_DOWN) {
        if (snake[0][1] === FIELD_HEIGHT - 1) {
            gameOver();

            return;
        }

        snake[0][1] += 1;
    }

    if (direction === DIRECTION_LEFT) {
        if (snake[0][0] === 0) {
            gameOver();

            return;
        }

        snake[0][0] -= 1;
    }

    if (direction === DIRECTION_RIGHT) {
        if (snake[0][0] === FIELD_WIDTH - 1) {
            gameOver();

            return;
        }

        snake[0][0] += 1;
    }

    if (snake[0][0] === food[0] && (snake[0][1] === food[1])) {
        eat();
    }

    if (automaticFlag === false) {
        movingDirection = direction;
    }

    for (let piece = 1; piece < snake.length; piece++) {
        let nextPreviousX = snake[piece][0];
        let nextPreviousY = snake[piece][1];

        snake[piece] = [previousX, previousY];

        previousX = nextPreviousX;
        previousY = nextPreviousY;
    }

    updateTimestamp();

    keypressFlag = false;
}

function handleKey(event) {
    if (gameActiveFlag === false || (keypressFlag === true)) {
        return;
    }

    if (event.code === 'Escape') {
        pauseGame();

        return;
    }

    let direction = '';

    // WASD and arrows used to control snake
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            direction = DIRECTION_UP;
            break;
        case 'KeyS':
        case 'ArrowDown':
            direction = DIRECTION_DOWN;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            direction = DIRECTION_LEFT;
            break;
        case 'KeyD':
        case 'ArrowRight':
            direction = DIRECTION_RIGHT;
            break;
    }

    // some unwanted key pressed
    if (direction !== '') {
        keypressFlag = true;

        moveSnake(direction, false);
    }
}

function drawSnake() {
    for (let piece of snake) {
        addPixel(piece[0], piece[1])
    }
}

function drawFood() {
    addPixel(food[0], food[1])
}

function mainLoop() {
    cleanMatrix();

    drawSnake();
    drawFood();

    moveSnake(movingDirection, true);

    render();
}

function startGame() {
    resetGame();

    if (firstTimeFlag === true) {
        alert('press OK to start');

        updateTimestamp();

        firstTimeFlag = false;
    }
    
    gameActiveFlag = true;

    mainInterval = setInterval(mainLoop, 16);

    document.addEventListener('keyup', handleKey);
}

startGame();