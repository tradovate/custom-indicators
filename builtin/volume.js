const predef = require("../tools/predef");
const meta = require("../tools/meta");

class volume {
    map(d) {
        return d.volume();
    }
}

module.exports = {
    name: "volume",
    description: "Volume",
    calculator: volume,
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.histogram,
    areaChoice: meta.AreaChoice.NEW,
    schemeStyles: predef.styles.solidLine("#7E838C")
};
