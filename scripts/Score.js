export class Score {
	// Instance Variables
	// scoreElement

	constructor() {
		this.scoreElement = document.createElement('div')
		this.scoreElement.classList.add('info')
		this.scoreElement.innerText = 0

		document.querySelector('.info-wrapper').append(this.scoreElement)
	} // constructor

	// Updates the user's score when tiles merge
	updateScore(num) {
		this.scoreElement.innerText = +this.scoreElement.innerText + num
	} // updateScore
} // Score
