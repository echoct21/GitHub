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




var G = ( function () {

	const w = 0; // wall
	const B = 1; // path
	const Y = 2; // end
	const T = 3; // warp

	let searcherX;
	let searcherY;
	let currentMap = 0;

	//const COLOR_WALL = 0x474742;
	const COLOR_WARP = 0xa236c9
	const COLOR_END = 0xf5d222
	const MAP_SIZE = 15;
	let startActive = false;
	let endActive = false;

	//Possible temporary if random maps is possible, which it is not, so here this stays
	const map1 = [
		[B, w, w, w, w, w, w, w, w, w, w, w, w, w, w,],
		[B, w, w, B, B, w, w, w, w, w, w, w, w, B, w,],
		[B, w, w, w, B, w, w, w, w, w, w, w, w, B, w,],
		[B, B, w, w, B, w, w, B, B, B, B, B, B, B, w,],
		[w, B, B, B, B, B, B, B, w, w, w, w, w, w, w,],
		[w, w, B, w, w, w, w, B, w, w, w, w, w, w, w,],
		[w, w, B, w, w, w, w, B, w, B, B, B, w, B, w,],
		[w, B, B, B, B, w, w, B, w, w, w, B, B, B, w,],
		[w, B, w, w, w, w, w, B, B, w, w, B, w, w, w,],
		[w, w, w, w, w, w, w, w, B, w, w, B, w, w, w,],
		[w, w, B, B, B, B, w, w, B, B, B, B, w, w, w,],
		[w, w, B, w, w, B, B, B, B, w, B, w, w, w, w,],
		[w, w, B, w, w, w, B, w, w, w, B, w, w, w, w,],
		[w, w, B, w, w, B, B, w, w, w, B, B, B, Y, w,],
		[w, w, B, w, w, B, w, w, w, w, w, B, w, w, w,],
	];

	const map2 = [
		[B, B, w, B, B, B, B, B, B, B, B, B, w, w, w,],
		[w, B, w, B, w, w, w, w, w, w, w, B, w, w, w,],
		[B, B, w, Y, w, B, B, B, w, w, w, B, w, w, w,],
		[w, B, w, w, w, w, w, B, w, w, w, B, B, B, w,],
		[w, B, B, B, B, B, w, B, B, w, w, w, w, B, w,],
		[w, B, w, w, w, B, B, B, w, w, w, w, B, B, w,],
		[w, B, w, w, w, B, w, w, w, w, B, B, B, w, w,],
		[w, B, B, w, w, B, w, w, w, w, B, w, w, w, w,],
		[w, w, B, w, w, B, B, B, B, B, B, w, w, w, w,],
		[w, w, B, w, w, w, w, w, B, w, w, w, w, w, w,],
		[w, w, B, B, w, w, w, w, B, B, B, B, B, w, w,],
		[w, w, B, w, w, B, B, B, B, w, w, w, B, w, w,],
		[B, B, B, w, w, B, w, w, w, w, w, B, B, w, w,],
		[w, w, w, w, w, B, B, w, w, w, w, w, B, w, w,],
		[w, w, w, w, w, w, B, w, w, w, w, w, w, w, w,],
	];

	const map3 = [
		[B, w, w, w, w, w, w, B, w, w, w, w, w, w, B,],
		[B, B, B, w, w, w, w, B, w, w, w, w, B, B, B,],
		[w, w, B, w, B, B, B, B, w, w, w, w, B, w, w,],
		[w, w, B, w, B, w, w, w, w, w, w, w, B, w, w,],
		[w, B, B, B, B, w, w, w, w, w, B, B, B, B, w,],
		[w, B, w, w, B, B, w, w, w, B, B, w, w, B, w,],
		[w, B, w, w, B, w, w, w, w, w, B, w, w, B, w,],
		[w, B, w, w, B, B, w, Y, B, B, B, w, w, B, w,],
		[w, B, w, w, w, B, w, w, w, B, w, w, w, B, w,],
		[w, B, w, w, w, B, w, w, w, B, w, w, w, B, w,],
		[w, B, w, w, w, B, w, w, w, B, w, w, w, B, w,],
		[T, B, w, w, w, B, w, w, w, B, w, w, w, B, T,],
		[w, w, w, w, B, B, w, w, w, B, B, w, w, w, w,],
		[w, w, w, w, B, w, w, w, w, w, B, w, w, w, w,],
		[w, w, w, w, B, w, w, w, w, w, B, w, w, w, w,]
	];

	const map4 = [
		[B, B, B, B, B, B, B, B, B, B, B, B, B, B, B,],
		[w, B, w, w, w, w, w, w, w, w, w, w, w, w, B,],
		[w, B, w, w, w, w, B, B, B, B, B, T, w, w, B,],
		[w, B, B, w, w, w, B, w, w, w, w, w, w, w, B,],
		[w, w, B, w, B, B, B, B, B, B, B, B, w, w, B,],
		[w, w, B, w, B, w, w, w, w, w, w, B, w, w, B,],
		[w, w, B, w, B, w, w, w, w, w, w, B, w, w, B,],
		[w, w, B, w, B, w, w, w, w, w, w, B, w, w, B,],
		[w, B, B, B, B, w, B, B, B, B, B, B, w, w, B,],
		[w, B, w, w, w, w, B, w, B, w, w, w, w, w, B,],
		[w, w, w, B, w, w, B, w, B, w, w, w, w, w, B,],
		[B, B, B, B, B, w, B, w, B, B, B, B, B, w, B,],
		[w, w, w, B, w, w, B, w, w, w, w, B, w, w, T,],
		[w, B, B, B, w, w, B, w, w, w, w, w, w, w, w,],
		[w, B, w, w, w, w, B, B, B, B, B, B, B, B, Y,]
	];

	const map5 = [
		[B, w, w, w, w, w, w, w, w, w, B, w, w, w, w,],
		[B, w, w, w, w, w, w, w, w, B, B, B, B, w, w,],
		[B, w, w, w, w, T, B, B, B, B, w, w, B, w, w,],
		[B, B, B, w, w, w, w, w, w, B, B, B, B, w, w,],
		[B, w, B, w, w, w, w, w, w, B, w, w, w, w, B,],
		[w, w, B, w, w, B, B, B, B, B, w, w, w, w, B,],
		[w, T, B, w, w, w, B, w, w, w, w, w, w, w, B,],
		[w, B, w, w, B, B, B, w, w, B, B, B, B, w, B,],
		[w, B, w, w, B, w, w, w, w, B, w, w, B, w, B,],
		[w, Y, w, w, B, w, w, w, B, B, w, w, B, w, B,],
		[w, B, w, w, B, w, w, w, B, w, w, w, B, B, B,],
		[w, B, w, w, B, B, w, w, B, w, w, w, w, w, w,],
		[B, B, B, B, B, B, B, B, B, B, B, B, B, B, B,],
		[w, w, w, B, w, w, w, w, B, w, w, w, w, w, w,],
		[w, w, w, B, w, w, w, w, B, w, w, w, B, w, w,]
	];

	let mapArray = [
		map1, map2, map3, map4, map5
	];

	let collectedLetters = [];

	const startArray = ['S', 'T', 'A', 'R', 'T'];
	const titleArray = ['G', 'L', 'Y', 'P', 'H', ' ', ' ', 'H', 'U', 'N', 'T', 'E', 'R'];

	const wordArray = ["Stop", "Frog", "Horse", "Pig", "House", "Ball", "Tree"];

	let chosenWord;

	let chosenWordArray;
	let orderedChosenWord;

	let finalArray = [];

	let activeGlyph = 0;

	let collected = "collected";
	let input = "input";

	/**
	 * Sets up the start screen with the start button and title up top.
	 */
	var startScreen = function() {
		startActive = true;

		PS.border(PS.ALL, PS.ALL, 0);

		for(let x = 1; x < 14; x++){
			PS.border(x, 2, 1);
			PS.glyph(x , 2, titleArray[x - 1])
		}

		for(let x = 5; x < 10; x++){
			PS.border(x, 7, 1);
			PS.glyph(x, 7, startArray[x - 5]);
		}
		chosenWord = wordArray[(PS.random(wordArray.length - 1)) - 1];
		chosenWordArray = Array.from(chosenWord);
		orderedChosenWord = Array.from(chosenWord);
		shuffleArray(chosenWordArray);
		//PS.glyph(0,14, 42);
	};

	var drawMap = function(map){
		var row, col, data;
		//PS.debug("Map number " + map + "\n");
		//TODO make this randomized; or not because it is hard
		//var m = mapArray[map];
		//PS.debug(m);
		for (row = 0; row <  MAP_SIZE; row += 1) {
			for (col = 0; col < MAP_SIZE; col += 1) {
				data = (mapArray[map])[row][col];
				//PS.debug("map[" + row + "," + col + "]=" + data + "\n");

				if (data === 0) {
					var color = (( PS.random( 32 ) - 1 ) + 128);
					PS.color(col, row, color, color, color) ;
				} else if(data === 2){
					PS.color(col, row, COLOR_END);
					PS.glyph(col, row, chosenWordArray[currentMap]);
				} else if(data === 3){
					PS.color(col, row, COLOR_WARP);
				}
			}
		}
		PS.gridPlane(1);
	};

	var clearScreen = function() {
		PS.gridPlane(0);
		for(let x = 0; x < MAP_SIZE; x++){
			for(let y = 0; y < MAP_SIZE; y++){
				PS.color(x,y,PS.COLOR_WHITE);
				PS.glyph(x,y, PS.DEFAULT);
				PS.border(x,y,0);
			}
		}
		PS.gridPlane(1);
		PS.alpha(PS.ALL, PS.ALL, 0);
		PS.gridPlane(0);
		//PS.debug("Screen cleared!");
	};


	var endScreen = function(){
		clearScreen();
		endActive = true;
		PS.statusText("Enter the code!");
		for (let x = 0; x < MAP_SIZE; x++) {
			for (let y = 0; y < MAP_SIZE; y++) {
				PS.border(x, y, 0);
			}
		}
		for(let x = 1; x < 14; x++){
			PS.border(x, 2, 1);
		}
		for(let x = 1; x < 14; x++){
			PS.border(x, 13, 1);
		}
		for(let x = 1; x < collectedLetters.length + 1; x++){
			PS.glyph(x, 13, collectedLetters[x - 1])
		}
		for(let x = 1; x < Array.from(input).length + 1; x++){
			PS.glyph(x, 3, Array.from(input)[x - 1]);
		}
		for(let x = 1; x < Array.from(collected).length + 1; x++){
			PS.glyph(x, 12, Array.from(collected)[x - 1]);
		}




	};

	//Shuffle function taken from : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	var shuffleArray = function(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	var exports = {

		// G.init()
		// Initializes the game

		init: function () {

			//PS.debug( "PS.init() called\n" );
			PS.gridSize(MAP_SIZE, MAP_SIZE);
			PS.gridColor(0x7eb9bf);
			PS.gridShadow(true, 0x6fcfd9);

			// This is also a good place to display
			// your game title or a welcome message
			// in the status line above the grid.
			// Uncomment the following code line and
			// change the string parameter as needed.

			PS.statusText("Find the letters!");

			// Add any other initialization code you need here.

			startScreen();

			shuffleArray(mapArray);

			PS.audioLoad("perc_triangle")
			PS.audioLoad("fx_powerup4")

			PS.fade(PS.ALL, PS.ALL, 20);

			// Change this TEAM constant to your team name,
			// using ONLY alphabetic characters (a-z).
			// No numbers, spaces, punctuation or special characters!

			const TEAM = "TeamDomino";

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.

			PS.dbLogin("imgd2900", TEAM, function (id, user) {
				if (user === PS.ERROR) {
					return;
				}
				PS.dbEvent(TEAM, "startup", user);
				PS.dbSend(TEAM, PS.CURRENT, {discard: true});
			}, {active: false});
			// Change the false in the final line above to true
			// before deploying the code to your Web site.
		},

		start: function (mapNum) {
			clearScreen();
			startActive = false;
			drawMap(mapNum);
			PS.alpha(0, 0, PS.ALPHA_OPAQUE)
			PS.color(0,0, PS.COLOR_RED);
			searcherX = 0;
			searcherY = 0;

		},

		move: function (h, v) {

			var nx, ny;

			// Calculate proposed new location.

			nx = searcherX + h;
			ny = searcherY + v;

			// Is there a wall in the proposed location?
			// If the bead there is COLOR_WALL (black),
			// exit without moving.
			PS.gridPlane(0);

			// Is new location off the grid?
			// If so, exit without moving.

			if ((nx < 0) || (nx >= MAP_SIZE) ||
				(ny < 0) || (ny >= MAP_SIZE)) {
				return;
			}

			if ((PS.color(nx, ny,) != PS.COLOR_WHITE) && (PS.color(nx, ny) != COLOR_WARP) && (PS.color(nx, ny) != COLOR_END)) {
				return;
			}

			PS.gridPlane(1);
			// Legal move, so change current grabber
			// location to floor color.

			PS.color(searcherX, searcherY, PS.COLOR_WHITE);
			PS.alpha(searcherX, searcherY, PS.ALPHA_OPAQUE);


			// Assign grabber's color to the
			// new location.

			PS.color(nx, ny, PS.COLOR_RED);
			PS.alpha(nx, ny, PS.ALPHA_OPAQUE)

			// Finally, update grabber's position

			searcherX = nx;
			searcherY = ny;

			PS.gridPlane(0);
			//PS.debug("Active grid plane 0. End search \n");
			if (PS.color(searcherX, searcherY) == COLOR_END) {
				collectedLetters.push(chosenWordArray[currentMap]);
				PS.audioPlay("perc_triangle")
				if(collectedLetters.length === chosenWordArray.length){
					endScreen();
				} else {
					currentMap++;
					clearScreen();
					G.start(currentMap);
				}

			}
			// Warp
			if (PS.color(searcherX, searcherY) == COLOR_WARP) {
				var warpX;
				var warpY;
				PS.color(searcherX, searcherY, PS.COLOR_WHITE);
				for (let col = 0; col < MAP_SIZE; col++) {
					for (let row = 0; row < MAP_SIZE; row++) {
						if(PS.color(col, row) == COLOR_WARP){
							warpX = col;
							warpY = row;
							//PS.debug(warpX +" " + warpY + "\n");
						}
					}
				}
				PS.audioPlay("fx_powerup4")
				G.moveTo(warpX, warpY);
		}

		},

		moveTo : function(x, y){
			PS.gridPlane(1);
			//PS.debug("Grid plane 1. Starting moveTo \n");
			PS.color(x,y, PS.COLOR_RED);
			PS.alpha(x, y, PS.ALPHA_OPAQUE)

			PS.color(searcherX, searcherY, PS.COLOR_WHITE);

			searcherX = x;
			searcherY = y;
			PS.gridPlane(0);
			PS.color(x,y,PS.COLOR_WHITE);
			//PS.debug("Grid plane 0. Ending moveTo \n");
		},

		touch : function(x, y, data, options){
			if(startActive){
				if((x < 10 && x > 4) && y === 7){
					//PS.debug("Started!")

					clearScreen();
					G.start(currentMap);
				}
			}
// Win checking that doesn't work
			if(endActive) {
				if ((x < 14 && x > 0) && y === 13) {
					activeGlyph = PS.glyph(x, y);
					PS.statusText("Active Glyph is " + String.fromCharCode(activeGlyph));
				} else if ((x < 14 && x > 0) && y === 2) {
					PS.glyph(x, y, activeGlyph);
					PS.statusText("Glyph Set!")
					finalArray.splice(x - 1, 1, String.fromCharCode(activeGlyph));
					//PS.debug(wordArray + "\n");
					//PS.debug(finalArray + "\n");
					//Fix this, because it doesn't work if they do it out of order.
					//PS.debug(finalArray);
					//PS.debug(orderedChosenWord);
					var win = true;
					for (let i = 0; i < orderedChosenWord.length; i++) {
						if (orderedChosenWord[i] != finalArray[i]) {
							win = false;
							break;
						}
					}
					if (win === true) {
						PS.statusText("You win!");
					}
				}
			}
				if (PS.glyph(x, y) == 42) {
					Array.prototype.push.apply(collectedLetters, chosenWordArray);
					//collectedLetters.push.apply(chosenWordArray);
					endScreen();
					startActive = false;
				}
		},

		keyDown : function(key, shift, ctrl, options){
			if(endActive){
				return;
			} else if(startActive){
				return;
			} else {
				switch (key) {
					case PS.KEY_ARROW_UP:
					case 119:
					case 87: {
						// Code to move things UP
						G.move(0, -1);
						break;
					}
					case PS.KEY_ARROW_DOWN:
					case 115:
					case 83: {
						// Code to move things DOWN
						G.move(0, 1);
						break;
					}
					case PS.KEY_ARROW_LEFT:
					case 97:
					case 65: {
						// Code to move things LEFT
						G.move(-1, 0);
						break;
					}
					case PS.KEY_ARROW_RIGHT:
					case 100:
					case 68: {
						// Code to move things RIGHT
						G.move(1, 0);
						break;
					}
				}
			}
		}
	};

	// Return the 'exports' object as the value
	// of this function, thereby assigning it
	// to the global G variable. This makes
	// its properties visible to Perlenspiel.

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
PS.init = G.init; //function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin with a call to PS.gridSize( x, y )  where x and y are the desired initial dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems
/*
	 PS.gridSize( 15, 15 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	 PS.statusText( "Find the letters!" );

	// Add any other initialization code you need here.

	G.main();

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
	// before deploying the code to your Web site.*/
//};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = G.touch; //= function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:


/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

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

	switch ( key ) {
		case PS.KEY_ARROW_UP:
		case 119:
		case 87: {
			// Code to move things UP
			G.move(0, -1);
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83: {
			// Code to move things DOWN
			G.move(0, 1);
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65: {
			// Code to move things LEFT
			G.move(-1, 0);
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68: {
			// Code to move things RIGHT
			G.move(1,0);
			break;
		}
	}
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
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
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

