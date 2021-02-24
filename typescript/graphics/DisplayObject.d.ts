import { LineStyle, FillStyle, ColorRGB, TextStyle } from "./Style";
import { ScaleBound } from "./Scale";

/**
 * A type that represents graphic objects. Used in `map`'s return object's `graphics.items` array property.
 * ```javascript
 *  ...
 * //we can tell map to render graphics:
 *  map(d) {
 *      return {
 *          graphics: {
 *              items: [
 *                  //Our DisplayObjects go here.
 *              ]
 *          }
 *      }
 *  }
 * ...
 * ```
 */
export type DisplayObject = LineSegments | Shapes | ContourShapes | Instancing | Text | Container | Dots;

/** This is a `DisplayObject`. It represents a group of one or more Line objects.  */
export interface LineSegments {
    readonly tag: 'LineSegments';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** An array of `Line` objects to be rendered. */
    readonly lines: readonly Line[];
    /** `LineStyle` object representing the rendered group's styles. */
    readonly lineStyle: LineStyle;
}

/** 
 * Represents a single line from point `a` to `b`. For use in the `LineSegments` `DisplayObject`. May 
 * be declared as having optional infinite start or end values such that the line will not terminate 
 * on one or both ends of the X axis. 
 */
export interface Line {
    readonly tag: 'Line';
    /** origin point of the line */
    readonly a: Point;
    /** end point of the line. */
    readonly b: Point;
    /** Optional. Declares that this line is non-terminal in the negative X-axis space. */
    readonly infiniteStart?: boolean;
    /** Optional. Declares that this line is non-terminal in the positive X-axis space. */
    readonly infiniteEnd?: boolean;
}

/**
 * This is a `DisplayObject`. Represents a group of one or more solid primitive `Shape` objects.
 */
export interface Shapes {
    readonly tag: 'Shapes';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** An array of `Shape` objects associated with this `Shapes` group. */
    readonly primitives: readonly Shape[];
    /** `FillStyle` object to define the color that this group of shapes will be rendered. */
    readonly fillStyle: FillStyle;
}

/**
 * This is a `DisplayObject`. Represents a group of one or more outlined primitive `Shape` objects.
 */
export interface ContourShapes {
    readonly tag: 'ContourShapes';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** An array of `Shape` primitives associated with this `ContourShapes` group. */
    readonly primitives: readonly Shape[];
    /** The `LineStyle` object representing the width and color of the rendered object's outlines.  */
    readonly lineStyle: LineStyle;
}

/**
 * A type that represents any of the primitive `Shape` objects. For use in `Shapes` or `ContourShapes`
 * `DisplayObject`s rendered `shapes` array.
 * 
 * ```javascript
 *  ...
 *  {
 *      graphics: {
 *          items: [
 *              {
 *                  tag: "Shapes",
 *                  key: "myShapes",
 *                  primitives: [
 *                      //Shapes go here.
 *                  ]
 *                  fillStyle: {
 *                      color: { r: 1, b: 0, c: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 *  ...
 * ```
 */
export type Shape = Rectangle | Circle | RoundedRectangle | Polygon | Ellipse;

/**
 * Shape Object. Defines an instance of a Rectangle shape for use in the Shapes or ContourShapes `primitives` value.
 * Usage:
 * ``` javascript
 * // Inside a calculator's `map` function, this particular definition will draw 
 * // red 24x24px squares centered at { x: index, y: value } of each rendered bar
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: "Shapes",
 *                  key: 'rects',
 *                  //the rectangle is a primitve
 *                  primitives: [ 
 *                      {
 *                          tag: 'Rectangle',
 *                          position: {
 *                              x: du(d.index()),
 *                              y: du(d.value()),
 *                          }
 *                          size: {
 *                              height: px(24),
 *                              width: px(24)
 *                          }
 *                      }
 *                  ],
 *                  fillStyle: {
 *                      color: { r: 1, g: 0, b: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ...
 *      
 * ```
 */
export interface Rectangle {
    readonly tag: 'Rectangle';
    /** */
    readonly position: Point;
    readonly size: Size;
    readonly infiniteStart?: boolean;
    readonly infiniteEnd?: boolean;
}

/**
 * Shape Object. Defines an instance of an `Ellipse` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
 * Usage:
 * ``` javascript
 * //within a map function's return object. This will draw a red ellipse centered at each rendered 
 * //bar's value and index.
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: "Shapes",
 *                  key: 'ellipses',
 *                  //the ellipse is a primitve
 *                  primitives: [ 
 *                      {
 *                          tag: 'Ellipse',
 *                          position: {
 *                              x: du(d.index()),
 *                              y: du(d.value()),
 *                          }
 *                          size: {
 *                              height: px(18),
 *                              width: px(24)
 *                          }
 *                      }
 *                  ],
 *                  fillStyle: {
 *                      color: { r: 1, g: 0, b: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ...
 *      
 * ```
 */
export interface Ellipse {
    readonly tag: 'Ellipse';
    /** origin point of the ellipse */
    readonly position: Point;
    /** size of the ellipse */
    readonly size: Size;
}

/**
 * `Shape` Object. Defines an instance of a `Circle` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
 * Usage:
 * ``` javascript
 * //within a map function's return object. This will draw a red circle centered at each rendered 
 * //bar's value and index.
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: "Shapes",
 *                  key: 'circles',
 *                  //the circle is a primitve
 *                  primitives: [ 
 *                      {
 *                          tag: 'Circle',
 *                          center: {
 *                              x: d.index(),
 *                              y: d.value(),
 *                          }
 *                          radius: 10
 *                      }
 *                  ],
 *                  fillStyle: {
 *                      color: { r: 1, g: 0, b: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ...
 *      
 * ```
 */
export interface Circle {
    readonly tag: 'Circle';
    readonly center: Point;
    readonly radius: number;
}

/**
 * `Shape` Object. Defines an instance of a `RoundedRectangle` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
 * Usage:
 * ``` javascript
 * //within a map function's return object. This will draw a red rounded rect centered at each rendered 
 * //bar's value and index.
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: "Shapes",
 *                  key: 'roundRects',
 *                  //the rounded rect is a primitve
 *                  primitives: [ 
 *                      {
 *                          tag: 'RoundedRectangle',
 *                          position: {
 *                              x: du(d.index()),
 *                              y: du(d.value()),
 *                          }
 *                          size: {
 *                              height: px(16),
 *                              width: px(24)
 *                          }
 *                      }
 *                  ],
 *                  fillStyle: {
 *                      color: { r: 1, g: 0, b: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ...
 *      
 * ```
 */
export interface RoundedRectangle {
    readonly tag: 'RoundedRectangle';
    readonly position: Point;
    readonly size: Size;
    readonly radius: number;
}

/**
 * `Shape` Object. Defines an instance of a `Polygon` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
 * Usage:
 * ``` javascript
 * //within a map function's return object. This will draw a red triangle rect at each rendered 
 * //bar's value and index.
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: "Shapes",
 *                  key: 'tris',
 *                  //the polygon is a primitve
 *                  primitives: [ 
 *                      {
 *                          tag: 'Polygon',
 *                          points: [
 *                              //top
 *                              {
 *                                  x: du(d.index()),
 *                                  y: op(du(d.value()), '-', px(4))
 *                              },
 *                              //right
 *                              {
 *                                  x: op(du(d.index()), '+', px(4)),
 *                                  y: du(d.value())
 *                              },
 *                              //left
 *                              {
 *                                  x: op(du(d.index()), '-', px(4)),
 *                                  y: du(d.value())
 *                              }
 *                          ]
 *                      }
 *                  ],
 *                  fillStyle: {
 *                      color: { r: 1, g: 0, b: 0 }
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ...
 *      
 * ```
 */
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
