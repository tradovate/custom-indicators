import { LineStyle, FillStyle, ColorRGB, TextStyle } from "./Style";
import { ScaleBound } from "./Scale";

/**
 * A type that represents graphic objects. Used in `map`'s return object's `graphics.items` array property.
 * ```javascript
 *  ...
 * //we can tell map to render graphics using the graphics property in 
 * //map's return object:
 *  map(d) {
 *      return {
 *          graphics: {
 *              items: [
 *                  //Our DisplayObjects go here.
 *              ]
 *          }
 *      }
 *  }
 * ```
 */
export type DisplayObject = LineSegments | Shapes | ContourShapes | Instancing | Text | Container | Dots;

/**
 *  This is a `DisplayObject`. It represents a group of one or more Line objects.  
 * ```javascript
 * //within a the graphics items array, displays an infinite horizontal 
 * //line at the 3800 price.
 * ...
 *  {   
 *      tag: 'LineSegments',
 *      key: 'lines',
 *      lines: [
 *          {
 *              tag: 'Line',
 *              a: {
 *                  x: du(0),
 *                  y: du(3800),
 *              }, 
 *              b: {
 *                  x: du(1),
 *                  y: du(3800)
 *              },
 *              infiniteStart: true, 
 *              infiniteEnd: true          
 *          }
 *      ],
 *      lineStyle: {
 *          lineWidth: 3,
 *          color: '#f00'
 *      }
 * }
 * ```
*/
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
 * ```javascript
 * //within a LineSegments DisplayObject, displays an infinite horizontal 
 * //line at the 3800 price.
 * ...
 *  lines: [
 *      {
 *          tag: 'Line',
 *          a: {
 *              x: du(0),
 *              y: du(3800),
 *          }, 
 *          b: {
 *              x: du(1),
 *              y: du(3800)
 *          },
 *          infiniteStart: true, 
 *          infiniteEnd: true          
 *      }
 *  ]
 * ``` 
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
 * ```javascript
 * //within the graphics items array, displays a filled circle 60px above each bar
 * ...
 *  {
 *      tag: "Shapes",
 *      key: 'circs',
 *      primitives: [
 *          {
 *              tag: 'Circle',
 *              radius: 10,
 *              center: {
 *                  x: op(du(d.index()), '-', px(2)),
 *                  y: op(du(d.value()), '-', px(60)),
 *              },
 *          },
 *      ],
 *      fillStyle: {
 *          color: "#5c5"
 *      }
 *  }
 * ```
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
 * ```javascript
 * //within the graphics items array, displays a stroked circle 60px above each bar
 * ...
 *  {
 *      tag: "ContourShapes",
 *      key: 'circs',
 *      primitives: [
 *          {
 *              tag: 'Circle',
 *              radius: 10,
 *              center: {
 *                  x: op(du(d.index()), '-', px(2)),
 *                  y: op(du(d.value()), '-', px(60)),
 *              },
 *          },
 *      ],
 *      lineStyle: {
 *          lineWidth: 3,
 *          color: "#5c5"
 *      }
 *  }
 * ```
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
 * A type that represents the union of all primitive `Shape` object types. For use in `Shapes` or `ContourShapes`
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }
 * ```
 */
export type Shape = Rectangle | Circle | RoundedRectangle | Polygon | Ellipse;

/**
 * This is a `Shape` primitive. Defines an instance of a Rectangle shape for use in the Shapes or ContourShapes `primitives` value.
 * Usage:
 * ``` javascript
 * // Inside a calculator's map function, this particular definition will draw 
 * // red 24x24px squares centered at { x: index, y: value } of each rendered bar
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: 'Shapes',
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }   
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
 * This is a `Shape` primitive. Defines an instance of an `Ellipse` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
 * Usage:
 * ``` javascript
 * //within a map function's return object. This will draw a red ellipse centered at each rendered 
 * //bar's value and index.
 * ...
 *  {
 *      graphics: {
 *          items: [ 
 *              {
 *                  tag: 'Shapes',
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }    
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
 * This is a `Shape` primitive. Defines an instance of a `Circle` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }   
 * ```
 */
export interface Circle {
    readonly tag: 'Circle';
    readonly center: Point;
    readonly radius: number;
}

/**
 * This is a `Shape` primitive. Defines an instance of a `RoundedRectangle` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }      
 * ```
 */
export interface RoundedRectangle {
    readonly tag: 'RoundedRectangle';
    /** The `Point` origin of this object. */
    readonly position: Point;
    /** The `Size` object that describes this object's dimensions. */
    readonly size: Size;
    /** A `number` describing the radius of this object's corners in pixels. */
    readonly radius: number;
}

/**
 * This is a `Shape` primitive. Defines an instance of a `Polygon` shape for use in the `Shapes` or `ContourShapes` `primitives` value.
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
 *                      color: '#f00'
 *                  }
 *              }
 *          ]
 *      }
 *  }     
 * ```
 */
export interface Polygon {
    readonly tag: 'Polygon';
    /** An array of `Point` objects that describe this `Polygon`. */
    readonly points: readonly Point[];
}

/** 
 * This is a `DisplayObject`. Declares a one or more shapes as a shared instance. Members of the `instances` 
 * array will be rendered as shared instances. (Currently supports only `Rectangle`)
 * ```javascript
 *  //inside map's return object. This example will render an orange rect
 *  //extending 30px above each bar, centered at the bar. Each render
 *  //will use instance sharing.
 * ...
 *  graphics: {
 *      items: [
 *          {
 *              tag: "Instancing",
 *              key: "shades",
 *              instances: [
 *                  {
 *                      position: {
 *                          x: op(du(d.index()), '-', min(px(2.5), du(0.25))),
 *                          y: du(d.value())
 *                      },
 *                      size: {
 *                          width: min(px(5), du(0.5)),
 *                          height: px(30)
 *                      },          
 *                      color: { r: 1, g: 0.5, b: 0.25 }
 *                  }
 *              ],
 *          }
 *      ]
 * }
 * ```
 * 
 */
export interface Instancing {
    readonly tag: 'Instancing';
    /** The graphic element's render key, like an HTML `id` attribute. */   
    readonly key: string;
    /** An array of `Instance` objects that describes what shapes will share instances. */
    readonly instances: readonly Instance[];
    /** Optional. A `Shape` primitive to use. (Currently only supports `Rectangle`.) */
    readonly primitive?: Shape;
}

/** Defines an `Instance` to be used in an `Instances` `DisplayObject`. */
export interface Instance {
    /** A `Point` object that describes this object's origin in 2D space. */
    readonly position: Point;
    /** A `Size` object that describes the dimensions of this object. */
    readonly size: Size;
    /** A `ColorRGB` object that describes this object's color. */
    readonly color: ColorRGB;
}

/**
 * This is a `DisplayObject`. Represents an array of WebGL dots.
 * ```javascript
 * ...
 * //in map's return object. this example will draw a colorful square of dots above each bar.
 * graphics: {
 *      items: [
 *          tag: 'Dots',
 *          key: 'myDots',
 *          dots: [
 *              {
 *                  point: {
 *                      x: du(d.index()),
 *                      y: op(du(d.value()), '-', px(100))
 *                  },
 *                  color: { r: 1, g: 0, b: 0 }
 *              },
 *              {
 *                  point: {
 *                      x: op(du(d.index()), '-', px(6)),
 *                      y: op(du(d.value()), '-', px(94))
 *                  },
 *                  color: { r: 1, g: .5, b: 0 }
 *              },
 *              {
 *                  point: {
 *                      x: du(d.index()),
 *                      y: op(du(d.value()), '-', px(94))
 *                  },
 *                  color: { r: 0, g: .5, b: .5 }
 *              },
 *              {
 *                  point: {
 *                      x: op(du(d.index()), '-', px(6)),
 *                      y: op(du(d.value()), '-', px(100))
 *                  },
 *                  color: { r: 0, g: 0, b: 1 }
 *              },
 *          ],
 *          style: {
 *              lineWidth: 3,
 *              color: '#f00',
 *          }
 *      }
 * }
 * ```
 */
export interface Dots {
    readonly tag: 'Dots';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** An array of `Dot` objects that describe the dots in this drawing. */
    readonly dots: readonly Dot[];
    /** 
     * The style of the dots as a `LineStyle` object. Individual dot colors override the 
     * color portion of this value
     */
    readonly style: LineStyle;
}

/**
 * Describes a `Dot` object for use in the `Dots` `DisplayObject`.
 * Consists of a `Point` and a `ColorRGB`.
 * ```javascript
 *  //a dot 400px above the graph origin. This will inherit it's size from the `Dots` owner object's `style`.
 *  const myDot = {
 *      point: {
 *          x: px(0),
 *          y: px(400)
 *      },
 *      color: {
 *          r: 1, g: 0, b: 0
 *      }
 *  }
 * ```
 */
export interface Dot {
    /** A `Point` object to describe this `Dot`'s position in 2D space. */
    readonly point: Point;
    /** A `ColorRGB` object used to describe the color of this `Dot`. */
    readonly color: ColorRGB;
}

/**
 * This is a `DisplayObject`. Represents some text to be rendered. When rendered in the global space, 
 * `Text` can be used as a label.
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
 *                      style: { fontSize: 18, fontWeight: "bold", fill: '#f00' },
 *                      textAlignment: 'centerMiddle',
 *                      global: true //<- indicates this is a globally-scoped object
 *                  }
 *              ]
 *          }
 *      }
 *  }
 * ```
 */
export interface Text {
    readonly tag: 'Text';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** The origin point of the element. */
    readonly point: Point;
    /** The text string to display. */
    readonly text: string;
    /** An Object with one optional property, `color`. */
    readonly style: TextStyle;
    /** Any of the valid `TextAlignmentEnum` values. */
    readonly textAlignment: TextAlignmentEnum;
}

/** Type union over all valid text alignment strings. */
export type TextAlignmentEnum = "none" | "centerAbove" | "centerMiddle" | "centerBelow" | "leftAbove" | "leftMiddle" | "leftBelow" | "rightAbove" | "rightMiddle" | "rightBelow";

/** 
 * This is a `DisplayObject`. You can use a container to logically group elements. You can also 
 * optionally specify transformation operations over the entire container.
 * ```javascript
 *  graphics: {
 *      items: [
 *          {
 *              tag: 'Container',
 *              key: 'myContainer',
 *              children: [
 *                  {
 *                      tag: "Text",
 *                      key: "rightTop",
 *                      point: {
 *                          x: op(du(d.index()), '-', px(2)),
 *                          y: op(du(d.value()), '-', px(58)),
 *                      },
 *                      text: "!",
 *                      style: { fontSize: 18, fontWeight: "bold", fill: "#5c5" },
 *                      textAlignment: "centerMiddle"
 *                  },
 *                  {
 *                      tag: "ContourShapes",
 *                      key: 'circs',
 *                      primitives: [
 *                          {
 *                              tag: 'Circle',
 *                              radius: 10,
 *                              center: {
 *                                  x: op(du(d.index()), '-', px(2)),
 *                                  y: op(du(d.value()), '-', px(60)),
 *                              },
 *                          }
 *                      ],
 *                      lineStyle: {
 *                          lineWidth: 3,
 *                          color: "#5c5"
 *                      }
 *                  }
 *              ],
 *          }
 *      }
 *  }
 * ```
 */
export interface Container {
    readonly tag: 'Container';
    /** The graphic element's render key, like an HTML `id` attribute. */
    readonly key: string;
    /** Array of children objects contained in this `Container`. */
    readonly children: readonly DisplayObject[];
    /** Optional. An array of `TransformOp`s. */
    readonly transformOps?: readonly TransformOp[];
}

/**
 * Defines a point within a space of variable unit types
 */
export interface Point {
    /** 
     * A `ScaleBound` value that describes the x component of this `Point`.
     * hint: use the `px`, `du`, or `op` helper functions 
     */
    readonly x: ScaleBound;
    /** 
     * A `ScaleBound` value that describes the y component of this `Point`.
     * hint: use the `px`, `du`, or `op` helper functions 
     */
    readonly y: ScaleBound;
}

/**
 * Used in `Rectangle` and `RoundedRectangle`. Defines an object that has `ScaleBound` 
 * `height` and `width` properties. 
 */
export interface Size {
    readonly width: ScaleBound;
    readonly height: ScaleBound;
}

/** Type union over `Translate` and `ZIndex`. Used to describe a transformation operation
 * on a `Container` `DisplayObject`.
 * ```typescript
 *  type Translate {
 *      readonly tag: 'Translate';
 *      readonly vector: Vector2;
 *  }
 *  type ZIndex {
 *      readonly tag: 'ZIndex';
 *      readonly zIndex: number;
 *  }
 * ```
 */
export type TransformOp = Translate | ZIndex;

/** Describes a 2D translation transformation, using the components of the provided `Vector2` */
interface Translate {
    readonly tag: 'Translate';
    readonly vector: Vector2;
}

/** Describes a 2 component Vector */
export interface Vector2 {
    /** Vector x component. Hint: use the `du(value)`, `px(value)`, or `op(a, oper, b)` helper functions */
    readonly x: ScaleBound;
    /** Vector y component. Hint: use the `du(value)`, `px(value)`, or `op(a, oper, b)` helper functions */
    readonly y: ScaleBound;
}

/** 
 * Describes a transformation in the Z axis. Negative Z faces into the viewport, 
 * positive toward the end user. 
 */
interface ZIndex {
    readonly tag: 'ZIndex';
    readonly zIndex: number;
}
