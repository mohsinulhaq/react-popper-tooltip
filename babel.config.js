const presets = [
  [
    '@babel/env',
    {
      useBuiltIns: 'usage'
    }
  ],
  [
    '@babel/react',
    {
      useBuiltIns: true
    }
  ],
  'minify'
];

const plugins = ['@babel/plugin-proposal-class-properties'];

module.exports = { presets, plugins };
