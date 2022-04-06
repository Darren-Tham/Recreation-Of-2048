// IDEAS
// ADD WIN/LOSE GAMESCREEN
// ADD SCORE
// MAKE SETTING TAB (CHANGE COLOR, CHANGE SIZE, CHANGE DURATION, CHANGE NUMBER OF TILES SPAWNING)

const ROWS = 4
const COLS = 4
const DURATION = 100

class Grid {
	// Instance Variables:
	// gridElement
	// tiles
	// keyPressed

	constructor(gridElement) {
		this.gridElement = gridElement
		this.tiles = new Array(ROWS).fill().map(() => new Array(COLS).fill(null))
		this.keyPressed = false
		this.emptyCells()

		gridElement.style.setProperty('--ROWS', ROWS)
		gridElement.style.setProperty('--COLS', COLS)
		gridElement.style.setProperty('--DURATION', `${DURATION}ms`)
	} // constructor

	// Fill the grid with empty gray cells (placeholders)
	emptyCells() {
		for (let i = 0; i < ROWS * COLS; i++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			this.gridElement.append(cell)
		} // for
	} // emptyCells

	// Spawns a random tile in the grid
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
		this.gridElement.append(randomTile.tileElement)
	} // randomTile

	// Removes most properties from tiles to keep clean
	resetProperties() {
		setTimeout(() => {
			this.tiles.forEach(row => {
				row.map(tile => {
					if (tile) {
						const tileElement = tile.tileElement
						tileElement.classList.remove('merge')
						tileElement.style.removeProperty('animation')
						tileElement.style.removeProperty('--DELAY')
						tileElement.style.removeProperty('--DIST')
					}
				}) // map
			}) // forEach
		}, DURATION) // setTimeout
	} // resetProperties

	// Checks if the tile is in bounds
	inBounds(direction, newDim, row, col) {
		switch (direction) {
			case 'up':
				return newDim && !this.tiles[newDim - 1][col]
			case 'left':
				return newDim && !this.tiles[row][newDim - 1]
			case 'down':
				return newDim < ROWS - 1 && !this.tiles[newDim + 1][col]
			case 'right':
				return newDim < COLS - 1 && !this.tiles[row][newDim + 1]
		} // switch
	} // checkInBounds

	// Checks if the tile can merge with another tile
	canMerge(direction, newDim, row, col) {
		const currentTile = this.tiles[row][col]
		let nextTile
		switch (direction) {
			case 'up':
				nextTile = newDim - 1 >= 0 ? this.tiles[newDim - 1][col] : null
				break
			case 'left':
				nextTile = newDim - 1 >= 0 ? this.tiles[row][newDim - 1] : null
				break
			case 'down':
				nextTile = newDim + 1 < ROWS ? this.tiles[newDim + 1][col] : null
				break
			case 'right':
				nextTile = newDim + 1 < COLS ? this.tiles[row][newDim + 1] : null
				break
		} // switch
		return currentTile.tileElement.innerText === nextTile?.tileElement.innerText && !nextTile.tileElement.classList.contains('merge')
	} // checkCanMerge

	// Get new dimension of tile
	getNewDim(direction, row, col) {
    let newDim = direction === 'up' || direction === 'down' ? row : col
		while (this.inBounds(direction, newDim, row, col)) {
			newDim = direction === 'down' || direction === 'right' ? newDim + 1 : newDim - 1
		} // while
		if (this.canMerge(direction, newDim, row, col)) {
			newDim = direction === 'down' || direction === 'right' ? newDim + 1 : newDim - 1
		} // if
		return newDim
	} // getNewRow

	// Gets the distance from old dimension to new dimension
	getDist(direction, row, col, newDim) {
		switch (direction) {
			case 'up':
			case 'down':
				return Math.abs(row - newDim)
			case 'left':
			case 'right':
				return Math.abs(col - newDim)
		} // switch
	} // getDist

	// Applies changes to the new tile
	// Removes old tile, add merge effect to new tile, change position, add duration
	applyChanges(direction, row, col, newDim, delay, dist) {
		const currentTile = this.tiles[row][col]
		switch (direction) {
			case 'up':
			case 'down':
				if (this.tiles[newDim][col]) {
					this.tiles[newDim][col].remove(delay)
					currentTile.merge(delay)
				} // if
				currentTile.changePosition(col, newDim)
				currentTile.addDuration(dist)

				this.tiles[newDim][col] = currentTile
				this.tiles[row][col] = null
				break
			case 'left':
			case 'right':
				if (this.tiles[row][newDim]) {
					this.tiles[row][newDim].remove(delay)
					currentTile.merge(delay)
				} // if
				currentTile.changePosition(newDim, row)
				currentTile.addDuration(dist)

				this.tiles[row][newDim] = currentTile
				this.tiles[row][col] = null
				break
		} // switch
	} // applyChanges

	// Sliding the tiles together
	slide(direction, row, col) {
		if (!this.tiles[row][col]) return { delay: 0, validMove: false }

		const newDim = this.getNewDim(direction, row, col)
		const dist = this.getDist(direction, row, col, newDim)
		if (!dist) return { delay: 0, validMove: false }

		const delay = DURATION * dist
		this.applyChanges(direction, row, col, newDim, delay, dist)
		return { delay, validMove: true }
	} // slide

	setInitialization(direction) {
		switch (direction) {
			case 'up':
			case 'left':
				return 1
			case 'down':
				return ROWS - 2
			case 'right':
				return COLS - 2
		} // switch
	} // setInitialization

	// Checks if j is in bounds
	conditionCheck(direction, j) {
		switch (direction) {
			case 'up':
				return j < ROWS
			case 'left':
				return j < COLS
			case 'down':
			case 'right':
				return j >= 0
		} // direction
	} // conditionCheck

	// Updates board when user does a valid action
	update(direction) {
		if (this.keyPressed) return

		this.keyPressed = true
		let maxDelay = 0
		let validMove = false

		const dim = direction === 'up' || direction === 'down' ? COLS : ROWS
		let j = this.setInitialization(direction)

		for (let i = 0; i < dim; i++) {
			while (this.conditionCheck(direction, j)) {
				const obj = direction === 'up' || direction === 'down' ? this.slide(direction, j, i) : this.slide(direction, i, j)
				maxDelay = Math.max(maxDelay, obj.delay)
				validMove = validMove ? true : obj.validMove
				if (direction === 'up' || direction === 'left') {
					j++
				} else {
					j--
				} // if-else
			} // while
			j = this.setInitialization(direction)
		} // for
		setTimeout(() => {
			if (validMove) {
				this.randomTile()
				this.resetProperties()
				setTimeout(() => (this.keyPressed = false), DURATION)
			} else {
				this.keyPressed = false
			} // if-else
		}, maxDelay) // setTimeout
	} // update
} // Grid

class Tile {
	// Instance Variable
	// tileElement - DOM Element

	constructor(x, y) {
		this.tileElement = document.createElement('div')
		this.tileElement.classList.add('tile')
		this.tileElement.innerText = Math.random() <= 0.1 ? 4 : 2
		this.tileElement.style.animation = 'popout var(--DURATION)'
		this.addColor()
		this.changePosition(x, y)
	} // constructor

	// Changes coordinates of tile
	changePosition(x, y) {
		this.tileElement.style.setProperty('--X', x)
		this.tileElement.style.setProperty('--Y', y)
	} // changePosition

	// Adds duration speed when sliding
	addDuration(dist) {
		this.tileElement.style.setProperty('--DIST', dist)
	} // changeDuration

	// Adds a color to a tile
	addColor() {
		const num = 100 - Math.log(this.tileElement.innerText) * 5
		this.tileElement.style.background = `hsl(200, 100%, ${num}%)`
	} // addColor

	// Applies the merge animation
	merge(delay) {
		this.tileElement.style.setProperty('--DELAY', `${delay}ms`)
		this.tileElement.style.zIndex = 1
		this.tileElement.classList.add('merge')
		this.tileElement.style.animation = 'merge var(--DURATION) ease var(--DELAY)'

		setTimeout(() => {
			this.tileElement.innerText *= 2
			this.addColor()
			this.tileElement.style.removeProperty('z-index')
		}, delay) //setTimeout
	} // merge

	// Removes the DOM element
	remove(delay) {
		setTimeout(() => {
			this.tileElement.remove()
		}, delay) // setTimeout
	} // remove
} // Tile

// ------------------------------ Begin Program ------------------------------

const grid = new Grid(document.getElementById('grid'))
grid.randomTile()
grid.randomTile()

addEventListener('keydown', e => {
	switch (e.key) {
		case 'w':
		case 'W':
		case 'ArrowUp':
			grid.update('up')
			break
		case 'a':
		case 'A':
		case 'ArrowLeft':
			grid.update('left')
			break
		case 's':
		case 'S':
		case 'ArrowDown':
			grid.update('down')
			break
		case 'd':
		case 'D':
		case 'ArrowRight':
			grid.update('right')
			break
	} // switch
}) // addEventListener
