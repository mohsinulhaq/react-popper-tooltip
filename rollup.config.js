import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = 'src/index.ts';
const external = (id) => !id.startsWith('.') && !id.startsWith('/');
const getBabelOptions = (useESModules = true) => ({
  extensions: ['.ts', '.tsx'],
  runtimeHelpers: true,
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      interop: false,
      sourcemap: true,
    },
    external,
    plugins: [
      resolve({ extensions: ['.ts', '.tsx'] }),
      babel(getBabelOptions(false)),
      sizeSnapshot(),
    ],
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve({ extensions: ['.ts', '.tsx'] }),
      babel(getBabelOptions()),
      sizeSnapshot(),
    ],
  },
];
