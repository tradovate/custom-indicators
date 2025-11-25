/** The implementation specifies a set of parameters that should be submitted by the user to the indicator. */
export interface ParameterDefinitions {
    /** Each field of the object represents one parameter.
    * ```
        ...
        params: {
            offset: {
                    type: "number",
                    def: 2.0,
                    restrictions: {
                        step: 0.25,
                        min: 0.0
                    }
            }
        }
        ...
    ```
    *
    * Instantiated indicator's {@linkcode Calculator} has access to user-specified values via `this.props` property using the same field names.
    *
    ```
    ...
        map(d) {
            return d.value() - this.props.offset;
        }
    ...
    ```
    *
    * Each parameter specification is an object that declares the type of parameter in `type` field, default value via `def` field, and an optional restriction for its values (depending on parameter type).
    */
    [parameterName: string]: NumberParameterDefinition | BooleanParameterDefinition | TextParameterDefinition | EnumParameterDefinition;
}

export interface NumberParameterDefinition {
    readonly type: 'number';
    readonly def: number;
    /** Optional restrictions */
    readonly restrictions: {
        readonly min?: number;
        readonly max?: number;
        readonly step?: number;
    }
}

export interface BooleanParameterDefinition {
    readonly type: 'boolean';
    readonly def: boolean;
}

export interface TextParameterDefinition {
    readonly type: 'text';
    readonly def: string;
}

export interface EnumParameterDefinition {
    readonly type: 'enum';
    /** A set of allowed values as an object `{ value1: "Description1", value2: "Description2", ... }`` */
    readonly enumSet: { [enumValue: string]: string };
    /** One of keys from `enumSet` */
    readonly def: string;
}
