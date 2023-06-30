let mainInterval = null;

let gameActive = false;

let snake = [
    [9, 16],
    [9, 17],
    [9, 18],
];

let food = [9, 9];

const DIRECTION_UP = 'up';
const DIRECTION_DOWN = 'down';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

let movingDirection = DIRECTION_UP;

let keypressFlag = false;

const MOVE_DELAY = 550;

let lastAutoMoveTimestamp = new Date().getTime();

function gameOver() {
    gameActive = false;

    clearInterval(mainInterval)

    console.log('game over ' + JSON.stringify(snake));

    alert('GAME OVER');
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

    lastAutoMoveTimestamp = new Date().getTime();

    keypressFlag = false;
}

function handleKey(event) {
    if (gameActive === false || (keypressFlag === true)) {
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

document.addEventListener('keyup', handleKey);

gameActive = true;

mainInterval = setInterval(mainLoop, 16);