export interface LineStyle {
    readonly lineWidth: number;
    readonly color: Color;
    readonly opacity?: number;
    readonly lineStyle?: DashLineStyle | string;
}

export enum DashLineStyle {
    Solid = 1,
    ThreeOne = 2,
    TwoTwo = 3,
    FiveTwo = 4,
    FourFour = 5
}

export interface FillStyle {
    readonly color: Color;
    readonly opacity?: number;
}

export interface FontStyle {
    readonly fontFamily?: string;
    readonly fontSize: number;
    readonly fontStyle?: string;
    readonly fontWeight?: string;
    readonly letterSpacing?: number;
    readonly lineHeight?: number;
}

export interface TextStyle extends FontStyle {
    readonly fill?: Color;
}

export type Color = number | string;

export interface ColorRGB {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}
