import { Calculator } from "./calculator";
import { Canvas } from "./canvas";
import { TimeSeries } from "./TimeSeries";

export type Plotter = PlotterDefinition | readonly PlotterDefinition[];

export type PlotterDefinition = Lines | Dots | Columns | Range | Custom;

/** Draw fields as lines */
export interface Lines {
    readonly type: 'multiline';
    /** Fields of {@linkcode Calculator.map} output */
    readonly fields: readonly string[];
}

/** Draw fields as dots */
export interface Dots {
    readonly type: 'dots';
    /** Field of {@linkcode Calculator.map} output */
    readonly field: string;
}

/** Draw fields as columns */
export interface Columns {
    readonly type: 'columns';
    /** Field of {@linkcode Calculator.map} output */
    readonly field: string;
}

/** Draw fields as range */
export interface Range {
    readonly type: 'range';
    /** Fields of {@linkcode Calculator.map} output. The first item of tuple - `from` field, the second - `to` field  */
    readonly fields: [string, string];
}

/** Custom drawing algorithm with using basic vector graphics */
export interface Custom {
    readonly type: 'custom';
    /** Functions that called to convert {@linkcode Calculator.map} output series to drawings 
     * @param canvas An object that provides drawing functionality
     * @param calculatorInstance An instance that was used to calculated time series
     * @param calculatedSeries Output of calculations
    */
    function(canvas: Canvas, calculatorInstance: Calculator, calculatedSeries: TimeSeries): void;
}