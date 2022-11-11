import { Graphics } from '@pixi/graphics';
import dPathParser from 'd-path-parser';
import color from 'tinycolor2';
import arcToBezier from 'svg-arc-to-cubic-bezier';

interface SVGStyle
{
    fill: string | null;
    opacity: string | null;
    stroke: string | null;
    strokeWidth: string | null;
    strokeOpacity: string | null;
    cap: string | null;
    join: string | null;
    miterLimit: string | null;
}

/**
 * Scalable Graphics drawn from SVG image document.
 * @class SVG
 * @extends PIXI.Graphics
 */
class SVG extends Graphics
{
    /** Fallback line color */
    private lineColor: string | null = null;

    /**
     * @param svg - Inline SVGElement `<svg>` or buffer.
     */
    constructor(svg?: SVGSVGElement | SVGElement | string)
    {
        super();

        if (svg)
        {
            this.drawSVG(svg);
        }
    }

    /**
     * Draw an SVG element.
     * @param svg - Inline SVGElement `<svg>` or buffer.
     * @return Element suitable for chaining.
     */
    drawSVG(svg: SVGSVGElement | SVGElement | string): this
    {
        if (typeof svg === 'string')
        {
            const div = document.createElement('div');

            div.innerHTML = svg.trim();
            svg = div.querySelector('svg') as SVGElement;
        }

        if (!svg)
        {
            throw new Error('Missing <svg> element in SVG constructor');
        }

        this._svgFill(svg);
        this._svgChildren(svg.children);

        return this;
    }

    /**
     * Create a PIXI Graphic from SVG element
     * @param children - Collection of SVG nodes
     * @param inherit - Whether to inherit fill settings.
     */
    private _svgChildren(children: HTMLCollection, inherit = false): void
    {
        for (let i = 0; i < children.length; i++)
        {
            const child = children[i] as unknown as SVGElement;

            this._svgFill(child, inherit);
            switch (child.nodeName.toLowerCase())
            {
                case 'path': {
                    this._svgPath(child as SVGPathElement);
                    break;
                }
                case 'circle':
                case 'ellipse': {
                    this._svgCircle(child as SVGCircleElement);
                    break;
                }
                case 'rect': {
                    this._svgRect(child as SVGRectElement);
                    break;
                }
                case 'polygon': {
                    this._svgPoly(child as SVGPolygonElement, true);
                    break;
                }
                case 'polyline': {
                    this._svgPoly(child as SVGPolylineElement);
                    break;
                }
                case 'g': {
                    break;
                }
                default: {
                    // eslint-disable-next-line no-console
                    console.info(`[PIXI.SVG] <${child.nodeName}> elements unsupported`);
                    break;
                }
            }
            this._svgChildren(child.children, true);
        }
    }

    /** Convert the Hexidecimal string (e.g., "#fff") to uint */
    private _hexToUint(hex: string): number
    {
        if (hex[0] === '#')
        {
            // Remove the hash
            hex = hex.substr(1);

            // Convert shortcolors fc9 to ffcc99
            if (hex.length === 3)
            {
                hex = hex.replace(/([a-f0-9])/ig, '$1$1');
            }

            return parseInt(hex, 16);
        }

        const { r, g, b } = color(hex).toRgb();

        return (r << 16) + (g << 8) + b;
    }

    /**
     * Render a <ellipse> element or <circle> element
     * @param node - Circle element
     */
    private _svgCircle(node: SVGCircleElement): void
    {
        let heightProp = 'r';
        let widthProp = 'r';
        const isEllipse = node.nodeName === 'elipse';

        if (isEllipse)
        {
            heightProp += 'x';
            widthProp += 'y';
        }
        const width = parseFloat(node.getAttribute(widthProp) as string);
        const height = parseFloat(node.getAttribute(heightProp) as string);
        const cx = node.getAttribute('cx');
        const cy = node.getAttribute('cy');
        let x = 0;
        let y = 0;

        if (cx !== null)
        {
            x = parseFloat(cx);
        }
        if (cy !== null)
        {
            y = parseFloat(cy);
        }
        if (!isEllipse)
        {
            this.drawCircle(x, y, width);
        }
        else
        {
            this.drawEllipse(x, y, width, height);
        }
    }

    /**
     * Render a <rect> element
     * @param node - Rectangle element
     */
    private _svgRect(node: SVGRectElement): void
    {
        const x = parseFloat(node.getAttribute('x') as string);
        const y = parseFloat(node.getAttribute('y') as string);
        const width = parseFloat(node.getAttribute('width') as string);
        const height = parseFloat(node.getAttribute('height') as string);
        const rx = parseFloat(node.getAttribute('rx') as string);

        if (rx)
        {
            this.drawRoundedRect(x, y, width, height, rx);
        }
        else
        {
            this.drawRect(x, y, width, height);
        }
    }

    /**
     * Convert the SVG style name into usable name.
     * @param name - Name of style
     * @return Name used to reference style
     */
    private _convertStyleName(name: string): string
    {
        return name
            .trim()
            .replace('-width', 'Width')
            .replace(/.*-(line)?/, '');
    }

    /**
     * Get the style property and parse options.
     * @param node - Element with style
     * @return Style attributes
     */
    private _svgStyle(node: SVGElement): SVGStyle
    {
        const style = node.getAttribute('style');
        const baseOpacity = node.getAttribute('opacity');
        const result: SVGStyle = {
            fill: node.getAttribute('fill'),
            opacity: baseOpacity || node.getAttribute('fill-opacity'),
            stroke: node.getAttribute('stroke'),
            strokeOpacity: baseOpacity || node.getAttribute('stroke-opacity'),
            strokeWidth: node.getAttribute('stroke-width'),
            cap: node.getAttribute('stroke-linecap'),
            join: node.getAttribute('stroke-linejoin'),
            miterLimit: node.getAttribute('stroke-miterlimit'),
        };

        if (style !== null)
        {
            style.split(';').forEach((prop) =>
            {
                const [name, value] = prop.split(':');

                if (name)
                {
                    const convertedName = this._convertStyleName(name) as keyof typeof result;

                    if (!result[convertedName])
                    {
                        result[convertedName] = value.trim();
                    }
                }
            });
        }

        return result;
    }

    /**
     * Render a polyline element.
     * @param node - Polyline element
     * @param close - Close the path
     */
    private _svgPoly(node: SVGPolylineElement, close?: boolean)
    {
        const points = (node.getAttribute('points') as string)
            .split(/[ ,]/g)
            .map((p) => parseInt(p, 10));

        this.drawPolygon(points);

        if (close)
        {
            this.closePath();
        }
    }

    /**
     * Set the fill and stroke style.
     * @param node - SVG element
     * @param inherit - Inherit the fill style
     */
    private _svgFill(node: SVGElement, inherit?: boolean)
    {
        const { fill, opacity, stroke, strokeOpacity, strokeWidth, cap, join, miterLimit } = this._svgStyle(node);
        const defaultLineWidth = stroke !== null ? 1 : 0;
        const lineWidth = strokeWidth !== null ? parseFloat(strokeWidth) : defaultLineWidth;
        const lineColor = stroke !== null ? this._hexToUint(stroke) : this.lineColor;

        if (fill)
        {
            if (fill === 'none')
            {
                this.beginFill(0, 0);
            }
            else
            {
                this.beginFill(
                    this._hexToUint(fill),
                    opacity !== null ? parseFloat(opacity) : 1,
                );
            }
        }
        else if (!inherit)
        {
            this.beginFill(0);
        }

        this.lineStyle({
            width: stroke === null && strokeWidth === null && inherit ? this.line.width : lineWidth,
            alpha: strokeOpacity === null ? this.line.alpha : parseFloat(strokeOpacity),
            color: stroke === null && inherit ? this.line.color : lineColor,
            cap: cap === null && inherit ? this.line.cap : cap,
            join: join === null && inherit ? this.line.join : join,
            miterLimit: miterLimit === null && inherit ? this.line.miterLimit : parseFloat(miterLimit as string),
        } as any);

        if (node.getAttribute('fill-rule'))
        {
            // eslint-disable-next-line no-console
            console.info('[PIXI.SVG] "fill-rule" attribute is not supported');
        }
    }

    /**
     * Render a <path> d element
     * @param node - Path element.
     */
    private _svgPath(node: SVGPathElement)
    {
        const d = node.getAttribute('d') as string;
        let x = 0;
        let y = 0;
        const commands = dPathParser(d.trim());

        for (let i = 0; i < commands.length; i++)
        {
            const command = commands[i];

            switch (command.code)
            {
                case 'm': {
                    this.moveTo(
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'M': {
                    this.moveTo(
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'H': {
                    this.lineTo(x = command.value, y);
                    break;
                }
                case 'h': {
                    this.lineTo(x += command.value, y);
                    break;
                }
                case 'V': {
                    this.lineTo(x, y = command.value);
                    break;
                }
                case 'v': {
                    this.lineTo(x, y += command.value);
                    break;
                }
                case 'Z': {
                    this.closePath();
                    break;
                }
                case 'L': {
                    this.lineTo(
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'l': {
                    this.lineTo(
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'C': {
                    this.bezierCurveTo(
                        command.cp1.x,
                        command.cp1.y,
                        command.cp2.x,
                        command.cp2.y,
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'c': {
                    const currX = x;
                    const currY = y;

                    this.bezierCurveTo(
                        currX + command.cp1.x,
                        currY + command.cp1.y,
                        currX + command.cp2.x,
                        currY + command.cp2.y,
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 's':
                case 'q': {
                    const currX = x;
                    const currY = y;

                    this.quadraticCurveTo(
                        currX + command.cp.x,
                        currY + command.cp.y,
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'S':
                case 'Q': {
                    this.quadraticCurveTo(
                        command.cp.x,
                        command.cp.y,
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                // The arc and arcTo commands are incompatible
                // with SVG (mostly because elliptical arcs)
                // so we normalize arcs from SVG into bezier curves
                case 'a': {
                    arcToBezier({
                        px: x,
                        py: y,
                        cx: x += command.end.x,
                        cy: y += command.end.y,
                        rx: command.radii.x,
                        ry: command.radii.y,
                        xAxisRotation: command.rotation,
                        largeArcFlag: command.large ? 1 : 0,
                        sweepFlag: command.clockwise ? 1 : 0,
                    }).forEach(({ x1, y1, x2, y2, x, y }) =>
                        this.bezierCurveTo(x1, y1, x2, y2, x, y));
                    break;
                }
                case 'A': {
                    arcToBezier({
                        px: x,
                        py: y,
                        cx: x = command.end.x,
                        cy: y = command.end.y,
                        rx: command.radii.x,
                        ry: command.radii.y,
                        xAxisRotation: command.rotation,
                        largeArcFlag: command.large ? 1 : 0,
                        sweepFlag: command.clockwise ? 1 : 0,
                    }).forEach(({ x1, y1, x2, y2, x, y }) =>
                        this.bezierCurveTo(x1, y1, x2, y2, x, y));
                    break;
                }
                default: {
                    // eslint-disable-next-line no-console
                    console.info('[PIXI.SVG] Draw command not supported:', command.code, command);
                    break;
                }
            }
        }
    }
}

export { SVG };
