// IDEAS
// ADD WIN/LOSE GAMESCREEN
// ADD SCORE

class Grid {
	// Instance Variables:
	// gridElement
	// tiles
	// rows
	// cols
	// duration
	// numTiles
	// keyPressed

	constructor(rows, cols, duration, numTiles) {
		// this.gridElement = gridElement
		this.gridElement = document.createElement('div')
		this.gridElement.id = 'grid'
		document.body.append(this.gridElement)
		this.keyPressed = false
		this.rows = rows
		this.cols = cols
		this.numTiles = numTiles
		this.tiles = new Array(rows).fill().map(() => new Array(cols).fill(null))
		this.setDuration(duration)
		this.gridElement.style.setProperty('--ROWS', this.rows)
		this.gridElement.style.setProperty('--COLS', this.cols)
	} // constructor

	// Starts the 2048 game!
	start() {
		this.emptyCells()
		this.setSize()
		this.randomTiles(true)
		addEventListener('keydown', eventListener)
	} // start

	// Deletes the grid
	delete() {
		this.gridElement.remove()
	} // delete

	// Sets the duration of the animation
	setDuration(duration) {
		this.duration = duration
		this.gridElement.style.setProperty('--DURATION', `${this.duration}ms`)
	} // setDuration

	// Sets the size of each tile
	setSize() {
		const VIEWPORT = 75
		if (this.rows > this.cols) {
			this.gridElement.style.setProperty('--SIZE', `calc(${VIEWPORT}vmin / var(--ROWS))`)
		} else {
			this.gridElement.style.setProperty('--SIZE', `calc(${VIEWPORT}vmin / var(--COLS))`)
		} // if-else
	} // setSize

	// Fill the grid with empty gray cells (placeholders)
	emptyCells() {
		for (let i = 0; i < this.rows * this.cols; i++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
			this.gridElement.append(cell)
		} // for
	} // emptyCells

	// Spawns random tiles in the grid
	randomTiles(start = false) {
    const tilesPerMove = start ? 2 : this.numTiles
		for (let i = 0; i < tilesPerMove; i++) {
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
		} // for
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
		}, this.duration) // setTimeout
	} // resetProperties

	// Checks if the tile is in bounds
	inBounds(direction, newDim, row, col) {
		switch (direction) {
			case 'up':
				return newDim && !this.tiles[newDim - 1][col]
			case 'left':
				return newDim && !this.tiles[row][newDim - 1]
			case 'down':
				return newDim < this.rows - 1 && !this.tiles[newDim + 1][col]
			case 'right':
				return newDim < this.cols - 1 && !this.tiles[row][newDim + 1]
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
				nextTile = newDim + 1 < this.rows ? this.tiles[newDim + 1][col] : null
				break
			case 'right':
				nextTile = newDim + 1 < this.cols ? this.tiles[row][newDim + 1] : null
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

		const delay = this.duration * dist
		this.applyChanges(direction, row, col, newDim, delay, dist)
		return { delay, validMove: true }
	} // slide

	setInitialization(direction) {
		switch (direction) {
			case 'up':
			case 'left':
				return 1
			case 'down':
				return this.rows - 2
			case 'right':
				return this.cols - 2
		} // switch
	} // setInitialization

	// Checks if j is in bounds
	conditionCheck(direction, j) {
		switch (direction) {
			case 'up':
				return j < this.rows
			case 'left':
				return j < this.cols
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

		const dim = direction === 'up' || direction === 'down' ? this.cols : this.rows

		for (let i = 0; i < dim; i++) {
			let j = this.setInitialization(direction)
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
		} // for
		setTimeout(() => {
			if (validMove) {
				this.randomTiles()
				this.resetProperties()
				setTimeout(() => (this.keyPressed = false), this.duration)
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
		const num = 100 - Math.log2(this.tileElement.innerText) * 9.5
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

// ------------------------------ Settings Setup ------------------------------

const SETTINGS_DELAY = 100
const settingsPopup = document.querySelector('.settings-popup')

// Pops up a window of the settings
function openSettings() {
	const wrapper = document.querySelector('.settings-wrapper')
	wrapper.addEventListener('click', () => {
		settingsPopup.style.visibility = 'visible'
		settingsPopup.style.animation = `pop ${SETTINGS_DELAY}ms`
		window.removeEventListener('keydown', eventListener)
	}) // addEventListener
} // openSettings

// Closes and updates the settings
function closeAndUpdateSettings() {
	const close = document.querySelector('.close')
	close.addEventListener('click', () => {
		settingsPopup.style.animation = `shrink ${SETTINGS_DELAY}ms`
		setTimeout(() => (settingsPopup.style.visibility = 'hidden'), SETTINGS_DELAY)
		window.addEventListener('keydown', eventListener)

		const rows = +document.getElementById('rows').value
		const cols = +document.getElementById('cols').value
		const duration = +document.getElementById('duration').value
		const numTiles = +document.getElementById('num-tiles').value

		if (dimChanged(rows, cols)) {
			grid.delete()
			grid = new Grid(rows, cols, duration, numTiles)
			grid.start()
		} else {
			grid.setDuration(duration)
      grid.numTiles = numTiles
		} // if-else
	}) // addEventListener
} // closeSettings

// Checks to see if the dimension of the grid has changed
// If it has, the game will restart
function dimChanged(newRows, newCols) {
	return !(newRows === grid.rows && newCols === grid.cols)
} // settingsChanged

// ------------------------------ Begin Program ------------------------------

let grid = new Grid(4, 4, 75, 1)

// Makes the game play
function play() {
	grid.start()
	openSettings()
	closeAndUpdateSettings()
} // play

// Sets up the EventListener for addEventListener
// Will be used for removeEventListener
function eventListener(e) {
	switch (e.key) {
		case 'w':
		case 'W':
		case 'ArrowUp':
			return grid.update('up')
		case 'a':
		case 'A':
		case 'ArrowLeft':
			return grid.update('left')
		case 's':
		case 'S':
		case 'ArrowDown':
			return grid.update('down')
		case 'd':
		case 'D':
		case 'ArrowRight':
			return grid.update('right')
	} // switch
} // eventListener

play()
