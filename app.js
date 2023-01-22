// Gameboard object
const Gameboard = (() => {
  let board = new Array(9).fill(null);
  let gameOver = false;

  const addMark = (index, mark) => {
    if (gameOver) {
      return;
    }
    if (board[index] === null) {
      board[index] = mark;
      document.getElementById(index).innerHTML = mark;
      document.getElementById(index).classList.add(mark);
    } else {
      console.log("Spot already taken!");
    }
  };

  const render = () => {
    board.forEach((mark, index) => {
      if (mark !== null) {
        document.getElementById(index).innerHTML = mark;
        document.getElementById(index).classList.add(mark);
      }
    });
  };

  const checkForWin = (currentPlayer) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log(`Player ${board[a]} wins!`);
        document.getElementById(a).classList.add("winner");
        document.getElementById(b).classList.add("winner");
        document.getElementById(c).classList.add("winner");
        document.getElementById(
          "winner-message"
        ).innerHTML = `Congratulations ${currentPlayer.name}! You won!`;
        document.getElementById("winner-message-container").style.display =
          "block";
        gameOver = true;
        return true;
      }
    }
    return false;
  };

  const checkForTie = () => {
    if (!board.includes(null) && !checkForWin()) {
      document.getElementById("winner-message").innerHTML = `It was a tie!`;
      document.getElementById("winner-message-container").style.display =
        "block";
      gameOver = true;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = new Array(9).fill(null);

    render();
    document.querySelectorAll("td").forEach((cell) => {
      cell.innerHTML = "";
    });
    document.querySelectorAll("td").forEach((cell) => {
      cell.classList.remove("X", "O", "winner");
      gameOver = false;
    });
  };

  return { addMark, render, checkForWin, checkForTie, reset };
})();

// Player objects
const PlayerFactory = (name, marker) => ({ name, marker });

// Game flow controller
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;

  const startGame = (player1Name, player2Name) => {
    player1 = PlayerFactory(player1Name, "X");
    player2 = PlayerFactory(player2Name, "O");
    currentPlayer = player1;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playTurn = (index) => {
    if (player1 && player2) {
      Gameboard.addMark(index, currentPlayer.marker);
      if (Gameboard.checkForWin(currentPlayer) || Gameboard.checkForTie()) {
        // GameController.reset();
      } else {
        switchPlayer();
      }
    } else {
      document.getElementById(
        "winner-message"
      ).innerHTML = `Please enter both player names to begin the game.`;
      document.getElementById("winner-message-container").style.display =
        "block";
    }
  };

  const reset = () => {
    Gameboard.reset();
    currentPlayer = player1;
    document.getElementById("winner-message-container").style.display = "none";
  };

  return { playTurn, reset, startGame };
})();

// Event listeners for gameboard clicks
document.querySelectorAll("td").forEach((cell) => {
  cell.addEventListener("click", (event) => {
    GameController.playTurn(event.target.id);
  });
});

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const player1Name = form.querySelector("input[id='player1-name']").value;
  const player2Name = form.querySelector("input[id='player2-name']").value;
  GameController.startGame(player1Name, player2Name);
  GameController.reset();
});
