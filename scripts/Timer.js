export class Timer {
	// Instance Variables
	// timerElement
	// stopTimer
	constructor() {
		this.timerElement = document.createElement('div')
		this.timerElement.classList.add('info')
		this.timerElement.innerText = 0
		document.querySelector('.info-wrapper').append(this.timerElement)

		this.stopTimer = false
	} // constructor

	// Starts the timer
	start() {
		setTimeout(() => {
			if (this.stopTimer) return
			this.timerElement.innerText = +this.timerElement.innerText + 1
			this.start()
		}, 1000) // setTimeout
	} // start

	// Stops the timer
	stop() {
		this.stopTimer = true
	} // stop

	// Restarts the timer
	restart() {
		this.timerElement.innerText = 0
	} // restart
} // Timer
