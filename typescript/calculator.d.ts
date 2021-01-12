import { BarInputEntity, InputEntity, TimeSeries } from "./TimeSeries";

/** 
 * Indicator's algorithm should implement this interface.   
 * The app assigns the properties upon initialization of the calculator instance. */
export interface Calculator {
    /** An object with user-specified parameters. The indicator specifies a set of parameters in {@linkcode Indicator.params}. When a user adds the indicator's instance to a chart, the app shows an editor that let fill out actual values. */
    readonly props: { [parameterName: string]: number | boolean };

    /** Contract assigned to the indicator */
    readonly contractInfo: {
        /** Symbol like `ESH1` */
        readonly contract: string;
        /** Name of product like `ES` */
        readonly product: string;
        /** Product's tick size (or minimal price movement) */
        readonly tickSize: number;
    }

    /** Chart's element description */
    readonly chartDescription: {
        /** Type of basis elements that are used to build the chart */
        readonly underlyingType: 'MinuteBar' | 'Tick' | 'DailyBar';
        /** The size of elements */
        readonly elementSize: number;
        /** Specifies the way chart elements built */
        readonly elementSizeUnit: 'UnderlyingUnits' | 'Volume' | 'Range' | 'Renko' | 'MomentumRange' | 'PointAndFigure';
        /** Whether the chart elements include volume profiles */
        readonly withHistogram: boolean;
    }

    /** An object that points to materialized DLLs that were specified in {@linkcode Indicator.dlls}. Each field is an interface object to corresponding DLL. See [example of usage](../pages/Tutorial/BlackboxDLL.html) */
    readonly dlls: { [dllName: string]: {
        [functionName: string]: (...args: any[]) => any
     } };

    /** The application calls the method before running an iteration through input series items. The implementation is optional. Can be used to reset an internal calculation state.
```javascript
class ema {
    init() {
        this.previousMA = undefined;
        this.initialSum = 0;
    }
    ...
}
``` */
    init?(): void;

    /** Implements the algorithm that maps a flow of values from input series to a new series.
```
    ...
    map(d) {
        return d.value() - this.props.offset;
    }
    ...
```
     * @param entity Single input data
     * @param index Index of the entity in the input series
     * @param inputSeries
     * @returns The application expects the values in the output series at least match {@linkcode Indicator.plots} definition.
     * `number` returned value is identical to `{ value: number }` for a basic single line plot.
     * `undefined` returned value transaltes to an empty value in the output
     * Additionally, if the function returns the result as an object, it is possible to specify styling for this particular output item and/or for the corresponding candlestick. See details in [Signaling Average True Range](../pages/Tutorial/SignalingATR.html) tutorial.
    */
    map(entity: InputEntity | BarInputEntity, index: number, inputSeries: TimeSeries): number | { [fieldName: string]: any } | undefined;

    /** The app calls the method with the value returned by {@linkcode map} to check if the indicator's algorithm considers to filter out some result values. The method should return `true` if the value should stay. The implementation is optional. */
    filter(entity: { [fieldName: string]: any }): boolean;
}
