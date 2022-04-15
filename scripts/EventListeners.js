import { grid, settings } from './script.js'
import { SETTINGS_DELAY } from './Settings.js'

// Moves the tiles
export function moveEvent(evt) {  
	switch (evt.key) {
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
} // moveEvent

// Sets up the EventListener for hovering over the settings icon
export function settingsHoverEvent() {
	settings.settingsIcon.style.background = 'hsl(200, 0%, 80%)'
} // settingsHoverEvent

// Sets up the EventListener for opening the settings
export function openSettingsEvent() {
	if (!settings.settingsOpened) {
		settings.settingsPopup.style.visibility = 'visible'
		settings.settingsPopup.style.animation = `pop ${SETTINGS_DELAY}ms`
		removeEventListener('keydown', moveEvent)
		settings.settingsOpened = true
	} else {
		settings.closeAndUpdateSettings()
	} // if-else
} // openSettingsEvent