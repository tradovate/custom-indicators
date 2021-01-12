/** Specifies available fields and functions of input elements in {@linkcode Calculator.map} and {@linkcode Calculator.filter} */
export interface InputEntity {
    /** Timestamp */
    timestamp(): Date;

    /** Input data value or Close price of the bar if `inputType === "bars"` */
    value(): number;
}

/** Specifies available fields and functions of input elements in {@linkcode Calculator.map} and {@linkcode Calculator.filter} if `inputType === "bars"` */
export interface BarInputEntity extends InputEntity {
    /** High price of bar */
    high(): number;

    /** Low price of bar */
    low(): number;

    /** Open price of bar */
    open(): number;

    /** Close price of bar */
    close(): number;

    /** Total trade volume of bar */
    volume(): number;

    /** Trade volume executed at offer price */
    offerVolume(): number;

    /** Trade volume executed at bid price */
    bidVolume(): number;

    /** Volume profile of the bar. Available if the chart was requested with `withHistogram: true` */
    profile(): readonly VolumeProfileLevel[] | undefined; 
}

export interface VolumeProfileLevel {
    /** Level's price */
    readonly price: number;

    /** Total volume at the `price` */
    readonly vol: number;

    /** Bid volume at the `price` */
    readonly bidVol: number;

    /** Ask volume at the `price` */
    readonly askVol: number;
}

export interface TimeSeries {
    readonly data: readonly InputEntity[];

    get(index: number): InputEntity;

    size(): number;

    first(): InputEntity;

    last(): InputEntity;

    prior(): InputEntity;

    back(n: number): InputEntity;
}