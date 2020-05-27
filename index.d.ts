/// <reference types="pixi.js" />

declare namespace PIXI {
    export class SVG extends PIXI.Graphics {
        constructor(svg?:SVGSVGElement|SVGElement|string);
        drawSVG(svg:SVGSVGElement|SVGElement|string): this;
    }
}

declare module "pixi-svg" {
    export import SVG = PIXI.SVG;
}
