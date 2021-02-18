import { DisplayObject } from "./DisplayObject";

export interface GraphicsResponse {
    readonly items?: readonly GraphicsObject[];
}
    
export type GraphicsObject = DisplayObject & { readonly origin?: AxesOrigin; readonly global?: boolean; };

export interface AxesOrigin {
    readonly cs: "frame" | "grid";
    readonly h: 'left' | 'right';
    readonly v: 'top' | 'bottom';
}
