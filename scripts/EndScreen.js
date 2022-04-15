import { moveEvent, settingsHoverEvent, openSettingsEvent } from './EventListeners.js'
import { grid, settings } from './script.js'
import { SETTINGS_DELAY } from './Settings.js'

const END_SCREEN_DURATION = 500
const END_SCREEN_DELAY = 500
export class EndScreen {
	// Instance Variables
	// endScreen
	// endScreenText
	// endScreenScoreWrapper
	// endScreenScore
	// endScreenButton
  // finalScore

	constructor(userWon, reason, scoreObj) {
		this.setupVar(userWon, reason, scoreObj)
		this.displayEndScreen()
		this.disableEventListeners()
	} // constructor

	// Sets up the instance variables
	setupVar(userWon, reason, scoreObj) {
		this.endScreen = document.createElement('div')
		this.endScreenText = document.createElement('div')
		this.endScreenScoreWrapper = document.createElement('div')
		this.endScreenScore = document.createElement('div')
		this.endScreenButton = document.createElement('div')
    this.score = scoreObj

		this.endScreen.classList.add('end-screen', 'popup')
		this.endScreenText.classList.add('end-screen-text')
		this.endScreenScoreWrapper.classList.add('two-grid')
		this.endScreenScore.classList.add('small-text')
		this.endScreenButton.classList.add('end-screen-button', 'flex')

		this.endScreenScoreWrapper.innerText = 'Score'
		this.endScreenScore.innerText = this.score.scoreElement.innerText
		this.endScreenScoreWrapper.append(this.endScreenScore)

		this.endScreenButton.addEventListener('click', () => this.pressEndButton())

		if (userWon) {
			this.gameWonScreen()
		} else {
			this.gameOverScreen(reason)
		} // if-else
		this.endScreen.append(this.endScreenText, this.endScreenScoreWrapper, this.endScreenButton)
		document.body.append(this.endScreen)
	} // setupVar

	// Displays the end screen
	displayEndScreen() {
		setTimeout(() => {
			this.endScreen.style.animation = `appear ${END_SCREEN_DURATION}ms ease`
			this.endScreen.style.visibility = 'visible'
		}, END_SCREEN_DELAY)
	} // displayEndScreen

	// Sets up and displays the game won screen
	gameWonScreen() {
		this.endScreen.style.background = 'rgb(255, 255, 174)'

		this.endScreenText.classList.add('flex')
		this.endScreenText.innerText = 'You Win!'

		this.endScreenButton.style.background = 'rgb(241, 241, 149)'
		this.endScreenButton.innerText = 'Continue!'
		this.endScreenButton.addEventListener('mouseenter', () => (this.endScreenButton.style.background = 'rgb(245, 245, 162)'))
		this.endScreenButton.addEventListener('mouseleave', () => (this.endScreenButton.style.background = 'rgb(241, 241, 149)'))
		this.endScreenButton.addEventListener('click', () => {
			grid.randomTiles()
			if (grid.userLoses()) {
				new EndScreen(false, 'No Available Moves', this.score)
			} // if
		}) // addEventListener
	} // gameWonScreen

	// Sets up and displays the game over screen
	gameOverScreen(reason) {
		this.endScreen.style.background = 'rgb(255, 123, 123)'

		this.endScreenText.classList.add('two-grid')
		this.endScreenText.innerText = 'Game Over!'
		const reasonDiv = document.createElement('div')
    reasonDiv.classList.add('small-text')
		reasonDiv.innerText = reason
		this.endScreenText.append(reasonDiv)

		this.endScreenButton.style.background = 'rgb(255, 182, 182)'
		this.endScreenButton.innerText = 'Restart!'
		this.endScreenButton.addEventListener('mouseenter', () => (this.endScreenButton.style.background = 'rgb(255, 212, 212)'))
		this.endScreenButton.addEventListener('mouseleave', () => (this.endScreenButton.style.background = 'rgb(255, 182, 182)'))
		this.endScreenButton.addEventListener('click', () => grid.restartGame())
	} // gameOverScreen

	// Enables the event listeneres for moving and opening settings
	enableEventListeners() {
		addEventListener('keydown', moveEvent)
		settings.dynamicEventHandlers()
	} // enableEventListeners

	// Disables the event listeners for moving and opening settings
	disableEventListeners() {
		removeEventListener('keydown', moveEvent)
		settings.settingsIcon.removeEventListener('click', openSettingsEvent)
		settings.settingsIcon.removeEventListener('mouseenter', settingsHoverEvent)
		settings.settingsIcon.style.cursor = 'default'
	} // disableEventListeners

	// When the user press the button, it will do a shrink animation and remove the endScreen in HTML
	pressEndButton() {
		this.endScreen.style.animation = `shrink ${SETTINGS_DELAY}ms`
		this.enableEventListeners()
		setTimeout(() => this.endScreen.remove(), SETTINGS_DELAY)
	} // pressEndButton
} // EndScreen
