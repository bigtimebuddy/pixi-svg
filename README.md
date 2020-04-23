# pixi-svg

SVG to Graphics DisplayObject for pixi.js.

[![Node.js CI](https://github.com/bigtimebuddy/pixi-svg/workflows/Node.js%20CI/badge.svg)](https://github.com/bigtimebuddy/pixi-svg/actions?query=workflow%3A%22Node.js+CI%22)

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
  - `stroke-linejoin`
  - `stroke-linecap`

## Unsupported Features

- Basically, anything not listed above
- Interactivity
- Any `transform` attributes
- `<style>` elements are ignored
- `<path>` elements which use arcs to draw (`a` or `A` drawing command)
- `<text>` elements are ignored
- Gradients or images
- The following attributes are also ignored:
  - `fill-rule`

## License

MIT License.
