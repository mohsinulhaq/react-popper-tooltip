module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { bugfixes: true, loose: true }],
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};
