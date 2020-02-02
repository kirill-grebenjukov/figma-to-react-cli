"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderProps = renderProps;
exports.default = exportStylesFile;

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _lodash = _interopRequireDefault(require("lodash"));

var _toFile = _interopRequireDefault(require("./to-file"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderProps(props) {
  if (!props) {
    return [''];
  }

  return [..._lodash.default.keys(props).flatMap(key0 => {
    const key = key0.indexOf('-') ? `'${key0}'` : key0;
    const value = (0, _utils.rip0)(props[key0], 1).split('{...props},').join('...props,');
    const hasProps = value.indexOf('...props') >= 0;
    return [`${key}: ${hasProps ? 'props' : '()'} => (`, value, '),'];
  })];
}

function exportStylesFile(styles, component, {
  context
}) {
  const {
    exportCode: {
      path: exportPath,
      stylesExt: ext = 'styles.js'
    },
    eol
  } = context;
  const {
    componentName,
    componentPath
  } = component;
  const componentNameKebab = (0, _justKebabCase.default)(componentName);
  const jsCode = ['module.exports = {', ...renderProps(styles), '}'].join(eol);
  (0, _toFile.default)({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context
  });
}