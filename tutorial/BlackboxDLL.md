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
 
First of all, we need to tell the app via module's export that the indicator imports a function from some DLL. {@linkcode Indicator.dlls} field there specifies the path to DLL and a list of imported functions. Each function declaration includes its name and a call signature. The signature is straightforward: an array with two items. The first item is the name of the return type, the second item is an array of type names of arguments. Currently, supported type names are `int`, `double`, and `string`.
 
After that our indicator gets a new automatically assigned field {@linkcode Calculator.dlls} with 'materialized' dlls and regular Javascript functions.
 
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
