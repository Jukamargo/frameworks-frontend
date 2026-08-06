// ==========================
// SUDOKU PASTEL
// Parte 1
// ==========================

const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

const solution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

const board = document.getElementById("board");
const timerElement = document.getElementById("timer");
const errorsElement = document.getElementById("errors");
const message = document.getElementById("message");
const numbers = document.getElementById("numbers");

let selected = null;
let errors = 0;

let seconds = 0;
let timer;

//=========================
// Cronômetro
//=========================

function startTimer(){

    clearInterval(timer);

    timer = setInterval(()=>{

        seconds++;

        const min = String(Math.floor(seconds/60)).padStart(2,"0");
        const sec = String(seconds%60).padStart(2,"0");

        timerElement.textContent = `${min}:${sec}`;

    },1000);

}

//=========================
// Contadores
//=========================

function createCounters(){

    numbers.innerHTML="";

    for(let i=1;i<=9;i++){

        const div=document.createElement("div");

        div.className="number-counter";

        div.id="count"+i;

        div.textContent=i;

        numbers.appendChild(div);

    }

}

//=========================
// Atualizar contador
//=========================

function updateCounters(){

    for(let n=1;n<=9;n++){

        let total=0;

        document.querySelectorAll("input").forEach(input=>{

            if(Number(input.value)===n){

                total++;

            }

        });

        const div=document.getElementById("count"+n);

        if(total===9){

            div.classList.add("complete");

        }else{

            div.classList.remove("complete");

        }

    }

}

//=========================
// Criar tabuleiro
//=========================

function createBoard(){

    board.innerHTML="";

    for(let row=0;row<9;row++){

        for(let col=0;col<9;col++){

            const cell=document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row=row;
            cell.dataset.col=col;

            const input=document.createElement("input");

            input.maxLength=1;

            input.dataset.row=row;
            input.dataset.col=col;

            if(puzzle[row][col]!==0){

                input.value=puzzle[row][col];

                input.disabled=true;

                cell.classList.add("fixed");

            }

            input.addEventListener("focus",()=>{

                selected=input;

                clearHighlights();

                highlightSelection(input);

            });

            input.addEventListener("input",()=>{

                input.value=input.value.replace(/[^1-9]/g,"");

                updateCounters();

                validateCell(input);

            });

            cell.appendChild(input);

            board.appendChild(cell);

        }

    }

}

//=========================
// Reiniciar
//=========================

function resetGame(){

    errors=0;

    seconds=0;

    errorsElement.textContent="0/3";

    timerElement.textContent="00:00";

    message.textContent="";

    createCounters();

    createBoard();

    startTimer();

}

resetGame();
// ==========================
// PARTE 2
// ==========================

// Limpa todos os destaques
function clearHighlights() {

    document.querySelectorAll(".cell").forEach(cell => {

        cell.classList.remove(
            "selected",
            "highlight",
            "same",
            "error",
            "conflict"
        );

    });

}

// Destaca linha, coluna, bloco e números iguais
function highlightSelection(input) {

    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    const value = input.value;

    document.querySelectorAll(".cell").forEach(cell => {

        const r = Number(cell.querySelector("input").dataset.row);
        const c = Number(cell.querySelector("input").dataset.col);

        // linha
        if (r === row)
            cell.classList.add("highlight");

        // coluna
        if (c === col)
            cell.classList.add("highlight");

        // bloco 3x3
        if (
            Math.floor(r / 3) === Math.floor(row / 3) &&
            Math.floor(c / 3) === Math.floor(col / 3)
        ) {

            cell.classList.add("highlight");

        }

    });

    input.parentElement.classList.add("selected");

    // destaca números iguais

    if (value !== "") {

        document.querySelectorAll("input").forEach(i => {

            if (i.value === value) {

                i.parentElement.classList.add("same");

            }

        });

    }

}

// ==========================
// Validação
// ==========================

function validateCell(input) {

    if (input.value === "") {

        input.parentElement.classList.remove("error");
        input.parentElement.classList.remove("conflict");
        return;

    }

    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    const value = Number(input.value);

    // limpa antes
    input.parentElement.classList.remove("error");
    input.parentElement.classList.remove("conflict");

    // valor correto?

    if (value !== solution[row][col]) {

        input.parentElement.classList.add("error");

        input.parentElement.classList.add("shake");

        setTimeout(() => {

            input.parentElement.classList.remove("shake");

        }, 250);

        errors++;

        errorsElement.textContent = errors + "/3";

        if (errors >= 3) {

            gameOver();

        }

    }

    // conflitos

    highlightConflicts();

    checkVictory();

}

// ==========================
// Mostrar conflitos
// ==========================

function highlightConflicts() {

    document.querySelectorAll(".cell").forEach(c => {

        c.classList.remove("conflict");

    });

    document.querySelectorAll("input").forEach(input => {

        if (input.value === "") return;

        const value = input.value;

        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);

        document.querySelectorAll("input").forEach(other => {

            if (other === input) return;

            if (other.value === "") return;

            if (other.value !== value) return;

            const r = Number(other.dataset.row);
            const c = Number(other.dataset.col);

            const sameRow = row === r;
            const sameCol = col === c;

            const sameBlock =
                Math.floor(row / 3) === Math.floor(r / 3) &&
                Math.floor(col / 3) === Math.floor(c / 3);

            if (sameRow || sameCol || sameBlock) {

                input.parentElement.classList.add("conflict");
                other.parentElement.classList.add("conflict");

            }

        });

    });

}

// ==========================
// Vitória
// ==========================

function checkVictory() {

    let ok = true;

    document.querySelectorAll("input").forEach(input => {

        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);

        if (Number(input.value) !== solution[row][col]) {

            ok = false;

        }

    });

    if (ok) {

        clearInterval(timer);

        message.innerHTML =
            "🎉 <b>Parabéns!</b><br>Você completou o Sudoku!";

        board.classList.add("win");

    }

}

// ==========================
// Game Over
// ==========================

function gameOver() {

    clearInterval(timer);

    message.innerHTML =
        "💔 Você atingiu o limite de erros.";

    document.querySelectorAll("input").forEach(input => {

        input.disabled = true;

    });

}

// ==========================
// BOTÕES
// ==========================

document.getElementById("newGame").addEventListener("click", newGame);
document.getElementById("hint").addEventListener("click", giveHint);
document.getElementById("check").addEventListener("click", checkBoard);

// Novo jogo
function newGame() {

    errors = 0;
    seconds = 0;

    errorsElement.textContent = "0/3";
    timerElement.textContent = "00:00";
    message.textContent = "";

    createCounters();
    createBoard();
    startTimer();

}

// Dar dica
function giveHint() {

    const empty = [];

    document.querySelectorAll("input").forEach(input => {

        if (input.disabled) return;

        if (input.value === "") {

            empty.push(input);

        }

    });

    if (empty.length === 0) return;

    const random = empty[Math.floor(Math.random() * empty.length)];

    const row = Number(random.dataset.row);
    const col = Number(random.dataset.col);

    random.value = solution[row][col];

    validateCell(random);

    updateCounters();

}

// Verificar tabuleiro
function checkBoard() {

    let wrong = 0;

    document.querySelectorAll("input").forEach(input => {

        if (input.disabled) return;

        validateCell(input);

        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);

        if (Number(input.value) !== solution[row][col]) {

            wrong++;

        }

    });

    if (wrong === 0) {

        message.innerHTML = "🎉 Tudo certo até agora!";

    } else {

        message.innerHTML = `❌ Existem ${wrong} posição(ões) incorreta(s).`;

    }

}