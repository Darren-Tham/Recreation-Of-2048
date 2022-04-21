import { moveEvent, settingsHoverEvent, openSettingsEvent } from './EventListeners.js'
import { grid } from './script.js'

export const SETTINGS_DELAY = 100
export class Settings {
	// Instance Variables
	// settingsPopup
	// settingsIcon
	// settingsClose
	// settingsOpened

	constructor() {
		this.settingsPopup = document.querySelector('.settings')
		this.settingsIcon = document.querySelector('.settings-icon')
		this.settingsClose = document.querySelector('.settings-close')
		this.settingsOpened = false
		this.openSettings()
	} // constructor

	// Opens the settings
	openSettings() {
		this.dynamicEventHandlers()
		this.staticEventHandlers()
	} // openSettings

	// Event Handlers used in other files
	// Will be removed and readded in other files
	dynamicEventHandlers() {
		this.settingsIcon.addEventListener('click', openSettingsEvent)
		this.settingsIcon.addEventListener('mouseenter', settingsHoverEvent)
		this.settingsIcon.style.cursor = 'pointer'
	} // dynamicEventHandlers

	// Event Handlers that are only used in this file
	// Should not be removed
	staticEventHandlers() {
		this.settingsClose.addEventListener('click', () => this.closeAndUpdateSettings())
		const defaultBackground = getComputedStyle(document.documentElement).getPropertyValue('--GRAY-BG')
		this.settingsIcon.addEventListener('mouseleave', () => (this.settingsIcon.style.background = defaultBackground))
	} // staticEventHandlers

	// Closes and updates the settings
	closeAndUpdateSettings() {
		const rows = +document.getElementById('rows').value
		const cols = +document.getElementById('cols').value
		const duration = +document.getElementById('duration').value
		const tilesPerMove = +document.getElementById('tiles-per-move').value
		if (this.settingsInvalid(rows, cols, duration, tilesPerMove)) return

		this.settingsPopup.style.animation = `shrink ${SETTINGS_DELAY}ms`
		setTimeout(() => this.settingsPopup.style.removeProperty('visibility'), SETTINGS_DELAY)
		addEventListener('keydown', moveEvent)

		if (this.dimChanged(rows, cols)) {
			grid.restartGame()
		} else {
			grid.setDuration(duration)
			grid.tilesPerMove = tilesPerMove
		} // if-else
		this.settingsOpened = false
	} // closeAndUpdateSettings

	// Checks to see if the dimension of the grid has changed
	// If it has, the game will restart
	dimChanged(rows, cols) {
		return !(rows === grid.rows && cols === grid.cols)
	} // dimChanged

	// Checks if the settings are playable
	settingsInvalid(rows, cols, duration, tilesPerMove) {
		if (rows <= 0) {
			alert('The number of rows has to be greater than 0!')
      return true
		} else if (cols <= 0) {
      alert('The number of columns has to be greater than 0!')
      return true
    } else if (rows === 1 && cols === 1) {
      alert('The number of rows and columns cannot both equal 1!')
      return true
    } else if (duration < 0) {
      alert('The duration cannot be negative!')
      return true
    } else if (tilesPerMove < 0) {
      alert('The number of tiles per move cannot be negative!')
      return true
    } // if-elif
	} // checkSettings
} // Settings
