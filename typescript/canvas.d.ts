import { InputEntity } from "./TimeSeries";

/** A point in time domain. This value is not a number. You cannot use regular Javascript arithmetic operations with it. */
export type IndexedDate = {};

export type Path = {};

export type Heatmap = {};

export interface Point {
    /** A point in time domain. {@linkcode plotting.x} functions should be used to get the value from items of {@linkcode TimeSeries} */
    readonly x: IndexedDate;
    /** A value in the domain of the indicator. For example, price */
    readonly y: number;
}

export interface LineStyle {
    /** Web color */
    readonly color?: string | number;
    /** as 0..1 fraction */
    readonly opacity?: number;
    /**  Line width in pixels */
    readonly width?: number;
    /** Line width relatively OHLC bar space. If specified, `width` field is ignored */
    readonly relativeWidth?: number;
}

export interface Canvas {
    /** Draws a single line between two points */
    drawLine(from: Point, to: Point, style: LineStyle): void;
    
    /** Draws a multi-segment line.
     * @param path An object built by {@linkcode plotting.createPath}
     */
    drawPath(path: Path, style: LineStyle): void;

    /** Draws a heat map
     * @param heatmap An object built by {@linkcode plotting.createHeatmap}
     */
    drawHeatmap(heatmap: Heatmap): void;
}

/** Utility module that provides helper functions for {@linkcode Canvas} related custom plotting.
```javascript
const plotting = require("./tools/plotting");
```
*/
export module plotting {
    export module x {
        /** Evaluates `x` coordinate of an output item for using with `canvas.drawLine` and `canvas.drawPath` functions */
        export function get(entity: InputEntity): IndexedDate;

        /** Calculates a new {@linkcode IndexedDate} value as an offset from `x`
         * @param x Original value
         * @param dx Offset in pixels
         */
        export function relative(x: IndexedDate, dx: number): IndexedDate;

        /** Evaluates a new coordinate as a value between `x1` and `x2` that splits the distance between them as `k`:`1.0 - k` 
         * @param k 0..1
        */
        export function between(x1: IndexedDate, x2: IndexedDate, k: number): IndexedDate;
    }

    /** Encapsulates details about a multi-segment path */
    export interface PathBuilder {
        /** Moves the cursor to a new point
         * @param x A point in time domain
         * @param y A value in the domain of the indicator
         */
        moveTo(x: IndexedDate, y: number): PathBuilder;
        
        /** Draws a line from the last coordinates of the cursor to a new point. Moves the cursor to this point.
         * @param x A point in time domain
         * @param y A value in the domain of the indicator
         */
        lineTo(x: IndexedDate, y: number): PathBuilder;
        
        /**  Finalizes building the path
         * @returns An object that can be passed to {@linkcode Canvas.drawPath} function
         */
        end(): Path;
    }

    /** Creates an object that encapsulates details about a multi-segment path. */
    export function createPath(): PathBuilder;

    export interface HeatmapBuilder {
        /** Add a new column to the heatmap. Each band/column covers a range of values between `lowerBound` and `upperBound` at the `x` coordinate. 
         * @param x Coordinates of the band 
         * @param colors An array of web colors. Each color fills out equal space in the band/column.
         * */
        addColumn(x: IndexedDate, colors: readonly (string | number)[]): HeatmapBuilder; 
        
        /** Finalizes building the heatmap
         * @returns An object that can be passed to {@linkcode Canvas.drawHeatmap} function
         */
        end(): Heatmap;
    }

    /** Creates an object that encapsulates details about heat map. The heat map consists of multiple bands/columns, one band per each output item. The band covers an area from `lowerBound` to `upperBound`
     * @param lowerBound A value in the domain of the indicator
     * @param upperBound A value in the domain of the indicator
     */
    export function createHeatmap(lowerBound: number, upperBound: number): HeatmapBuilder;
}