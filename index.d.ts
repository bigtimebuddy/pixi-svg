/// <reference types="pixi.js" />

declare namespace PIXI {
    export class SVG extends PIXI.Graphics {
        constructor(svg:SVGSVGElement);
    }
}

declare module "pixi-svg" {
    export import SVG = PIXI.SVG;
}
