"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _get = _interopRequireDefault(require("lodash/get"));

var _utils = require("../../../utils");

var _constants = require("../../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function middleware({
  node,
  nodeJson,
  context
}) {
  const {
    id
  } = nodeJson;
  const {
    settingsJson
  } = context;
  const {
    extends: {
      mode,
      import: extImport,
      component: extComponent
    } = {}
  } = settingsJson[id] || {};

  const res = _objectSpread({}, node);

  if (!mode || !extImport || !extComponent) {
    return res;
  }

  res.importCode = [...node.importCode, ...extImport.split('\n')];

  if (mode === _constants.USE_AS_ROOT) {
    res.renderCode = (props, children) => [`<${extComponent} ${(0, _utils.rip)(props, 0, `node-${props.key}`)}>`, ...(0, _utils.rc)(children), `</${extComponent}>`];
  } else if (mode === _constants.USE_INSTEAD) {
    res.renderCode = props => [`<${extComponent} ${(0, _utils.rip)(props, 0, `node-${props.key}`)} />`];
  } else if (mode === _constants.WRAP_WITH) {
    res.renderInstance = node.renderInstance || node.renderCode;

    res.renderCode = (props, children, thisNode) => [`<${extComponent} ${(0, _utils.rip)({
      style: _objectSpread({}, (0, _utils.copyStylePosition)(props), (0, _utils.copyStyleSize)(props))
    }, 0, `node-${props.key}`)}>`, ...thisNode.renderInstance(_objectSpread({}, props, {
      style: _objectSpread({}, (0, _get.default)(props, 'style'), (0, _utils.clearStylePosition)())
    }), children, thisNode), `</${extComponent}>`];
  }

  return res;
}