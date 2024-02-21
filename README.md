# Tyruswoo Camera Control for RPG Maker MV

Tyruswoo's Camera Control plugin allows greater control of the camera.

## Plugin Commands
- `CamSet`
- `CamFollow`

### A Few Notes
- `CamSet` simply places the camera at a certain position, but the camera
    will still be attempting to follow its current target (usually the
    player, by default).
- `CamFollow` allows changing the camera's target.  This can be used to
    make the camera follow a certain event's perspective.  Or, the
    camera can be set to follow the map (i.e. a fixed perspective).
- These plugin commands can be used in combination with the "Scroll Map..."
  event command, found on Event Commands tab 2, under the Movement section.

### Plugin Command Usage
In all plugin command calls described below, place `x` and `y` with coordinates, and replace `ID` with an event's ID number.

`CamSet x y` sets the camera's position to x and y, where x and y are integers.

`CamSet player` sets the camera's position to the player's current position.

`CamSet event ID` sets the camera's position to the current location
of the event of the given ID.

`CamFollow x y` makes the camera follow (lock on) the given coordinates.
- This sets the camera to "follow" the map; i.e., to not
  move unless the "Scroll Map..." event command is used.
- This is useful is conjunction with the event command
  "Scroll Map..." (found on Event Commands tab 2, under
  the Movement section).  This allows for cutscenes
  where the camera is set to follow a certain path, but
  the player can still move as they please.
- Note that the "Scroll Map..." event command can be
  used in two directions at once, allowing for diagonal
  panning of the camera.

`CamFollow map` makes the camera follow (lock on) the map, at the
camera's current position, without defining coordinates.

`CamFollow player` makes the camera follow the player.
This is the same as the default behavior of the RPG Maker MV camera.

`CamFollow event ID` makes the camera follow the position of the given event.
This can be useful in making cutscenes that follow a certain event.
If the event is invisible, then it can look like the camera is simply panning across a scene.
- This can also be used to allow for cutscenes where
  the camera is set to follow a certain path, while the
  player can move as they please.
- Can also be used in combination with the "Scroll
  Map..." event command, allowing for diagonal panning
  of the camera.

### For more help using the Screenshot Snapper plugin, see [Tyruswoo.com](https://www.tyruswoo.com).

## Version History

**v1.0**
- Plugin released.

**v1.1** - 2/1/2020
- Fixed a bug that resulted in an event's speed increasing when targeted
       by the CamFollow Event plugin command.

**v1.1.1** - 9/2/2023
- This plugin is now free and open source under the MIT license.

**v1.1.2** - 2/21/2024
- Fixed a compatibility issue with other plugins that alter Game_Player's
  update function.