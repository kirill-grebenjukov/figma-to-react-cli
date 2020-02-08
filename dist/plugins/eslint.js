"use strict";

var _eslint = require("eslint");

var _getConfig = _interopRequireDefault(require("../file-generator/get-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const plugin = ({
  eslintrc
}) => {
  const options = (0, _getConfig.default)(eslintrc);
  const linter = options && new _eslint.Linter();
  return ({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext
  }) => {
    if (!options) {
      return jsCode;
    }

    const {
      fixed,
      output,
      messages
    } = linter.verifyAndFix(jsCode, options);

    if (!fixed) {
      const fileName = [exportPath, componentPath, componentNameKebab, ext].filter(t => !!t).join('/');
      console.warn(`\n${fileName}:\n`, messages.map(({
        message
      }) => `${message}`));
    }

    return output;
  };
};

module.exports = plugin;