import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = 'src/index.js';
const name = 'TooltipTrigger';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-popper': 'ReactPopper'
};
const external = id => !id.startsWith('.') && !id.startsWith('/');
const getBabelOptions = ({useESModules = true} = {}) => ({
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  plugins: [['@babel/plugin-transform-runtime', {useESModules}]]
});

export default [
  {
    input,
    output: {
      name,
      file: 'dist/index.js',
      format: 'iife',
      globals,
      interop: false
    },
    external: Object.keys(globals),
    plugins: [resolve(), babel(getBabelOptions()), terser(), sizeSnapshot()]
  },
  {
    input,
    output: {
      file: pkg.browser,
      format: 'cjs',
      interop: false
    },
    external,
    plugins: [babel(getBabelOptions({useESModules: false})), sizeSnapshot()]
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      interop: false
    },
    external,
    plugins: [babel(getBabelOptions()), sizeSnapshot()]
  }
];
