# SchemeStyles object

Sets default color and other styles for plots.

Allows defining styles for multiple app's color schemes. As for now, they are _dark_ and _light_. Each scheme has own field in the object that named correspondingly. If _light_ scheme is not set, _dark_ one is used.

Each single scheme style object has a set of fields with names referring to [plots](plots.md). The value of these fields are objects with the next fields:

* `color` _String_: [named web colors](https://en.wikipedia.org/wiki/Web_colors)
* `lineWidth` _Number_: in pixels
* `lineStyle` _Number_: an index of style in the list of line styles in the app's Indicator Editor
* `opacity` _Number_: in percents

### Example

```javascript
...

module.exports = {
    ...

    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "blue", lineStyle: 3 }
        }
    }

};
```

See also [Human-friendlier EMA](index.md#human-friendlier-ema) example
