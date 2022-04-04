const ROWS = 4
const COLS = 4
const DURATION = 500

class Grid {
	constructor(gridElement) {
		this.gridElement = gridElement
		this.tiles = new Array(ROWS).fill().map(() => new Array(COLS).fill(null))
		this.emptyCells()

		gridElement.style.setProperty('--ROWS', ROWS)
		gridElement.style.setProperty('--COLS', COLS)
		gridElement.style.setProperty('--DURATION', `${DURATION}ms`)
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
		this.tiles[randomCoord.y][randomCoord.x] = randomTile
		this.gridElement.append(randomTile.tile)
	} // randomTile

	// Returns the new row of the tile
	getNewRow(row, col) {
		let newRow = row
		// while loop breaks when it reaches the edge of the board
		// or when it reaches a tile
		while (newRow && !this.tiles[newRow - 1][col]) {
			newRow--
		} // while

		// if the next tile has the same number as the currentTile and
		// it has not merged yet
		if (newRow && this.tiles[row][col]?.tile?.innerText === this.tiles[newRow - 1][col]?.tile?.innerText) {
			newRow--
		} // if
		return newRow
	} // getNewRow

	update() {
		for (let col = 0; col < COLS; col++) {
			for (let row = 1; row < ROWS; row++) {
				const currentTile = this.tiles[row][col]
				// if it is not a tile, continue
				if (!currentTile) continue

				const newRow = this.getNewRow(row, col)

				const dist = row - newRow
				if (!dist) continue

				if (this.tiles[newRow][col]) {
					this.tiles[newRow][col].remove(dist)
					currentTile.merge(dist)
				} // if

				currentTile.changePosition(col, newRow)
				currentTile.addDuration(dist)

				this.tiles[newRow][col] = currentTile
				this.tiles[row][col] = null
			} // for
		} // for
	} // update
} // Grid

class Tile {
	constructor(x, y) {
		this.tile = document.createElement('div')
		this.tile.classList.add('tile')
		this.tile.innerText = Math.random() <= 0.1 ? 4 : 2
		this.addColor()
		this.changePosition(x, y)
	} // constructor

	// Changes coordinates of tile
	changePosition(x, y) {
		this.tile.style.setProperty('--X', x)
		this.tile.style.setProperty('--Y', y)
	} // changePosition

	// Adds duration speed when sliding
	addDuration(dist) {
		this.tile.style.setProperty('--DIST', dist)
	} // changeDuration

	// Adds a color to a tile
	addColor() {
		const num = 100 - Math.log(this.tile.innerText) * 5
		this.tile.style.background = `hsl(200, 100%, ${num}%)`
	} // addColor

	// Applies the merge animation
	merge(dist) {
    const delay = DURATION * dist
    this.tile.style.setProperty('--DELAY', `${delay}ms`)
		this.tile.style.zIndex = 1
    this.tile.classList.add('merge')

		setTimeout(() => {
			this.tile.innerText *= 2
			this.addColor()
			this.tile.style.removeProperty('z-index')
		}, delay)
	} // merge

	remove(dist) {
		setTimeout(() => {
			this.tile.remove()
		}, DURATION * dist)
	}
} // Tile

addEventListener('keydown', e => {
	switch (e.key) {
		case 'w':
		case 'W':
		case 'ArrowUp':
			grid.update()
			break
		case 'a':
		case 'A':
		case 'ArrowLeft':
			break
		case 's':
		case 'S':
		case 'ArrowDown':
			break
		case 'd':
		case 'D':
		case 'ArrowRight':
			break
	} // switch
}) // addEventListener

const grid = new Grid(document.getElementById('grid'))
grid.randomTile()
grid.randomTile()
