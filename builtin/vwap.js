const lodash = require("lodash");
const predef = require("../tools/predef");
const meta = require("../tools/meta");
const typicalPrice = require("../tools/typicalPrice");

class vwap {
    init() {
        this.cumulativeValue = 0;
        this.cumulativeVolume = 0;
        this.tradeDate = 0;
    }

    map(d) {
        const tradeDate = d.tradeDate();
        if (tradeDate !== this.tradeDate) {
            this.cumulativeVolume = 0;
            this.cumulativeValue = 0;
            this.tradeDate = tradeDate;
        }
        const volumeProfile = d.profile();
        if (volumeProfile && volumeProfile.length) {
            for (let i = 0; i < volumeProfile.length; ++i) {
                const level = volumeProfile[i];
                this.cumulativeVolume += level.vol;
                this.cumulativeValue += level.vol * level.price;
            }
        }
        else {
            const vol = d.volume();
            this.cumulativeVolume += vol;
            this.cumulativeValue += vol * typicalPrice(d);
        }
        return this.cumulativeValue / this.cumulativeVolume;
    }
}

module.exports = {
    name: "vwap",
    description: "VWAP",
    calculator: vwap,
    inputType: meta.InputType.BARS,
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
