# Recreating 2048
## Introduction
This repository will be a recreation of the popular game 2048 using JavaScript, HTML 5, and CSS 3. JavaScript will be used for the logic of the game; HTML 5 is used to setup the browser to make it playable on a browser, and CSS 3 is used to style the game.

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/704606226553634932/968921034331930645/Screen_Shot_2022-04-27_at_1.03.26_PM.png" width="600">
</p>

## How To Play
The objective of the game is to create a tile with the number 2048. The player is presented with a 4 x 4 board with two tiles. Every tile spawned will be either a 2 or a 4, and there is a 10% chance of a 4 spawning. The player can move the tiles up, down, left, or right, and in doing so, it will move every tile to the corresponding direction. If the tiles with the same number merge, then it will combine and add the tiles together to form a new number, and it will update the score. Every tile will be 2 to the power of *n* with *n* being greater than 0. When the player makes their first move, the timer will start and will be displayed in the end screen.
### Winning Condition
The player wins if the player manages to create a tile with the number 2048. The player may wish to continue playing the game to get a higher score. The score is calculated by adding tiles that have been combined. For example, if the player combines a 2 tile with another 2 tile, the player's score will increase by 4.
### Losing Condition
If the board is filled with no moves available or no additional tiles can spawn, then the player loses the game.
### Settings
The player can use the settings to customize the board. They can change the number of rows, the number of columns, the duration at which the tiles move, and how many tiles will spawn per move.

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/704606226553634932/968922357915848714/Screen_Shot_2022-04-27_at_1.11.18_PM.png" width="400">
</p>
