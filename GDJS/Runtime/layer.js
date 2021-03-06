/*
 * GDevelop JS Platform
 * Copyright 2013-2016 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

/**
 * Represents a layer of a scene, used to display objects.
 *
 * *Not yet implemented:* Viewports and support for multiple cameras
 *
 * @class Layer
 * @namespace gdjs
 * @constructor
 */
gdjs.Layer = function(layerData, runtimeScene)
{
    this._name = layerData.name;
    this._cameraRotation = 0;
    this._zoomFactor = 1;
    this._timeScale = 1;
    this._hidden = !layerData.visibility;
    this._effects = layerData.effects || [];
    this._cameraX = runtimeScene.getGame().getDefaultWidth()/2;
    this._cameraY = runtimeScene.getGame().getDefaultHeight()/2;
    this._width = runtimeScene.getGame().getDefaultWidth();
    this._height = runtimeScene.getGame().getDefaultHeight();

    this._renderer = new gdjs.LayerRenderer(this, runtimeScene.getRenderer());
    this.show(!this._hidden);
    this.setEffectsDefaultParameters();
};

gdjs.Layer.prototype.getRenderer = function() {
   return this._renderer;
};

/**
 * Get the name of the layer
 * @method getName
 * @return {String} The name of the layer
 */
gdjs.Layer.prototype.getName = function() {
	return this._name;
};

/**
 * Change the camera center X position.
 *
 * @method getCameraX
 * @param cameraId The camera number. Currently ignored.
 * @return The x position of the camera
 */
gdjs.Layer.prototype.getCameraX = function(cameraId) {
	return this._cameraX;
};

/**
 * Change the camera center Y position.
 *
 * @method getCameraY
 * @param cameraId The camera number. Currently ignored.
 * @return The y position of the camera
 */
gdjs.Layer.prototype.getCameraY = function(cameraId) {
	return this._cameraY;
};

/**
 * Set the camera center X position.
 *
 * @method setCameraX
 * @param x {Number} The new x position
 * @param cameraId The camera number. Currently ignored.
 */
gdjs.Layer.prototype.setCameraX = function(x, cameraId) {
	this._cameraX = x;
	this._renderer.updatePosition();
};

/**
 * Set the camera center Y position.
 *
 * @method setCameraY
 * @param y {Number} The new y position
 * @param cameraId The camera number. Currently ignored.
 */
gdjs.Layer.prototype.setCameraY = function(y, cameraId) {
	this._cameraY = y;
	this._renderer.updatePosition();
};

gdjs.Layer.prototype.getCameraWidth = function(cameraId) {
	return (+this._width)*1/this._zoomFactor;
};

gdjs.Layer.prototype.getCameraHeight = function(cameraId) {
	return (+this._height)*1/this._zoomFactor;
};

gdjs.Layer.prototype.show = function(enable) {
	this._hidden = !enable;
    this._renderer.updateVisibility(enable);
};

/**
 * Check if the layer is visible.
 *
 * @method isVisible
 * @return true if the layer is visible.
 */
gdjs.Layer.prototype.isVisible = function() {
	return !this._hidden;
};

/**
 * Set the zoom of a camera.
 *
 * @method setCameraZoom
 * @param The new zoom. Must be superior to 0. 1 is the default zoom.
 * @param cameraId The camera number. Currently ignored.
 */
gdjs.Layer.prototype.setCameraZoom = function(newZoom, cameraId) {
	this._zoomFactor = newZoom;
	this._renderer.updatePosition();
};

/**
 * Get the zoom of a camera.
 *
 * @method getZoom
 * @param cameraId The camera number. Currently ignored.
 * @return The zoom.
 */
gdjs.Layer.prototype.getCameraZoom = function(cameraId) {
	return this._zoomFactor;
};

/**
 * Get the rotation of the camera, expressed in degrees.
 *
 * @method getCameraRotation
 * @param cameraId The camera number. Currently ignored.
 * @return The rotation, in degrees.
 */
gdjs.Layer.prototype.getCameraRotation = function(cameraId) {
	return this._cameraRotation;
};

/**
 * Set the rotation of the camera, expressed in degrees.
 * The rotation is made around the camera center.
 *
 * @method setCameraRotation
 * @param rotation {Number} The new rotation, in degrees.
 * @param cameraId The camera number. Currently ignored.
 */
gdjs.Layer.prototype.setCameraRotation = function(rotation, cameraId) {
	this._cameraRotation = rotation;
	this._renderer.updatePosition();
};

/**
 * Convert a point from the canvas coordinates (For example, the mouse position) to the
 * "world" coordinates.
 *
 * TODO: Update this method to store the result in a static array
 *
 * @method convertCoords
 * @param x {Number} The x position, in canvas coordinates.
 * @param y {Number} The y position, in canvas coordinates.
 * @param cameraId The camera number. Currently ignored.
 */
gdjs.Layer.prototype.convertCoords = function(x, y, cameraId) {
	x -= this._width/2;
	y -= this._height/2;
	x /= Math.abs(this._zoomFactor);
	y /= Math.abs(this._zoomFactor);

	var tmp = x;
	x = Math.cos(this._cameraRotation/180*3.14159)*x - Math.sin(this._cameraRotation/180*3.14159)*y;
	y = Math.sin(this._cameraRotation/180*3.14159)*tmp + Math.cos(this._cameraRotation/180*3.14159)*y;

	return [x + this.getCameraX(cameraId), y + this.getCameraY(cameraId)];
};

gdjs.Layer.prototype.convertInverseCoords = function(x, y, cameraId) {
   x -= this.getCameraX(cameraId);
   y -= this.getCameraY(cameraId);

	var tmp = x;
	x = Math.cos(-this._cameraRotation/180*3.14159)*x - Math.sin(-this._cameraRotation/180*3.14159)*y;
	y = Math.sin(-this._cameraRotation/180*3.14159)*tmp + Math.cos(-this._cameraRotation/180*3.14159)*y;

   x *= Math.abs(this._zoomFactor);
   y *= Math.abs(this._zoomFactor);

	return [x + this._width/2, y + this._height/2];
};

gdjs.Layer.prototype.getWidth = function() {
    return this._width;
};

gdjs.Layer.prototype.getHeight = function() {
    return this._height;
};

gdjs.Layer.prototype.getEffects = function() {
    return this._effects;
};

gdjs.Layer.prototype.setEffectParameter = function(name, parameterIndex, value) {
    return this._renderer.setEffectParameter(name, parameterIndex, value);
};

gdjs.Layer.prototype.setEffectsDefaultParameters = function() {
    for (var i = 0; i < this._effects.length; ++i) {
        var effect = this._effects[i];
        for (var name in effect.parameters) {
            this.setEffectParameter(effect.name, name, effect.parameters[name]);
        }
    }
};

/**
 * Set the time scale for the objects on the layer:
 * time will be slower if time scale is < 1, faster if > 1.
 * @method setTimeScale
 * @param timeScale {Number} The new time scale (must be positive).
 */
gdjs.Layer.prototype.setTimeScale = function(timeScale) {
	if ( timeScale >= 0 ) this._timeScale = timeScale;
};

/**
 * Get the time scale for the objects on the layer.
 * @method getTimeScale
 */
gdjs.Layer.prototype.getTimeScale = function() {
	return this._timeScale;
};

/**
 * Return the time elapsed since the last frame,
 * in milliseconds, for objects on the layer.
 * @method getElapsedTime
 */
gdjs.Layer.prototype.getElapsedTime = function(runtimeScene) {
   return runtimeScene.getTimeManager().getElapsedTime() * this._timeScale;
}
