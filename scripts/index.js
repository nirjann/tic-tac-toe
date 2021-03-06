console.log("script loaded");

// Globals
let players = [];
let godMode = false;
let result = null;
let scores = {
  x: -10,
  o: 10,
  tie: 0,
};

// data about the board
//gameboard init
let gameBoard = function () {
  "use strict";
  let _board = [];
  let _rowContainer = [0,0,0];
  let _columnContainer = [0,0,0];
  let _diagContainer = [0,0,0];
  let _oppositeDiagContainer = [0,0,0];

  function init_board() {
    for (let i = 0; i < 3; i++) {
      _board.push(["", "", ""]);
    }
  }
  function getBoardStates(index_x, index_y) {
    return _board[index_x][index_y];
  }

  function setBoardState(index_x, index_y, value) {
    _board[index_x][index_y] = value;
  }

  function resetBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _board[i][j] = "";
      }
    }
  }
  return {
    init_board,
    getBoardStates,
    setBoardState,
    resetBoard,
    
  };
};

let displayController = function (board) {
  "use strict";
  let board_blocks = document.querySelectorAll(".board-block");
  function displayBoard() {
    board_blocks.forEach((item) => {
      let index_x = Number(item.getAttribute("index_x"));
      let index_y = Number(item.getAttribute("index_y"));
      let block_value = board.getBoardStates(index_x, index_y);
      if (block_value == "o") {
        item.innerHTML = `<i class="far fa-circle fa-5x fa-custom"></i>`;
      } else if (block_value == "x") {
        item.innerHTML = `<i class="fas fa-times fa-5x fa-custom"></i>`;
      } else {
        item.innerHTML = "";
      }
    });
  }
  return {
    displayBoard,
  };
};

// Players
let Player = (userName, token, index, active) => {
  return {
    userName,
    token,
    index,
    active,
  };
};

//init board
let board = gameBoard();
board.init_board();

// game logic
function isWin(board) {
  let result = null;
  //checking the rows
  let index_x = 0;
  let index_y = 0;

  for (let index_x = 0; index_x < 3; index_x++) {
    if (
      board.getBoardStates(index_x, index_y) != "" &&
      board.getBoardStates(index_x, index_y + 1) ==
        board.getBoardStates(index_x, index_y) &&
      board.getBoardStates(index_x, index_y + 2) ==
        board.getBoardStates(index_x, index_y + 1)
    ) {
      if (board.getBoardStates(index_x, index_y) == "x") {
        result = "x";
      } else {
        result = "o";
      }
    }
  }

  // checking the columns
  index_x = 0;
  for (index_y = 0; index_y < 3; index_y++) {
    if (
      board.getBoardStates(index_x, index_y) != "" &&
      board.getBoardStates(index_x + 1, index_y) ==
        board.getBoardStates(index_x, index_y) &&
      board.getBoardStates(index_x + 2, index_y) ==
        board.getBoardStates(index_x + 1, index_y)
    ) {
      if (board.getBoardStates(index_x, index_y) == "x") {
        result = "x";
      } else {
        result = "o";
      }
    }
  }

  // checking the left diagonal
  index_x = 0;
  index_y = 0;
  if (
    board.getBoardStates(index_x, index_y) != "" &&
    board.getBoardStates(index_x + 1, index_y + 1) ==
      board.getBoardStates(index_x, index_y) &&
    board.getBoardStates(index_x + 2, index_y + 2) ==
      board.getBoardStates(index_x + 1, index_y + 1)
  ) {
    if (board.getBoardStates(index_x, index_y) == "x") {
      result = "x";
    } else {
      result = "o";
    }
  }

  // checking right diagonal
  index_x = 0;
  index_y = 2;
  if (
    board.getBoardStates(index_x, index_y) != "" &&
    board.getBoardStates(index_x + 1, index_y - 1) ==
      board.getBoardStates(index_x, index_y) &&
    board.getBoardStates(index_x + 2, index_y - 2) ==
      board.getBoardStates(index_x + 1, index_y - 1)
  ) {
    if (board.getBoardStates(index_x, index_y) == "x") {
      result = "x";
    } else {
      result = "o";
    }
  }

  let tieCounter = 0;
  for (index_x = 0; index_x < 3; index_x++) {
    for (index_y = 0; index_y < 3; index_y++) {
      if (board.getBoardStates(index_x, index_y) != "") tieCounter++;
    }
  }
  
  if (result == null && tieCounter == 9) {
    result = "tie";
  }
  return result;
}

// God's Move
function minimax(board, depth, isMaximizing) {
  // terminal condition
  let _ = isWin(board);
  
  if (_ != null) {
    let score = scores[_];
    return score;
  }
    

  if (isMaximizing) {
    let bestScore = -1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board.getBoardStates(i, j) == "") {
          board.setBoardState(i, j, "o");
          let score = minimax(board, depth + 1, false);
          board.setBoardState(i, j, "");
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = 1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board.getBoardStates(i, j) == "") {
          board.setBoardState(i, j, "x");
          let score = minimax(board, depth + 1, true);
          board.setBoardState(i, j, "");
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function makeGodMove() {
  let bestScore = -1000;
  let bestMove;
  console.log("God Move");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board.getBoardStates(i, j) == "") {
        board.setBoardState(i, j, "o");
        let score = minimax(board, 0, false);
        board.setBoardState(i, j, "");
        if (score > bestScore) {
          bestScore = score;
          bestMove = { i, j };
        }
      }
    }
  }
  console.log(bestMove);
  board.setBoardState(bestMove.i, bestMove.j, "o");
  let displayContl = displayController(board);
  displayContl.displayBoard();
}

function makeMove(item) {
  let index_x = item.getAttribute("index_x");
  let index_y = item.getAttribute("index_y");

  //getting the active player
  let activePlayer;
  let altPlayer;
  players.forEach((player) => {
    player.active ? (activePlayer = player) : (altPlayer = player);
  });
  let token = activePlayer.token;

  //setting the board with user input
  if (board.getBoardStates(index_x, index_y) == "") {
    board.setBoardState(index_x, index_y, token);
  } else {
    alert("Sorry! This move is not allowed");
  }
  let displayContl = displayController(board);
  displayContl.displayBoard();

  // toggle active player
  let togglePlayer = () => {
    altPlayer.active = true;
    activePlayer.active = false;
    let tempPlayer;
    tempPlayer = activePlayer;
    activePlayer = altPlayer;
    altPlayer = tempPlayer;
  };
  togglePlayer();

  if (activePlayer.userName == "God") {
    makeGodMove();
    togglePlayer();
  }

  result = isWin(board);
  let score = scores[result];
  if (score == 10) {
    alert(`${players[1].userName} Won!!`);
  } else if (score == -10) {
    alert(`${players[0].userName} Won!!`);
  } else if (score == 0) {
    alert("It's a TIE");
  }
}

// DOM specific functions
function getFormText() {
  let nameField = document.getElementById("player-name");
  let nameText = nameField.value;
  nameField.value = "";
  return nameText;
}

function addPlayersToDash(player) {
  let playersList = document.getElementById("players-list");
  console.dir(player);
  let li = document.createElement("li");
  li.classList.add("player_avatar");
  li.id = `player-${player.index}-avatar`;
  if (player.token == "x") {
    li.innerHTML = `<i class="fas fa-times fa-3x"></i>
    <p id="player-${player.index}-name">${player.userName}</p>`;
  } else {
    li.innerHTML = `<i class="fas fa-circle fa-3x"></i>
    <p id="player-${player.index}-name">${player.userName}</p>`;
  }

  playersList.appendChild(li);
}

function clearDash() {
  let playerList = document.getElementById("players-list");
  playerList.innerHTML = "";
}

function resetGame(board) {
  board.resetBoard();
  players = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      console.log(board.getBoardStates(i, j));
    }
  }
}
// Event Listeners

document.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  target = event.target;

  // add player button event listener
  if (target.id == "player-submit") {
    event.preventDefault();
    if (players.length < 2) {
      let nameText = getFormText();
      let index = 1;
      let token = "x";
      let active = true;
      if (!nameText) {
        console.log("can't be empty");
      } else {
        if (players.length == 1) {
          index++;
          token = "o";
          active = false;
        }
        let player = Player(nameText, token, index, active);
        players.push(player);
        addPlayersToDash(player);
      }
    } else {
      alert("Maximum Users Already added");
    }

    console.dir(players);
  }

  // reset button
  if (target.id == "reset-btn") {
    console.log("reset btn clicked");
    event.preventDefault();
    resetGame(board);
    let displayContl = displayController(board);
    displayContl.displayBoard();
    clearDash();
  }

  // AI play button
  if (target.id == "god-btn") {
    event.preventDefault();
    if (players.length == 2) {
      alert("Already two players added");
    } else if (players.length == 0) {
      alert("You must add a player first!");
    } else {
     
      let god = Player("God", "o", 2, false);
      players.push(god);
      addPlayersToDash(god);
      console.dir(players);
    }
  }
});

let board_blocks = document.querySelectorAll(".board-block");
board_blocks.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    makeMove(item);
  });
});
