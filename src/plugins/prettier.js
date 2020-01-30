import prettier from 'prettier';

import getConfig from '../file-generator/get-config';

const plugin = ({ prettierrc }) => {
  const options = getConfig(prettierrc);

  return ({ jsCode }) => {
    if (options) {
      return prettier.format(jsCode, options);
    }

    return jsCode;
  };
};

export default plugin;
