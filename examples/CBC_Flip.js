// ============================================================
// CBC — Change in Control
// Original Tradingview by friksa (Mozilla Public License 2.0)
// Converted to Tradovate JS by https://x.com/imRobbieRobski
// ============================================================
// Green ▲ below bar = bullish flip (bears → bulls in control)
// Red   ▼ above bar = bearish flip (bulls → bears in control)
// Use this on a 10 minute chart to trade with the trend
// Look for entries on a smaller time frame. 
// Buy Red, Sell Green. Sell Red, Cover Green
// ============================================================

const predef = require("./tools/predef");
const meta   = require("./tools/meta");
const { du, op, px } = require("./tools/graphics");

class CBC {
    init() {
        this.prevCbc = undefined;
    }

    map(d, i, history) {
        if (i < 1) return {};

        const close    = d.close();
        const prevBar  = history.get(i - 1);
        const prevHigh = prevBar.high();
        const prevLow  = prevBar.low();

        let cbc;

        if (this.prevCbc === undefined) {
            if (close >= prevHigh)     cbc = 1;
            else if (close <= prevLow) cbc = 0;
            else                       cbc = undefined;
        } else if (this.prevCbc === 1 && close <= prevLow) {
            cbc = 0;
        } else if (this.prevCbc === 0 && close >= prevHigh) {
            cbc = 1;
        } else {
            cbc = this.prevCbc;
        }

        const bullishFlip = (this.prevCbc === 0 && cbc === 1);
        const bearishFlip = (this.prevCbc === 1 && cbc === 0);

        this.prevCbc = cbc;

        // Read user-defined colors from params
        const bullColor = this.props.bullColor || "#00C076";
        const bearColor = this.props.bearColor || "#FF3A5C";

        let graphics = undefined;

        if (bullishFlip) {
            graphics = {
                items: [
                    {
                        tag: "Shapes",
                        key: "bullArrow",
                        primitives: [
                            {
                                tag: "Polygon",
                                points: [
                                    { x: du(d.index()),                 y: op(du(d.low()), "+", px(14)) },
                                    { x: op(du(d.index()), "-", px(8)), y: op(du(d.low()), "+", px(28)) },
                                    { x: op(du(d.index()), "+", px(8)), y: op(du(d.low()), "+", px(28)) },
                                ],
                            },
                        ],
                        fillStyle: { color: bullColor },
                    },
                ],
            };
        }

        if (bearishFlip) {
            graphics = {
                items: [
                    {
                        tag: "Shapes",
                        key: "bearArrow",
                        primitives: [
                            {
                                tag: "Polygon",
                                points: [
                                    { x: du(d.index()),                 y: op(du(d.high()), "-", px(14)) },
                                    { x: op(du(d.index()), "-", px(8)), y: op(du(d.high()), "-", px(28)) },
                                    { x: op(du(d.index()), "+", px(8)), y: op(du(d.high()), "-", px(28)) },
                                ],
                            },
                        ],
                        fillStyle: { color: bearColor },
                    },
                ],
            };
        }

        return { graphics };
    }
}

function noopPlotter() {}

module.exports = {
    name:        "CBC",
    description: "CBC - Change in Control",
    calculator:  CBC,
    tags:        ["My Indicators"],
    inputType:   meta.InputType.BARS,
    areaChoice:  meta.AreaChoice.OVERLAY,
    plotter:     [predef.plotters.custom(noopPlotter)],
    params: {
        bullColor: predef.paramSpecs.color("#00C076"),
        bearColor: predef.paramSpecs.color("#FF3A5C"),
    },
};