const lodash = require("lodash");
const { ParamType } = require("./meta");
const p = require("./plotting");

function mkStyle(style) {
    if (typeof style === "string") {
        style = { color: style };
    }
    return {
        color: style.color || "gray",
        lineWidth: style.lineWidth || 1,
        opacity: style.opacity || 100,
        lineStyle: style.lineStyle || 1
    };
}

module.exports = {
    plotters: {
        line: { type: "line" },
        multiline(fields) {
            return { type: "multiline", fields };
        },
        singleline(field) {
            return { type: "multiline", fields: [field] };
        },
        pivotpoints(fields) {
            return { type: "pivotpoints", fields };
        },
        histogram: { type: "histogram" },
        cumulative: { type: "cumulative" },
        zigzag(fields) {
            return { type: "zigzag", fields };
        },
        macd: { type: "macd" },
        scatter: { type: "scatter" },
        dots(field) {
            return { type: "dots", field: field || "_" };
        },
        columns(field) {
            return { type: "columns", field };
        },
        custom(func) {
            return { type: "custom", function: func };
        }
    },
    scalers: {
        singlePath: { type: "singlePath" },
        multiPath(fields) {
            return { type: "multiPath", fields };
        }
    },
    paramSpecs: {
        period(defValue) {
            return {
                type: ParamType.NUMBER,
                def: defValue,
                restrictions: {
                    step: 1, min: 1
                },
                validate(value) {
                    if (value < 1) {
                        return "Period should be a positive number";
                    }
                    return undefined;
                }
            };
        },
        number(defValue, step, min) {
            return {
                type: ParamType.NUMBER,
                def: defValue,
                restrictions: {
                    step: step || 1, min: min || 0
                }
            };
        },
        percent(defValue, step, min, max) {
            return {
                type: ParamType.NUMBER,
                def: defValue,
                restrictions: {
                    step: step || 1, min, max
                }
            };
        },
        bool(defValue) {
            return {
                type: ParamType.BOOLEAN,
                def: defValue
            };
        },
        text(defValue) {
            return {
                type: ParamType.TEXT,
                def: defValue
            };
        },
        enum(enumSet, defValue) {
            return {
                type: ParamType.ENUM,
                enumSet,
                def: defValue,
                toSelectOptions() {
                    return lodash.toPairs(enumSet).map(p => ({
                        label: p[1],
                        value: p[0]
                    }));
                }
            };
        },
        color(defValue) {
            return {
                type: ParamType.COLOR,
                def: defValue
            };
        }
    },
    filters: {
        onlyNumberValue(d) {
            return typeof d.value === "number" && !isNaN(d.value);
        },
        isNumber(d) {
            return typeof d === "number" && !isNaN(d);
        }
    },
    tags: {
        MovingAverage: "Moving Averages",
        Channels: "Channels",
        Volatility: "Volatility",
        Oscillators: "Oscillators",
        Volumes: "Volume-based"
    },
    styles: {
        solidLine(plotName, dark, light) {
            if (arguments.length === 1) {
                dark = plotName;
                plotName = "_";
            }
            if (!light) {
                light = dark;
            }
            const result = {
                dark: {},
                light: {}
            };
            result.dark[plotName] = mkStyle(dark);
            result.light[plotName] = mkStyle(light);
            return result;
        },
        plot(partialStyle) {
            return mkStyle(partialStyle);
        },
        dashLine(plotName, dark, light) {
            if (arguments.length === 1) {
                dark = plotName;
                plotName = "_";
            }
            if (!light) {
                light = dark;
            }
            const result = {
                dark: {},
                light: {}
            };
            result.dark[plotName] = mkStyle(dark);
            result.dark[plotName].lineStyle = 3;
            result.light[plotName] = mkStyle(light);
            result.light[plotName].lineStyle = 3;
            return result;
        },
    }
};
