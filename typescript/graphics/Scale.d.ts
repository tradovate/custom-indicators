
/** Unit type to use for indicators' scale. 'du' indicates domain units, which are price 
 * for the y axis and index for the x axis. 'px' indicates pixels. 
 */
export type ScaleUnit = 'du' | 'px';

/**
 * An object that represents a value in units of either 'px' or 'du'. In the Code Explorer, 
 * we can use the `px(value)` or `du(value)` functions. To create dynamic values, we can use the
 * `op(a, operator, b)`:
 * ```javascript
 * //creates a point 60 pixels above the price 3800.50.
 * const myMixedValue = op(du(3800.50), '-', px(60))
 * 
 * ```
 */
export type ScaleBound = ScaleBoundValue | ExprScaleBound;

/** Simple value structure to represent a fixed value in either 'px' or 'du'. */
export interface ScaleBoundValue {
    /** The value portion of the `ScaleBoundValue` */
    readonly value: number;
    /** The type of unit that this measurement represents. Either 'px' or 'du'. */
    readonly unit: ScaleUnit;
}

/** Operator for `ExprScaleBound` expression-representing objects. */
type Op = '+' | '-' | '*' | '/' | 'max' | 'min';

/** 
 * An object that represents an expression for calculating `ScaleBoundValue`s dynamically. In the Code Explorer, 
 * we should use the `op`, `du`, and `px` helper functions. You can mix units freely in an `ExprScaleBound` object:
 * ```javascript
 * //creates a value that represents a point 60 pixels above the price 3850.00.
 *  const myMixedValue = op(du(3850.00), '-', px(60))
 * ``` 
 */
export interface ExprScaleBound {
    /** The left-hand operand in the expression. */
    readonly a: ScaleBound;
    /** The right-hand operand in the expression. */
    readonly b: ScaleBound;
    /** the operator to be used for calculations. */
    readonly op: Op;
}
