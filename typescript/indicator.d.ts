import { Calculator } from "./calculator";
import { DLLs } from "./dlls";
import { ParameterDefinitions } from "./params";
import { Plots } from "./plots";
import { Plotter } from "./plotter";
import { Scaler } from "./scaler";
import { SchemeStyles } from "./scheme-styles";

/***
 * Indicator's definition used by the application to connect it with UI.
 * Example:
 ```
 ...
module.exports = {
    name: "doubleEma",
    description: "Double EMA",
    calculator: doubleEma,
    params: {
        slowPeriod: predef.paramSpecs.period(21),
        fastPeriod: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators"],
    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },
    plotter: [
        predef.plotters.dots("slow"),
        predef.plotters.singleline("fast"),
        predef.plotters.custom(dnaLikePlotter)
    ],
    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "lightblue"}
        }
    }
};
```
 */
interface Indicator {
    /** Unique identifier associated with the indicator. */
    readonly name: string;
    /** Calculation algorithms */
    readonly calculator: Calculator;
    /** Readable text that used in UI. Optional. */
    readonly description?: string;
    /** Set of input parameters. Optional. */
    readonly params?: ParameterDefinitions;
    /** Expected type of input series. Optional. Default: `any` */
    readonly inputType?: 'bars' | 'volume' | `any`;
    /** Default choice for placement. Optional. Default: `overlay` */
    readonly areaChoice?: 'overlay' | 'new';
    /** Output results for displaying. Optional. If not specified, the application will expect a numeric output or `value` field of the output object. */
    readonly plots?: Plots;
    /** How to plot results. Optional. If not specified, the application will display the results as lines. */
    readonly plotter?: Plotter;
    /** How to group with other similar indicators in UI dropdown menu. */
    readonly tags?: readonly string[];
    /** Default color/style of plotted results. */
    readonly schemeStyles?: SchemeStyles;
    /** How to auto-scale results in the chart area. If not specified, the application will try to fit all `plots` to the plot area. */
    readonly scaler?: Scaler;
    /** Windows DLL import specification. Can be used in standalone Windows application only. */
    readonly dlls?: DLLs;
}