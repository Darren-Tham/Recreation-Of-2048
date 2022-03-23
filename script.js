const ROWS = 4;
const COLS = 4;
const board = document.getElementById("board");
let tiles = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));

// -------------------- Main Method --------------------

begin();

// -------------------- Functions --------------------

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
  if (tile.firstChild) {
    console.log("test");
    return randomTile();
  } else {
    const child = document.createElement("div");
    child.classList.add("tile", "popout");
    child.innerText = Math.random() <= 0.1 ? "4" : "2";
    tile.append(child);
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
  tiles = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));
} // restartGame

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      for (let col = 0; col < COLS; col++) {
        for (let row = 1; row < ROWS; row++) {
          if (!tiles[row][col].firstChild || tiles[row - 1][col].firstChild) {
            continue;
          } // if
          const currentTile = tiles[row][col];

          let currentRow = row;
          while (currentRow !== 0 && !tiles[currentRow - 1][col].firstChild) {
            currentRow--;
          } // while
          const newTile = tiles[currentRow][col];
          const newTileChild = document.createElement("div");
          newTileChild.classList.add("tile", "forwards");
          newTileChild.innerText = currentTile.firstChild.innerText;

          currentTile.removeChild(currentTile.firstChild);

          document.documentElement.style.setProperty("--ONE", "translateY(calc(var(--GAP) + var(--SIZE)))");
          document.documentElement.style.setProperty("--TWO", "translateY(calc((var(--GAP) + var(--SIZE)) * 2))");
          document.documentElement.style.setProperty("--THREE", "translateY(calc((var(--GAP) + var(--SIZE)) * 3))");

          switch (row - currentRow) {
            case 1:
              newTileChild.classList.add("slide-one");
              break;
            case 2:
              newTileChild.classList.add("slide-two");
              break;
            case 3:
              newTileChild.classList.add("slide-three");
              break;
          } // switch
          newTile.append(newTileChild);
        } // for
      } // for
      break;
    case "a":
    case "A":
    case "ArrowLeft":
      console.log("a works");
      break;
    case "s":
    case "S":
    case "ArrowDown":
      console.log("s works");
      break;
    case "d":
    case "D":
    case "ArrowRight":
      console.log("d works");
      break;
  } // switch
}); // addEventListener
