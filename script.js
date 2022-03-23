const board = document.getElementById("board");
const tiles = new Array(4).fill(null).map(() => new Array(4).fill(null));

// Setting up tiles array and HTML document
tiles.forEach((row, i) => {
  for (let j in row) {
    const tile = document.createElement("div");
    tile.classList.add("tile-setup");
    board.append(tile);
    tiles[i][j] = tile;
  } // for
});

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

randomTile();
randomTile();

window.addEventListener("keydown", (e) => {
  if (e.key == "w" || e.key == "W") console.log("test");
});
