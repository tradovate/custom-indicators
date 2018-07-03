# Calculator class

## Properties

The app assigns the next properties upon initialization of the calculator instance.

### `props`
An object with user-specified parameters. See [Params](params.md)

### `contractInfo`
An object with financial contract info:
* `contract` _String_: symbol like `ESU8`
* `product` _String_: name of product like `ES`
* `tickSize` _Number_: product's tick size

### `chartDescription`
The same as `chartDescription` field of [Get Chart](https://github.com/tradovate/api/blob/master/MarketData.md#get-chart) request related to attached chart.

### dlls
_Standalone Windows app only_
An object that points to materialized DLLs that were specified in [indicator's module export](indicator-module.md). Each field is an interface object to corresponding DLL. See [example of usage](index.md#blackbox-dll)

## Methods

### `init()`

The app calls the method before running an iteration through input series items. The implementation is optional. Can be used to reset an internal calculation state.

```javascript
class ema {
    init() {
        this.previousMA = undefined;
        this.initialSum = 0;
    }
    ...
}
```

### `map(entity, index)`

The app calls this method in the loop for each input item.

* `entity` _Object_: the current input value
  - `timestamp()` _Date_: Date/time
  - `value()` _Number_: input data value or Close price of OHLC if `inputType === "bars"`
  - `high()`, `low()`, `open()`, `close()` _Number_: access to prices of OHLC if `inputType === "bars"`
  - `volume()`, `offerVolume()`, `bidVolume()` _Number_: access to volume values of OHLC if `inputType === "bars"`
  - `profile()` [_VolumeProfile_](volume-profile.md): access to volume profile of OHLC if `inputType === "bars"` and the chart is Bid/Ask type
* `index` _Number_: Position in the input series

The method should return one of the next values:
* a numeric value for a basic single line plot;
* an object with fields that can be used for later for displaying multiple or custom plots or further calculations;
* `undefined` to represent empty value in the output

Additionally, if `map` returns the result as an object, it is possible to specify styling for this particular output item and/or for the corresponding candlestick. See details [here](index.md#signaling-average-true-range)

### filter(mappedValue)

The app calls the method with the value returned by `map` to remove some result values. The method should return `true` if the value should stay. The implementation is optional.
