# motion

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module shows camera window when motion is detected by motion tool

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: MMM-Motion-Camera,
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option              | Description
|-------------------- |-----------
| `height`            | *Optional* video window height <br><br>**Type:** `string` <br>Default 300px
| `width`             | *Optional* video window width  <br><br>**Type:** `string` <br>Default 100%
| `scrolling`         | *Optional* enable scrolling    <br><br>**Type:** `string` <br>Default no
| `notification_label`| *Optional* notification label tha change mode (motion detected/idle)<br><br>**Type:** `string` <br>Default MOTION_DETECTED
| `cameraUrl`         | *Required* camera feed URL    <br><br>**Type:** `string` <br>Example http://door/picture/1/frame/
