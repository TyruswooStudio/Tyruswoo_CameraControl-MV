//=============================================================================
// Camera Control
// by Tyruswoo
// TYR_CameraControl.js
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2026 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Imported = Imported || {};
Imported.TYR_CameraControl = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.CameraControl = Tyruswoo.CameraControl || {};

/*:
 * @plugindesc MV v1.2.0  Allows greater control of the camera.
 * @author Tyruswoo
 *
 * @help
 * Camera Control for RPG Maker MV by Tyruswoo
 * Allows greater control of the camera.
 *
 * Plugin Commands:
 *   CamSet
 *   CamFollow
 *
 * A Few Notes:
 * - CamSet simply places the camera at a certain position, but the camera
 *     will still be attempting to follow its current target (usually the
 *     player, by default).
 * - CamFollow allows changing the camera's target.  This can be used to
 *     make the camera follow a certain event's perspective.  Or, the
 *     camera can be set to follow the map (i.e. a fixed perspective).
 * - These plugin commands can be used in combination with the "Scroll Map..."
 *   event command, found on Event Commands tab 2, under the Movement section.
 * 
 * ============================================================================
 * Plugin Command Usage:
 * (Replace x and y with coordinates, and replace ID with an event's ID number.)
 *
 *  CamSet x y           Sets the camera's position to x and y,
 *                       where x and y are integers.
 *
 *  CamSet player        Sets the camera's position to the player's
 *                       current position.
 *
 *  CamSet event ID      Sets the camera's position to the current location
 *                       of the event of the given ID.
 *
 *  CamFollow x y        Makes the camera follow (lock on) the given coordinates.
 *                       - This sets the camera to "follow" the map; i.e., to not
 *                         move unless the "Scroll Map..." event command is used.
 *                       - This is useful is conjunction with the event command
 *                         "Scroll Map..." (found on Event Commands tab 2, under
 *                         the Movement section).  This allows for cutscenes
 *                         where the camera is set to follow a certain path, but
 *                         the player can still move as they please.
 *                       - Note that the "Scroll Map..." event command can be
 *                         used in two directions at once, allowing for diagonal
 *                         panning of the camera.
 *
 *  CamFollow map        Makes the camera follow (lock on) the map, at the
 *                       camera's current position, without defining coordinates.
 *
 *  CamFollow player     Makes the camera follow the player.  This is the same
 *                       as the default behavior of the RPG Maker MV camera.
 *
 *  CamFollow event ID   Makes the camera follow the position of the given event.
 *                       This can be useful in making cutscenes that follow a
 *                       certain event.  If the event is invisible, then it can
 *                       look like the camera is simply panning across a scene.
 *                       - This can also be used to allow for cutscenes where
 *                         the camera is set to follow a certain path, while the
 *                         player can move as they please.
 *                       - Can also be used in combination with the "Scroll
 *                         Map..." event command, allowing for diagonal panning
 *                         of the camera.
 * ============================================================================
 * Scripting Functions:
 * 
 * Camera Control comes with functions that can be called inside scripts.
 * These functions correspond to the plugin commands described above.
 * 
 * Replace x and y with coordinates, and replace id with an event's ID number.
 * The scripting functions are written as shown below:
 * 
 *     // Camera setting functions
 *     Tyruswoo.CameraControl.setOnCoords(x, y);
 *     Tyruswoo.CameraControl.setOnPlayer();
 *     Tyruswoo.CameraControl.setOnEvent(id);
 * 
 *     // Camera following functions
 *     Tyruswoo.CameraControl.followCoords(x, y);
 *     Tyruswoo.CameraControl.followMap();
 *     Tyruswoo.CameraControl.followPlayer();
 *     Tyruswoo.CameraControl.followEvent(id);
 * 
 * ============================================================================
 * Debugging Camera Control Commands:
 * 
 * To see output from Camera Control (and any other plugins that might log to
 * the console), press the F12 key while in game to open the console.
 * When you run a Camera Control plugin command or script function, the action
 * it takes will be logged to the console.
 * 
 * For example, if the plugin command `CamFollow Player` runs, and the player
 * is at the coordinates (44, 12), the console logs the following:
 * 
 *     CamFollow: Camera now following player's position: x = 44 , y = 12
 * 
 * The log message will tell whether the command's point of reference is the
 * player, an event, the map, or coordinates.
 * 
 * Now suppose the plugin command `CamSet Foo` runs. This is not expected usage
 * so the console shows the following warning:
 * 
 *     Ignoring unrecognized CamSet command: CamSet Foo
 * 
 * So if Camera Control ever isn't behaving as you expect, you can check the
 * console for clues to what happened.
 * 
 * ============================================================================
 * Visit Tyruswoo.com to ask for help, donate, or browse more of our plugins.
 * ============================================================================
 * Version History:
 * 
 * v1.0:
 *   - Plugin released.
 *
 * v1.1:  2/1/2020
 *   - Fixed a bug that resulted in an event's speed increasing when targeted
 *        by the CamFollow Event plugin command.
 * 
 * v1.1.1:  9/2/2023
 *   - This plugin is now free and open source under the MIT license.
 *
 * v1.1.2:  2/21/2024
 *   - Fixed a compatibility issue with other plugins that alter Game_Player's
 *     update function.
 * 
 * v1.2.0:  4/9/2026
 *   - Improved tolerance for spelling and syntax variations.
 *   - Added static functions for use in scripting.
 * 
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2026 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 * ============================================================================
 */

//=============================================================================
// Static functions: camera position setting
//=============================================================================

Tyruswoo.CameraControl.setOnPlayer = function() {
	const x = $gamePlayer.x;
	const y = $gamePlayer.y;
	console.log("CamSet: Setting camera to player's position: x =", x, ", y =", y);
	$gamePlayer.center(x, y);
};

Tyruswoo.CameraControl.setOnEvent = function(eventId) {
	const x = $gameMap._events[eventId].x;
	const y = $gameMap._events[eventId].y;
	console.log("CamSet: Setting camera to position of event", eventId, ": x =", x, ", y =", y);
	$gamePlayer.center(x, y);
};

Tyruswoo.CameraControl.setOnCoords = function(x, y) {
	console.log("CamSet: Setting camera to coordinates: x =", x, ", y =", y);
	$gamePlayer.center(x, y);
};

//=============================================================================
// Static functions: camera following
//=============================================================================

Tyruswoo.CameraControl.followPlayer = function() {
	const x = $gamePlayer.x;
	const y = $gamePlayer.y;
	console.log("CamFollow: Camera now following player's position: x =", x, ", y =", y);
	$gamePlayer.center(x, y);
	$gameMap._camFollow = 'player';
};

Tyruswoo.CameraControl.followEvent = function(eventId) {
	const x = $gameMap._events[eventId].x;
	const y = $gameMap._events[eventId].y;
	console.log("CamFollow: Camera now following position of event", eventId, ": x =", x, ", y =", y);
	$gamePlayer.center(x, y);
	$gameMap._camFollow = 'event';
	$gameMap._camFollowEventID = eventId;
};

Tyruswoo.CameraControl.followMap = function() {
	console.log("CamFollow: Camera now following the map.");
	$gameMap._camFollow = 'map';
}

Tyruswoo.CameraControl.followCoords = function(x, y) {
	console.log("CamFollow: Camera now following coordinates: x =", x, ", y =", y);
	$gamePlayer.center(x, y);
	$gameMap._camFollow = 'map';
}

//=============================================================================
// Static coords parsing helpers
//=============================================================================

// This regular expression recognizes x,y coordinates in a variety of formats:
// * Positive, negative, or zero.
// * Separated by comma, space, or both.
// * Surrounded by parentheses, or not.
Tyruswoo.CameraControl.COORDS_REGEX = /^\(?(-?\d+)(?:,|, | )(-?\d+)\)?$/;

Tyruswoo.CameraControl.isCoords = function(args) {
	return Tyruswoo.CameraControl.COORDS_REGEX.test(args.join(' '));
};

Tyruswoo.CameraControl.parseCoords = function(args) {
	let str = args.join(' ');
	let captures = str.match(Tyruswoo.CameraControl.COORDS_REGEX);
	return [Number.parseInt(captures[1]), Number.parseInt(captures[2])];
};

//=============================================================================
// Game_Map
//=============================================================================

// Alias method
Tyruswoo.CameraControl.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function(mapId) {
	Tyruswoo.CameraControl.Game_Map_initialize.call(this, mapId);
	this._camFollow = 'player';
	this._camFollowEventID = 0;
};

//=============================================================================
// Game_Player
//=============================================================================

// Alias method
Tyruswoo.CameraControl.Game_Player_updateScroll =
	Game_Player.prototype.updateScroll;
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
	const camFollow = $gameMap._camFollow;
	if ('map' == camFollow) {
		return; // Don't scroll.
	} else if ('event' == camFollow) {
		const eventID = $gameMap._camFollowEventID;
		const event = $gameMap._events[eventID];
		if (eventID > 0 && event !== undefined) {
			// Center camera on this event, regardless of its position.
			$gamePlayer.center(event._realX, event._realY);
		}
		return;
	}
	// Otherwise, scroll with the player.
	Tyruswoo.CameraControl.Game_Player_updateScroll.call(this,
		lastScrolledX, lastScrolledY);
};

//=============================================================================
// Game_Interpreter
//=============================================================================

// Alias method
Tyruswoo.CameraControl.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command === 'CamSet') {
		// Set the camera's position.
		const firstArg = args[0].toLowerCase();
		if (firstArg.startsWith('p')) {
			Tyruswoo.CameraControl.setOnPlayer();
		} else if (firstArg.startsWith('e') && !!args[1]) {
			Tyruswoo.CameraControl.setOnEvent(Number.parseInt(args[1]));
		} else if (Tyruswoo.CameraControl.isCoords(args)) {
			let [x, y] = Tyruswoo.CameraControl.parseCoords(args);
			Tyruswoo.CameraControl.setOnCoords(x, y);
		} else {
			console.warn(`Ignoring unrecognized CamSet command: ${command} ${args.join(' ')}`);
		}
	} else if (command === 'CamFollow') {
		// Make the camera move with the specified frame of reference.
		const firstArg = args[0].toLowerCase();
		if (firstArg.startsWith('p')) {
			Tyruswoo.CameraControl.followPlayer();
		} else if (firstArg.startsWith('e') && !!args[1]) {
			Tyruswoo.CameraControl.followEvent(Number.parseInt(args[1]));
		} else if (firstArg.startsWith('m')) {
			Tyruswoo.CameraControl.followMap();
		} else if (Tyruswoo.CameraControl.isCoords(args)) {
			let [x, y] = Tyruswoo.CameraControl.parseCoords(args);
			Tyruswoo.CameraControl.followCoords(x, y);
		} else {
			console.warn(`Ignoring unrecognized CamFollow command: ${command} ${args.join(' ')}`);
		}
	} else {
		// Not a Camera Control command.
		// Pass the plugin command through to other plugins.
		Tyruswoo.CameraControl.Game_Interpreter_pluginCommand.call(this, command, args);
	}
};
