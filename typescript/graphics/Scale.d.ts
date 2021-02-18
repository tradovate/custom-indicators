export type ScaleUnit = 'du' | 'px' | 'gl';

export type ScaleBound = ScaleBoundValue | ExprScaleBound;

export interface ScaleBoundValue {
    readonly value: number;
    readonly unit: ScaleUnit;
}

type Op = '+' | '-' | '*' | '/' | 'max' | 'min';

export interface ExprScaleBound {
    readonly a: ScaleBound;
    readonly b: ScaleBound;
    readonly op: Op;
}
