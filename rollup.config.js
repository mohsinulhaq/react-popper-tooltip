import babel from 'rollup-plugin-babel';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = 'src/index.js';
const external = id => !id.startsWith('.') && !id.startsWith('/');
const getBabelOptions = (useESModules = true) => ({
  runtimeHelpers: true,
  plugins: [['@babel/plugin-transform-runtime', {useESModules}]]
});

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      interop: false
    },
    external,
    plugins: [babel(getBabelOptions(false)), sizeSnapshot()]
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm'
    },
    external,
    plugins: [babel(getBabelOptions()), sizeSnapshot()]
  }
];
