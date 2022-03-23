const board = document.getElementById("board");
const tiles = new Array(4).fill(null).map(() => new Array(4).fill(null));

tiles.forEach((row, i) => {
  for (let j in row) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.append(tile);
    tiles[i][j] = tile;
  };
});