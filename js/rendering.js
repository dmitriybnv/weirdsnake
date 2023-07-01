'use strict';

let pixels = [];

const FIELD_WIDTH = 19;
const FIELD_HEIGHT = 19;

const DEFAULT_COLOR = '';

class Pixel {
    constructor(x = 0 , y = 0, color = DEFAULT_COLOR) {
        this.x = x;
        this.y = y;
        this.color = color;
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