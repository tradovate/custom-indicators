When we define or calculate measurements in chart space when using Custom Indicators or Custom Drawing Tools, we need to consider the unit type that we are working with. We use two typical unit types when developing custom Tradovate tools:

- `px`: the `px` unit is for pixels. When we want to define something with an absolute pixel unit value, we use `px`.
- `du`: the `du` unit stands for *domain units*. In the X axis, domain units are the index of the bar, while in the Y axis they are the price of the asset.

We provide helper functions to work with the Scale Bound values expected by anything that requires a {@link Point} type object. We can import those functions into our Custom Indicator or Custom Drawing file like so:

```js
const { px, du, op, min, max } = require('./tools/graphics')
//...
```

Let's review each of these functions and their use.

- `px` and `du`: Simply defines a Scale Bound value in either `px` or `du` unit spaces respectively.
- `op`: allows for operation between `px` or `du` Scale Bound values. This allows us to write code like so - `const myVal = op(px(16), '-', du(4525))` - this would result in a value equal to 16 pixels above the 4525 price, given that this is used for a `y` coordinate.
- `min`: chooses the lesser of a value. Ex. `min(px(d.index()*16), du(d.index())` will choose the smaller of 16 pixels times the bar index, or the bar index as a domain unit.
- `max`: works exactly the same way as `min`, except it chooses the larger of the given values.

Anytime we need to define a point in chart space, we will need to provide ScaleBound values. Knowing how to use these functions will save you time and effort when it comes to creating custom tools. Some examples of ScaleBound values in the wild are the `x` and `y` fields of any {@link Point} type object (so anchors in custom drawing tools, or the `point` field of a Text type DisplayObject).