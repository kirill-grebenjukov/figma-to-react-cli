import defaultConfig from './default-config';
import * as utils from './utils';
import eslint from './plugins/eslint';
import prettier from './plugins/prettier';
import androwShadow from './plugins/androw-shadow';

module.exports = {
  defaultConfig,
  utils,
  beautify: {
    eslint,
    prettier,
  },
  plugins: {
    androwShadow,
  },
};
