# Indicator's module

Module with indicator should export an object with the next fields:

* `name` _String_: Unique identifier associated with the indicator
* `description` _String_ (optional): Readable text that used in UI
* `calculator` [_Calculator_](calculator.md): Calculation algorithm
* `params` [_Params_](params.md)(optional): Set of input parameters
* `inputType` _String_(optional): Expected type of input series. Can be `bars`, `volume`, `any`. Default: `any`
* `areaChoice` _String_(optional): Default choice for placement. Can be `overlay`, `new`. Default: `overlay`
* `plots` [_Plots_](plots.md)(optional): Output results for displaying. Default: only numeric output as-is or `value` field of the output object
* `plotter` [_Plotter_](plotter.md) or [_Plotter_](plotter.md)[] (optional): How to plot results. Default: single line plotter
* `tags` _String_[](optional): How to group with other similar indicators
* `schemeStyles` [_SchemeStyle_](schemeStyles.md)(optional): Default color/style of plotted results
* `scaler` [_Scaler_](scaler.md)(optional): How to auto-scale results in the chart area. Default: all `plots` should fit in
* `dlls` [_DLLs_](dlls.md)(optional, _standalone Windows apps only_): Windows DLL import specification

## Example

```javascript
const predef = require("./tools/predef");

...

module.exports = {
    name: "spectrogram",
    description: "Spectrogram",
    calculator: spectrogram,
    params: {
        period: predef.paramSpecs.period(64)
    },
    tags: ["Fourier Analysis"],
    areaChoice: "new",
    plotter: [
        predef.plotters.custom(heatmapPlotter)
    ],
    scaler: predef.scalers.multiPath(["lower", "upper"])
};
```
