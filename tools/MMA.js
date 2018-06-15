// https://en.wikipedia.org/wiki/Moving_average#Modified_moving_average

function ModifiedMovingAverage(period) {
    function mma(value) {
        return mma.push(value);
    }

    mma.reset = () => {
        mma.state = {
            items: 0,
            sumX: 0
        };
    };

    mma.push = (value) => {
        if (mma.state.items < period) {
            ++mma.state.items;
            mma.state.sumX += value;
            if (mma.state.items === period) {
                mma.state.value = mma.state.sumX / period;
            }
        }
        else {
            mma.state.value = (mma.state.value * (period - 1) + value) / period;
        }
        return mma.avg();
    };

    mma.avg = () => mma.state.value;

    mma.reset();

    return mma;
}

module.exports = ModifiedMovingAverage;
