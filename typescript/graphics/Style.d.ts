/**
 * Represents the style used to render a line.
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
 */
export interface FillStyle {
    /** 
     * the fill color. Can be a Web Color string in either named (`'red'`)
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
 * Definition for Text fill style.
 */
export interface TextStyle extends FontStyle {
    readonly fill?: Color;
}

/**
 * A hexadecimal or named web color string
 */
export type Color = number | string;

/**
 * An object that represents RGB color.
 */
export interface ColorRGB {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}
