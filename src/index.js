import dPathParse from 'd-path-parser';

/**
 * Render SVG as Graphics
 * @class SVGUtils
 * @memberof PIXI
 */
export default class SVGUtils {
    /**
     * Create a PIXI Graphic from SVG element
     * @static
     * @method PIXI.SVGUtils.from
     * @param {SVGSVGElement} svg - SVG Element
     * @param {Number} [resolution=1] - Default resolution
     * @param {PIXI.Graphics} [graphic=null] - Graphic to use, or else create a new one.
     */
    static from (svg, resolution = 1, graphic = null) {
        if (!graphic) {
            graphic = new PIXI.Graphics();
        }
        this.fill(graphic, svg, resolution);
        this.parseChildren(graphic, svg.children, resolution);
        return graphic;
    }

    /**
     * Create a PIXI Graphic from SVG element
     * @static
     * @private
     * @method PIXI.SVGUtils.parseChildren
     * @param {Array<*>} children - Collection of SVG nodes
     * @param {Number} resolution - Default resolution
     * @param {PIXI.Graphics} graphic - Graphic to use, or else create a new one.
     */
    static parseChildren (graphic, children, resolution, inherit = false) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this.fill(graphic, child, resolution, inherit);
            switch (child.nodeName.toLowerCase()) {
                case 'path': {
                    this.drawPath(graphic, child, resolution);
                    break;
                }
                case 'circle': {
                    this.drawCircle(graphic, child, resolution);
                    break;
                }
                case 'ellipse': {
                    this.drawEllipse(graphic, child, resolution);
                    break;
                }
                case 'rect': {
                    this.drawRect(graphic, child, resolution);
                    break;
                }
                case 'polyline': {
                    this.drawPolygon(graphic, child, resolution);
                    break;
                }
                case 'g': {
                    break;
                }
                default: {
                    console.info('[SVGUtils] <%s> elements unsupported', child.nodeName);
                    break;
                }
            }
            this.parseChildren(graphic, child.children, resolution, true);
        }
    }

    /**
     * Convert the Hexidecimal string (e.g., "#fff") to uint
     * @static
     * @private
     * @method PIXI.SVGUtils.hexToUint
     */
    static hexToUint (hex) {
        if (hex[0] === '#') {
                        // Remove the hash
            hex = hex.substr(1);

                        // Convert shortcolors fc9 to ffcc99
            if (hex.length === 3) {
                hex = hex.replace(/([a-f0-9])/ig, '$1$1');
            }
            return parseInt(hex, 16);
        } else {
            const div = document.createElement('div');
            div.style.color = hex;
            const rgb = window.getComputedStyle(document.body.appendChild(div)).color
                .match(/\d+/g)
                .map(function (a) {
                    return parseInt(a, 10);
                });
            document.body.removeChild(div);
            return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
        }
    }

    /**
     * Render a <circle> element
     * @static
     * @private
     * @method PIXI.SVGUtils.drawCircle
     * @param {PIXI.Graphics} graphic
     * @param {SVGCircleElement} circleNode
     * @param {Number} resolution
     */
    static drawCircle (graphic, circleNode, resolution) {
        this.internalEllipse(graphic, circleNode, 'r', 'r', resolution);
    }

    /**
     * Render a <ellipse> element
     * @static
     * @private
     * @method PIXI.SVGUtils.drawEllipse
     * @param {PIXI.Graphics} graphic
     * @param {SVGCircleElement} ellipseNode
     * @param {Number} resolution
     */
    static drawEllipse (graphic, ellipseNode, resolution) {
        this.internalEllipse(graphic, ellipseNode, 'rx', 'ry', resolution);
    }

    /**
     * Render a <ellipse> element or <circle> element
     * @static
     * @private
     * @method PIXI.SVGUtils.internalEllipse
     * @param {PIXI.Graphics} graphic
     * @param {SVGCircleElement} node
     * @param {Number} wName Width name property
     * @param {Number} hName Height name property
     * @param {Number} resolution
     */
    static internalEllipse (graphic, node, wName, hName, resolution) {
        const width = parseFloat(node.getAttribute(wName)) * resolution;
        const height = parseFloat(node.getAttribute(hName)) * resolution;
        const cx = node.getAttribute('cx');
        const cy = node.getAttribute('cy');
        let x = 0;
        let y = 0;
        if (cx !== null) {
            x = parseFloat(cx) * resolution;
        }
        if (cy !== null) {
            y = parseFloat(cy) * resolution;
        }
        graphic.drawEllipse(x, y, width, height);
    }

    /**
     * Render a <rect> element
     * @static
     * @private
     * @method PIXI.SVGUtils.drawRect
     * @param {PIXI.Graphics} graphic
     * @param {SVGRectElement} rectNode
     * @param {Number} resolution
     */
    static drawRect (graphic, rectNode, resolution) {
        const x = parseFloat(rectNode.getAttribute('x'));
        const y = parseFloat(rectNode.getAttribute('y'));
        const width = parseFloat(rectNode.getAttribute('width'));
        const height = parseFloat(rectNode.getAttribute('height'));
        const rx = parseFloat(rectNode.getAttribute('rx'));
        if (rx) {
            graphic.drawRoundedRect(
                x * resolution,
                y * resolution,
                width * resolution,
                height * resolution,
                rx * resolution
            );
        } else {
            graphic.drawRect(
                x * resolution,
                y * resolution,
                width * resolution,
                height * resolution
            );
        }
    }

    /**
     * Set the fill and stroke style.
     * @static
     * @private
     * @method PIXI.SVGUtils.fill
     * @param {PIXI.Graphics} graphic
     * @param {SVGElement} node
     * @param {Number} resolution
     * @param {Boolean} inherit
     */
    static fill (graphic, node, resolution, inherit) {
        const fill = node.getAttribute('fill');
        const opacity = node.getAttribute('opacity');
        const stroke = node.getAttribute('stroke');
        const strokeWidth = node.getAttribute('stroke-width');
        const lineWidth = strokeWidth !== null ? parseFloat(strokeWidth) : 0;
        const lineColor = stroke !== null ? this.hexToUint(stroke) : graphic.lineColor;
        if (fill) {
            if (fill === 'none') {
                graphic.beginFill(0, 0);
            } else {
                graphic.beginFill(
                    this.hexToUint(fill),
                    opacity !== null ? parseFloat(opacity) : 1
                );
            }
        } else if (!inherit) {
            graphic.beginFill(0);
        }
        graphic.lineStyle(
            lineWidth * resolution,
            lineColor
        );

        if (node.getAttribute('stroke-linejoin')) {
            console.info('[SVGUtils] "stroke-linejoin" attribute is not supported');
        }
        if (node.getAttribute('stroke-linecap')) {
            console.info('[SVGUtils] "stroke-linecap" attribute is not supported');
        }
        if (node.getAttribute('fill-rule')) {
            console.info('[SVGUtils] "fill-rule" attribute is not supported');
        }
    }

    /**
     * Render a <path> d element
     * @static
     * @method PIXI.SVGUtils.drawPath
     * @param {PIXI.Graphics} graphic
     * @param {SVGPathElement} pathNode
     * @param {Number} resolution
     */
    static drawPath (graphic, pathNode, resolution) {
        const d = pathNode.getAttribute('d');
        let x, y;
        const commands = dPathParse(d);
        for (var i = 0; i < commands.length; i++) {
            const command = commands[i];
            switch (command.code) {
                case 'm': {
                    graphic.moveTo(
                        x += command.end.x * resolution,
                        y += command.end.y * resolution
                    );
                    break;
                }
                case 'M': {
                    graphic.moveTo(
                        x = command.end.x * resolution,
                        y = command.end.y * resolution
                    );
                    break;
                }
                case 'H': {
                    graphic.lineTo(x = command.value * resolution, y);
                    break;
                }
                case 'h': {
                    graphic.lineTo(x += command.value * resolution, y);
                    break;
                }
                case 'V': {
                    graphic.lineTo(x, y = command.value * resolution);
                    break;
                }
                case 'v': {
                    graphic.lineTo(x, y += command.value * resolution);
                    break;
                }
                case 'Z': {
                    graphic.closePath();
                    break;
                }
                case 'L': {
                    graphic.lineTo(
                        x = command.end.x * resolution,
                        y = command.end.y * resolution
                    );
                    break;
                }
                case 'l': {
                    graphic.lineTo(
                        x += command.end.x * resolution,
                        y += command.end.y * resolution
                    );
                    break;
                }
                case 'C': {
                    const currX = x;
                    const currY = y;
                    graphic.bezierCurveTo(
                        currX + command.cp1.x * resolution,
                        currY + command.cp1.y * resolution,
                        currX + command.cp2.x * resolution,
                        currY + command.cp2.y * resolution,
                        x = command.end.x * resolution,
                        y = command.end.y * resolution
                    );
                    break;
                }
                case 'c': {
                    const currX = x;
                    const currY = y;
                    graphic.bezierCurveTo(
                        currX + command.cp1.x * resolution,
                        currY + command.cp1.y * resolution,
                        currX + command.cp2.x * resolution,
                        currY + command.cp2.y * resolution,
                        x += command.end.x * resolution,
                        y += command.end.y * resolution
                    );
                    break;
                }
                case 's':
                case 'q': {
                    const currX = x;
                    const currY = y;
                    graphic.quadraticCurveTo(
                        currX + command.cp.x * resolution,
                        currY + command.cp.y * resolution,
                        x += command.end.x * resolution,
                        y += command.end.y * resolution
                    );
                    break;
                }
                case 'S':
                case 'Q': {
                    const currX = x;
                    const currY = y;
                    graphic.quadraticCurveTo(
                        currX + command.cp.x * resolution,
                        currY + command.cp.y * resolution,
                        x = command.end.x * resolution,
                        y = command.end.y * resolution
                    );
                    break;
                }
                default: {
                    console.info('[SVGUtils] Draw command not supported:', command.code, command);
                    break;
                }
            }
        }
    }
}

// Assign to global pixi object
PIXI.SVGUtils = SVGUtils;
