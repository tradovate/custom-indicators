## Javascript

Tradovate Trader is a cross-platform application: we run it as a standalone application on Windows, Mac OS, Android, iOS and via regular modern web browsers. To achieve it, our decision was to leverage a cross-platform programming language and SDK that would be available on all these platforms with no (ok, almost no) changes. Javascript is the perfect fit for this idea.

When the app is based on Javascript, charting is supposed to be Javascript-based too. As well as builtin technical indicators that a must-have feature of trading application. The next step is just to expose the internal API to public to make custom indicators possible.

In spite of old popular beliefs, the modern Javascript is not scary unreliable some-glue-for-html slow stuff anymore like it was just several years ago. New standards like ES6 made Javascript friendlier for developers with object-oriented background. If you are familiar with C#, C++, Java or Scala, you can find out a lot of surprising similarities.

The range of open source packages can satisfy (up to some degree, of course) any data science needs: you can find out as digital signal processing libraries as well as machine learning ones. The most advanced of them use your GPU even on mobile phone behind scene to speed up calculations.

There is a lot of educational material in Internet - starting from [W3 schools](https://www.w3schools.com/js/default.asp) up to [CodeAcademy](https://www.codecademy.com/learn/learn-javascript) and [Udacity](https://www.udacity.com/course/es6-javascript-improved--ud356). Any community library will definitely have a couple paper books too.

Because there are so many high-quality materials about the language, we will not try to teach you how to program. Instead, we will focus on how to plug your algorithms to Tradovate Trader.

## Simple Offset indicator
Imagine that we need an indicator that will show a line with some offset from input series data. Something like `Offset Indicator = Input Value - 2.0` It could be used as a stop loss line with our magic number.

Our indicator's file is a Javascript's [CommonJS](https://github.com/webpack/docs/wiki/commonjs) module. The module exports a definition of the indicator for Tradovate Trader: how to uniquely identify our indicator in the library of indicators, how to calculate values, how to plot them, default colors and styles. Our first module will look like the next code:

```javascript
class offset {
    map(d) {
        return d.value() - 2.0;
    }
}

module.exports = {
    name: "exampleOffset",
    calculator: offset
};
```

![Simple Offset](/charts/SimpleOffset.png)

The export here will tell the app to add an indicator with the unique name `exampleOffset` and calculations for this indicators are coded in class `offset`. The name plays a role of a machine-readable identifier. We don't expect it to be some nice looking text.

To be a calculator, the class should implement at least one function: `map`. The function _maps_ or translates an input value to output one, that's it. The input value is an object that points to just one item in input series and the app iterates through the whole series one by one in some sort of a loop. Here is a pseudo-code that can give some clues what is going on under the hood:

```javascript
  const inputSeries = [
      { date: Date.parse('2018-06-05'), value: () => 2770.25 },
      { date: Date.parse('2018-06-06'), value: () => 2770.50 },
      ...];

  const outputSeries = [];

  const offsetIndicator = require("exampleOffset");

  const calculator = new offsetIndicator.calculator();

  for(let i=0; i<inputSeries.length; ++i) {
    outputSeries.push(calculator.map(inputSeries[i], i, outputSeries))
  }

  // Now outputSeries can go plotting to the screen
```

  The app calls `map` function with three arguments: the current item, index of the item in the series and a series with _previously calculated_ values. As for our Offset Indicator, it is enough just to use the input item.

  As soon as we put our indicator to the app via Code Explorer, Charts module will show it in the list of indicators with the name 'EXAMPLEOFFSET'. It will just plot a grey line by default with some offset below the input. Later, we will learn how to customize our indicators with a human-friendlier name.

## Parameterized Offset indicator
In the previous example, we introduced some magic number to specify the offset. But it would be more convenient to introduce some flexibility and let us choose the number at the time when we place the indicator to the chart. To do it, we need to extend our module to get the next content:

```javascript
class offset {
    map(d) {
        return d.value() - this.props.offset;
    }
}

module.exports = {
    name: "exampleOffset",
    calculator: offset,
    params: {
        offset: {
                type: "number",
                def: 2.0,
                restrictions: {
                    step: 0.25,
                    min: 0.0
                }
        }
    }
};
```

Now our calculator has `this.props` object that includes all parameters specified by a user when the indicator was placed on a chart. To help the app and the user to figure out what parameters are expected, we added `params` section to the module export. It tells the app that we expect one parameter named `offset` and it should be edited as `number` with default value `2.0` and some restrictions on the value.

## Exponential Moving Average

[Exponential Moving Average](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_averages) is a little bit more complex indicator: it has to keep in mind its previous calculations.

The app doesn't restrict the calculator class how it can use its fields or functions. As result, the most simple way to keep the state of previous calculation is by saving it in object's fields. Like, `this.initialSum = this.initialSum + d.value()`. Here is our EMA that has a lot in common with our previous indicator:

```javascript
class ema {
    init() {
        this.previousMA = undefined;
        this.initialSum = 0;
    }

    map(d, index) {
        let result;

        if (index < this.props.period) {
            this.initialSum += d.value();
            result = this.initialSum / (index + 1);
        }
        else {
            const multiplier = 2.0 / (this.props.period + 1);
            result = (d.value() - this.previousMA) * multiplier + this.previousMA;
        }
        this.previousMA = result;
        return result;
    }
}

module.exports = {
    name: "exampleEma",
    calculator: ema,
    params: {
        period: {
                type: "number",
                def: 10,
                restrictions: {
                    step: 1,
                    min: 3
                }
        }
    }
};
```

We added one more function to the calculator class - `init()`. The app calls this optional function before the calculation loop. Our EMA uses it to initialize state's fields.

## Human-friendlier EMA

Now we will improve the appearance of the indicator in the app.

First, let's add a recognizable name in the indicator menu and default line style by extending module's export with indicator's definition.

```javascript
class ema {
    init() {
        this.previousMA = undefined;
        this.initialSum = 0;
    }

    map(d, index) {
        let result;

        if (index < this.props.period) {
            this.initialSum += d.value();
            result = this.initialSum / (index + 1);
        }
        else {
            const multiplier = 2.0 / (this.props.period + 1);
            result = (d.value() - this.previousMA) * multiplier + this.previousMA;
        }
        this.previousMA = result;
        return result;
    }
}

module.exports = {
    name: "exampleEma",
    description: "My EMA",
    calculator: ema,
    params: {
        period: {
                type: "number",
                def: 10,
                restrictions: {
                    step: 1,
                    min: 3
                }
        }
    },
    tags: ["My Indicators", "Moving Averages"],
    schemeStyles: {
        dark: {
            _: {
                color: "red",
            }
        }
    }
};
```

Now the indicator can be found in two sub-menus: `My Indicators` and `Moving Averages` under the name `My EMA`. By default, it will have a red color. The app uses [web colors](https://en.wikipedia.org/wiki/Web_colors). Other line properties that can be set in default style are `lineWidth` (in pixels), `opacity` (in percents), `lineStyle` (an index of style in the list of line styles in Indicator Editor). `schemeStyles` can be used to set default styles for `dark` and `light` mode of the app. `_` field is a placeholder for the plot name: an indicator can have multiple plots and each of them can have default styles. But our current indicator has just one plot without any particular name. As so, we use just `_`.

## Built-in tools

A major part of the indicator can be reused by other indicators. The app includes `tools` folder with a set of such reusable classes and functions. Indicators can import it via `require` construction of Javascript.

For example, our EMA can be rewritten as this one:

```javascript
const predef = require("./tools/predef");
const EMA = require("./tools/EMA");

class ema {
    init() {
        this.emaAlgo = EMA(this.props.period);
    }

    map(d) {
        return this.emaAlgo(d.value());
    }
}

module.exports = {
    name: "exampleEma",
    description: "My EMA",
    calculator: ema,
    params: {
        period: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators", predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("red")
};
```

Source codes of `tools` folder are open and available for viewing via Code Explorer.

## Double EMA

There are several indicators that employ two moving averages with different periods. We'll build some variation of it and will show two EMA side-by-side. Let's call one of them "fast EMA" and another "slow EMA".

As in the previous indicator, we will apply ready-to-use EMA algorithm from `tools`. Twice. And each of EMA will have own parameter and own output value.

To return two values from `map` function, we will return an object with two fields  (instead of just a number as previously). Then, we will define how to plot these values and will refer to their names.

```javascript
const predef = require("./tools/predef");
const EMA = require("./tools/EMA");

class doubleEma {
    init() {
        this.slowEma = EMA(this.props.slowPeriod);
        this.fastEma = EMA(this.props.fastPeriod);
    }

    map(d) {
        const value = d.value();
        return {
            slow: this.slowEma(value),
            fast: this.fastEma(value)
        };
    }
}

module.exports = {
    name: "doubleEma",
    description: "Double EMA",
    calculator: doubleEma,
    params: {
        slowPeriod: predef.paramSpecs.period(21),
        fastPeriod: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators"],
    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },
    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "blue", lineStyle: 3 }
        }
    }
};
```

Now module's export includes a new field `plots`: it tells the app which fields from the output object should be plotted and shown in the Data Box inside Charts.

This version of `schemeStyles` includes default line properties for both these plots.

## Plotters

So far our indicators plotted only lines. But there is a variety of other plotters in Tradovate Trader: dots, columns, specialized plotters that you can find out in some complex built-in indicators.

As an example, we are going to replace 'slow EMA' line with dots. The plotter will place one dot per each bar.

To achieve it, we need to add `plotter` field to module's exports:

```javascript

...

module.exports = {
    name: "doubleEma",
    description: "Double EMA",
    calculator: doubleEma,
    params: {
        slowPeriod: predef.paramSpecs.period(21),
        fastPeriod: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators"],
    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },
    plotter: [
        predef.plotters.dots("slow"),
        predef.plotters.singleline("fast"),
    ],
    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "lightblue"}
        }
    }
};
```

Moreover, we can implement even our own plotter. Since we have two closely related plots, it would be nice to connect them at each bar. It will look like a DNA.

Below we've implemented `dnaLikePlotter` function and mentioned it in our list of plotters. We didn't touch old plotters, just added one more.

All that the plotter function does it draws basic lines from one point to another. The app calls this function with three arguments: `canvas`, `indicatorInstance` and `history`.

`canvas` represents a chart area and has several methods to place drawing to it: to draw a line from one point to another, to draw a complex path with multiple points. The canvas is going to be a rich structure with more functionality to come.

`indicatorInstance` refers to the instance of our calculator class. The plotter can access its fields if needed. For example, `indicatorInstance.props.slowPeriod` is available there

`history` is an object that stores results of our calculations.

```javascript
const predef = require("./tools/predef");
const EMA = require("./tools/EMA");
const p = require("./tools/plotting");

class doubleEma {
    init() {
        this.slowEma = EMA(this.props.slowPeriod);
        this.fastEma = EMA(this.props.fastPeriod);
    }

    map(d) {
        const value = d.value();
        return {
            slow: this.slowEma(value),
            fast: this.fastEma(value)
        };
    }
}

function dnaLikePlotter(canvas, indicatorInstance, history) {
    for(let i=0; i<history.data.length; ++i) {
        const item = history.get(i);
        if (item.slow !== undefined && item.fast !== undefined) {
            const x = p.x.get(item);
            canvas.drawLine(
                p.offset(x, item.fast),
                p.offset(x, item.slow),
                {
                    color: item.fast > item.slow ? "green" : "red",
                    relativeWidth: 0.5,
                    opacity: 0.5
                });
        }
    }
}

module.exports = {
    name: "doubleEma",
    description: "Double EMA",
    calculator: doubleEma,
    params: {
        slowPeriod: predef.paramSpecs.period(21),
        fastPeriod: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators"],
    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },
    plotter: [
        predef.plotters.dots("slow"),
        predef.plotters.singleline("fast"),
        predef.plotters.custom(dnaLikePlotter)
    ],
    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "lightblue"}
        }
    }
};
```

![DNA-like Double EMA](/charts/DoubleEMA.png)

The plotter function above involves `tools/plotting` built-in module. The module contains a bunch of helper functions to simplify plotting. In our case, we use `x.get(item)` to retrieve X coordinate of the item. Note: as for now, the app uses `date` and more complex structures as a time (or X) coordinate, the plotter shouldn't expect a number there.

The function plots each line with red or green color and tells the app to draw them with half opacity and a width equals to half space between bars (`relativeWidth`).

## Signaling Average True Range

Fancy-looking EMA is not enough for successful trading. We need a fancy-looking Average True Range indicator too.

First, we just copy the built-in ATR indicator with some renaming:

```javascript
const predef = require("./tools/predef");
const meta = require("./tools/meta");
const MMA = require("./tools/MMA");
const trueRange = require("./tools/trueRange");

class averageTrueRange {
    init() {
        this.movingAverage = MMA(this.props.period);
    }

    map(d, i, history) {
        return this.movingAverage(trueRange(d, history.prior()));
    }
}

module.exports = {
    name: "exampleATR",
    description: "Average True Range",
    calculator: averageTrueRange,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: ["My Indicators"],
    schemeStyles: predef.styles.solidLine("#ffe270")
};
```

The source code is similar to our previous indicators with some additions in the module's export: `inputType` restricts user's choice with OHLC bars here, and `areaChoice` will highlight 'New Area' choice by default when you will place an indicator to the chart. Bars as an input are required to calculate True Range that needs High, Low and Close: all of them will be available in `map` function via `d.high()`, `d.low()` and `d.close()`

Our goal is to improve the indicator and highlight places where it is larger than some parameterized threshold. Moreover, the `threshold` parameter will be in tick sizes to make the indicator a product-neutral.

We will highlight as ATR chart as well as corresponding candlesticks. For simplicity, highlighting will be with eye-catching tones of red/green colors.

If we need just change the style of dots and columns, we don't need to implement custom plotter: all we need to do is to compose `style` field in the returned object from `map` function. Candlestick style is done the similar way.

```javascript
const predef = require("./tools/predef");
const meta = require("./tools/meta");
const MMA = require("./tools/MMA");
const trueRange = require("./tools/trueRange");

class averageTrueRange {
    init() {
        this.movingAverage = MMA(this.props.period);
    }

    map(d, i, history) {
        const atr = this.movingAverage(trueRange(d, history.prior()));
        const tickSize = this.contractInfo.tickSize;
        const atrInTicks = atr / tickSize;
        let overrideStyle;
        if (atrInTicks > this.props.threshold) {
            overrideStyle = {
                color: d.open() > d.close() ? "salmon" : "lightgreen"
            };
        }
        return {
            value: atr,
            candlestick: overrideStyle,
            style: {
                value: overrideStyle
            }
        };
    }
}

module.exports = {
    name: "exampleATR",
    description: "Average True Range",
    calculator: averageTrueRange,
    params: {
        period: predef.paramSpecs.period(14),
        threshold: predef.paramSpecs.number(10, 1, 0)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: ["My Indicators"],
    plotter: predef.plotters.columns("value"),
    schemeStyles: predef.styles.solidLine("#ffe270")
};
```

![Signaling ATR](/charts/SignalingATR.png)

`this.contractInfo` above is an object with details about the contract of the chart. The app assigns it to the indicator during construction.

## Blackbox DLL

Let's assume we have an old mature indicator that we implemented with old good C. We don't want or we cannot translate it to Javascript. For such cases, Tradovate Trader has the option to import DLL via a bridge.

For example, we have the next C function. It calculates a kind of median price of a bar, but with flexible weights for open, high/low prices.

```c
extern "C" __declspec(dllexport)
double __stdcall calculate(int barIndex, double openWeight, double highLowWeight,
  double open, double high, double low, double close) {
    return (open * openWeight + high * highLowWeight + low * highLowWeight + close) / (openWeight + 2 * highLowWeight + 1.0);
};
```

Our indicator will call this function for each bar and pass the result to the app.

First of all, we need to tell the app via module's export that the indicator imports a function from some DLL. `dlls` field there specifies the path to DLL and a list of imported functions. Each function declaration includes its name and a call signature. The signature is straightforward: an array with two items. The first item is a name of the return type, the second item is an array type names of arguments. Currently supported type names are `int`, `double` and `string`.

After that our indicator gets a new automatically assigned field `dlls` with 'materialized' dlls and regular Javascript functions.

```javascript
const predef = require("./tools/predef");
const meta = require("./tools/meta");

class adapter {
    map(d, index) {
        return this.dlls.blackboxDll.calculate(
            index,
            this.props.openWeight,
            this.props.highLowWeight,
            d.open(),
            d.high(),
            d.low(),
            d.close());
    }
}

module.exports = {
    name: "flexibleMedian",
    calculator: adapter,
    description: "Flexible Median",
    tags: ["My Indicators"],
    params: {
        openWeight: predef.paramSpecs.number(1, 0.1, 0),
        highLowWeight: predef.paramSpecs.number(1, 0.1, 0)
    },
    inputType: meta.InputType.BARS,
    schemeStyles: predef.styles.solidLine("#ffe270"),
    dlls: {
        blackboxDll: {
            path: 'blackboxDll.dll',
            functions: {
                // double calculate(int barIndex,
                // double openWeight, double highLowWeight,
                // double open, double high, double low, double close)
                calculate: ['double',
                  ['int', 'double', 'double',
                  'double', 'double', 'double', 'double']],
            }
        }
    }
};
```

Note: the app searches the DLL according to [DLL Search Order ](https://msdn.microsoft.com/en-us/library/windows/desktop/ms682586(v=vs.85).aspx)

DLL should be compiled to the same platform (32 or 64-bits) as the installed Tradovate Trader.

Unfortunately, DLL import works on Windows' standalone platform only.

DLL import is available since 1.180608 version of the app.

## Fourier Moving Average

Tradovate Trader includes some third-party libraries that can be helpful for indicators.

[Lodash](https://lodash.com/docs) is very popular and high-performance library to work with arrays and objects. All you need to do is to include `const lodash = require("lodash")` to your module.

Another is a library for [Fast Fourier Transform](https://en.wikipedia.org/wiki/Fast_Fourier_transform). Here is an example of how to apply this library to build a moving average that calculated as FFT of input data, a filter of high frequencies and inverse FFT.

```javascript
const predef = require("./tools/predef");
const FFT = require("fft");

class fourierMA {
    init() {
        const period = this.props.period;
        this.fft = FFT(period);
        this.signal = new Array(period);
        this.zero = new Array(period);
        for(let i=0; i<period; ++i) {
            this.zero[i] = 0.0;
        }
        this.lastIndex = -1;
    }

    map(d, index) {
        const period = this.props.period;
        const value = d.value();

        if (index < period) {
            this.signal[period - index - 1] = value;
        }
        else {
            if (this.lastIndex < index) {
                this.signal.pop();
                this.signal.unshift(value);
            }
            else {
                this.signal[0] = value;
            }
        }

        this.lastIndex = index;

        if (index >= period) {
            const re = [].concat(this.signal);
            const im = [].concat(this.zero);
            this.fft.fft1d(re, im);

            const startFreq = this.props.filterFreqStart;
            for(let i=startFreq; i<period; ++i) {
                re[i] = im[i] = 0.0;
            }
            this.fft.ifft1d(re, im);

            return re[0];
        }
    }
}

module.exports = {
    name: "fourierMA",
    description: "Fourier MA",
    calculator: fourierMA,
    params: {
        period: predef.paramSpecs.period(64),
        filterFreqStart: predef.paramSpecs.period(16),
    },
    tags: ["My Indicators"],
};
```

![FFT MA](/charts/FFTMA.png)


Note: FFT is available since 1.180615 version of the app.

## Spectrogram

Our [Spectrogram](https://en.wikipedia.org/wiki/Spectrogram) has a lot in common with our previous indicator. Let's move out such pieces to a new helper module:

```javascript
const FFT = require("fft");

function initialize(instance) {
    const period = instance.props.period;
    instance.fft = FFT(period);
    instance.signal = new Array(period);
    instance.zero = new Array(period);
    for(let i=0; i<period; ++i) {
        instance.zero[i] = 0.0;
    }
    instance.lastIndex = -1;
}

function updateSeries(instance, value, index) {
    const period = instance.props.period;
    if (index < period) {
        instance.signal[period - index - 1] = value;
    }
    else {
        if (instance.lastIndex < index) {
            instance.signal.pop();
            instance.signal.unshift(value);
        }
        else {
            instance.signal[0] = value;
        }
    }

    instance.lastIndex = index;

    if (index >= period) {
        const re = [].concat(instance.signal);
        const im = [].concat(instance.zero);
        instance.fft.fft1d(re, im);
        return { re, im };
    }
}

module.exports = {
    initialize,
    updateSeries,
    tag: "Fourier Analysis"
};
```

Let's save it with `fourierCommon.js` name.

Refactored `fourierMA` will be reduced up to the next version:

```javascript
const predef = require("./tools/predef");
const FFT = require("fft");
const fourierCommon = require("./fourierCommon");

class fourierMA {
    init() {
        fourierCommon.initialize(this);
    }

    map(d, index) {
        const period = this.props.period;
        const value = d.value();

        const transform = fourierCommon.updateSeries(this, value, index);

        if (transform) {
            const re = transform.re;
            const im = transform.im;

            const startFreq = this.props.filterFreqStart;
            for(let i=startFreq; i<period; ++i) {
                re[i] = im[i] = 0.0;
            }

            this.fft.ifft1d(re, im);

            return re[0];
        }
    }
}

module.exports = {
    name: "fourierMA",
    description: "Fourier MA",
    calculator: fourierMA,
    params: {
        period: predef.paramSpecs.period(64),
        filterFreqStart: predef.paramSpecs.period(16),
    },
    tags: [fourierCommon.tag],
};
```


TODO:
