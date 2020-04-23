import dPathParse from 'd-path-parser';

// <div> element to measure string colors like "black"
// and convert to hex colors
const measureColor = document.createElement('div');

/**
 * Scalable Graphics drawn from SVG image document.
 * @class SVG
 * @extends PIXI.Graphics
 * @memberof PIXI
 * @param {SVGSVGElement} svg - SVG Element `<svg>`
 */
export default class SVG extends PIXI.Graphics {
    /**
     * Constructor
     */
    constructor (svg) {
        super();
        this.fill(svg);
        this.svgChildren(svg.children);
    }

    /**
     * Create a PIXI Graphic from SVG element
     * @private
     * @method PIXI.SVG#svgChildren
     * @param {Array<*>} children - Collection of SVG nodes
     * @param {Boolean} [inherit=false] Whether to inherit fill settings.
     */
    svgChildren (children, inherit = false) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this.fill(child, inherit);
            switch (child.nodeName.toLowerCase()) {
                case 'path': {
                    this.svgPath(child);
                    break;
                }
                case 'circle':
                case 'ellipse': {
                    this.svgCircle(child);
                    break;
                }
                case 'rect': {
                    this.svgRect(child);
                    break;
                }
                case 'polygon': {
                    this.svgPoly(child, true);
                    break;
                }
                case 'polyline': {
                    this.svgPoly(child);
                    break;
                }
                case 'g': {
                    break;
                }
                default: {
                    // @if DEBUG
                    console.info('[SVGUtils] <%s> elements unsupported', child.nodeName);
                    // @endif
                    break;
                }
            }
            this.svgChildren(child.children, true);
        }
    }

    /**
     * Convert the Hexidecimal string (e.g., "#fff") to uint
     * @private
     * @method PIXI.SVG#hexToUint
     */
    hexToUint (hex) {
        if (hex[0] === '#') {
                        // Remove the hash
            hex = hex.substr(1);

                        // Convert shortcolors fc9 to ffcc99
            if (hex.length === 3) {
                hex = hex.replace(/([a-f0-9])/ig, '$1$1');
            }
            return parseInt(hex, 16);
        } else {
            measureColor.style.color = hex;
            const rgb = window.getComputedStyle(document.body.appendChild(measureColor)).color
                .match(/\d+/g)
                .map(function (a) {
                    return parseInt(a, 10);
                });
            document.body.removeChild(measureColor);
            return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
        }
    }

    /**
     * Render a <ellipse> element or <circle> element
     * @private
     * @method PIXI.SVG#internalEllipse
     * @param {SVGCircleElement} node
     */
    svgCircle (node) {

        let heightProp = 'r';
        let widthProp = 'r';
        const isEllipse = node.nodeName === 'elipse';
        if (isEllipse) {
            heightProp += 'x';
            widthProp += 'y';
        }
        const width = parseFloat(node.getAttribute(widthProp));
        const height = parseFloat(node.getAttribute(heightProp));
        const cx = node.getAttribute('cx');
        const cy = node.getAttribute('cy');
        let x = 0;
        let y = 0;
        if (cx !== null) {
            x = parseFloat(cx);
        }
        if (cy !== null) {
            y = parseFloat(cy);
        }
        if (!isEllipse) {
            this.drawCircle(x, y, width);
        }
        else {
            this.drawEllipse(x, y, width, height);
        }
    }

    /**
     * Render a <rect> element
     * @private
     * @method PIXI.SVG#svgRect
     * @param {SVGRectElement} node
     */
    svgRect (node) {
        const x = parseFloat(node.getAttribute('x'));
        const y = parseFloat(node.getAttribute('y'));
        const width = parseFloat(node.getAttribute('width'));
        const height = parseFloat(node.getAttribute('height'));
        const rx = parseFloat(node.getAttribute('rx'));
        if (rx) {
            this.drawRoundedRect(
                x,
                y,
                width,
                height,
                rx
            );
        } else {
            this.drawRect(
                x,
                y,
                width,
                height
            );
        }
    }

    /**
     * Get the style property and parse options.
     * @private
     * @method PIXI.SVG#svgStyle
     * @param {SVGElement} node
     * @return {Object} Style attributes
     */
    svgStyle (node) {
        const style = node.getAttribute('style');
        const result = {
            fill: node.getAttribute('fill'),
            opacity: node.getAttribute('opacity'),
            stroke: node.getAttribute('stroke'),
            strokeWidth: node.getAttribute('stroke-width')
        };
        if (style !== null) {
            style.split(';').forEach(prop => {
                const [name, value] = prop.split(':');
                result[name.trim()] = value.trim();
            });
            if (result['stroke-width']) {
                result.strokeWidth = result['stroke-width'];
                delete result['stroke-width'];
            }
        }
        return result;
    }

    /**
     * Render a polyline element.
     * @private
     * @method PIXI.SVG#svgPoly
     * @param {SVGPolylineElement} node
     */
    svgPoly (node, close) {

        const points = node.getAttribute('points')
            .split(/[ ,]/g)
            .map(p => parseInt(p));

        this.drawPolygon(points);

        if (close) {
            this.closePath();
        }
    }

    /**
     * Set the fill and stroke style.
     * @private
     * @method PIXI.SVG#fill
     * @param {SVGElement} node
     * @param {Boolean} inherit
     */
    fill (node, inherit) {

        const {fill, opacity, stroke, strokeWidth} = this.svgStyle(node);
        const defaultLineWidth = stroke !== null ? 1 : 0;
        const lineWidth = strokeWidth !== null ? parseFloat(strokeWidth) : defaultLineWidth;
        const lineColor = stroke !== null ? this.hexToUint(stroke) : this.lineColor;
        if (fill) {
            if (fill === 'none') {
                this.beginFill(0, 0);
            } else {
                this.beginFill(
                    this.hexToUint(fill),
                    opacity !== null ? parseFloat(opacity) : 1
                );
            }
        } else if (!inherit) {
            this.beginFill(0);
        }
        this.lineStyle(
            lineWidth,
            lineColor
        );

        // @if DEBUG
        if (node.getAttribute('stroke-linejoin')) {
            console.info('[SVGUtils] "stroke-linejoin" attribute is not supported');
        }
        if (node.getAttribute('stroke-linecap')) {
            console.info('[SVGUtils] "stroke-linecap" attribute is not supported');
        }
        if (node.getAttribute('fill-rule')) {
            console.info('[SVGUtils] "fill-rule" attribute is not supported');
        }
        // @endif
    }

    /**
     * Render a <path> d element
     * @method PIXI.SVG#svgPath
     * @param {SVGPathElement} node
     */
    svgPath (node) {
        const d = node.getAttribute('d');
        let x, y;
        const commands = dPathParse(d);
        for (var i = 0; i < commands.length; i++) {
            const command = commands[i];
            switch (command.code) {
                case 'm': {
                    this.moveTo(
                        x += command.end.x,
                        y += command.end.y
                    );
                    break;
                }
                case 'M': {
                    this.moveTo(
                        x = command.end.x,
                        y = command.end.y
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
                        y = command.end.y
                    );
                    break;
                }
                case 'l': {
                    this.lineTo(
                        x += command.end.x,
                        y += command.end.y
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
                        y = command.end.y
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
                        y += command.end.y
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
                        y += command.end.y
                    );
                    break;
                }
                case 'S':
                case 'Q': {
                    this.quadraticCurveTo(
                        command.cp.x,
                        command.cp.y,
                        x = command.end.x,
                        y = command.end.y
                    );
                    break;
                }
                default: {
                    // @if DEBUG
                    console.info('[SVGUtils] Draw command not supported:', command.code, command);
                    // @endif
                    break;
                }
            }
        }
    }
}
