# Plotter object

The plotter specifies how to plot output results: as lines, dots, columns, or a custom algorithm.

### Lines

* `type: "multiline"`
* `fields` _String_[]: array of plot names. Plot name coincides with an output field.

### Dots

* `type: "dots"`
* `field` _String_: plot name

### Columns

* `type: "columns"`
* `field` _String_: plot name

### Custom plotter

* `type: "custom"`
* `function` _Function_: a custom function that draws results to a canvas

The function should have the next signature: `function someCustomPlotter(canvas, calculatorInstance, outputHistory)`

`canvas` object has the next methods:

#### `drawLine(pnt1, pnt2, style)`

Draws a single line between two points

* `pnt1`, `pnt2` _Object_: with `x` and `y` fields. `y` is a value in the domain of the indicator, no need to translate to screen coordinates. See [plotting tool module](plotter.md#Plotting) below about `x`
* `style` _Object_ (optional):
  - `color` _String_ (optional): web color
  - `width` _Number_ (optional): line width in pixels
  - `relativeWidth` _Number_ (optional): line width relatively OHLC bar space. `width` should be omitted
  - `opacity` _Number_ (optional): as a 0..1 fraction

#### `drawPath(path, style)`

Draws a multi-segment line

* `path` _Object_: An object created by `plotting.createPath()` function. See [plotting tool module](plotter.md#Plotting) below
* `style` _Object_: The same as `drawLine` style

#### `drawHeatmap(heatmap)`

Draws a heat map

* `heatmap` _Object_: An object created by `createHeatmap(lowerBound, upperBound)` function. See [plotting tool module](plotter.md#Plotting) below

### Plotting module

```javascript
const plotting = require("./tools/plotting");
```

This module encapsulates several functions that intended to simplify working with `canvas`

#### `plotting.x.get(outputHistoryItem)`

Evaluates `x` coordinate of an output item for using with `canvas.drawLine` and `canvas.drawPath` functions

Note: x coordinate in the app is not a number. You cannot use regular Javascript arithmetic operations.

#### `plotting.x.relative(x, dx)`

Evaluates a new coordinate as a `dx`-pixel step from `x`.

#### `plotting.x.between(x1, x2, k)`

Evaluates a new coordinate as a value between `x1` and `x2` that splits the distance between them as `k`:`1.0 - k`

#### `plotting.createPath()`

Returns an object that encapsulates details about a multi-segment path.

##### Methods of the `path` object

* `moveTo(x, y)`: moves the cursor to a new point
* `lineTo(x, y)`: draws a line from the last coordinates of the cursor to a new point. Moves the cursor to this point.
* `end()`: finalizes building the path and returns a result object that can be passed to `canvas.drawPath` function

#### `plotting.createHeatmap(lowerBound, upperBound)`

Returns an object that encapsulates details about heat map. The heat map consists of multiple bands (or columns), one band per each output item.

##### Methods of the `heatmap` object

* `addColumn(x, colors)`: add a new band/color. Each band/column covers a range of values between `lowerBound` and `upperBound` at the `x` coordinate. `colors` is an array of web colors. Each color fills out equal space in the band/column.
* `end()`: finalizes building the heatmap and returns a result object that can be passed to `canvas.drawHeatmap` function

### Example

See [here](index.md#plotters)
