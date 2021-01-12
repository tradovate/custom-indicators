Now we will improve the appearance of the indicator in the app.
 
First, let's add a recognizable name in the indicator menu and default line style by extending the module's export with the indicator's definition.
 
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
