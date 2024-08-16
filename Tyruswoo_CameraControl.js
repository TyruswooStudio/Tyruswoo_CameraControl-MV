//=============================================================================
// Camera Control
// by Tyruswoo
// TYR_CameraControl.js
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
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
 * @plugindesc MV v1.1.2  Allows greater control of the camera.
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
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
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
	var camFollow = $gameMap._camFollow;
	if ('map' == camFollow) {
		return; // Don't scroll.
	} else if ('event' == camFollow) {
		var eventID = $gameMap._camFollowEventID;
		var event = $gameMap._events[eventID];
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
    Tyruswoo.CameraControl.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'CamSet') {
		switch (args[0]) {
			case 'player':
			case 'Player':
				var x = $gamePlayer.x;
				var y = $gamePlayer.y;
				console.log("CamSet: Setting camera to player's position: x =", x, ", y =", y);
				$gamePlayer.center(x, y);
				break;
			case 'event':
			case 'Event':
				var id = parseInt(args[1]);
				var x = $gameMap._events[id].x;
				var y = $gameMap._events[id].y;
				console.log("CamSet: Setting camera to position of event", id, ": x =", x, ", y =", y);
				$gamePlayer.center(x, y);
				break;
			default:
				var x = parseInt(args[0]);
				var y = parseInt(args[1]);
				console.log("CamSet: Setting camera to coordinates: x =", x, ", y =", y);
				$gamePlayer.center(x, y);
		}
	} else if (command === 'CamFollow') {
		switch (args[0]) {
			case 'player':
			case "player":
				var x = $gamePlayer.x;
				var y = $gamePlayer.y;
				console.log("CamFollow: Camera now following player's position: x =", x, ", y =", y);
				$gamePlayer.center(x, y);
				$gameMap._camFollow = 'player';
				break;
			case 'event':
			case 'Event':
				var id = parseInt(args[1]);
				var x = $gameMap._events[id].x;
				var y = $gameMap._events[id].y;
				console.log("CamFollow: Camera now following position of event", id, ": x =", x, ", y =", y);
				$gamePlayer.center(x, y);
				$gameMap._camFollow = 'event';
				$gameMap._camFollowEventID = id;
				break;
			case 'map':
			case 'Map':
				console.log("CamFollow: Camera now following the map.");
				$gameMap._camFollow = 'map';
				break;
			default:
				var x = parseInt(args[0]);
				var y = parseInt(args[1]);
				console.log("CamFollow: Camera now following coordinates: x =", x, ", y =", y);
				$gamePlayer.center(x, y);
				$gameMap._camFollow = 'map';
		}
	}
};
