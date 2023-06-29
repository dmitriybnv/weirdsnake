(function () {
    let gameMatrix = [];

    const PIXEL = true;
    const EMPTY_SPACE = false;

    function initialize() {
        for (let y = 0; y < 20; y++) {
            gameMatrix[y] = [];

            for (let x = 0; x < 20; x++) {
                gameMatrix[y] = [];

                gameMatrix[y][x] = EMPTY_SPACE;
            }
        }
    }

    function drawPixel(x, y) {
        gameMatrix[y][x] = PIXEL;
    }

    function render() {
        let table = document.querySelector('#gameField');

        let rows = table.querySelectorAll('tr');

        for (let [rowId, row] of rows.entries()) {
            let columns = row.querySelectorAll('td');

            for (let [columnId, column] of columns.entries()) {
                if (gameMatrix[rowId][columnId] === PIXEL) {
                    column.querySelector('input').checked = true;
                }
            }
        }
    }

    initialize();

    // render pixel at x=0,y=1
    // drawPixel(0, 1);

    render();
})();