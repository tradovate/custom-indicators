/** Tells the app how to auto-scale the indicator in the chart area. */
export interface Scaler {
    readonly type: 'multiPath';
    /** A set of fields of output object calculated by {@linkcode Calculator.map} that should by used by autoscaling functionality */
    readonly fields: readonly string[];
}