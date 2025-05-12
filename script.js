// Surprise Button functionality
document.getElementById("surpriseBtn").addEventListener("click", function() {
    const msg = document.getElementById("surpriseMsg");
    msg.style.display = "block";

    // Hide the message after 3 seconds
    setTimeout(() => {
        msg.style.display = "none";
    }, 3000);
});

// Tic-Tac-Toe Game
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;

document.getElementById("startTicTacToe").addEventListener("click", startGame);
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", function() {
        makeMove(parseInt(this.dataset.index));
    });
});

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.getElementById("ticTacToeGame").style.display = "block";
    document.getElementById("status").innerText = "Player X's turn";
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.innerText = "";
        cell.style.pointerEvents = "auto";
        cell.style.backgroundColor = "white";
    });
}

function makeMove(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    const cell = document.querySelectorAll(".cell")[index];
    cell.innerText = currentPlayer;
    cell.style.pointerEvents = "none";
    cell.style.backgroundColor = currentPlayer === "X" ? "#ffdddd" : "#ddddff";

    if (checkWinner()) {
        document.getElementById("status").innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        highlightWinningCells();
        return;
    }

    if (!board.includes("")) {
        document.getElementById("status").innerText = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").innerText = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function highlightWinningCells() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const winningPattern = winPatterns.find(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });

    if (winningPattern) {
        winningPattern.forEach(index => {
            document.querySelectorAll(".cell")[index].style.backgroundColor = 
                currentPlayer === "X" ? "#ffaaaa" : "#aaaaff";
        });
    }
}

// JavaScript Game functionality
document.getElementById("startJsGame").addEventListener("click", function() {
    document.getElementById("jsGameContainer").style.display = "block";
    this.style.display = "none";
});
