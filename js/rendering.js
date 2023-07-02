'use strict';

let pixels = [];

class Pixel {
    constructor(x = 0, y = 0, color = DEFAULT_COLOR) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

function createDOM() {
    let table = document.querySelector('#gameField');

    for (let y = 0; y < FIELD_HEIGHT; y++) {
        let tr = document.createElement('tr');

        table.appendChild(tr);

        for (let x = 0; x < FIELD_WIDTH; x++) {
            let td = document.createElement('td');
            let label = document.createElement('label');
            let input = document.createElement('input');

            input.type = 'checkbox';

            tr.appendChild(td);
            td.appendChild(label);
            label.appendChild(input);
        }
    }
}

function cleanPixels() {
    pixels = [];
}

function addPixel(x, y, color = DEFAULT_COLOR) {
    pixels.push(new Pixel(x, y, color));
}

function render() {
    let table = document.querySelector('#gameField');

    let rows = table.querySelectorAll('tr');

    for (let [rowId, row] of rows.entries()) {
        let columns = row.querySelectorAll('td');

        for (let [columnId, column] of columns.entries()) {
            let foundPixel = null;

            for (let pixel of pixels) {
                if (columnId === pixel.x && (rowId === pixel.y)) {
                    foundPixel = pixel;

                    break;
                }
            }

            let input = column.querySelector('input');

            input.checked = foundPixel !== null;

            input.style['accent-color'] = foundPixel !== null ? foundPixel.color : DEFAULT_COLOR;
        }
    }
}