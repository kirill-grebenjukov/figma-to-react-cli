import { Linter } from 'eslint';

import getConfig from '../file-generator/get-config';

const plugin = ({ eslintrc }) => {
  const options = getConfig(eslintrc);
  const linter = options && new Linter();

  return ({ jsCode, exportPath, componentPath, componentNameKebab, ext }) => {
    if (!options) {
      return jsCode;
    }

    const { fixed, output, messages } = linter.verifyAndFix(jsCode, options);

    if (!fixed) {
      const fileName = [exportPath, componentPath, componentNameKebab, ext]
        .filter(t => !!t)
        .join('/');
      console.warn(
        `\n${fileName}:\n`,
        messages.map(({ message }) => `${message}`),
      );
    }

    return output;
  };
};

export default plugin;
