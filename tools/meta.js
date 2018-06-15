module.exports = {
    ParamType: {
        NUMBER: "number",
        BOOLEAN: "boolean",
        TEXT: "text",
        ENUM: "enum"
    },
    OutputType: {
        LINE: "line"
    },
    InputType: {
        BARS: "bars",
        VOLUME: "volume",
        OHLC: "ohlc",
        ANY: "any"
    },
    AreaChoice: {
        OVERLAY: "overlay",
        NEW: "new"
    },
    error(param, text) {
        return {
            param,
            text
        };
    }
};
