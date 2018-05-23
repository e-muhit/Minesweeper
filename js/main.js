const $main = $('main');
const $secTable = $('.table');
const $modal = $('.modal');
const $modalMines = $('.modal-mines');
let $modalLoss = $('.modal-loss');
let $modalWin = $('.modal-win');
let $square;
let mineField = [];
let bombs = [];
let $table;
let columns;
let rows;
let mines;
let openSquares = 0;


function getAttribute() {
    $modal.modal('show');
}

$('#b1').click(function () {
    columns = Number($('#column-row-amount').val());
    rows = Number($('#column-row-amount').val());
    $.modal.close();
    $modalMines.modal('show');
});

$('#b3').one('click', function () {
    mines = Number($('#mines-amount').val());
    $.modal.close();
    startGame();
});

// create table
// create 2d array representing table
function createBoard() {
    $table = $('<table><tbody>');
    if ((columns > 100) || (rows > 100)){
        columns = 100;
        rows = 100;
    }
    for (let r = 0; r < rows; r++) {
        let $tr = $('<tr>');
        let row = [];
        for (let c = 0; c < columns; c++) {
            $('<td class="squares">').appendTo($tr);
            row.push(null);
        }
        $tr.appendTo($table);
        mineField.push(row);
    }
    $table.appendTo($secTable);
    $square = $('.squares');
}

function mineAmount() {
    let mineAmount = $('.mine-amount');
    mineAmount.html(mines);
}

// create mines
// place mines in random location
function plantMines() {
    if (mines > ($square.length / 2)) {
        mines = Math.floor($square.length / 2);
    }
    while (bombs.length != mines) {
        let width = mineField[0].length;
        let randomX = Math.floor(Math.random() * width);
        let randomY = Math.floor(Math.random() * mineField.length);
        let randomInt = width * randomX + randomY;
        if ($.inArray(randomInt, bombs) === -1) {
            bombs.push(randomInt);
            mineField[randomX][randomY] = 'MINE';
        }
    }
    mineAmount();
}

// check for mine location depending on click
// x is horizontal, y is vertical
function checkMines(x, y) {
    if (mineField[x][y] === 'MINE') {
        return true;
    }
    else {
        let width = mineField[0].length;
        let numMines = 0;
        if (x - 1 >= 0 && mineField[x - 1][y] === 'MINE') {
            numMines += 1;
        }
        if (y - 1 >= 0 && mineField[x][y - 1] === 'MINE') {
            numMines += 1;
        }
        if (x - 1 >= 0 && y - 1 >= 0 && mineField[x - 1][y - 1] === 'MINE') {
            numMines += 1;
        }
        if (x + 1 < width && mineField[x + 1][y] === 'MINE') {
            numMines += 1;
        }
        if (y + 1 < width && mineField[x][y + 1] === 'MINE') {
            numMines += 1;
        }
        if (x + 1 < width && y + 1 < width && mineField[x + 1][y + 1] === 'MINE') {
            numMines += 1;
        }
        if (x + 1 < width && y - 1 >= 0 && mineField[x + 1][y - 1] === 'MINE') {
            numMines += 1;
        }
        if (x - 1 >= 0 && y + 1 < width && mineField[x - 1][y + 1] === 'MINE') {
            numMines += 1;
        }
        return numMines;
    }
}


function checkWinner() {
    return (openSquares >= (rows * columns - mines));
}

function winner() {
    let win = $('.win-score');
    let winInt = Number(win.html());
    winInt++;
    win.html(winInt);
}

function loser() {
    let loss = $('.loss-score');
    let lossInt = Number(loss.html());
    lossInt++;
    loss.html(lossInt);
}

// add click function to reveal number or mine
// add click function for flag
function addClick() {
    for (const z in $square) {
        let clickSquare = $square.eq(z);
        clickSquare.on('click', function () {
            let squareIndex = $square.index($(event.target));
            if (event.altKey) {
                $square.eq(squareIndex).toggleClass('flag');
            }
            else {
                let width = mineField[0].length;
                // got the formula for x and y from brother-in-law
                let x = Math.floor(squareIndex / width);
                let y = squareIndex % width;
                let num = checkMines(x, y);
                
                if (num === true) {
                    for (const bombLocation of bombs) {
                        $square.eq(bombLocation).removeClass('flag');
                        $square.eq(bombLocation).html('');
                        let img = $('<img src="images/mine.jpg"/>');
                        img.appendTo($square.eq(bombLocation));
                    }
                    for (const a in $square) {
                        clickSquare = $square.eq(a);
                        clickSquare.off();
                    }
                    loser();
                    
                    $modalLoss.html('BOOM!!! YOU LOSE!!');
                    $modalLoss.modal('show');
                    if (columns >= 10 && rows >= 10 && mines >= 15) {
                        columns -= 5;
                        rows -= 5;
                        mines -= 10;
                    }
                    setTimeout(clearTable, 5000);
                }
                else {
                    openSquares++;
                    $square.eq(squareIndex).html(num);
                    $(this).css('background-color', 'lightgray');
                    if (checkWinner()) {
                        winner();
                        $modalWin.html('WOOOHOOO!!! YOU WIN');
                        $modalWin.modal('show');
                        if (columns < 100 && rows < 100) {
                            columns += 5;
                            rows += 5;
                            mines += 15;
                        }
                        setTimeout(clearTable, 5000);
                    }
                }
            }
        });
    }
}

// clear Table
function clearTable() {
    $table.remove();
    mineField = [];
    bombs = [];
    $square.length = 0;
    openSquares = 0;
    $modalLoss.html('');
    $modalWin.html('');
    $.modal.close();
    createBoard();
    plantMines();
    addClick();
}

function startGame() {
    createBoard();
    plantMines();
    addClick();
}
getAttribute();