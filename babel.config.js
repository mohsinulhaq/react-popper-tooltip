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
  ]
];

const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-class-properties'
];

const env = {
  esm: {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          useBuiltIns: 'usage'
        }
      ]
    ]
  }
};

module.exports = { presets, plugins, env };
