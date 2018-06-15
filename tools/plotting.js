const lodash = require("lodash");

module.exports = {
    createPath() {
        let items = [];
        let makeCopyOnWrite = false;
        const copyOnWrite = () => {
            if (makeCopyOnWrite) {
                items = [].concat(items);
                makeCopyOnWrite = false;
            }
        }
        const path = {
            moveTo(x, y) {
                copyOnWrite();
                items.push({
                    t: "M",
                    x: lodash.clone(x),
                    y: y
                });
                return path;
            },
            lineTo(x, y) {
                copyOnWrite();
                items.push({
                    t: "L",
                    x: lodash.clone(x),
                    y: y
                });
                return path;
            },
            end() {
                _makeCopyOnWrite = true;
                return {
                    t: "path",
                    items
                };
            }
        }
        return path;
    },

    x: {
        get(historyItem) {
            return historyItem.date;
        },
        relative(x, dx) {
            return {x, dx};
        },
        between(x1, x2, k) {
            return {x1, x2, k};
        },
    },

    offset(x, y) {
        return {x, y};
    }
}
