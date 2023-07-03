'use strict';

let firstTimeFlag = true;

let game = null;

function startGame() {
    game = new Game();

    if (firstTimeFlag === true) {
        alert('press OK to start');

        game.updateTimestamp();

        firstTimeFlag = false;
    }

    game.gameActiveFlag = true;

    let mainInterval = setInterval(function () {
        game.mainLoop();
    }, 16);

    let listener = function (event) {
        game.handleKey(event);
    };

    document.addEventListener('keydown', listener);

    game.gameOverCallback = function () {
        clearInterval(mainInterval);

        document.removeEventListener('keydown', listener);

        startGame();
    };
}

createDOM();

startGame();