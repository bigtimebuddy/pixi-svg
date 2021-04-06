import { Graphics } from '@pixi/graphics';
import dPathParser from 'd-path-parser';
import color from 'tinycolor2';

/**
 * Scalable Graphics drawn from SVG image document.
 * @class SVG
 * @extends PIXI.Graphics
 * @memberof PIXI
 * @param {SVGSVGElement|SVGElement|string} [svg] - Inline SVGElement `<svg>` or buffer.
 */
class SVG extends Graphics
{
    constructor(svg)
    {
        super();

        if (svg)
        {
            this.drawSVG(svg);
        }
    }

    /**
     * Draw an SVG element.
     * @method PIXI.SVG#drawSVG
     * @param {SVGSVGElement|SVGElement|string} svg - Inline SVGElement `<svg>` or buffer.
     * @return {PIXI.SVG} Element suitable for chaining.
     */
    drawSVG(svg)
    {
        if (typeof svg === 'string')
        {
            const div = document.createElement('div');

            div.innerHTML = svg.trim();
            svg = div.querySelector('svg');
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
     * @private
     * @method
     * @param {Array<*>} children - Collection of SVG nodes
     * @param {Boolean} [inherit=false] Whether to inherit fill settings.
     */
    _svgChildren(children, inherit = false)
    {
        for (let i = 0; i < children.length; i++)
        {
            const child = children[i];

            this._svgFill(child, inherit);
            switch (child.nodeName.toLowerCase())
            {
                case 'path': {
                    this._svgPath(child);
                    break;
                }
                case 'circle':
                case 'ellipse': {
                    this._svgCircle(child);
                    break;
                }
                case 'rect': {
                    this._svgRect(child);
                    break;
                }
                case 'polygon': {
                    this._svgPoly(child, true);
                    break;
                }
                case 'polyline': {
                    this._svgPoly(child);
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

    /**
     * Convert the Hexidecimal string (e.g., "#fff") to uint
     * @private
     * @method
     */
    _hexToUint(hex)
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
     * @private
     * @method
     * @param {SVGCircleElement} node
     */
    _svgCircle(node)
    {
        let heightProp = 'r';
        let widthProp = 'r';
        const isEllipse = node.nodeName === 'elipse';

        if (isEllipse)
        {
            heightProp += 'x';
            widthProp += 'y';
        }
        const width = parseFloat(node.getAttribute(widthProp));
        const height = parseFloat(node.getAttribute(heightProp));
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
     * @private
     * @method
     * @param {SVGRectElement} node
     */
    _svgRect(node)
    {
        const x = parseFloat(node.getAttribute('x'));
        const y = parseFloat(node.getAttribute('y'));
        const width = parseFloat(node.getAttribute('width'));
        const height = parseFloat(node.getAttribute('height'));
        const rx = parseFloat(node.getAttribute('rx'));

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
     * Get the style property and parse options.
     * @private
     * @method
     * @param {SVGElement} node
     * @return {Object} Style attributes
     */
    _svgStyle(node)
    {
        const style = node.getAttribute('style');
        const result = {
            fill: node.getAttribute('fill'),
            opacity: node.getAttribute('opacity'),
            stroke: node.getAttribute('stroke'),
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
                    result[name.trim()] = value.trim();
                }
            });
            if (result['stroke-width'])
            {
                result.strokeWidth = result['stroke-width'];
                delete result['stroke-width'];
            }
        }

        return result;
    }

    /**
     * Render a polyline element.
     * @private
     * @method
     * @param {SVGPolylineElement} node
     */
    _svgPoly(node, close)
    {
        const points = node.getAttribute('points')
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
     * @private
     * @method
     * @param {SVGElement} node
     * @param {Boolean} inherit
     */
    _svgFill(node, inherit)
    {
        const { fill, opacity, stroke, strokeWidth, cap, join, miterLimit } = this._svgStyle(node);
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
            color: stroke === null && inherit ? this.line.color : lineColor,
            cap: cap === null && inherit ? this.line.cap : cap,
            join: join === null && inherit ? this.line.join : join,
            miterLimit: miterLimit === null && inherit ? this.line.miterLimit : parseFloat(miterLimit),
        });

        if (node.getAttribute('fill-rule'))
        {
            // eslint-disable-next-line no-console
            console.info('[PIXI.SVG] "fill-rule" attribute is not supported');
        }
    }

    /**
     * Render a <path> d element
     * @method
     * @param {SVGPathElement} node
     */
    _svgPath(node)
    {
        const d = node.getAttribute('d');
        let x;
        let y;
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
                case "a": {
                    const RAD = (Math.PI / 180);
                    this.arc(
                        (x += command.end.x),
                        (y += command.end.y),
                        command.rotation * RAD, 
                        command.radii.x * RAD,
                        command.radii.y * RAD,
                        command.clockwise,
                    );
                    break;
                }
                case "A": {
                    const RAD = (Math.PI / 180);
                    this.arc(
                        (x = command.end.x),
                        (y = command.end.y),
                        command.rotation * RAD, 
                        command.radii.x * RAD,
                        command.radii.y * RAD,
                        command.clockwise
                    );
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
