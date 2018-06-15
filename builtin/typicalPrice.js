const predef = require("../tools/predef");
const meta = require("../tools/meta");
const typicalPrice = require("../tools/typicalPrice");

class typicalPriceIndicator {
    map(d) {
        return typicalPrice(d);
    }
}

module.exports = {
    name: "typicalPrice",
    title: "Typical",
    description: "Typical Price",
    calculator: typicalPriceIndicator,
    inputType: meta.InputType.BARS,
    schemeStyles: predef.styles.dashLine("#CC33FF")
};
