import { Tile } from './Tile.js'
import { Score } from './Score.js'
import { moveEvent } from './EventListeners.js'
import { EndScreen } from './EndScreen.js'
import { Timer } from './Timer.js'

export class Grid {
	// Instance Variables:
	// gridElement
	// tiles
	// rows
	// cols
	// duration
	// tilesPerMove
	// score
	// keyPressed
	// userAlreadyWon
	// timerHasStarted

	constructor() {
		this.setupVar()
		addEventListener('keydown', moveEvent)
	} // constructor

	testColors() {
		this.emptyCells()
		this.setSize()

		let count = 2
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				const testTile = new Tile(i, j)
				testTile.tileElement.innerText = count
				testTile.addColor()
				this.tiles[i][j] = testTile
				this.gridElement.append(testTile.tileElement)
				count *= 2
			}
		}
	}

	testWin() {
		this.emptyCells()
		this.setSize()

		for (let i = 0; i < 2; i++) {
			const testTile = new Tile(i, 0)
			testTile.tileElement.innerText = 1024
			testTile.addColor()
			this.tiles[i][0] = testTile
			this.gridElement.append(testTile.tileElement)
		}
	}

	testLose() {
		this.emptyCells()
		this.setSize()

		let count = 2
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const testTile = new Tile(i, j)
				testTile.tileElement.innerText = count !== 2048 ? count : 1024
				testTile.addColor()
				this.tiles[i][j] = testTile
				this.gridElement.append(testTile.tileElement)
				count *= 2
			}
		}
	}

	// Sets up the instance variables used in this class
	setupVar() {
		this.gridElement = document.createElement('div')
		this.gridElement.id = 'grid'
		this.score = new Score()
		this.timer = new Timer()
		document.body.append(this.gridElement)

		this.rows = +document.getElementById('rows').value
		this.cols = +document.getElementById('cols').value
		this.gridElement.style.setProperty('--ROWS', this.rows)
		this.gridElement.style.setProperty('--COLS', this.cols)
		this.setDuration(+document.getElementById('duration').value)
		this.tilesPerMove = +document.getElementById('tiles-per-move').value
		this.tiles = new Array(this.rows).fill().map(() => new Array(this.cols).fill(null))

		this.keyPressed = false
		this.userAlreadyWon = false
		this.timerHasStarted = false
	} // setupVar

	// Starts the 2048 game!
	start() {
		this.emptyCells()
		this.setSize()
		this.randomTiles(true)
		if (this.userLoses()) {
			new EndScreen(false, 'No Available Moves', this.score, this.timer)
		} // if
	} // start

	// Restarts the game
	restartGame() {
		this.gridElement.remove()
		this.score.scoreElement.remove()
    this.timer.timerElement.remove()
		this.setupVar()
		this.start()
	} // restartGame

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
		const tilesPerMove = start ? 2 : this.tilesPerMove
		for (let i = 0; i < tilesPerMove; i++) {
			const availableCells = []
			this.tiles.forEach((row, y) => {
				row.forEach((tile, x) => {
					if (!tile) {
						availableCells.push({ x, y })
					} // if
				}) // forEach
			}) // forEach
			if (availableCells.length === 0) return new EndScreen(false, 'No Location For New Tile', this.score, this.timer)

			const randomCoord = availableCells[Math.floor(Math.random() * availableCells.length)]
			const randomTile = new Tile(randomCoord.y, randomCoord.x)
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
	inBounds(direction, newDim, otherDim) {
		switch (direction) {
			case 'up':
				return newDim && !this.tiles[newDim - 1][otherDim]
			case 'left':
				return newDim && !this.tiles[otherDim][newDim - 1]
			case 'down':
				return newDim < this.rows - 1 && !this.tiles[newDim + 1][otherDim]
			case 'right':
				return newDim < this.cols - 1 && !this.tiles[otherDim][newDim + 1]
		} // switch
	} // checkInBounds

	// Gets the next tile in relation to the direction
	getNextTile(direction, newDim, otherDim) {
		switch (direction) {
			case 'up':
				return newDim - 1 >= 0 ? this.tiles[newDim - 1][otherDim] : null
			case 'left':
				return newDim - 1 >= 0 ? this.tiles[otherDim][newDim - 1] : null
			case 'down':
				return newDim + 1 < this.rows ? this.tiles[newDim + 1][otherDim] : null
			case 'right':
				return newDim + 1 < this.cols ? this.tiles[otherDim][newDim + 1] : null
		} // switch
	} // getNextTile

	// Returns true if the next tile is the same number as the current tile
	sameNum(direction, newDim, otherDim, currentTileNum) {
		return currentTileNum === this.getNextTile(direction, newDim, otherDim)?.tileElement.innerText
	} // sameNum

	// Checks if the tile can merge with another tile
	canMerge(direction, newDim, otherDim, currentTileNum) {
		const nextTile = this.getNextTile(direction, newDim, otherDim)
		return this.sameNum(direction, newDim, otherDim, currentTileNum) && !nextTile.tileElement.classList.contains('merge')
	} // checkCanMerge

	// Updates newDim
	updateNewDim(direction, newDim) {
		return direction === 'down' || direction === 'right' ? newDim + 1 : newDim - 1
	} // updateNewDim

	// Get new dimension of tile
	getNewDim(direction, row, col) {
		const currentTileNum = this.tiles[row][col].tileElement.innerText
		const otherDim = direction === 'up' || direction === 'down' ? col : row
		let newDim = direction === 'up' || direction === 'down' ? row : col
		while (this.inBounds(direction, newDim, otherDim)) {
			newDim = this.updateNewDim(direction, newDim)
		} // while
		if (this.canMerge(direction, newDim, otherDim, currentTileNum)) {
			newDim = this.updateNewDim(direction, newDim)
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
		let firstDim, secondDim
		switch (direction) {
			case 'up':
			case 'down':
				firstDim = newDim
				secondDim = col
				break
			case 'left':
			case 'right':
				firstDim = row
				secondDim = newDim
				break
		} // switch
		if (this.tiles[firstDim][secondDim]) {
			this.tiles[firstDim][secondDim].remove(delay)
			currentTile.merge(delay, this.score)
		} // if
		currentTile.changePosition(firstDim, secondDim)
		currentTile.addDuration(dist)

		this.tiles[firstDim][secondDim] = currentTile
		this.tiles[row][col] = null
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

		if (!this.timerHasStarted) {
			this.timer.start()
			this.timerHasStarted = true
		} // if
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
				setTimeout(() => (this.keyPressed = false), this.duration)
				if (this.userWins() && !this.userAlreadyWon) {
					this.userAlreadyWon = true
					return new EndScreen(true, '', this.score, this.timer)
				} // if
				this.randomTiles()
				this.resetProperties()
				if (this.userLoses()) {
					new EndScreen(false, 'No Available Moves', this.score, this.timer)
				} // if
			} else {
				this.keyPressed = false
			} // if-else
		}, maxDelay) // setTimeout
	} // update

	// Checks if the user wins by getting 2048
	userWins() {
		return this.tiles.some(row => {
			if (row.some(e => e?.tileElement.innerText === '2048')) return true
		}) // some
	} // userWins

	// Checks if the user loses by having no available moves
	userLoses() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				const currentTile = this.tiles[i][j]
				if (!currentTile) return false

				const currentNum = currentTile.tileElement.innerText
				const canMoveUp = this.canMove('up', i, j, currentNum)
				const canMoveLeft = this.canMove('left', j, i, currentNum)
				const canMoveDown = this.canMove('down', i, j, currentNum)
				const canMoveRight = this.canMove('right', j, i, currentNum)
				const canMove = canMoveUp || canMoveLeft || canMoveDown || canMoveRight
				if (canMove) return false
			} // for
		} // for
		return true
	} // userLoses

	// Returns true if the tile can move in a particular direction
	canMove(direction, newDim, otherDim, num) {
		return this.sameNum(direction, newDim, otherDim, num) || this.inBounds(direction, newDim, otherDim)
	} // canMove
} // Grid
