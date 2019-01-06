module.exports = {
  presets: ['@babel/typescript', '@babel/react', ['@babel/env', {loose: true}]],
  plugins: [['@babel/proposal-class-properties', {loose: true}]]
};
