// blackboxDll.cpp : Defines the exported functions for the DLL application.
//

extern "C" __declspec(dllexport) double __stdcall calculate(int barIndex, double openWeight, double highLowWeight, double open, double high, double low, double close) {
		return (open * openWeight + high * highLowWeight + low * highLowWeight + close) / (openWeight + 2 * highLowWeight + 1.0);
	};
