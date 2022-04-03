const ROWS = 4
const COLS = 4
const GAP = 1.5

class Grid {
	constructor(gridElement) {
		this.gridElement = gridElement
		gridElement.style.setProperty('--ROWS', ROWS)
		gridElement.style.setProperty('--COLS', COLS)
    this.emptyCells()
	} // constructor

	emptyCells() {
		for (let i = 0; i < ROWS * COLS; i++) {
			const cell = document.createElement('div')
			cell.classList.add('cell')
      this.gridElement.append(cell)
		} // for
	} // emptyCells
} // Grid

const grid = new Grid(document.getElementById('grid'))
