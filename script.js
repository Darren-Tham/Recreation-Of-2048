const ROWS = 4;
const COLS = 4;
const board = document.getElementById("board");
let tiles = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));

// -------------------- Main Method --------------------

begin();

// -------------------- Setup --------------------

document.documentElement.style.setProperty("--ROWS", ROWS);
document.documentElement.style.setProperty("--COLS", COLS);

// Setting up tiles array and HTML document
function setup() {
  tiles.forEach((row, i) => {
    for (let j in row) {
      const tile = document.createElement("div");
      tile.classList.add("tile-setup");
      board.append(tile);
      tiles[i][j] = tile;
    } // for
  });
}

// Adds a random tile
function randomTile() {
  const i = Math.floor(Math.random() * 4);
  const j = Math.floor(Math.random() * 4);
  const tile = tiles[i][j];
  if (tile.classList.contains("tile")) {
    return randomTile();
  } else {
    tile.classList.add("tile");
    tile.innerText = Math.random() <= 0.1 ? "4" : "2";
  }
} // randomTile

// Setup the board using setup() and add two random tiles in the board
// If two tiles are 4, then the game will restart
function begin() {
  setup();

  randomTile();
  randomTile();

  let fourCount = 0;
  tiles.forEach((row, i) => {
    for (let j in row) {
      const tile = tiles[i][j];
      if (tile.innerText === "4") {
        fourCount++;
      } // if
    } // for
    if (fourCount === 2) {
      restartGame();
      begin();
    } // if
  }); // forEach
} // begin

// Restarts the game
function restartGame() {
  board.innerHTML = "";
  tiles = new Array(4).fill(null).map(() => new Array(4).fill(null));
} // restartGame

window.addEventListener("keydown", (e) => {
  if (e.key == "w" || e.key == "W") console.log("test");
});
