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
    setTimeout(() => (tileChild.className = "tile"), DURATION);
  }
} // randomTile

// Adds a random tile after each move
function addRandomTileAfterMoves (maxDelay, validMove) {
  if (!validMove) return;

  setTimeout(() => {
    randomTile();
  }, maxDelay)
}

function test() {
  const child = document.createElement("div");
  child.classList.add("tile", "popout");
  child.innerText = "2";
  addColor(child);
  tiles[0][0].append(child);
  setTimeout(() => (child.className = "tile"), DURATION);
}

function test2() {
  const child = document.createElement("div");
  child.classList.add("tile", "popout");
  child.innerText = "4";
  addColor(child);
  tiles[1][0].append(child);
  setTimeout(() => (child.className = "tile"), DURATION);
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

// Adds the slide effect to the tile
function addSlide(tile, distance) {
  switch (distance) {
    case 1:
      tile.classList.add("slide-one");
      break;
    case 2:
      tile.classList.add("slide-two");
      break;
    case 3:
      tile.classList.add("slide-three");
  } // switch
} // addSlide

// Updates the new merged tile
function newMergedTile(tile, delay) {
  setTimeout(() => {
    const tileChild = tile.lastChild;
    tileChild.classList.add("merge");
    tileChild.innerText *= 2;
    addColor(tileChild);
    tile.removeChild(tile.firstChild);
  }, delay); // setTimeout
} // newMergedTile

// Resets the element's class name to only tile for aesthetic
function clearClassName(tile, delay, overlap) {
  if (overlap) {
    delay += DURATION;
  } // if

  setTimeout(() => {
    tile.className = "tile";
  }, delay); // setTimeout
} // clearClassName

function isTile(row, col) {
  return !tiles[row][col].firstChild;
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      let maxDelay = 0;
      let validMove = false;
      for (let col = 0; col < COLS; col++) {
        for (let row = 1; row < ROWS; row++) {
          // if it is not a tile, continue
          if (isTile(row, col)) {
            continue;
          } // if


          const currentTile = tiles[row][col];
          let newRow = row;
          let overlap = false;

          // while loop breaks when it reaches the edge of the board
          // or when it reaches a tile
          while (newRow !== 0 && !tiles[newRow - 1][col].firstChild) {
            newRow--;
          } // while

          // if the tile above is the same number, make the tile above the newTile
          if (newRow !== 0 && tiles[newRow - 1][col].firstChild?.innerText === currentTile.firstChild.innerText) {
            newRow--;
            overlap = true;
          } // if

          const distance = row - newRow;
          if (distance === 0) {
            continue;
          } else {
            validMove = true;
          } // if-else

          const newTile = tiles[newRow][col];
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

          let delay = DURATION * (distance);
          if (delay > maxDelay) {
            maxDelay = delay;
          } // if
          addSlide(newTileChild, distance);

          if (overlap) {
            newMergedTile(newTile, delay);
          } // if
          clearClassName(newTileChild, delay, overlap);
        } // for
      } // for
      addRandomTileAfterMoves(maxDelay, validMove);
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
