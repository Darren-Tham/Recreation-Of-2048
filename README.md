# Recreating 2048
## Introduction
This repository will be a recreation of the popular game 2048 using JavaScript, HTML 5, and CSS 3. JavaScript will be used for the logic of the game; HTML 5 is used to setup the browser to make it playable on a browser, and CSS 3 is used to style the game.
## How To Play
The objective of the game is to create a tile with the number 2048. The player is presented with a 4 x 4 board with two tiles. The two starting tiles will be either two 2s or a 2 and a 4. The player can move the tiles up, down, left, or right. In doing so, it will move every tile to the corresponding direction. If the tiles with the same number merge, then it will combine and add the tiles together to form a new number. Every tile will be 2 to the power of *n* with *n* being greater than 0.
### Winning Condition
The player wins if the player manages to create a tile with the number 2048. The player may wish to continue playing the game to get a higher score. The score is calculated by adding tiles that have been combined. For example, if the player combines a 2 tile with another 2 tile, the player's score will increase by 4.
### Losing Condition
If the board is filled with 16 tiles with no moves available, then the player loses the game.
