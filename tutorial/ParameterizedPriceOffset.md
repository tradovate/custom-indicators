In the previous example, we introduced some magic numbers to specify the offset. But it would be more convenient to introduce some flexibility and let us choose the number at the time when we place the indicator on the chart. To do it, we need to extend our module to get the next content:
 
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
 
Now our calculator has `this.props` object that includes all parameters specified by a user when the indicator was placed on a chart. To help the app and the user to figure out what parameters are expected, we added the `params` section to the module export. It tells the app that we expect one parameter named `offset` and it should be edited as `number` with default value `2.0` and some restrictions on the value.
