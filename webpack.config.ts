const webpack = require('webpack');

module.exports = (config, context) => {
  const resultConfig = {
    ...config,
  };

  const rules = resultConfig.module.rules;
  const tsLoaderRule = rules.find((item) => item.loader.includes('ts-loader'));
  if (!tsLoaderRule) {
    throw new Error(__filename + ': tsLoaderRule not found!');
  }
  if (tsLoaderRule.options.getCustomTransformers) {
    throw new Error(__filename + ': getCustomTransformers already set!');
  }
  /**
   * add the custom transformer
   * see: https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin
   */
  tsLoaderRule.options = {
    ...tsLoaderRule.options,
    getCustomTransformers: (program) => ({
      before: [require('@nestjs/swagger/plugin').before({}, program)],
    }),
  };

  /**
   * we must also  add a provider plugin
   * see: https://github.com/nrwl/nx/issues/2147#issuecomment-587165933
   */
  resultConfig.plugins = [
    ...(resultConfig.plugins || []),
    new webpack.ProvidePlugin({
      openapi: '@nestjs/swagger',
    }),
  ];

  return resultConfig;
};
