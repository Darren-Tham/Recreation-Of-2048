const ROWS = 4;
const COLS = 4;
const DURATION = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--DURATION"));
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
    return randomTile();
  } else {
    const tileChild = document.createElement("div");
    tileChild.classList.add("tile", "popout");
    tileChild.innerText = Math.random() <= 0.1 ? "4" : "2";
    addColor(tileChild);
    tile.append(tileChild);
    setTimeout(() => tileChild.className = "tile", DURATION);
  }
} // randomTile

function test() {
  const child = document.createElement("div");
  child.classList.add("tile", "popout");
  child.innerText = "2";
  addColor(child);
  tiles[0][0].append(child);
}

function test2() {
  const child = document.createElement("div");
  child.classList.add("tile", "popout");
  child.innerText = "2";
  addColor(child);
  tiles[1][0].append(child);
}

// Setup the board using setup() and add two random tiles in the board
// If two tiles are 4, then the game will restart
function begin() {
  setup();

  randomTile();
  randomTile();
  /*
  test();
  test2();
  */

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

// Adds a color to the tile
function addColor(tile) {
  tile.style.background = "hsl(200, 100%, " + (100 - +tile.innerText * 5) + "%)";
} // addColor

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      for (let col = 0; col < COLS; col++) {
        for (let row = 1; row < ROWS; row++) {
          // if it is not a tile, continue
          if (!tiles[row][col].firstChild) {
            continue;
          } // if

          const currentTile = tiles[row][col];
          let currentRow = row;
          let overlap = false;

          // while loop breaks when it reaches the edge of the board
          // or when it reaches a tile
          while (currentRow !== 0 && !tiles[currentRow - 1][col].firstChild) {
            currentRow--;
          } // while

          // if the tile above is the same number, make the tile above the newTile
          if (currentRow !== 0 && tiles[currentRow - 1][col].firstChild?.innerText === currentTile.firstChild?.innerText) {
            currentRow--;
            overlap = true;
          } // if

          const newTile = tiles[currentRow][col];
          const newTileChild = document.createElement("div");
          newTileChild.classList.add("tile");
          newTileChild.innerText = currentTile.firstChild.innerText;
          addColor(newTileChild);

          currentTile.removeChild(currentTile.firstChild);
          newTile.append(newTileChild);

          // Setting up sliding duration
          document.documentElement.style.setProperty("--ONE", "translateY(calc(var(--GAP) + var(--SIZE)))");
          document.documentElement.style.setProperty("--TWO", "translateY(calc((var(--GAP) + var(--SIZE)) * 2))");
          document.documentElement.style.setProperty("--THREE", "translateY(calc((var(--GAP) + var(--SIZE)) * 3))");

          let delay;

          switch (row - currentRow) {
            case 1:
              newTileChild.classList.add("slide-one");
              delay = DURATION;
              break;
            case 2:
              newTileChild.classList.add("slide-two");
              delay = DURATION * 2;
              break;
            case 3:
              newTileChild.classList.add("slide-three");
              delay = DURATION * 3;
          } // switch

          // CHANGE TO CORRECT COLOR AND CHANGE NUMBER. REMOVE OLD CHILD AND CLEAR CLASS TAGS
          // FIX TRANSITION
          // I WAS REALLY TIRED AND WENT TO SLEEP BECAUSE BADMINTON
          // GOOD LUCK FUTURUE ME!!! YOU GOT THIS :)

          if (overlap) {
            setTimeout(() => {
              newTileChild.classList.add("merge");
              newTileChild.innerText *= 2;
              addColor(newTileChild);
              newTile.removeChild(newTile.firstChild);
            }, delay);
            setTimeout(() => {
              newTileChild.className = "tile";
            }, delay + DURATION);
          } // if
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
