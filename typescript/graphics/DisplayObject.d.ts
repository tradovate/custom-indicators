import { LineStyle, FillStyle, ColorRGB, TextStyle } from "./Style";
import { ScaleBound } from "./Scale";

export type DisplayObject = LineSegments | Shapes | ContourShapes | Instancing | Text | Container | Dots;

export interface LineSegments {
    readonly tag: 'LineSegments';
    readonly key: string;
    readonly lines: readonly Line[];
    readonly lineStyle: LineStyle;
}

export interface Line {
    readonly tag: 'Line';
    readonly a: Point;
    readonly b: Point;
    readonly infiniteStart?: boolean;
    readonly infiniteEnd?: boolean;
}

export interface Shapes {
    readonly tag: 'Shapes';
    readonly key: string;
    readonly primitives: readonly Shape[];
    readonly fillStyle: FillStyle;
}

export interface ContourShapes {
    readonly tag: 'ContourShapes';
    readonly key: string;
    readonly primitives: readonly Shape[];
    readonly lineStyle: LineStyle;
}

export type Shape = Rectangle | Circle | RoundedRectangle | Polygon | Ellipse;

export interface Rectangle {
    readonly tag: 'Rectangle';
    readonly position: Point;
    readonly size: Size;
    readonly infiniteStart?: boolean;
    readonly infiniteEnd?: boolean;
}

export interface Ellipse {
    readonly tag: 'Ellipse';
    readonly position: Point;
    readonly size: Size;
}

export interface Circle {
    readonly tag: 'Circle';
    readonly center: Point;
    readonly radius: number;
}

export interface RoundedRectangle {
    readonly tag: 'RoundedRectangle';
    readonly position: Point;
    readonly size: Size;
    readonly radius: number;
}

export interface Polygon {
    readonly tag: 'Polygon';
    readonly points: readonly Point[];
}

export interface Instancing {
    readonly tag: 'Instancing';
    readonly key: string;
    readonly instances: readonly Instance[];
    readonly primitive?: Shape;
}

export interface Instance {
    readonly position: Point;
    readonly size: Size;
    readonly color: ColorRGB;
}

export interface Dots {
    readonly tag: 'Dots';
    readonly key: string;
    readonly dots: readonly Dot[];
    readonly style: LineStyle;
}

export interface Dot {
    readonly point: Point;
    readonly color: ColorRGB;
}

export interface Text {
    readonly tag: 'Text';
    readonly key: string;
    readonly point: Point;
    readonly text: string;
    readonly style: TextStyle;
    readonly textAlignment: TextAlignmentEnum;
}

export type TextAlignmentEnum = "none" | "centerAbove" | "centerMiddle" | "centerBelow" | "leftAbove" | "leftMiddle" | "leftBelow" | "rightAbove" | "rightMiddle" | "rightBelow";

export interface Container {
    readonly tag: 'Container';
    readonly key: string;
    readonly children: readonly DisplayObject[];
    readonly transformOps?: readonly TransformOp[];
}

export interface Point {
    readonly x: ScaleBound;
    readonly y: ScaleBound;
}

export interface Size {
    readonly width: ScaleBound;
    readonly height: ScaleBound;
}

export type TransformOp = Translate | ZIndex;

interface Translate {
    readonly tag: 'Translate';
    readonly vector: Vector2;
}

export interface Vector2 {
    readonly x: ScaleBound;
    readonly y: ScaleBound;
}

interface ZIndex {
    readonly tag: 'ZIndex';
    readonly zIndex: number;
}
