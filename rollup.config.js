import { terser } from 'rollup-plugin-terser';
import bubel from 'rollup-plugin-buble';
import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production'
const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
const banner = [
    `/*!`,
    ` * ${pkg.name} - v${pkg.version}`,
    ` * Compiled ${compiled}`,
    ` *`,
    ` * ${pkg.name} is licensed under the MIT License.`,
    ` * http://www.opensource.org/licenses/mit-license`,
    ` */`,
].join('\n');

const name = '_pixi_svg';

export default {
    input: 'src/index.js',
    external: Object.keys(pkg.peerDependencies),
    plugins: [
        bubel(),
        ...prod ? [terser({
            output: {
                comments: (node, comment) => comment.line === 1
            }
        })] : []
    ],
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            banner,
        },
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            banner,
        },
        {
            file: pkg.browser,
            format: 'iife',
            name,
            footer: `Object.assign(PIXI, ${name});`,
            sourcemap: true,
            banner,
            globals: {
                '@pixi/graphics': 'PIXI'
            }
        }
    ]
}
