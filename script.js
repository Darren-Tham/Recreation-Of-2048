// ADD BETTER METHOD FOR SPAWNING NEW BLOCK
// TRY TO FIT ALL IN ONE METHOD
// ADD SCORE
// CHANGE COLORS POSSIBLY

const ROWS = 4;
const COLS = 4;
const DURATION = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--DURATION"));

const board = document.getElementById("board");
const css = window.document.styleSheets[0];
let tiles = new Array(ROWS).fill().map(() => new Array(COLS).fill(null));
let nums = new Array(ROWS).fill().map(() => new Array(COLS).fill(0));
let hasMerged = new Array(ROWS).fill().map(() => new Array(COLS).fill(false));
let keyPressed = false;

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
  }); // forEach
} // setup

// Adds a random tile
function randomTile() {
  const i = Math.floor(Math.random() * ROWS);
  const j = Math.floor(Math.random() * COLS);
  const tile = tiles[i][j];
  if (tile.firstChild) {
    return randomTile();
  } else {
    const tileChild = document.createElement("div");
    tileChild.classList.add("tile", "popout");
    const num = Math.random() <= 0.1 ? 4 : 2;
    nums[i][j] = num;
    tileChild.innerText = num;
    addColor(tileChild);
    tile.append(tileChild);
    setTimeout(() => (tileChild.className = "tile"), DURATION);
  } // if-else
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
  nums = new Array(ROWS).fill().map(() => new Array(COLS).fill(0));
  resetHasMerged();
} // restartGame

// Adds a color to the tile
function addColor(tile) {
  const num = Math.log(+tile.innerText);
  tile.style.background = "hsl(20, 100%, " + (100 - num * 5) + "%)";
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

// Adds a new tile DOM element
function addNewTile(num) {
  const newTileChild = document.createElement("div");
  newTileChild.classList.add("tile");
  newTileChild.innerText = num;
  addColor(newTileChild);
  return newTileChild;
} // addNewTile

// Updates the new merged tile
function newMergedTile(tile, delay) {
  setTimeout(() => {
    tile.classList.add("merge");
    tile.innerText *= 2;
    addColor(tile);
    tile.previousSibling.remove();
  }, delay); // setTimeout
} // newMergedTile

function resetCSS(cssRulesCount) {
  for (let i = 0; i < cssRulesCount; i++) {
    css.deleteRule(css.cssRules.length - 1);
  } // for
} // resetCSS

function resetClassName(tile, delay) {
  setTimeout(() => (tile.className = "tile"), delay);
} // resetClassName

// Resets the boolean array hasMerged to all false
function resetHasMerged() {
  hasMerged = new Array(ROWS).fill().map(() => new Array(COLS).fill(false));
} // resetHasMerged

function slideAnimation(direction, distance, num, tile) {
  let axis;
  switch (direction) {
    case "up":
    case "down": {
      axis = "Y";
      break;
    } // up
    case "left":
    case "right": {
      axis = "X";
      break;
    } // left
  } // switch

  css.insertRule(
    `
    .slide-${num} {
      animation: slide-${num} calc(var(--DURATION) * ${distance}) linear;
      animation-fill-mode: forwards;
    }
  `,
    css.cssRules.length
  ); // insertRule

  if (direction === "down" || direction === "right") {
    distance *= -1;
  } // if

  css.insertRule(
    `
  @keyframes slide-${num} {
    from {
      transform: translate${axis}(calc((var(--GAP) + var(--SIZE)) * ${distance}))
    }
  }
  `,
    css.cssRules.length
  ); // insertRule

  tile.classList.add(`slide-${num}`);
} // slideAnimation

function slide(direction) {
  if (keyPressed) return;

  let maxDelay = 0;
  let validMove = false;
  keyPressed = true;
  let cssRulesCount = 0;

  switch (direction) {
    case "right": {
      rotate90();
      break;
    } // right
    case "down": {
      rotate180();
      break;
    } // down
    case "left": {
      rotate270();
    } // left
  } // switch

  for (let col = 0; col < COLS; col++) {
    for (let row = 1; row < ROWS; row++) {
      // if it is not a tile, continue
      if (!nums[row][col]) continue;

      const currentTile = tiles[row][col];
      let newRow = row;
      let overlap = false;

      // while loops breaks when it reaches the top of the board or when it reaches a tile
      while (newRow && !nums[newRow - 1][col]) {
        newRow--;
      } // while

      if (newRow && !hasMerged[newRow - 1][col] && nums[newRow - 1][col] === nums[row][col]) {
        newRow--;
        overlap = true;
      } // if

      const distance = row - newRow;
      if (!distance) continue;

      validMove = true;

      const num = nums[row][col];
      nums[newRow][col] = num;

      const newTileChild = addNewTile(num);
      tiles[newRow][col].append(newTileChild);

      currentTile.removeChild(currentTile.firstChild);
      nums[row][col] = 0;

      let delay = DURATION * distance;
      maxDelay = Math.max(maxDelay, delay);

      slideAnimation(direction, distance, cssRulesCount, newTileChild);
      cssRulesCount += 2;

      if (overlap) {
        newMergedTile(newTileChild, delay);
        nums[newRow][col] *= 2;
        hasMerged[newRow][col] = true;
        delay += DURATION;
      } // if
      resetClassName(newTileChild, delay);
    } // for
  } // for

  setTimeout(() => {
    if (validMove) {
      randomTile();
    } // if
    keyPressed = false;
    resetHasMerged();
    resetCSS(cssRulesCount);
  }, maxDelay);

  switch (direction) {
    case "right": {
      rotate270();
      break;
    } // right
    case "down": {
      rotate180();
      break;
    } // down
    case "left": {
      rotate90();
    } // left
  } // switch
} // slide

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      return slide("up");
    case "a":
    case "A":
    case "ArrowLeft":
      return slide("left");
    case "s":
    case "S":
    case "ArrowDown":
      return slide("down");
    case "d":
    case "D":
    case "ArrowRight":
      return slide("right");
  } // switch
}); // addEventListener

// Rotates arrays by 90
function rotate90() {
  tiles.map((row) => row.reverse());
  tiles = switchIndicies(tiles);

  nums.map((row) => row.reverse());
  nums = switchIndicies(nums);

  hasMerged.map((row) => row.reverse());
  hasMerged = switchIndicies(hasMerged);
} // rotate90

// Rotates arrays by 180 degrees
function rotate180() {
  for (let i = 0, j = ROWS - 1; i < j; i++, j--) {
    let temp = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = temp;

    temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;

    temp = hasMerged[i];
    hasMerged[i] = hasMerged[j];
    hasMerged[j] = temp;
  } // for
} // rotateBoard180

// Rotates arrays by 270 degrees
function rotate270() {
  tiles = switchIndicies(tiles).map((row) => row.reverse());

  nums = switchIndicies(nums).map((row) => row.reverse());

  hasMerged = switchIndicies(hasMerged).map((row) => row.reverse());
} // rotateBoard270

// Creates a new array by switching the indicies of tiles
function switchIndicies(matrix) {
  const rotatedArr = new Array(ROWS).fill().map(() => new Array(COLS).fill(null));
  tiles.forEach((row, i) => {
    for (let j in row) {
      rotatedArr[j][i] = matrix[i][j];
    } // for
  }); // forEach
  return rotatedArr;
} // switchIndicies
