let gameMatrix = [];

const PIXEL = true;
const EMPTY_SPACE = false;

const FIELD_WIDTH = 19;
const FIELD_HEIGHT = 19;

// we could even go as far as creating HTML matrix
// based on preferred width and height but it's too tedious
function cleanMatrix() {
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        gameMatrix[y] = [];

        for (let x = 0; x < FIELD_WIDTH; x++) {
            gameMatrix[y] = [];

            gameMatrix[y][x] = EMPTY_SPACE;
        }
    }
}

function addPixel(x, y) {
    gameMatrix[y][x] = PIXEL;
}

function render() {
    let table = document.querySelector('#gameField');

    let rows = table.querySelectorAll('tr');

    for (let [rowId, row] of rows.entries()) {
        let columns = row.querySelectorAll('td');

        for (let [columnId, column] of columns.entries()) {
            column.querySelector('input').checked = gameMatrix[rowId][columnId] === PIXEL;
        }
    }
}