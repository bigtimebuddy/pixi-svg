/// <reference types="pixi.js" />

declare namespace PIXI {
    export class SVG extends PIXI.Graphics {
        constructor(svg:SVGSVGElement|SVGElement|string);
    }
}

declare module "pixi-svg" {
    export import SVG = PIXI.SVG;
}
