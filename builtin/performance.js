const predef = require("../tools/predef");
const meta = require("../tools/meta");

class performance {
    map(d, _, history) {
        const current = d.value();
        const first = history.first().value();
        return (current - first) / first * 100;
    }
}

module.exports = {
    name: "performance",
    title: "PERF",
    description: "Performance",
    calculator: performance,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#FF9966")
};
