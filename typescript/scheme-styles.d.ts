/** Declares default color and other styles for plots.
    Allows defining styles for multiple app's color schemes. As for now, they are _dark_ and _light_. Each scheme has own field in the object that named correspondingly. If _light_ scheme is not set, _dark_ one is used.
 */
export interface SchemeStyles {
    dark: ThemedSchemeStyles;
    light?: ThemedSchemeStyles;
}

export interface ThemedSchemeStyles {
    readonly [plotName: string]: {
        /**  [Named web colors](https://en.wikipedia.org/wiki/Web_colors) */
        readonly color: string;
        readonly opacity?: number;
        /** In pixels */
        readonly lineWidth: number;
        /** An index of dash style in the list of line styles in the app's Indicator Editor. If not specifed - solid line */
        readonly lineStyle?: number;
    }
}