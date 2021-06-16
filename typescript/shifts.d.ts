/**
 * Describes a `Shifts` `Indicator` component. This is an object with string keys of any name whose values are numbers. Each key string
 * should correspond with a property you've defined on the return object of the `map` function.
 */
export interface Shifts {
    /** The application expects `value` but you can return anything from `map`. */
    readonly value?: number;
    /** Shift properties' keys should be mapped to plot names. */
    readonly [plotName: string]: number;
}