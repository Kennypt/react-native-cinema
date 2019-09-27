module.exports = api => {
  api.cache(false);

  const presets = [
    '@babel/preset-typescript',
    '@babel/preset-env'
    /*[
      '@babel/preset-env',
      {
        targets: {
          esmodules: false,
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],*/
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: 3,
        regenerator: true,
        useESModules: false,
      }
    ],
    /*'@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import'*/
  ];

  return {
    presets,
    plugins,
  };
};
