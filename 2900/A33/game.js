/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

/**
 * G - game variable that does everything.
 * @type {{keyDown: exports.keyDown}}
 */
var G = (function () {

	const MAP_SIZE = 16;
	let timer;

	const w = 0; //wall
	const f = 1; //floor
	const x = 2; //exit
	const n = 3; //enter
	const e = 4; //enemy
	const room1 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, e, f, f, f, f, f, f, f, f, e, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[n, f, f, w, f, f, f, f, f, f, f, f, w, f, f, x],
		[n, f, f, w, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, e, f, f, f, f, f, f, f, f, e, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const room2 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, w, w, w, w, w, w, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, e, f, f, f, f, f, w, f, f, w],
		[n, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[n, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, e, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const room3 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, w, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, w, f, f, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, e, f, e, f, e, f, e, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, f, f, e, f, e, f, e, f, e, f, f, f, x],
		[n, f, f, f, f, f, f, f, f, f, f, f, f, f, f, x],
		[w, f, f, f, e, f, e, f, e, f, e, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, w, f, f, f, w],
		[w, f, f, f, f, f, w, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const room4 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[n, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, e, f, w, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, f, f, w, e, f, w, f, f, w],
		[w, f, f, w, f, f, w, x, x, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, x, x, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, w, w, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, e, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, e, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	let mapArray = [room1, room2, room3, room4];
	let currentMap = 0;

	let enemies = [];
	let player;

	let playerX;
	let playerY;

	let lives = 3;

	/**
	 * Draws the map on the board, clearing the screen before it does.
	 */
	var drawMap = function(map){
		var row, col, data;
		PS.gridPlane(0);
		clearScreen();
		for (row = 0; row <  MAP_SIZE; row++) {
			for (col = 0; col < MAP_SIZE; col++) {
				data = (mapArray[map])[row][col];
				//PS.debug("map[" + row + "," + col + "]=" + data + "\n");
				if (data === 0) {
					var color = (( PS.random( 16 ) - 1 ) + 64);
					PS.color(col, row, color, color, color) ;
				} else if(data === 1){
					var color = (( PS.random( 16 ) - 1 ) + 128);
					PS.color(col, row, color, color, color);
				} else if(data === 2){
					var color = (( PS.random( 16 ) - 1 ) + 168);
					PS.color(col, row, color, color, color);
					PS.data(col, row, "exit");
				} else if(data === 3){
					var color = (( PS.random( 16 ) - 1 ) + 168);
					PS.color(col, row, color, color, color);
					PS.data(col, row, "enter");
				} else if(data === 4){
					var color = (( PS.random( 16 ) - 1 ) + 128);
					PS.color(col, row, color, color, color);
					PS.data(col, row, "enemy");
				}
			}
		}
		PS.gridPlane(1);
		placeChars();
		toggleVision();
	}

	/**
	 * Clears the screen to prepare for the next thing (screen or map)
	 */
	var clearScreen = function() {
		PS.gridPlane(0);
		for(let x = 0; x < MAP_SIZE; x++){
			for(let y = 0; y < MAP_SIZE; y++){
				PS.color(x,y,0xEEEEEE);
				PS.glyph(x,y, PS.DEFAULT);
				PS.border(x,y,0);
			}
		}
		PS.gridPlane(1);
		PS.alpha(PS.ALL, PS.ALL, 0);
		PS.data(PS.ALL, PS.ALL, PS.DEFAULT);
		PS.gridPlane(0);
		//PS.debug("Screen cleared!");
	};

	/**
	 * Places the enemies on the map.
	 */
	var placeChars = function(){
		var row, col, data;
		for(let i = 0; i < enemies.length; i++){
			PS.spriteDelete(enemies[i].e);
		}
		for(let i = 0; i < enemies.length; i++){
			PS.spriteDelete(enemies[i].e);
		}
		for (row = 0; row <  MAP_SIZE; row++) {
			for (col = 0; col < MAP_SIZE; col++) {
				data = PS.data(col, row);
				if(data === "enemy"){
					//PS.debug(data)
					var enemy = PS.spriteSolid(1, 1);
					PS.spriteMove(enemy, col, row);
					PS.spritePlane(enemy, 1);
					//PS.color(col, row, PS.COLOR_BLACK);
					//PS.alpha(col, row, PS.ALPHA_OPAQUE);
					//PS.data(col, row, "enemy");
					//PS.debug(enemies);
					var enemyO = {e : enemy, line : null , step : null};
					enemies.push(enemyO);
					PS.data(col, row, PS.DEFAULT);
				}
			}
		}
		for (row = 0; row < MAP_SIZE; row++) {
			if(PS.data(0, row) === "enter"){
				PS.color(0, row, 0xEEEEEE);
				//PS.data(0, row, "player");
				//PS.alpha(0, row, PS.ALPHA_OPAQUE);
				player = PS.spriteSolid(1, 1);
				PS.spriteMove(player, 0, row);
				PS.spriteSolidColor(player, PS.COLOR_WHITE);
				PS.spritePlane(player, 1);
				PS.spriteCollide(player, damage);
				//playerX = 0;
				//playerY = row;
				//PS.debug("player" + playerX + " " + playerY + "\n")
				break;
			}
		}
	}

	/**
	 * Creates a win screen where you can shoot fireworks by pressing space.
	 */
	var endScreen = function(){
		PS.debug("End");
		PS.spriteDelete(player);
		for(let i = 0; i < enemies.length; i++){
			PS.spriteDelete(enemies[i].e);
		}
		clearScreen();
	}

	/**
	 * Moves the player when a key is pressed and takes the direction to move as input
	 * @param x
	 * @param y
	 */
	var move = function(x, y){
		let nx, ny;
		let location = PS.spriteMove(player);
		nx = location.x + x;
		ny = location.y + y;

		/*PS.debug("chosen" + nx + " " + ny + "\n")
		PS.debug("player" + playerX + " " + playerY + "\n")
		PS.debug("input" + x + " " + y + "\n")*/


		//Needs plane 0 to look at walls
		PS.gridPlane(0);
		//Check out of grid
		if ((nx < 0) || (nx >= MAP_SIZE) ||
			(ny < 0) || (ny >= MAP_SIZE)){
			return;
		}
		//Check walls
		let colorArr = [];
		PS.unmakeRGB(PS.color(nx, ny), colorArr);
		if(colorArr[0] < 127){
			return;
		}
		//Everything else is on the upper plane.
		PS.gridPlane(1);
		//Actually move
		//PS.alpha(playerX, playerY, 0);
		//PS.data(playerX, playerY, PS.DEFAULT);
		//PS.data(nx, ny, "player");
		//PS.color(nx, ny, 0xEEEEEE);
		//PS.alpha(nx, ny, PS.ALPHA_OPAQUE);
		PS.spriteMove(player, nx, ny);
		//playerX = nx;
		//playerY = ny;
		location = PS.spriteMove(player);
		//Check if we just moved onto the end, and advance the level
		if(PS.data(location.x, location.y) === "exit"){
			currentMap++
			//PS.timerStop(timer);
			if(currentMap === mapArray.length){
				endScreen();
			} else {
				drawMap(currentMap)
			}
		}

		//TODO uncomment and fix this? Might not need fixing
		/*Make a path to the player
		for(let i = 0; i < enemies.length; i++){
			let locationE = PS.spriteMove(enemies[i].e);
			var line;

			line = PS.line(locationE.x, locationE.y, location.x, location.y);

			if ( line.length > 0 ) {
				enemies[i].line = line;
				enemies[i].step = 0; // start at beginning
			}
		} */
	}

	/**
	 * Increments and displays the life counter (both up and down works)
	 * @param value
	 */
	var incrementLives = function(value){
		lives = lives + value;
		let lifeDisplay = [];
		for(let i = 0; i < lives; i++){
			lifeDisplay.push('❤️');
		}
		PS.debug("Lives changed by" + value + "\n");
		PS.debug(lifeDisplay + "\n");
		PS.statusText(lifeDisplay);
		if(lives === 0){
			loseScreen();
		}
	}

	/**
	 * Displays the lose screen
	 */
	var loseScreen = function(){
		PS.debug("Lose");
		clearScreen();
		PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
		PS.statusText("Game Over!")
		PS.statusColor(0xD5D5D5)
	}

	/**
	 * Shows the map for a few seconds when entering a level.
	 */
	var toggleVision = function(){
		//This does nothing at the moment because the vision system isn't implemented.
		//However it is here because it will be necessary eventually and adding it now makes it easier.
		//TODO make this multiple timers for each enemy
		//timer = PS.timerStart(50, triggerMovement);

	}

	/**
	 * Moves the enemies on a timer triggered in toggleVision
	 */
	var triggerMovement = function() {
		for (let i = 0; i < enemies.length; i++) {
			//PS.debug(enemies[i].x + ", " + enemies[i].y + "\n");
			let location = PS.spriteMove(enemies[i].e);
			if (enemies[i].line) { // path ready (not null)?
				// Get next point on path
				let p = enemies[i].line[enemies[i].step];
				let nx = p[0]; // next x-pos
				let ny = p[1]; // next y-pos
				// If actor already at next pos,
				// path is exhausted, so nuke it
				if ((location.x === nx) && (location.y === ny)){
					enemies[i].line = null;
					return;
				}

				// Move sprite to next position
				PS.gridPlane(0);
				//Check out of grid
				if ((nx < 0) || (nx >= MAP_SIZE) ||
					(ny < 0) || (ny >= MAP_SIZE)){
					return;
				}
				//Check walls
				let colorArr = [];
				PS.unmakeRGB(PS.color(nx, ny), colorArr);
				if(colorArr[0] < 127){
					return;
				}
				//Check player
				//if(PS.data(nx, ny) == "player");
				//Everything else is on the upper plane.
				PS.gridPlane(1);

				PS.spriteMove(enemies[i].e, nx, ny);
				//PS.data(location.x, enemies[i].y, PS.DEFAULT);
				//PS.alpha(location.x, enemies[i].y, 0);
				//PS.color(nx, ny, PS.COLOR_BLACK);
				//PS.alpha(nx, ny, PS.ALPHA_OPAQUE);

				//enemies[i].x = nx; // update xpos
				//enemies[i].y = ny; // and ypos

				enemies[i + 2] += 1; // point to next step

				// If no more steps, nuke path

				if (enemies[i].step >= enemies[i].line.length - 1) {
					enemies[i].line = null;
				}
			}
		}
	}

	/**
	 * Eliminates any enemies surrounding the player (doesn't work)
	 */
	var eliminate = function(){
		let location = PS.spriteMove(player);
		for(let y = location.y - 2; y <= location.y + 2; y++){
			for(let x = location.x - 2; x <= location.x + 2; x++){
				for(let i = 0; i < enemies.length; i++){
					if(PS.spriteMove(enemies[i].e).x === x && PS.spriteMove(enemies[i].e).y === y){
						PS.spriteDelete(enemies[i].e);
						enemies.splice(i, 1);
						//PS.debug("" + enemies);
					}
				}
			}
		}
	}

	var damage = function(s1, p1, s2, p2, type){
		PS.debug("Called increment from collision");
		incrementLives(-1);
	}

	// BREAK BETWEEN FUNCTIONS AND EXPORTS

	var exports = {

		/**
		 * Initializes the game with grid size, status, and start screen
		 * @param system
		 * @param options
		 */
		init : function(system, options){
			const TEAM = "TeamDomino";

			PS.gridSize( MAP_SIZE, MAP_SIZE );

			PS.debug("called increment from init");
			incrementLives(0);

			PS.gridColor(0x242424);

			drawMap(currentMap);

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.
			PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
				if ( user === PS.ERROR ) {
					return;
				}
				PS.dbEvent( TEAM, "startup", user );
				PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
			}, { active : false } );
			// Change the false in the final line above to true
			// before deploying the code to your Web site.
		},

		/**
		 * Calls move when WASD or the arrows are pressed
		 * @param key
		 * @param shift
		 * @param ctrl
		 * @param options
		 */
		keyDown : function(key, shift, ctrl, options){
			switch ( key ) {
				case PS.KEY_ARROW_UP:
				case 119:
				case 87: {
					// Code to move things UP
					move(0, -1);
					break;
				}
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					// Code to move things DOWN
					move(0, 1);
					break;
				}
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					// Code to move things LEFT
					move(-1, 0);
					break;
				}
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					// Code to move things RIGHT
					move(1,0);
					break;
				}
				case 32: {
					eliminate();
				}
			}
		},


	}

	return exports;
} () );



/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = G.init; /*function( system, options ) {


	PS.gridSize( 16, 16 );

	PS.statusText( "Game" );

	// Add any other initialization code you need here.

	// Change this TEAM constant to your team name,
	// using ONLY alphabetic characters (a-z).
	// No numbers, spaces, punctuation or special characters!

	const TEAM = "TeamDomino";

	// This code should be the last thing
	// called by your PS.init() handler.
	// DO NOT MODIFY IT, except for the change
	// explained in the comment below.

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );
	
	// Change the false in the final line above to true
	// before deploying the code to your Web site.
}; */

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = G.keyDown; /*function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
}; */

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

