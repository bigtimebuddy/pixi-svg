# pixi-svg

SVG to Graphics DisplayObject for pixi.js.

[![Build Status](https://travis-ci.org/bigtimebuddy/pixi-svg.svg?branch=master)](https://travis-ci.org/bigtimebuddy/pixi-svg)

## Examples

See SVG and pixi.js side-by-side comparisons:
https://bigtimebuddy.github.io/pixi-svg/example/

## Install

```bash
npm install pixi-svg --save
```

## Usage

For an inline SVG element:

```html
<svg id="svg1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="#F00" />
</svg>
```

Create a new `PIXI.SVG` object, provide the `<svg>` element.

```js
const svg = new PIXI.SVG(document.getElementById("svg1"));
const app = new PIXI.Application();
app.stage.addChild(svg);
```

## Supported Features

Only supports a subset of SVG's feature. Current this includes: 
- SVG Elements:
  - `<path>`
  - `<circle>`
  - `<rect>`
  - `<polygon>`
  - `<polyline>`
  - `<g>`
- `style` attributes with the following properties:
  - `stroke`
  - `stroke-width`
  - `fill`
  - `opacity`

## Unsupported Features

- Interactivity
- Any `transform` attributes
- `<style>` elements are ignored
- `<path>` elements which use arcs to draw (`a` or `A` drawing command)
- Gradients or images
- The following attributes are also ignored:
  - `stroke-linejoin`
  - `stroke-linecap`
  - `fill-rule`

## License

MIT License.
