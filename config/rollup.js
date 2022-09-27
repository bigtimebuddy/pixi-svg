import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from '../package.json';

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
const sourcemap = true;
const input = 'src/index.ts';
const peerExternal = Object.keys(pkg.peerDependencies);
const bundleExternal = Object.keys(pkg.dependencies).concat(peerExternal);
const plugins = [
    resolve(),
    commonjs(),
    esbuild({
        target: 'ES2017',
        minify: process.env.NODE_ENV === 'production',
    }),
];

export default [
    {
        input,
        external: bundleExternal,
        plugins,
        output: [
            {
                file: pkg.module,
                format: 'esm',
                sourcemap,
                banner,
            },
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap,
                banner,
            }
        ]
    },
    {
        input, 
        external: peerExternal,
        plugins,
        output: {
            file: pkg.bundle,
            format: 'iife',
            name,
            footer: `Object.assign(PIXI, ${name});`,
            sourcemap,
            banner,
            globals: {
                '@pixi/graphics': 'PIXI'
            }
        }
    }
];
