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