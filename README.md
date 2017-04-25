# pixi-svg

SVG to Graphics DisplayObject for PIXI.

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

## License

MIT License.