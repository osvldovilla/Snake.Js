//#region Config Globals
let gameGrid;
let gameUI;
let matrix = [];
let direction = 'ArrowRight';
let position;

const defaultColor = 'white';
const snakeColor = 'green';
const fruitColor = 'lightgreen';
const fruitEmoji = '🍎';

let isGameOver;
let interval;
let sizeBoard = 20;
let score = 0;
let snake = ['0-0'];
let speed = 1000;

const widthBoard = "600px"
const heightBoard = "600px"

let scoreDiv = document.getElementById('score');

const directions = {
    ArrowUp: -1,
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowLeft: -1,
};
//#endregion

onStart();

function onStart() {
    console.log('Game set default config...');
    setDefaultConfig();

    console.log('Game is drawing board...');
    drawBoard();

    console.log('Game add snake in board...');
    drawSnake();

    console.log('Game add random Fruit...');
    addFruit();

    console.log('Game is running...');
}

function setDefaultConfig() {
    gameUI = document.getElementById('game');
    gameUI.innerHTML = "";

    position = new Map([
        ['x', 0],
        ['y', 0]
    ]);

    isGameOver = false;
    score = 0;

    scoreDiv.innerHTML = `Score: ${score}`;
}

function update() {
    if (isGameOver) {
        return;
    }

    interval ? clearInterval(interval) : null;

    interval = setInterval(() => {
        console.log("speed: " + speed);

        if (!isGameOver) {
            move(direction);
        }

    }, speed);
}

function drawBoard() {
    gameGrid = document.createElement('div');
    matrix = [];

    for (let i = 0; i < sizeBoard; i++) {
        matrix[i] = [];

        for (let j = 0; j < sizeBoard; j++) {
            matrix[i][j] = `${i}-${j}`;

            let cell = document.createElement('div');
            cell.setAttribute('index', `${i}-${j}`);
            cell.id = `cell-${i}-${j}`;
            cell.className = 'cell';

            cell.style.backgroundColor = defaultColor;
            cell.style.border = '1px solid black';
            cell.style.margin = '1px';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';

            // cell.addEventListener('click', e => {
            //     let cell = e.target;
            //     cell.innerHTML = fruitEmoji;
            //     cell.style.backgroundColor = fruitColor;
            // });

            gameGrid.appendChild(cell);
        }
    }

    gameGrid.style.width = widthBoard;
    gameGrid.style.height = heightBoard;
    gameGrid.style.display = 'grid';
    gameGrid.style.gridTemplate = 'repeat(' + sizeBoard + ',5%) /  repeat(' + sizeBoard + ',5%)';

    gameUI.appendChild(gameGrid);

    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('keydown', e => {
        move(e.code);
        update();
    });
}

function addFruit(oldPoint) {
    if (oldPoint != undefined) {
        oldPoint.style.backgroundColor = snakeColor;
        oldPoint.innerHTML = "";
    }

    let pointRandom = [];
    pointRandom.push(Math.floor(Math.random() * 19));
    pointRandom.push(Math.floor(Math.random() * 19));

    let point = document.getElementById(`cell-${pointRandom[1]}-${pointRandom[0]}`);

    if (point.style.backgroundColor === snakeColor) {
        addFruit();
    } else {
        point.innerHTML = fruitEmoji;
        point.style.backgroundColor = fruitColor;
    }
}

function drawSnake(point) {
    let head;

    if (point != undefined) {
        head = document.getElementById(`cell-${snake.shift()}`);
        head.style.backgroundColor = defaultColor;

        snake.push(point)
    }

    snake.forEach(cell => {
        head = document.getElementById(`cell-${cell}`);
        head.style.backgroundColor = snakeColor;
    });
}

function move(keyPress) {
    if (isGameOver) {
        return;
    }

    direction = keyPress;

    switch (direction) {
        case 'ArrowUp':
            position.set('y', position.get('y') - 1);
            break;
        case 'ArrowDown':
            position.set('y', position.get('y') + 1);
            break;
        case 'ArrowLeft':
            position.set('x', position.get('x') - 1);
            break;
        case 'ArrowRight':
            position.set('x', position.get('x') + 1);
            break;
        default:
            return;
    }

    let xHead = position.get('x');
    let yHead = position.get('y');

    console.log('Game is moving to: ' + direction + " x: " + xHead + " y: " + yHead);

    let head = document.getElementById(`cell-${yHead}-${xHead}`);

    if (xHead < 0 || xHead > (sizeBoard - 1) || yHead < 0 || yHead > (sizeBoard - 1)) {
        console.log('Game is over by wall');
        gameOver();
        return;
    }

    if (head.style.backgroundColor === snakeColor) {
        console.log('Game is over by collision...');
        gameOver();
        return;
    }

    if (head.style.backgroundColor === fruitColor) {
        score += 10;

        changeSpeed();
        addFruit(head);
        snake.push(yHead + "-" + xHead);
    }

    drawSnake(yHead + "-" + xHead);
    scoreDiv.innerHTML = `Score: ${score}`;
}

function changeSpeed() {
    if (speed <= 10) {
        speed -= 1;
    } else if (speed <= 50) {
        speed -= 5;
    } else if (speed <= 100) {
        speed -= 10;
    } else if (speed <= 500) {
        speed -= 50;
    } else {
        speed -= 200;
    }
}

function defaultValues() {
    gameUI = document.getElementById('game');
    gameUI.innerHTML = "";

    position = new Map([
        ['x', 0],
        ['y', 0]
    ]);

    isGameOver = false;
    score = 0;
}

function gameOver() {
    isGameOver = true;
    gameUI.innerHTML = '<h1>Game Over</h1><br>😞';
    gameUI.style.textAlign = 'center';

    clearInterval(interval);
}