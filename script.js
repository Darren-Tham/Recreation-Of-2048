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

	testColors() {
		this.emptyCells()
		this.setSize()
		addEventListener('keydown', moveEvent)

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
		addEventListener('keydown', moveEvent)

		for (let i = 0; i < 2; i++) {
			const testTile = new Tile(i, 0)
			testTile.tileElement.innerText = 1024
			testTile.addColor()
			this.tiles[i][0] = testTile
			this.gridElement.append(testTile.tileElement)
		}
	}

	// Starts the 2048 game!
	start() {
		this.emptyCells()
		this.setSize()
		this.randomTiles(true)
		addEventListener('keydown', moveEvent)
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
			currentTile.merge(delay)
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
				this.checkState()
				setTimeout(() => (this.keyPressed = false), this.duration)
			} else {
				this.keyPressed = false
			} // if-else
		}, maxDelay) // setTimeout
	} // update

	// Checks if the game ends
	checkState() {
		if (this.userWins() || this.userLoses()) {
			const endScreen = document.querySelector('.end-screen')
			const endScreenText = document.querySelector('.end-screen-text')
			const endScreenButton = document.querySelector('.end-screen-button')

			this.displayEndScreen(endScreen)
			this.disableEventListeners()

			if (this.userWins()) {
				this.gameWon(endScreen, endScreenText, endScreenButton)
			} else {
				this.gameOver(endScreen, endScreenText, endScreenButton)
			} // if-else
		} // if
	} // checkState

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
				if (!currentTile) continue

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

	// Displays the end screen
	displayEndScreen(endScreen) {
		setTimeout(() => {
			endScreen.style.animation = `appear 500ms ease`
			endScreen.style.visibility = 'visible'
		}, 500)
		const finalScore = document.querySelector('.final-score')
		finalScore.innerText = score.innerText
	} // displayEndScreen

	// Displays the game won screen
	gameWon(endScreen, endScreenText, endScreenButton) {
		endScreen.style.background = 'rgb(255, 255, 174)'
		endScreenButton.style.background = 'rgb(241, 241, 149)'
		endScreenButton.addEventListener('mouseenter', () => (endScreenButton.style.background = 'rgb(245, 245, 162)'))
		endScreenButton.addEventListener('mouseleave', () => (endScreenButton.style.background = 'rgb(241, 241, 149)'))
		endScreenText.innerText = 'You Win!'
		endScreenButton.innerText = 'Continue!'
	} // gameWon

	// Displays the game over screen
	gameOver(endScreen, endScreenText, endScreenButton) {
		endScreen.style.background = 'rgb(255, 123, 123)'
		endScreenButton.style.background = 'rgb(255, 182, 182)'
		endScreenButton.addEventListener('mouseenter', () => (endScreenButton.style.background = 'rgb(255, 212, 212)')) // addEventListener
		endScreenButton.addEventListener('mouseleave', () => (endScreenButton.style.background = 'rgb(255, 182, 182)'))
		endScreenText.innerText = 'Game Over!'
		endScreenButton.innerText = 'Restart!'
	} // gameOver

	// Enables the event listeners for moving and opening settings
	enableEventListeners() {
		window.addEventListener('keydown', moveEvent)
		openSettings()
	} // enableEventListeners

	// Disables the event listeners for moving and opening settings
	disableEventListeners() {
		window.removeEventListener('keydown', moveEvent)
		settingsWrapper.removeEventListener('click', openSettingsEvent)
	} // disableEventListeners
} // Grid

class Tile {
	// Instance Variable
	// tileElement - DOM Element

	constructor(y, x) {
		this.tileElement = document.createElement('div')
		this.tileElement.classList.add('flex', 'tile')
		this.tileElement.innerText = Math.random() <= 0.1 ? 4 : 2
		this.tileElement.style.animation = 'appear var(--DURATION)'
		this.addColor()
		this.changePosition(y, x)
	} // constructor

	// Changes coordinates of tile
	changePosition(y, x) {
		this.tileElement.style.setProperty('--X', x)
		this.tileElement.style.setProperty('--Y', y)
	} // changePosition

	// Adds duration speed when sliding
	addDuration(dist) {
		this.tileElement.style.setProperty('--DIST', dist)
	} // changeDuration

	// Adds a color to a tile
	addColor() {
		const num = this.tileElement.innerText
		let background
		switch (num) {
			case '2':
				background = '#d4f0ff'
				break
			case '4':
				background = '#bbe6fc'
				break
			case '8':
				background = '#9dd6f2'
				break
			case '16':
				background = '#84d0f5'
				break
			case '32':
				background = '#69c4f0'
				break
			case 64:
				background = '#49adde'
				break
			case '128':
				background = '#309acf'
				break
			case '256':
				background = '#1b8ac2'
				break
			case '512':
				background = '#0f7fb8'
				break
			case '1024':
				background = '#036fa6'
				break
			case '2048':
				background = '#0362a6'
				break
			default:
				background = '#03518a'
		} // switch
		this.tileElement.style.background = background
	} // addColor

	// Applies the merge animation
	merge(delay) {
		this.tileElement.style.setProperty('--DELAY', `${delay}ms`)
		this.tileElement.style.zIndex = 1
		this.tileElement.classList.add('merge')
		this.tileElement.style.animation = 'merge var(--DURATION) ease var(--DELAY)'

		setTimeout(() => {
			const num = this.tileElement.innerText * 2
			this.tileElement.innerText = num
			this.addColor()
			this.tileElement.style.removeProperty('z-index')
			this.updateScore(num)
		}, delay) //setTimeout
	} // merge

	// Updates the score when tiles merge
	updateScore(num) {
		score.innerText = +score.innerText + num
	} // updateScore

	// Removes the DOM element
	remove(delay) {
		setTimeout(() => {
			this.tileElement.remove()
		}, delay) // setTimeout
	} // remove
} // Tile

// ------------------------------ Settings Setup ------------------------------

const SETTINGS_DELAY = 100
const settings = document.querySelector('.settings')
const settingsWrapper = document.querySelector('.settings-wrapper')
const close = document.querySelector('.close')
let settingsOpened = false

// Pops up a window of the settings
function openSettings() {
	settingsWrapper.addEventListener('click', openSettingsEvent)
	settingsHover()
} // openSettings

// Closes and updates the settings
function closeAndUpdateSettings() {
	settings.style.animation = `shrink ${SETTINGS_DELAY}ms`
	setTimeout(() => settings.style.removeProperty('visibility'), SETTINGS_DELAY)
	addEventListener('keydown', moveEvent)

	const rows = +document.getElementById('rows').value
	const cols = +document.getElementById('cols').value
	const duration = +document.getElementById('duration').value
	const numTiles = +document.getElementById('num-tiles').value

	if (dimChanged(rows, cols)) {
		grid.delete()
		grid = new Grid(rows, cols, duration, numTiles)
		grid.start()
		score.innerText = 0
	} else {
		grid.setDuration(duration)
		grid.numTiles = numTiles
	} // if-else
  settingsOpened = false
} // closeSettings

// Checks to see if the dimension of the grid has changed
// If it has, the game will restart
function dimChanged(newRows, newCols) {
	return !(newRows === grid.rows && newCols === grid.cols)
} // settingsChanged

// Creates a hover effect over the settings icon
function settingsHover() {
	settingsWrapper.addEventListener('mouseenter', settingsHoverEvent)

	const defaultBackground = getComputedStyle(document.documentElement).getPropertyValue('--GRAY-BG')
	settingsWrapper.addEventListener('mouseleave', () => (settingsWrapper.style.background = defaultBackground))
} // settingsHover

// ------------------------------ EventListeners ------------------------------

// Sets up the EventListener for moving the tiles
// Will be used for removeEventListener
function moveEvent(e) {
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

// Sets up the EventListener for opening the settings
function openSettingsEvent() {
	if (!settingsOpened) {
		settings.style.visibility = 'visible'
		settings.style.animation = `pop ${SETTINGS_DELAY}ms`
		removeEventListener('keydown', moveEvent)
		settingsOpened = true
	} else {
		closeAndUpdateSettings()
	} // if-else
} // openSettingsEvent

// Sets up the EventListener for hovering over the settings icon
function settingsHoverEvent() {
	settingsWrapper.style.background = 'hsl(200, 0%, 80%)'
} // settingsHoverEvent

// ------------------------------ Begin Program ------------------------------

const score = document.querySelector('.score')
let grid = new Grid(4, 4, 75, 1)

// Makes the game play
function play() {
	grid.testWin()
	openSettings()
	close.addEventListener('click', closeAndUpdateSettings)
} // play

play()
