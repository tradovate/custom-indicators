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
 * A type that describes the intersection between `DisplayObject` and `GraphicsScope`.
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

/**
 * The scope of the GraphicsObject. This consists of its origin in the given space, whether 
 * or not it is a global (single render) object, and the scalar condition under which the object 
 * should or should not be drawn.
 */
export type GraphicsScope = {
    readonly origin?: AxesOrigin;
    readonly global?: boolean;
    readonly conditions?: VisibilityConditions;
};

/**
 * A range in pixels per domain unit.
 */
export type ScaleRange = {
    readonly min?: number;
    readonly max?: number;
};

/**
 * Defines an object that describes the minimum and maximum scalar conditions that must exist for this object to be drawn.
 * This scale is measured in pixels per domain unit. This means that X represents roughly the pixels between bars, and Y is 
 * the tick size of the contract.  
 * ```javascript
 *  //adding this condition will cause our text object to render only at px/du > 10
 *  ...
 *  items: [
 *      {
 *          conditions: {
 *            scaleRangeX: { min: 10 }  
 *          },
 *          tag: 'Text',
 *          key: 'myText',
 *          text: 'rendered!',
 *          alignment: 'centerMiddle',
 *          point: {
 *              x: du(d.index()),
 *              y: op(du(d.value()), '-', px(50))
 *          },
 *          style: { fontSize: 18, fill: "red" },
 *      }
 *  ]
 *  ...
 * ```
 */
export type VisibilityConditions = {
    /** Optional. Roughly equal to the min and/or max number of px between bars required for this object to render. */
    scaleRangeX?: ScaleRange;
    /** Optional. The min and or max pixels per tick for this object's contract dependency required for this object to render. */
    scaleRangeY?: ScaleRange;
};

/**
 * An interface that describes the position and scale type of a `GraphicsObject`'s render origin. This defines how values are oriented in chart space.
 * By default an object's `AxesOrigin` `cs` is in `grid` space, `h` or the horizontal space is measured from `left`, and `v` or vertical space is measured from `top`.
 */
export interface AxesOrigin {
    readonly cs: "frame" | "grid";
    readonly h: 'left' | 'right';
    readonly v: 'top' | 'bottom';
}
