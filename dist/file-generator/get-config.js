"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;

var _fs = _interopRequireDefault(require("fs"));

var _vm = _interopRequireDefault(require("vm"));

var _module = _interopRequireDefault(require("module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(configPath) {
  const content = configPath ? _fs.default.readFileSync(configPath, {
    encoding: 'utf8'
  }) : null;
  let options = null;

  if (content) {
    if (configPath.endsWith('.js')) {
      _vm.default.runInThisContext(_module.default.wrap(content))(exports, require, module, __filename, __dirname);

      options = module.exports;
    } else {
      options = JSON.parse(content);
    }
  }

  return options;
}