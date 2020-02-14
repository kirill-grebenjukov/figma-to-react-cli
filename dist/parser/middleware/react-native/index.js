"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeType = _interopRequireDefault(require("./node-type"));

var _extNodeType = _interopRequireDefault(require("./ext-node-type"));

var _backgroundSolid = _interopRequireDefault(require("./background-solid"));

var _backgroundImage = _interopRequireDefault(require("./background-image"));

var _backgroundLinearGradient = _interopRequireDefault(require("./background-linear-gradient"));

var _border = _interopRequireDefault(require("./border"));

var _opacity = _interopRequireDefault(require("./opacity"));

var _clipsContent = _interopRequireDefault(require("./clips-content"));

var _textStyles = _interopRequireDefault(require("./text-styles"));

var _layoutAndSize = _interopRequireDefault(require("./layout-and-size"));

var _stretch = _interopRequireDefault(require("./stretch"));

var _exportAsImageOrSvg = _interopRequireDefault(require("./export-as-image-or-svg"));

var _exportToComponent = _interopRequireDefault(require("./export-to-component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const middlewares = [_nodeType.default, _extNodeType.default, _backgroundSolid.default, _backgroundImage.default, _backgroundLinearGradient.default, _border.default, _opacity.default, _clipsContent.default, _textStyles.default, _layoutAndSize.default, _stretch.default, _exportAsImageOrSvg.default, _exportToComponent.default];
var _default = middlewares;
exports.default = _default;