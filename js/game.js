'use strict';

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

class Game {
    mainInterval = null;

    movingDirection = DIRECTION_UP;

    gameActiveFlag = false;
    keypressFlag = false;
    newPieceFlag = false;
    pauseFlag = false;

    lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;

    snake = [
        new SnakePiece(9, 16),
        new SnakePiece(9, 17),
        new SnakePiece(9, 18),
    ];

    food = new Food(9, 9);

    gameOverCallback = () => {};

    gameOver() {
        this.gameOverCallback();
    }

    updateTimestamp() {
        this.lastAutoMoveTimestamp = new Date().getTime() + MOVE_DELAY;
    }

    pauseGame() {
        if (this.pauseFlag === false) {
            this.pauseFlag = true;
        } else {
            this.updateTimestamp();

            this.pauseFlag = false;
        }
    }

    generateFoodCoords() {
        // prevent food from spawning at border
        let food = new Food(
            randomInteger(1, FIELD_WIDTH - 2),
            randomInteger(1, FIELD_HEIGHT - 2)
        );

        // check if pixel occupied by snake
        for (let piece of this.snake) {
            if (piece.x === food.x && (piece.y === food.y)) {
                return this.generateFoodCoords();
            }
        }

        return food;
    }

    grow() {
        this.snake.push(this.snake.at(-1));

        this.newPieceFlag = true;
    }

    eat() {
        this.food = this.generateFoodCoords();

        this.grow();
    }

    moveSnake(direction, automaticFlag) {
        // prevents additional movement in one direction
        if (this.movingDirection === direction && (automaticFlag === false)) {
            return;
        }

        // prevents opposite movement
        if (
            (this.movingDirection === DIRECTION_UP && (direction === DIRECTION_DOWN))
            ||
            (this.movingDirection === DIRECTION_UP && (direction === DIRECTION_DOWN))
            ||
            (this.movingDirection === DIRECTION_LEFT && (direction === DIRECTION_RIGHT))
            ||
            (this.movingDirection === DIRECTION_RIGHT && (direction === DIRECTION_LEFT))
        ) {
            return;
        }

        // slows down automatic movement
        if (automaticFlag === true) {
            if (new Date().getTime() - this.lastAutoMoveTimestamp < MOVE_DELAY) {
                return;
            }
        }

        let previousX = (this.snake)[0].x;
        let previousY = (this.snake)[0].y;

        if (direction === DIRECTION_UP) {
            if ((this.snake)[0].y === 0) {
                this.gameOver();

                return;
            }

            (this.snake)[0].y -= 1;
        }

        if (direction === DIRECTION_DOWN) {
            if ((this.snake)[0].y === FIELD_HEIGHT - 1) {
                this.gameOver();

                return;
            }

            (this.snake)[0].y += 1;
        }

        if (direction === DIRECTION_LEFT) {
            if ((this.snake)[0].x === 0) {
                this.gameOver();

                return;
            }

            (this.snake)[0].x -= 1;
        }

        if (direction === DIRECTION_RIGHT) {
            if ((this.snake)[0].x === FIELD_WIDTH - 1) {
                this.gameOver();

                return;
            }

            (this.snake)[0].x += 1;
        }

        // except for the first piece
        for (let piece of this.snake.slice(1)) {
            if (piece.x === (this.snake)[0].x && (piece.y === (this.snake)[0].y)) {
                this.gameOver();

                return;
            }
        }

        if ((this.snake)[0].x === this.food.x && ((this.snake)[0].y === this.food.y)) {
            this.eat();
        }

        if (automaticFlag === false) {
            this.movingDirection = direction;
        }

        for (let piece = 1; piece < this.snake.length; piece++) {
            if (piece === this.snake.length - 1 && (this.newPieceFlag === true)) {
                this.newPieceFlag = false;

                break;
            }

            let nextPreviousX = (this.snake)[piece].x;
            let nextPreviousY = (this.snake)[piece].y;

            (this.snake)[piece] = new SnakePiece(previousX, previousY);

            previousX = nextPreviousX;
            previousY = nextPreviousY;
        }

        this.updateTimestamp();

        this.keypressFlag = false;
    }

    handleKey(event) {
        if (this.gameActiveFlag === false || (this.keypressFlag === true)) {
            return;
        }

        if (event.code === 'Escape') {
            this.pauseGame();

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
            this.keypressFlag = true;

            this.moveSnake(direction, false);
        }
    }

    drawSnake() {
        for (let piece of this.snake) {
            addPixel(piece.x, piece.y);
        }
    }

    drawFood() {
        addPixel(this.food.x, this.food.y, FOOD_COLOR);
    }

    mainLoop() {
        if (this.pauseFlag === true) {
            return;
        }

        cleanPixels();

        this.drawSnake();
        this.drawFood();

        this.moveSnake(this.movingDirection, true);

        render();
    }
}