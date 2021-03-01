import { DisplayObject } from "./DisplayObject";

/**
 * The `graphics` object portion of the `map` function's object return.
 * ```javascript
 *  map(d) {
 *      return {
 *          graphics: {
 *              items: [
 *                  //GraphicsObjects go here.
 *              ]
 *          }
 *      }
 *  }
 * ```
 */
export interface GraphicsResponse {
    /** Optional. The array of `GraphicsObject`s to render. */
    readonly items?: readonly GraphicsObject[];
}

/**
 * A type that describes the intersection between `DisplayObject`, `AxesOrigin`, and a boolean value representing
 * whether or not to render in the global scope.
 * ```javascript
 *  ...
 * //in this example map returns a global text label at the last bar's
 * //index on the X-axis and 40 pixels above the price 3850 in the Y-axis.
 *  map(d) {
 *      return {
 *          graphics: d.isLast() && {
 *              items: [
 *                  {
 *                      tag: 'Text',
 *                      key: 'myLabel',
 *                      point: {
 *                          x: du(d.index()),
 *                          y: op(du(3850), '-', px(40))
 *                      },
 *                      text: '-> 3850',
 *                      style: { fill: '#f00' },
 *                      textAlignment: 'centerMiddle',
 *                      global: true, //<- indicates this is a globally-scoped object
 *                      origin: {     //<- indicates (0,0) is (right, top) oriented
 *                          cs: 'grid',
 *                          h: 'right',
 *                          v: 'top',
 *                      }
 *                  }
 *              ]
 *          }
 *      }
 *  }
 * ```
 */
export type GraphicsObject = DisplayObject & GraphicsScope;

export type GraphicsScope = {
    readonly origin?: AxesOrigin;
    readonly global?: boolean;
    readonly conditions?: VisibilityConditions;
};

export type ScaleRange = {
    readonly min?: number;
    readonly max?: number;
};

export type VisibilityConditions = {
    scaleRangeX?: ScaleRange;
    scaleRangeY?: ScaleRange;
};

/**
 * An interface that describes the position and scale type of a `GraphicsObject`'s render origin. Basically,
 * this defines where (0, 0) will be oriented in the chart space.
 */
export interface AxesOrigin {
    readonly cs: "frame" | "grid";
    readonly h: 'left' | 'right';
    readonly v: 'top' | 'bottom';
}
