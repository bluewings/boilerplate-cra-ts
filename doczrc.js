const rules = require('./config/webpack.rules');

const modifyBundlerConfig = (config) => {
  config.resolve.extensions.push('.pug');
  config.module.rules = [...config.module.rules, ...rules()];
  return config;
};

export default {
  modifyBundlerConfig,
  typescript: true,
};
