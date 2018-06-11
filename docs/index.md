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

TODO:
