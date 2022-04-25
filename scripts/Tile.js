export class Tile {
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
				background = '#d0facf'
				break
			case '4':
				background = '#c9fffa'
				break
			case '8':
				background = '#ff91a5'
				break
			case '16':
				background = '#d3bdff'
				break
			case '32':
				background = '#ffc9ed'
				break
			case '64':
				background = '#ffcccc'
				break
			case '128':
				background = '#ffffd6'
				break
			case '256':
				background = '#ffb0ff'
				break
			case '512':
				background = '#a1cbff'
				break
			case '1024':
				background = '#ffd5ad'
				break
			case '2048':        
				background = '#f4ffb8'
				break
			default:
				background = '#fffef7'
		} // switch
		this.tileElement.style.background = background
	} // addColor

	// Applies the merge animation
	merge(delay, score) {
		this.tileElement.style.setProperty('--DELAY', `${delay}ms`)
		this.tileElement.style.zIndex = 1
		this.tileElement.classList.add('merge')
		this.tileElement.style.animation = 'merge var(--DURATION) ease var(--DELAY)'

		setTimeout(() => {
			const num = this.tileElement.innerText * 2
			this.tileElement.innerText = num
			this.addColor()
			this.tileElement.style.removeProperty('z-index')
      score.updateScore(num)
		}, delay) //setTimeout
	} // merge

	// Removes the DOM element
	remove(delay) {
		setTimeout(() => {
			this.tileElement.remove()
		}, delay) // setTimeout
	} // remove
} // Tile