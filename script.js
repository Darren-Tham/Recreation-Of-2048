const ROWS = 4
const COLS = 4
const GAP = 1.5

class Grid {
	constructor(gridElement) {
		this.gridElement = gridElement
		this.tiles = new Array(ROWS).fill().map(() => new Array(COLS).fill(null))
		this.emptyCells()

		gridElement.style.setProperty('--ROWS', ROWS)
		gridElement.style.setProperty('--COLS', COLS)
	} // constructor

	emptyCells() {
		for (let i = 0; i < ROWS * COLS; i++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			this.gridElement.append(cell)
		} // for
	} // emptyCells

	randomTile() {
		const availableCells = []
		this.tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (!tile) {
					availableCells.push({ x, y })
				} // if
			}) // forEach
		}) // forEach
		const randomCoord = availableCells[Math.floor(Math.random() * availableCells.length)]

		const randomTile = new Tile(randomCoord.x, randomCoord.y)
		this.tiles[randomCoord.y][randomCoord.x] = randomTile.tile
		this.gridElement.append(randomTile.tile)
	} // randomTile
} // Grid

class Tile {
	constructor(x, y) {
		this.tile = document.createElement('div')
		this.tile.classList.add('tile')
		this.tile.innerText = Math.random() <= 0.1 ? 4 : 2
		this.addColor()
		this.tile.style.setProperty('--X', x)
		this.tile.style.setProperty('--Y', y)
	} // constructor

	addColor() {
    const num = 100 - Math.log(this.tile.innerText) * 5
		this.tile.style.background = `hsl(200, 100%, ${num}%)`
	}
} // Tile

const grid = new Grid(document.getElementById('grid'))
grid.randomTile()
grid.randomTile()
