let snakePieces = [
    [9, 16],
    [9, 17],
    [9, 18],
];

let food = [9, 9];

let gameStarted = false;

let keypressFlag = false;

function moveSnake(key) {
    for (let piece in snakePieces) {
        if (key === 'KeyW' && (snakePieces[piece][1] > 0)) {
            snakePieces[piece][1] -= 1;
        }
    }

    keypressFlag = false;
}

function handleKey(event) {
    console.log(gameStarted, keypressFlag);

    if (gameStarted === false || (keypressFlag === true)) {
        return;
    }

    // might as well add support for arrows, but not now

    if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].indexOf(event.code) !== -1) {
        keypressFlag = true;

        moveSnake(event.code);
    }
}

function initializeSnake() {
    for (let piece of snakePieces) {
        addPixel(piece[0], piece[1])
    }
}

function initializeFood() {
    addPixel(food[0], food[1])
}

function mainLoop() {
    gameStarted = true;

    cleanMatrix();

    initializeSnake();
    initializeFood();

    render();
}

document.addEventListener('keydown', handleKey);

setInterval(function () {
    mainLoop()
}, 33);