/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)

The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

/*
Toy notes:
Size 16 x 20
Make border increase when hovered over. 64 colors
Only one can be active at once.



 */

var dividerRow = {
	top: 1,
	left : 1,
	bottom : 3,
	right : 1
};

var leftBound = {
    top : 0,
    left : 1,
    bottom : 0,
    right : 0
};

var bottomBound = {
     top : 0,
    left : 0,
    bottom : 1,
    right : 0
};

var rightBound = {
    top : 0,
    left : 0,
    bottom : 0,
    right : 1
};

var leftCorner = {
    top : 0,
    left : 1,
    bottom : 1,
    right : 0
}

var rightCorner = {
    top : 0,
    left : 0,
    bottom : 1,
    right : 1
}

var brushColor = PS.COLOR_WHITE;

var brushActive = false;

var brushSize = 1

var BOARDWIDTH = 16

function checkCoord(x, y){

    if(x < 0 || x > BOARDWIDTH - 1 || y < 0 || y > BOARDWIDTH + 3){
	return false;
    } else 
	return true;
    
}

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {
	// Change this string to your team name
	// Use only ALPHABETIC characters
	// No numbers, spaces or punctuation!

	const TEAM = "TeamDomino";

	// Begin with essential setup
	// Establish initial grid size

	PS.gridSize( BOARDWIDTH, BOARDWIDTH + 4 ); // or whatever size you want
	PS.gridColor(0xAEAEAE)

	// Default status text, gets changed when a selection is made.
	PS.statusText("Current Selection: " + "None")


	//Border color is black.
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_BLACK)
	PS.border (PS.ALL, 3, dividerRow)

	for(let y = 4; y < BOARDWIDTH + 4; y++) {
	    for (let x = 0; x < BOARDWIDTH; x++) {
		if(x === 0){
		    PS.border(x, y, leftBound);
		} else if(y === 19){
		    PS.border(x, y, bottomBound);
		} else if(x === 15){
		    PS.border(x, y, rightBound);
		} else {
		    PS.border(x, y, 0);
		}
	    }
	}

    //Fix corners (unfortunately necessary for now)
    PS.border(0, 19, leftCorner);
    PS.border(15, 19, rightCorner);
	// Install additional initialization code
	// here as needed

	//Randomize color palette -- you never know what you'll get; worth playing with multiple times.

	var r,g,b;
	var color;

	for(let y = 0; y < 4; y++){
		for(let x = 0; x < BOARDWIDTH -1; x++){
			 r = PS.random(256) -1;
			 g = PS.random(256) -1;
			 b = PS.random(256) -1;
			 color = ((r * 65536) + (g * 256) + b);
			 PS.color(x, y, color);
		}
	    PS.glyph(BOARDWIDTH - 1, y, y + 49);
	}
    PS.glyph(BOARDWIDTH - 1, 3, "E");



	// PS.dbLogin() must be called at the END
	// of the PS.init() event handler (as shown)
	// DO NOT MODIFY THIS FUNCTION CALL
	// except as instructed

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.

	if(y <= 3 && x < BOARDWIDTH - 1){
		brushColor = PS.color(x, y, PS.CURRENT);
		PS.statusText("Current Selection: " + brushColor.toString(16));
		PS.statusColor(brushColor);
	} else if(y <= 3 && x === BOARDWIDTH - 1){
	    if(PS.glyph(x, y, PS.CURRENT) == 49){
		PS.statusText("Brush Size: " + 1);
		brushSize = 1
	    } else if(PS.glyph(x, y, PS.CURRENT) == 50){
		PS.statusText("Brush Size: " + 2);
		brushSize = 2
	    } else if(PS.glyph(x, y, PS.CURRENT) == 51){
		PS.statusText("Brush Size: " + 3);
		brushSize = 3
	    } else if(PS.glyph(x, y, PS.CURRENT) == 69){
		PS.statusText("Erase Mode.");
		brushColor = PS.COLOR_WHITE
	    }
	} else {
	    if(brushSize == 3){
		if(checkCoord(x - 1, y) && checkCoord(x + 1, y)){
		    PS.fade(x-1, y, 15);
		    PS.color(x-1, y, brushColor);
		    PS.fade(x+1, y, 15);
		    PS.color(x+1, y, brushColor);
		}
		PS.fade(x, y, 15);
		PS.color(x, y, brushColor);
		
	    } else if(brushSize ==  2){
		if(checkCoord(x - 1, y)){
		    PS.fade(x-1, y, 15);
		    PS.color(x-1, y, brushColor);
		}
		PS.fade(x, y, 15);
		PS.color(x, y, brushColor);

	    }   else if(brushSize == 1){
		PS.fade(x, y, 15);
		PS.color(x, y, brushColor);
	    }
	}

    // Activate the brush to use while holding.
    brushActive = true;

};

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
    //Turns off the brush
    brushActive = false;
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
	if (y <= 3) {
		PS.border(x, y, 2)
	}

	//PS.debug("Width = " + test.top + " " + test.bottom + "\n"); This shouldn't be needed anymore, but I'm keeping it.

	//Use the active brush
	if (brushActive && y > 3) {
		if (brushSize == 3) {
			if (checkCoord(x - 1, y) && checkCoord(x + 1, y)) {
				PS.fade(x - 1, y, 15);
				PS.color(x - 1, y, brushColor);
				PS.fade(x + 1, y, 15);
				PS.color(x + 1, y, brushColor);
			}
			PS.fade(x, y, 15);
			PS.color(x, y, brushColor);

		} else if (brushSize == 2) {
			if (checkCoord(x - 1, y)) {
				PS.fade(x - 1, y, 15);
				PS.color(x - 1, y, brushColor);
			}
			PS.fade(x, y, 15);
			PS.color(x, y, brushColor);

		} else if (brushSize == 1) {
			PS.fade(x, y, 15);
			PS.color(x, y, brushColor);
		}
	}
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
	if(y === 3){
		PS.border(x, y, dividerRow);
	} else if (y < 3){
		PS.border(x, y, 1);
	}
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

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

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


