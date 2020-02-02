"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prettier = _interopRequireDefault(require("prettier"));

var _getConfig = _interopRequireDefault(require("../file-generator/get-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const plugin = ({
  prettierrc
}) => {
  const options = (0, _getConfig.default)(prettierrc);
  return ({
    jsCode
  }) => {
    if (options) {
      return _prettier.default.format(jsCode, options);
    }

    return jsCode;
  };
};

var _default = plugin;
exports.default = _default;