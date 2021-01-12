/** Specifies a set of DLLs for importing and exposing to {@linkcode Calculator.dlls}. See [an example](../pages/Tutorial/BlackboxDLL.html) */
export interface DLLs {
    /** Each field declares one DLL */
    readonly [dllName: string]: {
        /** A path to the DLL. The application searches the DLL according to [DLL Search Order ](https://msdn.microsoft.com/en-us/library/windows/desktop/ms682586(v=vs.85).aspx) */
        readonly path: string;
        /** A set of functions that should be exposed to the calculator */
        readonly functions: {
            /** each function declaration includes its name and a call signature. The signature is a tuple with two items. The first item is a name of the return type, the second item is an array of type names of arguments. Currently supported type names are `int`, `double` and `string`. */
            readonly [functionName: string]: ['double' | 'int', readonly ('double' | 'int' | 'string')[]];
        }        
    }
}