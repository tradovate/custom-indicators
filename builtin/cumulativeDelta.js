const predef = require("../tools/predef");
const meta = require("../tools/meta");

class cumulativeDelta {
    init() {
        this.last = 0;
    }

    map(d, i, history) {
        const strongUpDown = this.props.strongUpDown;
        const delta = d.offerVolume() - d.bidVolume();
        const open = this.last;
        const close = open + delta;
        const range = Math.abs(open) > Math.abs(close) ? open : close;
        const prevd = i > 0 ? history.prior() : d;

        const result = {
            open, close, delta, value: range
        };

        const upDown = (strong) => {
            if (strong) {
                return {
                    up: d.close() > prevd.high(),
                    down: d.close() < prevd.low()
                };
            }
            return {
                up: d.close() > d.open(),
                down: d.close() < d.open()
            };
        };

        // UpDown Coloring
        const ud = upDown(strongUpDown);
        if (ud.down) {
            // DOWN
            result.up = false;
        }
        else if (ud.up) {
            // UP
            result.up = true;
        }

        this.last = close;

        return result;
    }
}

module.exports = {
    name: "cumulativeDelta",
    title: "Cumulative Delta",
    description: "Cumulative Delta",
    calculator: cumulativeDelta,
    params: {
        strongUpDown: predef.paramSpecs.bool(true)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    scaler: predef.scalers.singlePath,
    plotter: predef.plotters.cumulative,
    plots: {
        delta: "Delta"
    },
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("delta", { color: "#7e838c", lineWidth: 3 })
};
