const predef = require("../tools/predef");
const meta = require("../tools/meta");

class priceVolumeTrend {
    init() {
        this.pvt = 0;
    }

    map(d, i, history) {
        let value;
        if (i > 0) {
            const close = d.close();
            const volume = d.volume();
            const prevClose = history.prior().close();
            const percentChange = (close - prevClose) / prevClose;
            value = percentChange * volume + this.pvt;
            this.pvt = value;
        }
        return value;
    }
}

module.exports = {
    name: "pvt",
    description: "Price Volume Trend",
    calculator: priceVolumeTrend,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
