const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MMA = require("../tools/MMA");

class adx {
    init() {
        const period = this.props.period;
        this.smoothedTR = MMA(period);
        this.smoothedDMP = MMA(period);
        this.smoothedDMM = MMA(period);
        this.smoothedDX = MMA(period);
    }

    map(d, i, history) {
        const {
            smoothedTR, smoothedDMP, smoothedDMM, smoothedDX, props
        } = this;
        const curH = d.high();
        const curL = d.low();
        if (i === 0) {
            return { tr: curH - curL };
        }
        const prior = history.prior();
        const priorC = prior.close();
        const priorH = prior.high();
        const priorL = prior.low();
        const tr = Math.max(curH - curL, Math.max(Math.abs(curH - priorC), Math.abs(curL - priorC)));
        const hDiff = curH - priorH;
        const lDiff = priorL - curL;
        const dmP = hDiff > lDiff ? Math.max(0, hDiff) : 0;
        const dmM = lDiff > hDiff ? Math.max(0, lDiff) : 0;
        const result = {
            tr,
            dmP,
            dmM,
            sm_tr: smoothedTR(tr),
            sm_dmp: smoothedDMP(dmP),
            sm_dmm: smoothedDMM(dmM)
        };

        if (i >= props.period) {
            if (result.sm_tr === 0) {
                result.dip = 0;
                result.dim = 0;
                result.dx = 0;
            }
            else {
                result.dip = (result.sm_dmp / result.sm_tr) * 100;
                result.dim = (result.sm_dmm / result.sm_tr) * 100;
                const sum = result.dip + result.dim;
                if (sum === 0) {
                    result.dx = 0;
                }
                else {
                    result.dx = (100 * Math.abs(result.dip - result.dim)) / sum;
                }
            }
            const adx = smoothedDX(result.dx);
            if (i >= (2 * props.period) - 1) {
                result.adx = adx;
            }
        }
        return result;
    }

    filter(d) {
        return predef.filters.isNumber(d.adx);
    }
}

module.exports = {
    name: "adx",
    description: "Average Directional Index",
    calculator: adx,
    params: {
        period: predef.paramSpecs.period(20)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    plots: {
        adx: { title: "ADX" },
        dip: { title: "+DI" },
        dim: { title: "-DI" }
    },
    schemeStyles: {
        dark: {
            adx: predef.styles.plot("#7E838C"),
            dip: predef.styles.plot("#33CC33"),
            dim: predef.styles.plot("#FF5050")
        }
    }
};
