# Params object

The object specifies a set of parameters that should be submitted by the user to the indicator.

Each field of the object represents one parameter. Instantiated indicator's [calculator](calculator.md) has access to user-specified values via `this.props` property using the same field names.

Each parameter specification is an object that states the type of parameter as `type` field, default value via `def` field, and an optional restriction for its values (depending on parameter type).

### Number

* `type: "number"`
* `def` _Number_: default value
* `restrictions` _Object
  - `min` _Number_ (optional)
  - `max` _Number_ (optional)
  - `step` _Number_ (optional)

### Boolean

* `type: "boolean"`
* `def` _Boolean_: default value, `true` or `false`

### Text

* `type: "text"`
* `def` _String_: default value

### Enumeration

* `type: "enum"`
* `enumSet` _Object_: a set of allowed values as an object `{ value1: "Description1", value2: "Description2", ... }``
* `def` _String_: default value, one of values

### Example

```javascript
...

module.exports = {
    ...

    params: {
        offset: {
                type: "number",
                def: 2.0,
                restrictions: {
                    step: 0.25,
                    min: 0.0
                }
        }
    },

    ...
};
```
