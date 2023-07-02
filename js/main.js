'use strict';

const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

const MOVE_DELAY = 200;

const FOOD_COLOR = 'green';

let mainInterval;

let gameActiveFlag;
let keypressFlag;
let newPieceFlag;
let pauseFlag;

let movingDirection;
let lastAutoMoveTimestamp;
let snake;
let food;

let firstTimeFlag = true;

class SnakePiece {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Food {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

function resetGame() {
    mainInterval = null;

    gameActiveFlag = false;
    keypressFlag = false;
    newPieceFlag = false;
    pauseFlag = false;

    movingDirection = DIRECTION_UP;

    lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;

    snake = [
        new SnakePiece(9, 16),
        new SnakePiece(9, 17),
        new SnakePiece(9, 18),
    ];

    food = new Food(9, 9);
}

function updateTimestamp() {
    lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;
}

function pauseGame() {
    if (pauseFlag === false) {
        pauseFlag = true;
    } else {
        updateTimestamp();

        pauseFlag = false;
    }
}

function gameOver() {
    startGame();
}

function generateFoodCoords() {
    // prevent food from spawning at border
    let randomX = randomInteger(1, FIELD_WIDTH - 2);
    let randomY = randomInteger(1, FIELD_HEIGHT - 2);

    // check if pixel occupied by snake
    for (let piece of snake) {
        if (piece.x === randomX && (piece.y === randomY)) {
            return generateFoodCoords();
        }
    }

    return new Food(randomX, randomY);
}

function grow() {
    snake.push(snake.at(-1));

    newPieceFlag = true;
}

function eat() {
    food = generateFoodCoords();

    grow();
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

    let previousX = snake[0].x;
    let previousY = snake[0].y;

    if (direction === DIRECTION_UP) {
        if (snake[0].y === 0) {
            gameOver();

            return;
        }

        snake[0].y -= 1;
    }

    if (direction === DIRECTION_DOWN) {
        if (snake[0].y === FIELD_HEIGHT - 1) {
            gameOver();

            return;
        }

        snake[0].y += 1;
    }

    if (direction === DIRECTION_LEFT) {
        if (snake[0].x === 0) {
            gameOver();

            return;
        }

        snake[0].x -= 1;
    }

    if (direction === DIRECTION_RIGHT) {
        if (snake[0].x === FIELD_WIDTH - 1) {
            gameOver();

            return;
        }

        snake[0].x += 1;
    }

    // except for the first piece
    for (let piece of snake.slice(1)) {
        if (piece.x === snake[0].x && (piece.y === snake[0].y)) {
            gameOver();

            return;
        }
    }

    if (snake[0].x === food.x && (snake[0].y === food.y)) {
        eat();
    }

    if (automaticFlag === false) {
        movingDirection = direction;
    }

    for (let piece = 1; piece < snake.length; piece++) {
        if (piece === snake.length - 1 && (newPieceFlag === true)) {
            newPieceFlag = false;

            break;
        }

        let nextPreviousX = snake[piece].x;
        let nextPreviousY = snake[piece].y;

        snake[piece] = new SnakePiece(previousX, previousY);

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
        addPixel(piece.x, piece.y);
    }
}

function drawFood() {
    addPixel(food.x, food.y, FOOD_COLOR);
}

function mainLoop() {
    if (pauseFlag === true) {
        return;
    }

    cleanPixels();

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

createDOM();

startGame();