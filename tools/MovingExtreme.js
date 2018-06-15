const CBuffer = require("./CBuffer");

function mkMovingExtreme(fnPeakEvaluation) {
    return function (period) {
        function extreme(value) {
            return extreme.push(value);
        }

        extreme.reset = () => {
            extreme.state = {
                recentIndex: -1,
                peakValue: undefined,
                items: period ? new CBuffer(period) : null
            };
        };

        extreme.push = (value, index) => {
            if (extreme.state.items) {
                if (extreme.state.items.length === period) {
                    extreme.state.items.shift();
                    extreme.state.recentIndex -= 1;
                    if (extreme.state.recentIndex === -1) {
                        extreme.state.peakValue = extreme.state.items.get(0);
                        extreme.state.recentIndex = 0;
                        for (let i = 1; i < extreme.state.items.length; ++i) {
                            if (fnPeakEvaluation(extreme.state.peakValue, extreme.state.items[i])) {
                                extreme.state.peakValue = value;
                                extreme.state.recentIndex = i;
                            }
                        }
                    }
                }
                extreme.state.items.push(value);
            }
            if (extreme.state.recentIndex === -1 || fnPeakEvaluation(extreme.state.peakValue, value)) {
                extreme.state.peakValue = value;
                extreme.state.recentIndex = index || (extreme.state.items ? extreme.state.items.length - 1 : 0);
            }
            return extreme.current();
        };

        extreme.current = () => extreme.state.peakValue;

        extreme.index = () => extreme.state.recentIndex;

        extreme.sinceExtreme = () => extreme.state.items.length - extreme.state.recentIndex - 1;

        extreme.reset();

        return extreme;
    };
}

module.exports = mkMovingExtreme;
