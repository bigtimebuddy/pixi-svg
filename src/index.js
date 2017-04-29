import SVG from './SVG';

// Check that PIXI exists
if (typeof PIXI === 'undefined') {
    throw 'pixi.js not found';
}
// Don't define twice
else if (!PIXI.SVG) {
    // Assign to global pixi object
    Object.defineProperty(PIXI, 'SVG', {
        get() {
            return SVG;
        }
    });
}

export default SVG;
