There are several indicators that employ two moving averages with different periods. We'll build some variation of it and will show two EMA side-by-side. Let's call one of them "fast EMA" and another "slow EMA".
 
As in the previous indicator, we will apply the ready-to-use EMA algorithm from [tools](https://github.com/tradovate/custom-indicators/tree/master/tools). Twice. And each EMA will have its own parameter and own output value.
 
To return two values from our {@linkcode Calculator.map} function implementation, we will return an object with two fields instead of just a number as previously. Then, we will define how to plot these values and will refer to their names.
 
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
 
Now module's export includes a new field {@linkcode Indicator.plots}: it tells the app which fields from the output object should be plotted and shown in the Data Box inside Charts.
 
This version of {@linkcode Indicator.schemeStyles} includes default line properties for both these plots.
 