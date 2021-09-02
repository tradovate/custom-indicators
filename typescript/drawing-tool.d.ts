// This functionality requires Tradovate Trader 1.210903+

import { ParameterDefinitions } from "./params";
import { Plots } from "./plots";
import { Point } from "./graphics/DisplayObject";
import { GraphicsResponse } from "./graphics/GraphicsResponse"
import { LineStyle, Color } from "./graphics/Style";
import { ScaleBound } from "./graphics/Scale";

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
}

interface DrawingArgs {
  readonly props: { [parameterName: string]: number | boolean };
  readonly plots: { [parameterName: string]: LineStyle };
  readonly anchors: readonly Point[];
  readonly state: any;
}

interface DrawingToolImplementation {
  render(args: DrawingArgs): GraphicsResponse;
  init?: (args: DrawingArgs) => any;
  update?: (args: DrawingArgs) => { newState: any };
  anchorRestraints?: (args: DrawingArgs) => readonly AnchorRestraint[];
  anchorStyles?: (args: DrawingArgs) => readonly AnchorStyle[];
  tooltips?: (args: DrawingArgs) => readonly DrawingTooltip[];
}

type CoordinateRestraint = number | [number, number];

interface AnchorRestraint {
    readonly x?: CoordinateRestraint;
    readonly y?: CoordinateRestraint;
}

interface AnchorStyle {
    readonly color: Color;
}

export interface DrawingTooltip {
    readonly coord: Point;
    readonly items: readonly DrawingTooltip.Item[];
    readonly alignment?: DrawingTooltip.Alignment;
}

export module DrawingTooltip {
    export interface Item {
        readonly content: string | number | Date | { delta: number } | ScaleBound;
        readonly key?: string;
        readonly title?: string;
    }

    export interface PredefinedAlignment {
        readonly tag: 'predef',
        readonly x: 'left' | 'center' | 'right';
        readonly y: 'above' | 'center' | 'below';
    }

    export interface OrthogonalAlignment {
        readonly tag: 'orthogonal',
        readonly diagonalPoint: Point;
    }

    export interface ContinuationAlignment {
        readonly tag: 'continuation',
        readonly diagonalPoint: Point;
    }

    export type Alignment = PredefinedAlignment | OrthogonalAlignment | ContinuationAlignment;
}
