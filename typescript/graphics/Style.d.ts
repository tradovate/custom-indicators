/**
 * Represents the style used to render a line.
 * ```javascript
 *  const my3pxLine = {
 *      lineWidth: 3,
 *      color: 'red',
 *  }
 * ```
 */
export interface LineStyle {
    /** width in pixels of the rendered line */
    readonly lineWidth: number;
    /** color of the rendered line */
    readonly color: Color;
    /** Optional. Opacity of the rendered line. */
    readonly opacity?: number;
    /** Optional. Defaults to `DashLineStyle.Solid`. See `DashLineStyle` for accepted values. */
    readonly lineStyle?: DashLineStyle | string;
}

/**
 * An enum that holds accepted values for the `lineStyle` property of the `LineStyle` interface.
 */
export enum DashLineStyle {
    Solid = 1,
    ThreeOne = 2,
    TwoTwo = 3,
    FiveTwo = 4,
    FourFour = 5
}

/** 
 * Defines a `Shapes` object's fill-style. 
 * ```javascript
 *  const halfRed = {
 *      color: 'red',
 *      opacity: 0.5,
 *  }
 * ```
 */
export interface FillStyle {
    /** 
     * Fill color described as a hexadecimal or named web color string.
     */
    readonly color: Color;
    /** number value between 0 and 1, where 1 represents 100% opacity. */
    readonly opacity?: number;
}

/**
 * Defines a 'Text' graphic object's `style` property.
 * ```javascript
 *  //18pt bold face font
 *  const myFontStyle = {
 *      fontSize: 18,
 *      fontWeight: 'bold'
 *  }
 * ```
 */
export interface FontStyle {
    /** Optional. A string representing the font family to use. Ex: `'monospace, Courier New'` */
    readonly fontFamily?: string;
    /** a number representing the font point size. */
    readonly fontSize: number;
    /** Optional. The style to apply to the font, such as 'italic'. */
    readonly fontStyle?: string;
    /** Optional. Weight of the font. Will accept a string such as "bold". */
    readonly fontWeight?: string;
    /** Optional. Represents space between letters in pixels. */
    readonly letterSpacing?: number;
    /** Optional. Text line height. Represents the vertical space in pixels that this line of text takes up. */
    readonly lineHeight?: number;
}

/**
 * Definition for a `Text` `DisplayObject`'s fill style. This inherits properties from `FontStyle`.
 * ```javascript
 *  const red18pt = { fill: '#f00', fontSize: 18 }
 * ```
 */
export interface TextStyle extends FontStyle {
    /** Optional. The color that the text should be rendered. */
    readonly fill?: Color;
}

/**
 * A hexadecimal or named web color string
 * ```javascript
 *  const orange = '#f90',
 *        red    = "red"
 * ```
 */
export type Color = number | string;

/**
 * An object that represents RGB color.
 * ```javascript
 *  const red = { r: 1, g: 0, b: 0 }
 * ```
 */
export interface ColorRGB {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}
