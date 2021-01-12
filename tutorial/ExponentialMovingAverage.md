[Exponential Moving Average](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_averages) is a little bit more complex indicator: it has to keep in mind its previous calculations.
 
The app doesn't restrict the calculator class how it can use its fields or functions. As result, the most simple way to keep the state of the previous calculation is by saving it in the object's fields. Like, `this.initialSum = this.initialSum + d.value()`. Here is our EMA that has a lot in common with our previous indicator:
 
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
 
We added one more function to the calculator class - an implementation of {@linkcode Calculator.init}. The application calls this optional function before the calculation loop. Our EMA uses it to initialize the state's fields.
