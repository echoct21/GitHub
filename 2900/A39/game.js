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
	const PLANE_ENEMY = 1;
	const PLANE_ACTOR = 2;

	const COLOR_ACTOR = PS.COLOR_WHITE;
	const COLOR_ENEMY = PS.COLOR_BLACK;
	const VIEW_DISTANCE = 4;
	const VIEW_MULTIPLIER = 45;

	let ATTACK_RANGE = 1;
	let deactivate = false;

	let timer;
	let paused = true;

	const MAP_WALL = 0;
	const MAP_FLOOR = 1;
	const MAP_EXIT = 2;
	const MAP_ENTER = 3;
	const MAP_ENEMY = 4;
	const MAP_WARP = 5;
	const MAP_HEALTH = 6;
 	const MAP_ATTACK = 7;
 	const MAP_COIN = 8;

	const w = MAP_WALL;
	const f = MAP_FLOOR;
	const x = MAP_EXIT;
	const n = MAP_ENTER;
	const e = MAP_ENEMY;
	const t = MAP_WARP;
	const h = MAP_HEALTH;
	const a = MAP_ATTACK;
	const c = MAP_COIN;
	//Track 0 (Enter to split)
	const ROOM1 = [
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
	const ROOM2 = [
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
	const ROOM3 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, w, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, w, f, f, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, e, f, e, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, w, f, e, f, f, f, e, f, e, f, f, f, x],
		[n, f, f, w, f, f, f, f, f, f, f, f, f, f, f, x],
		[w, f, f, w, f, f, e, f, e, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, w, f, f, f, w],
		[w, f, f, f, f, f, w, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM4 = [
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
	const ROOM5 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, w, w, w, w, w, w, w, f, f, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, f, f, w, e, f, w, f, f, w],
		[w, f, f, w, f, f, w, n, n, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, n, n, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, w, w, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, e, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, e, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM6 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[n, f, f, f, f, f, f, f, f, f, f, f, f, e, e, w],
		[n, f, f, f, f, f, f, f, f, f, f, f, f, e, e, x],
		[w, f, f, w, w, w, w, f, f, f, f, f, f, f, f, x],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, e, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, w, w, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, f, f, e, f, w, f, f, w],
		[w, f, f, f, f, w, f, w, f, f, f, f, w, f, f, w],
		[w, f, f, f, e, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, e, f, w, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, w, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
		]
	const ROOM7 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, w, f, f, f, f, f, f, f, w],
		[n, f, f, w, f, e, f, w, f, f, w, f, f, t, f, w],
		[n, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, e, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, w, w, w, f, f, f, w, w, w, f, f, w, f, f, x],
		[w, f, f, w, f, f, f, w, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, f, t, f, e, w, f, f, w],
		[w, f, f, f, f, f, f, w, f, f, f, f, w, e, e, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, w, f, w, f, f, f, w],
		[w, f, f, f, f, f, w, f, f, w, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM8 = [
		[w, w, w, w, w, w, w, x, x, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, x, x, w, w, w, w, w, w, w]
	]
	//Track 1 (Split (above) to end)
	const ROOM9 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, e, f, f, f, w, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, w, w, w, w, w, w, f, f, f, w, f, f, w],
		[w, f, f, w, f, h, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, f, f, w, f, e, w],
		[w, f, f, f, f, w, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, w, f, f, w, f, f, f, w, f, f, w],
		[w, f, f, w, f, w, e, f, w, f, f, f, w, f, f, w],
		[w, f, f, w, f, w, f, f, w, f, f, f, w, f, f, w],
		[w, e, f, w, f, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, w, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, w, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, w, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, n, n, w, w, w, w, w, w, w]
	]
	const ROOM10 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, w, w, w, w, w],
		[n, f, f, f, f, f, e, f, f, f, f, w, w, w, w, w],
		[n, f, f, f, f, f, f, f, f, f, f, w, w, w, w, w],
		[w, w, w, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, w, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, h, f, f, w, w, w, f,e, f, f, w, w, w, w, w],
		[w, w, f, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, f, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, w, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, f, f, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, f, w, w, w, w, w, f, f, f, f, f, w, f, f, w],
		[w, f, w, w, w, w, w, f, f, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, e, f, f, f, f, x],
		[w, w, w, w, w, w, w, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM11 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, w, f, f, f, f, h, f, f, w, f, f, x],
		[w, f, f, w, w, w, w, f, f, f, f, f, w, f, f, x],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, e, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, w, w, e, f, w, f, f, w],
		[w, f, f, f, f, w, f, w, f, f, f, f, w, f, f, w],
		[n, f, f, f, e, w, f, f, f, f, w, w, w, f, f, w],
		[n, f, f, e, f, w, f, e, f, f, f, f, f, e, f, w],
		[w, f, f, f, f, w, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM12 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM13 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, w, w, w],
		[w, f, f, f, e, f, f, f, f, f, f, e, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, a, f, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, w, w, w],
		[n, f, f, f, f, f, f, w, w, w, w, w, w, w, w, w],
		[n, f, f, f, f, f, f, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, w, w, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, w, w, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, w, w, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, x, x, w, w, w, w, w, w, w]
	]
	//Track2 (Split (below) to end)
	const ROOM14 = [
		[w, w, w, w, w, w, n, n, w, w, w, w, w, w, w, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, x],
		[w, f, f, w, f, f, w, w, w, w, w, w, w, f, f, x],
		[w, f, f, w, e, f, w, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, f, f, w, e, f, w, f, f, w],
		[w, f, f, w, f, f, w, e, e, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, w, e, e, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, w, w, w, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, a, f, w, f, f, w],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, e, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM15 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, w, w, w, w, w],
		[n, f, f, f, f, f, e, f, f, a, f, w, w, w, w, w],
		[n, f, f, f, f, f, f, f, f, f, f, w, w, w, w, w],
		[w, w, w, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, w, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, f, f, f, w, w, w, f, e, f, f, w, w, w, w, w],
		[w, w, f, w, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, f, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, w, w, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, f, f, f, w, w, w, f, f, f, f, w, w, w, w, w],
		[w, f, w, w, w, w, w, f, f, f, f, f, w, f, f, w],
		[w, f, w, w, w, w, w, f, f, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, e, f, f, f, f, x],
		[w, w, w, w, w, w, w, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM16 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, e, f, w, f, f, f, f, e, f, f, w, f, f, x],
		[w, f, f, w, w, w, w, f, f, f, f, f, w, f, f, x],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, e, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, e, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, w, w, e, f, w, f, f, w],
		[w, f, f, f, f, w, f, w, f, f, f, f, w, f, f, w],
		[n, f, a, f, f, w, f, f, f, f, w, w, w, f, f, w],
		[n, f, f, f, f, w, f, e, f, f, f, f, f, e, f, w],
		[w, f, f, f, f, w, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM17 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, e, f, f, f, f, f, f, e, w, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM18 = [
		[w, w, w, w, w, w, w, x, x, w, w, w, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, w, f, f, f, f, w, w, w, w, w, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, w, w, w],
		[w, f, f, w, f, f, f, f, f, f, h, f, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, w, w, w],
		[n, f, f, f, f, f, f, w, w, w, w, w, w, w, w, w],
		[n, f, f, f, f, f, f, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, a, f, w, w, w, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, w, w, w, w, w, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, w, f, f, f, f, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	//Track 3 (Split (center) to end)
	const ROOM19 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, e, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, w, w, w, w, w, f, f, w, f, f, w],
		[w, f, f, f, e, f, f, f, f, w, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, w, f, f, w, f, f, w],
		[w, w, w, w, w, w, w, f, f, w, e, f, f, f, f, w],
		[n, f, f, w, f, f, w, f, f, w, f, f, f, f, f, x],
		[n, f, f, w, f, f, w, f, f, w, f, f, f, f, f, x],
		[w, f, f, w, f, f, w, f, f, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, e, f, f, f, f, w, f, f, w],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, w, w, w, w, w, w, w, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, w, f, e, w],
		[w, e, f, f, f, f, f, f, f, f, f, f, w, f, e, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM20 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, f, f, f, f, w, w, f, f, f, f, f, f, w],
		[w, f, f, e, f, f, f, w, w, f, f, f, e, f, f, w],
		[w, f, f, f, f, f, f, w, w, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, w, w, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, e, f, f, e, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[n, f, f, w, w, w, f, f, f, f, w, w, w, f, f, x],
		[n, f, f, w, w, w, f, f, f, f, w, w, w, f, f, x],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, e, f, f, e, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, w, w, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, w, w, f, f, f, f, f, f, w],
		[w, f, f, e, f, f, f, w, w, f, f, f, e, f, f, w],
		[w, f, f, f, f, f, f, w, w, f, f, f, f, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w]
	]
	const ROOM21 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[n, f, f, f, f, f, f, w, w, f, f, f, f, f, f, x],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, f, f, w, f, f, f, f, f, f, f, f, w, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
	]
	//Boss Room (4)
	const ROOM22 = [
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
		[w, f, c, f, f, f, f, f, f, f, f, f, f, f, c, w],
		[w, f, f, f, f, f, c, f, f, f, f, f, f, f, f, w],
		[w, f, f, w, w, f, f, f, f, f, f, w, w, f, f, w],
		[w, f, f, w, w, f, f, c, f, f, f, w, w, f, f, w],
		[w, f, f, f, f, f, f, f, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, c, f, f, f, f, f, c, f, f, f, w],
		[n, f, f, f, f, f, f, f, f, f, f, f, f, c, f, w],
		[n, f, f, f, f, f, f, f, f, c, f, f, f, f, f, w],
		[w, f, f, f, f, f, f, c, f, f, f, f, f, f, f, w],
		[w, f, f, f, f, c, f, f, f, f, f, f, f, f, c, w],
		[w, f, f, w, w, f, f, f, f, f, f, w, w, f, f, w],
		[w, f, f, w, w, f, f, f, f, c, f, w, w, f, f, w],
		[w, f, f, f, f, f, f, c, f, f, f, f, f, f, f, w],
		[w, f, f, c, f, f, f, f, f, f, f, f, c, f, f, w],
		[w, w, w, w, w, w, w, w, w, w, w, w, w, w, w, w],
	]
	//Track1
	const mapArrayZero = [ROOM1, ROOM2, ROOM3, ROOM4, ROOM5, ROOM6, ROOM7, ROOM8];
	//Track 2
	const mapArrayOne = [ROOM9, ROOM10, ROOM11, ROOM12, ROOM13];
	//Track 3
	const mapArrayTwo = [ROOM14, ROOM15, ROOM16, ROOM17, ROOM18];
	//Track 4
	const mapArrayThree = [ROOM19, ROOM20, ROOM21];
	//BossRoom 4
	const mapArrayFour = [ROOM22];
	const mapTracks = [mapArrayZero, mapArrayOne, mapArrayTwo, mapArrayThree, mapArrayFour];
	let currentMap = 0;
	let currentTrack = 0;

	// Create a pool of sprite objects that can be re-used over and over again
	const MAX_ENEMIES = 20; // increase or decrease as appropriate
	const enemies = [];
	let e_count = 0; // number of active enemies

	let player;
	let actor_x;
	let actor_y;
	let lives = 3;
	let gameActive = false;

	/**
	 * Draws the map on the board, clearing the screen before it does.
	 */
	const drawMap = function(map, track){

		clearScreen();

		gameActive = true;

		PS.debug("Map: " + map + " Track: " + track + "\n");
		let m = mapTracks[track][map]; // get map
		for ( let row = 0; row < MAP_SIZE; row += 1 ) {
			for ( let col = 0; col < MAP_SIZE; col += 1 ) {
				let color;
				let data = m[row][col]; // get map element
				//PS.debug("map[" + row + "," + col + "]=" + data + "\n");
				if ( data === MAP_WALL ) {
					color = ( ( PS.random( 16 ) - 1 ) + 44 );
					PS.color( col, row, color, color, color );
					PS.data( col, row, "wall" ); // use this to identify walls
				}
				else if ( data === MAP_FLOOR ) {
					color = ( ( PS.random( 16 ) - 1 ) + 148 );
					PS.color( col, row, color, color, color );
				}
				else if ( data === MAP_EXIT ) {
					color = ( ( PS.random( 16 ) - 1 ) + 148 );
					PS.color( col, row, color, color, color );
					PS.data( col, row, "exit" );
				}
				else if ( data === MAP_ENTER ) {
					color = ( ( PS.random( 16 ) - 1 ) + 178 );
					PS.color( col, row, color, color, color );
					actor_x = col;
					actor_y = row;
					PS.spriteMove( player, col, row ); // move player to entrance
				}
				else if ( data === MAP_ENEMY ) {
					color = ( ( PS.random( 16 ) - 1 ) + 148 ); // color as floor space
					PS.color( col, row, color, color, color );

					if ( e_count >= MAX_ENEMIES ) {
						PS.debug( "Too many enemies!\n" ); // in case you run out
						return;
					}
					let e = enemies[ e_count ];
					e.x = col;
					e.y = row;
					PS.spriteMove( e.sprite, col, row ); // move sprite to new position
					PS.spriteShow( e.sprite, true ); // and show it
					e_count += 1; // update enemy count
				} else if(data === MAP_WARP){
					PS.color(col, row, 0xf2f2f2);
					PS.glyph(col, row, "@");
					PS.data(col, row, "warp");
				} else if(data === MAP_HEALTH) {
					PS.color(col, row, 0xf2f2f2);
					PS.glyph(col, row, '♡');
					PS.data(col, row, "health");
				} else if(data === MAP_ATTACK) {
					PS.color(col, row, 0xf2f2f2);
					PS.glyph(col, row, '⚚');
					PS.data(col, row, "attack");
				} else if(data = MAP_COIN){
					PS.color(col, row, 0xf2f2f2);
					PS.glyph(col, row, '$');
					PS.data(col, row, "coin");
				} else {
					PS.debug( "Unknown item at " + col + ", " + row + " : "); // in case you make a mistake
					PS.debug(data + "\n");
				}
				//j += 1; // point to next map element
			}
			//i++;
		}
		drawVision(false);
	}

	/**
	 * Clears the screen to prepare for the next thing (screen or map)
	 */
	const clearScreen = function() {
		PS.color( PS.ALL, PS.ALL, 0xEEEEEE );
		PS.border( PS.ALL, PS.ALL, 0 );
		PS.glyph( PS.ALL, PS.ALL, 0 );
		PS.data( PS.ALL, PS.ALL, 0 );
		// Reset all active enemies
		for ( let i = 0; i < enemies.length; i += 1 ) {
			//PS.debug("E-count: " + e_count + " length: " + enemies.length);
			let e = enemies[ i ];
			PS.spriteShow( e.sprite, false ); // hide the sprite; prevents collisions
			e.path = null;
			e.step = 0;
			e.x = -1;
			e.y = -1;
		}
		e_count = 0; // reset enemy count
		//PS.debug("Screen cleared!");
	};

	/**
	 * Places the enemies on the map.          REMOVED
	 */
	/*var placeChars = function(){
		var row, col, data;
		for(let i = 0; i < enemies.length; i++){
			PS.spriteDelete(enemies[i].e);
		}
		//May have fixed the loading bug here
		enemies = [];
		PS.debug("enemies is empty" + enemies);
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
	} */

	/**
	 * Creates a win screen where you can shoot fireworks by pressing space.
	 */
	const endScreen = function(){
		clearScreen();
		gameActive = false;
		paused = true;
		drawVision(false);
		PS.spriteShow( player, false ); // hide player sprite
		PS.statusText("You Win!");
		PS.timerStop(timer);
	}

	/**
	 * Moves the player when a key is pressed and takes the direction to move as input
	 * @param x
	 * @param y
	 */
	const move = function(x, y) {
		paused = false; // restart the timer
		if(!gameActive)
			return;


		let nx = actor_x + x;
		let ny = actor_y + y;

		//Check out of grid

		if ((nx < 0) || (nx >= MAP_SIZE) || (ny < 0) || (ny >= MAP_SIZE)) {
			return;
		}

		// Check walls

		let data = PS.data(nx, ny);
		if (data === "wall") {
			return;
		}

		actor_x = nx;
		actor_y = ny;
		PS.spriteMove(player, actor_x, actor_y);

		//Check if we just moved onto the end, and advance the level

		if (data === "exit") {
			currentMap += 1;
			paused = true;
			if (currentTrack === 0) {
				if (currentMap === mapTracks[currentTrack].length) {
					if (actor_y === 0) {
						currentTrack = 1;
						currentMap = 0;
						drawMap(currentMap, currentTrack);
					} else if (actor_x === 15) {
						currentTrack = 3;
						currentMap = 0;
						drawMap(currentMap, currentTrack);
					} else if (actor_y === 15) {
						currentTrack = 2;
						currentMap = 0;
						drawMap(currentMap, currentTrack);
					}
				} else {
					drawMap(currentMap, currentTrack);
				}
			} else if((currentTrack > 0) && currentMap === mapTracks[currentTrack].length){
				PS.debug("Map: " + currentMap + " Track: " + currentTrack + "\n");
				currentTrack = 4;
				currentMap = 0;
				drawMap(currentMap, currentTrack);
			} else {
				drawMap(currentMap, currentTrack);
			}
			return;
		}
		//Found a warp spot
		if(data === "warp"){
			PS.data(actor_x, actor_y, PS.DEFAULT);
			for(let col = 0; col < MAP_SIZE; col++){
				for(let row = 0; row < MAP_SIZE; row++){
					if(PS.data(col, row) === "warp"){
						//PS.debug("Col: " + col + ", Row: " + row);
						actor_x = col;
						actor_y = row;
						PS.spriteMove(player, actor_x, actor_y);
						PS.audioPlay("fx_powerup4");
						drawVision(true);
					}
				}
			}
		}
		//Found a health Powerup
		if(data === "health"){
			PS.data(actor_x, actor_y, PS.DEFAULT);
			incrementLives(1);
			PS.audioPlay("fx_powerup8");

		}
		//Found an attack powerup
		if(data === "attack"){
			PS.data(actor_x, actor_y, PS.DEFAULT);
			ATTACK_RANGE = 2;
			PS.audioPlay("fx_powerup8");
			let attackUp = PS.timerStart(360, function(){
				PS.timerStop(attackUp);
				ATTACK_RANGE = 1;
			});
		}
		//Reached the end and collected a coin
		if(data === "coin"){
			PS.data(actor_x, actor_y, PS.DEFAULT);
			endScreen();
		}
		//Turn the vision on as soon as they move, and with every movement after.
		drawVision(true);

		// Make all active sprites chase player
		for (let i = 0; i < e_count; i += 1) {
			let e = enemies[i];
			if (PS.spriteShow(e.sprite)) {
				let line = PS.line(e.x, e.y, actor_x, actor_y);
				if (line.length > 0) {
					e.line = line;
					e.step = 0;
				}
			}
		}

	}

	/**
	 * Increments and displays the life counter (both up and down works)
	 * @param value
	 */
	const incrementLives = function(value){
		if((lives + value) > 4){
			PS.audioPlay("fx_shoot8");
			return;
		} else {
			lives = lives + value;
		}
		let lifeDisplay = [];
		for(let i = 0; i < lives; i++){
			lifeDisplay.push('♡️');
		}
		//PS.debug("Lives changed by" + value + "\n");
		//PS.debug(lifeDisplay + "\n");
		PS.statusText(lifeDisplay);
		PS.statusColor(PS.COLOR_WHITE);
		if(lives === 0){
			loseScreen();
		}
	}

	/**
	 * Displays the lose screen TODO make this into one function
	 */
	const loseScreen = function(){
		gameActive = false;
		paused = true;
		drawVision(false);
		drawMap(currentMap, currentTrack);
		incrementLives(3);


		/*gameActive = false;
		PS.spriteShow( player, false ); // hide player
		clearScreen(); // hides all enemies
		PS.color( PS.ALL, PS.ALL, PS.COLOR_BLACK );
		PS.statusColor( 0xD5D5D5 );
		PS.statusText( "Game Over!" );
		PS.timerStop(timer); */
	}

	/**
	 * Creates the vision layer on top of the map, or turns it off.
	 * @param isOn : boolean true if making everything dark, false if lighting it up.
	 */
	const drawVision = function(isOn) {
		PS.gridPlane(3);
		if(isOn) {
			PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
			PS.alpha(PS.ALL, PS.ALL, PS.ALPHA_OPAQUE);
			//Draw the vision "circle"
			for (let x = actor_x - VIEW_DISTANCE; x <= actor_x + VIEW_DISTANCE; x++) {
				for (let y = actor_y - VIEW_DISTANCE; y <= actor_y + VIEW_DISTANCE; y++) {
					if ((x > -1 && y > -1) && (x < MAP_SIZE && y < MAP_SIZE)) {
						let level = getVision(Math.abs(actor_x - x), Math.abs(actor_y - y));
						//PS.debug("Level: " + level + " X: " + x + " Y: " + y + "\n");
						//PS.debug("Actor x + y: " + actor_x + " " + actor_y);
						PS.alpha(x, y, level);
					}
				}
			}
		} else {
			PS.alpha(PS.ALL, PS.ALL, 0);
		}
		PS.gridPlane(0);
	}

	/**
	 * Calculates the opacity at certain distances from the player.
	 * @param x x location relative to player
	 * @param y y location relative to player
	 * @returns {number} opacity at location
	 */
	const getVision = function(x, y){
		let distance =  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		return VIEW_MULTIPLIER * distance;
	}

	/**
	 * Stops an enemy if it has hit a wall or the edge of the map
	 * @param e
	 */
	const stop_enemy = function ( e ) {
		e.line = null;
		e.step = 0;
	};

	/**
	 * Moves the enemies on a timer
	 */
	const _clock = function () {

		if ( paused ) {
			return;
		}

		// Move all active enemies along their current path (if any)

		for ( let i = 0; i < e_count; i += 1 ) {
			let e = enemies[ i ];
			if ( PS.spriteShow( e.sprite ) && e.line ) { // enemy visible and path ready (not null)?

				// Check for end of path

				if ( e.step >= e.line.length ) {
					stop_enemy( e );
					continue; // move on to next enemy
				}

				let p = e.line[ e.step ]; // get next step in path
				let nx = p[ 0 ]; // next x-pos
				let ny = p[ 1 ]; // next y-pos

				// If actor already at next pos,
				// path is exhausted, so stop enemy

				/*if ( ( actor_x === nx ) && ( actor_y === ny ) ) {
					stop_enemy( e );
					continue; // move on to next enemy
				} */

				// Check if another enemy is at the next position and stop so that they cannot stack.
				for(let j = 0; j < e_count; j++){
					if(enemies[i].x === nx && enemies[i].y === ny){
						stop_enemy(e)
						continue;
					}
				}

				// Check out of grid

				if ( ( nx < 0 ) || ( nx >= MAP_SIZE ) || ( ny < 0 ) || ( ny >= MAP_SIZE ) ) {
					stop_enemy( e );
					continue; // move on to next enemy
				}

				// check for wall, stop enemy

				let data = PS.data( nx, ny );
				if ( data === "wall" ) {
					stop_enemy( e );
					continue; // move on to next enemy
				}

				// Move enemy, update position

				PS.spriteMove( e.sprite, nx, ny );
				e.x = nx;
				e.y = ny;
				//PS.debug("Moved enemy " + i);
			}
		}

	};

	/**
	 * Eliminates any enemies surrounding the player (doesn't work)
	 */
	const eliminate = function() {
		if (deactivate) {
			return
		} else {
			for (let y = actor_y - ATTACK_RANGE; y < (actor_y + ATTACK_RANGE + 1); y += 1) {
				for (let x = actor_x - ATTACK_RANGE; x < (actor_x + ATTACK_RANGE + 1); x += 1) {
					// Only check locations on the map
					if ((x >= 0) && (x < MAP_SIZE) && (y >= 0) && (y < MAP_SIZE)) {
						// Don't check if location is a wall
						if (PS.data(x, y) !== "wall") {
							// Look for visible sprites at this location
							for (let i = 0; i < e_count; i += 1) {
								let e = enemies[i];
								if (PS.spriteShow(e.sprite) && (e.x === x) && (e.y === y)) {
									PS.spriteShow(e.sprite, false); // hide sprite; dead!
									PS.audioPlay("fx_bang");
									deactivate = true;
									let cooldown = PS.timerStart(40, function(){
										PS.timerStop(cooldown);
										deactivate = false;
									});
								}
							}
						}
					}
				}
			}
		}
	};

	/**
	 * Deals damage to the player when they walk next to an enemy
	 * @param s1
	 * @param p1
	 * @param s2
	 * @param p2
	 * @param type
	 */
	const damage = function(s1, p1, s2, p2, type){
		//PS.debug("Called increment from collision; ");
		if(type === PS.SPRITE_OVERLAP) {
			incrementLives(-1);
			PS.audioPlay("fx_scratch");
		}
	}

	// BREAK BETWEEN FUNCTIONS AND EXPORTS

	const exports = {

		/**
		 * Initializes the game with grid size, status, and start screen
		 * @param system
		 * @param options
		 */
		init: function (system, options) {
			const TEAM = "TeamDomino";

			PS.gridSize(MAP_SIZE, MAP_SIZE);

			//PS.debug("called increment from init");
			// Activate the life counter by incrementing it by zero (not changing it at all)
			incrementLives(0);

			PS.gridColor(0x242424);

			PS.audioLoad("fx_scratch");
			PS.audioLoad("fx_bang");
			PS.audioLoad("fx_powerup4");
			PS.audioLoad("fx_shoot8");
			PS.audioLoad("fx_powerup8");


			// *BM* set up player sprite only once!

			player = PS.spriteSolid( 1, 1 );
			PS.spriteSolidColor( player, PS.COLOR_WHITE );
			PS.spritePlane( player, PLANE_ACTOR );
			PS.spriteCollide( player, damage );

			// Create a pool of re-usable enemies

			for ( let i = 0; i < MAX_ENEMIES; i += 1 ) {
				let s = PS.spriteSolid( 1, 1 );
				PS.spritePlane( s, PLANE_ENEMY );
				PS.spriteSolidColor( s, COLOR_ENEMY );
				enemies.push( {
					sprite : s,
					line : null,
					step : 0,
					x : 0, // x-pos of enemy
					y : 0 // y-pos of enemy
				} );
			}

			drawMap(currentMap, currentTrack);

			timer = PS.timerStart( 45, _clock ); // start the timer

			PS.keyRepeat(true, 10, 7); //set the key repeat times.

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

		/**
		 * Calls move when WASD or the arrows are pressed
		 * @param key
		 * @param shift
		 * @param ctrl
		 * @param options
		 */
		keyDown: function (key, shift, ctrl, options) {
			switch (key) {
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
					move(1, 0);
					break;
				}
				case PS.KEY_SPACE: {
					eliminate();
				}
			}
		},

	}

	return exports;
} () );

PS.init = G.init;

PS.keyDown = G.keyDown;

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

