# DLLs object

Specifies a set of DLLs for importing.

Each field declares one DLL via an object with the next fields:

* `path` _String_: a path to the DLL. The app searches the DLL according to [DLL Search Order ](https://msdn.microsoft.com/en-us/library/windows/desktop/ms682586(v=vs.85).aspx)
* `functions` _Object_: each function declaration includes its name and a call signature. The signature is an array with two items. The first item is a name of the return type, the second item is an array type names of arguments. Currently supported type names are `int`, `double` and `string`.

After that, the instantiated calculator object gets an access to `this.dlls` property with 'materialized' dlls and regular Javascript functions.

## Example

See [Blackbox DLL](index.md#blackbox-dll) example
