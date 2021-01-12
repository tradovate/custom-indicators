/** 
 * The implementation specifies a set of plots that will be displayed in Data Box of the chart and can be plotted by {@linkcode Indicator.plotters}. If plotters are not specified, all plots are plotted as lines.
*/
export interface Plots {
    /**
     * Field names of the object refers to a value of output object returned from {@linkcode Calculator.map}

    ```javascript
        ...
        plots: {
            fast: { title: "FastEMA" },
            slow: { title: "SlowEMA" }
        }
        ...
    ```
     */
    readonly [fieldName: string]: {
        /** How to show it in Data Box and Indicator Editor's style section. */
        readonly title: string;

        /** Specifies if the plot should be displayed only on the chart, but do not show it in Data Box. */
        readonly displayOnly?: boolean
    }
}