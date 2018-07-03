# Plots object

The object specifies a set of plots that will be displayed in Data Box of the chart and can be plotted by [plotters](plotters.md). If plotters are not specified, all plots are plotted as lines.

Field names of the object refers to a value of output object returned from `map` method of [calculator](calculator.md)

Each field specifies an object with the next fields:
* `title` _String_: how to show it in Data Box and Indicator Editor's style section
* `displayOnly` _Boolean_: specifies if the plot should be displayed only on the chart, but do not show it in Data Box

### Example

```javascript
...

module.exports = {
    ...

    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },

    ...
};
```
