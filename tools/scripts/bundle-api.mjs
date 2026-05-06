import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';

const workspaceRoot = process.cwd();
const distDir = join(workspaceRoot, 'dist/packages/api');
const inputFile = join(distDir, 'src/index.js');
const packageJsonPath = join(distDir, 'package.json');

const bundle = await rollup({
    input: inputFile,
    external: () => false,
    plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()],
});

await bundle.write({
    file: join(distDir, 'index.esm.js'),
    format: 'esm',
    sourcemap: true,
});

await bundle.write({
    file: join(distDir, 'index.cjs.js'),
    format: 'cjs',
    sourcemap: true,
});

await bundle.close();

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

packageJson.main = './index.cjs.js';
packageJson.module = './index.esm.js';
packageJson.types = './src/index.d.ts';
packageJson.exports = {
    '.': {
        types: './src/index.d.ts',
        require: './index.cjs.js',
        import: './index.esm.js',
        default: './index.cjs.js',
    },
    './package.json': './package.json',
};
delete packageJson.type;

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
