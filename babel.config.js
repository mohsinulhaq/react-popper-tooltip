module.exports = {
  presets: [['@babel/env', {loose: true}], '@babel/react'],
  plugins: [
    ['@babel/proposal-class-properties', {loose: true}],
    ['transform-react-remove-prop-types', {removeImport: true}]
  ]
};
