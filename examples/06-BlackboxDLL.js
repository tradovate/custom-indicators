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
