// This functionality requires Tradovate Trader 1.210903+

import { ParameterDefinitions } from "./params";
import { Plots } from "./plots";
import { Point } from "./graphics/DisplayObject";
import { GraphicsResponse } from "./graphics/GraphicsResponse"
import { LineStyle, Color } from "./graphics/Style";
import { ScaleBound } from "./graphics/Scale";

/**
 * Definition for a Custom Drawing Tool for use in the Trader application. This is the `module.exports` portion of the Custom Drawing Tool.
 * 
 * ```js
 *  //an example drawing tool export
 * 
 *  module.exports = {
 *      name: 'MyCustomDrawingTool',
 *      drawing: MyDrawingImplementation,
 *      description: 'My Custom Tool',
 *      params: {
 *          period: predef.paramSpecs.period(13)
 *      }
 *  }
 * ```
 * 
 */
interface DrawingTool {
  /** Unique identifier associated with the indicator. */
  readonly name: string;
  /** Calculation algorithms */
  readonly drawing: DrawingToolImplementation;
  /** Readable text that is used in the UI. Optional. */
  readonly description?: string;
  /** Set of input parameters. Optional. */
  readonly params?: ParameterDefinitions;
  /** Output results for displaying. Optional. If not specified, the application will expect a numeric output or `value` field of the output object. */
  readonly plots?: Plots;
  /** How to group with other similar indicators in UI dropdown menu. */
  readonly tags?: readonly string[];
  /** Maximum number of anchors that this drawing tool can have. */
  readonly maxN?: number;
  /** Minimum number of anchors that this drawing tool can have. */
  readonly minN?: number;
}

/**
 * A configuration object passed as a parameter to `DrawingToolImplementation` methods.
 */
interface DrawingArgs {
  /** Reflects the `params` field of {@link DrawingTool}, these are the user defined inputs for this custom tool. */
  readonly props: { [parameterName: string]: number | boolean };
  /** User defined output plots. Reflects the `plots` field of `DrawingTool`.  */
  readonly plots: { [parameterName: string]: LineStyle };
  /** Array of anchors associated with this drawing tool. */
  readonly anchors: readonly Point[];
  /** 
   * An arbitrary state held by an instance of {@link DrawingToolImplementation}, example usage would be keeping references to heavy calculations' 
   * results so we don't need to run them on every render.
   */
  readonly state: any;
}

/**
 * An interface holding the methods used by Custom Drawing Tools. See {@link DrawingToolImplementation.render}, {@link DrawingToolImplementation.update},
 * {@link DrawingToolImplementation.anchorRestraints}, {@link DrawingToolImplementation.anchorStyles}, {@link DrawingToolImplementation.tooltips},
 * {@link DrawingToolImplementation.init}.
 */
interface DrawingToolImplementation {
  /** Initializes the `state` parameter of {@link DrawingArgs}. 
   * 
   * ```js
   * const MyCustomTool = {
   *    init() {
   *        return {
   *            myCustomValue: 'hello world!',
   *            myCalculation: someBigCalculation()
   *        }
   *    },
   *    //...
   * }
   * ```
   * 
  */
  init?: () => any;
  /** 
   * Returns a `GraphicsResponse` object that defines what graphics to render and where. The returned object should contain an `items` array of {@link DisplayObject}.
   * 
   * ```js
   * //the render function of a custom tool
   * 
   * const MyCustomTool = {
   *    //...
   *    render({anchors, props}) {
   *        return {
   *            items: [
   *                //DisplayObjects here
   *            ]
   *        }
   *    }   
   *    //...
   * }
   * ```
   * 
   */
  render(args: DrawingArgs): GraphicsResponse;

  /** 
   * Updates the `state` of the {@link DrawingArgs} parameter. 
   * 
   * ```js
   * const MyCustomTool = {
   *    //...
   *    update({state}) {
   *        if(checkSomeCondition(state)) {     //check a condition on your state
   *            return {                        //if it is true, re-run some big calculation
   *                newState: {
   *                    ...state,               
   *                    myBigCalculation: runMyBigCalculation()
   *                }
   *            }
   *        } 
   * 
   *        //returning nothing will keep the old state, or 
   *        //you can return { newState: state } 
   *    }
   *    //...
   * },
   * ```
   * 
   */
  update?: (args: DrawingArgs) => { newState: any } | undefined | null;

  /** 
  * Limits the valid X and Y coordinate ranges that the Anchors can be separated by. 
  * 
  * ```js
  * 
  *  const MyCustomTool = {
  *      //...
  * 
  *      //anchors with these retraints can be up to 2 units apart in the Y axis and up to 14 units apart in the X axis
  *      anchorRestraints() {
  *          return [{y: 2}, {x: 14}]
  *      },
  * 
  *      //anchors with these restraints can be between the 4525 and 4535 price in the Y axis
  *      anchorRestraints() {
  *          return [{y: [4525, 4535]}]
  *      }
  * 
  *      //...
  *  }  
  * ```
  * 
  */
  anchorRestraints?: (args: DrawingArgs) => readonly AnchorRestraint[];

  /** 
  * Returns an array of {@link AnchorStyle} objects that define the colors for the Anchors in this Custom Drawing Tool.
  * 
  * ```js
  *  const MyCustomTool = {
  *      //...
  * 
  *      // The anchor at anchors[0] will be red, the anchor at anchors[1] will be blue
  *      anchorStyles() {
  *          return [{ color: 'red' }, { color: 'blue' }]
  *      },
  *      
  *      //...
  *  }
  * ```
  * 
  */
  anchorStyles?: (args: DrawingArgs) => readonly AnchorStyle[];

  /** 
  * Returns an array of {@link DrawingTooltip} objects.
  * 
  * ```js
  * const MyCustomTool = {
  *     //...
  *     tooltips({ anchors }) {
  *         return [
  *             {
  *                 coord: anchors[0],
  *                 alignment: {
  *                     tag: 'predef',
  *                     x: 'center',
  *                     y: 'center'
  *                 },
  *                 items: [  
  *                     {                        
  *                         content: "Hurray5",
  *                         title: "Woot-"
  *                     },
  *                     {
  *                         content: new Date()
  *                     },
  *                     {
  *                         content: 500
  *                     },
  *                     {
  *                         content: {delta: anchors[1].y.value - anchors[0].y.value}
  *                     }
  *                 ]
  *             }
  *         ]
  *     },
  *     //...
  * }
  * ```
  * 
  */
  tooltips?: (args: DrawingArgs) => readonly DrawingTooltip[];
}

/**
 * A number or pair of numbers that describe the limits of a coordinate. If this is a single number, describes the number of units that are valid
 * for a coordinate in the given axis. If this is an array pair of numbers, describes the `[min, max]` absolute coordinate values that are valid 
 * for the given axis.
 * 
 * ```js
 * 
 *  const MyCustomTool = {
 *      //...
 * 
 *      //a drawing tool with these retraints can move plus or minus 2 units in the Y axis and plus or minus 14 units in the X axis
 *      anchorRestraints() {
 *          return [{y: 2}, {x: 14}]
 *      },
 * 
 *      //a drawing tool with these restraints can move between the 4525 and 4535 price in the Y axis
 *      anchorRestraints() {
 *          return [{y: [4525, 4535]}]
 *      }
 * 
 *      //...
 *  }  
 * ```
 * 
 */
type CoordinateRestraint = number | [number, number];

/**
 * An object with an `x` and/or `y` field that describes the {@link CoordinateRestraint} for a Custom Drawing Tool's Anchor at the 
 * matching array position.  
 * 
 * ```js
 * 
 *  const MyCustomTool = {
 *      //...
 * 
 *      //the anchor at position [0] can move 2 units in the Y axis and the 
 *      //anchor at position [1] can move 14 units in the X axis
 *      anchorRestraints() {
 *          return [{y: 2}, {x: 14}]
 *      },
 * 
 *      //the anchor at position [0] can move between the 4525 and 4535 price in the Y axis
 *      anchorRestraints() {
 *          return [{y: [4525, 4535]}]
 *      },
 * 
 *      //...
 *  }  
 * ```
 * 
 */
interface AnchorRestraint {
    readonly x?: CoordinateRestraint;
    readonly y?: CoordinateRestraint;
}

/**
 * Interface describing the style of a given Anchor.
 * 
 * ```js
 *  const MyCustomTool = {
 *      //...
 * 
 *      // The anchor at anchors[0] will be red, the anchor at anchors[1] will be blue
 *      anchorStyles() {
 *          return [{ color: 'red' }, { color: 'blue' }]
 *      },
 *      
 *      //...
 *  }
 * ```
 * 
 */
interface AnchorStyle {
    /** Color of the anchor. */
    readonly color: Color;
}

/**
 * By holding shift while mousing over a Custom Drawing Tool, you can reveal its tooltip. You can use this interface to describe how these tooltips
 * will appear by changing their coordinates, content items, and alignment.
 */
export interface DrawingTooltip {
    /** The X and Y coordinates that this tooltip will be rendered at. */
    readonly coord: Point;
    /** An array of {@link DrawingTooltip.Item} that describes the content of the tooltip. */
    readonly items: readonly DrawingTooltip.Item[];
    /** How this tooltip will be aligned relative to its coord `Point`. If undefined, defaults to {@link DrawingTooltip.PredefinedAlignment} with the `x` field set to `'left'` and the `y` field set to `'below'`. */
    readonly alignment?: DrawingTooltip.Alignment;
}

export module DrawingTooltip {
    /**
     * Describes a {@link DrawingTooltip} content item.
     */
    export interface Item {
        /** Drawing content, can be a variety of types. Will tell the tooltip to render whatever content is defined.*/
        readonly content: string | number | Date | { delta: number } | ScaleBound;
        /** Unique key for this content item. */
        readonly key?: string;
        /** Title for this content item, will render as a label before content. */
        readonly title?: string;
    }
    /**
     * The basic Predefined Alignment method. You can assign an alignment mode to the `x` and `y` fields to control where 
     * the tooltip will render relative to the render {@link Point} of the tooltip.
     */
    export interface PredefinedAlignment {
        readonly tag: 'predef',
        /** X alignment for this tooltip. */
        readonly x: 'left' | 'center' | 'right';
        /** Y alignment for this tooltip. */
        readonly y: 'above' | 'center' | 'below';
    }
    /**
     * For use with infinite lines, keeps the tooltip away from the line instead of on top of the line.
     */
    export interface OrthogonalAlignment {
        readonly tag: 'orthogonal',
        readonly diagonalPoint: Point;
    }
    /**
     * Aligns the tooltip relative to the `diagonalPoint` {@link Point} field. Will orient the tooltip to always align opposite the direction 
     * of the `diagonalPoint` field. If the `diagonalPoint` is equal to the `coord` point of this tooltip, will render directly centered on that point.
     */
    export interface ContinuationAlignment {
        readonly tag: 'continuation',
        readonly diagonalPoint: Point;
    }
    /**
     * A type describing the possible types of alignment that can be implemented by a Drawing Tool's Tooltip.
     */
    export type Alignment = PredefinedAlignment | OrthogonalAlignment | ContinuationAlignment;
}
