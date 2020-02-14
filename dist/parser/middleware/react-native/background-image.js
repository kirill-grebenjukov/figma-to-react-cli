"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _fs = _interopRequireDefault(require("fs"));

var _axios = _interopRequireDefault(require("axios"));

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const resizeModes = {
  FILL: 'cover',
  FIT: 'center',
  TILE: 'repeat',
  STRETCH: 'stretch'
};

async function middleware({
  node,
  nodeJson,
  context
}) {
  const {
    imagesJson,
    exportImages: {
      path: exportImagesPath,
      codePrefix: exportImagesCodePrefix
    }
  } = context;
  const {
    id,
    name,
    fills
  } = nodeJson;

  if (!fills) {
    return node;
  }

  const background = fills.find(({
    type,
    visible = true,
    opacity = 1.0
  }) => type === 'IMAGE' && visible && opacity > 0);

  if (!background) {
    return node;
  }

  const {
    opacity = 1.0,
    scaleMode,
    imageRef
  } = background;
  const uri = imagesJson[imageRef];

  if (!uri) {
    return node;
  }

  const fileName = `${(0, _utils.sanitizeFileName)(name)}I${(0, _utils.sanitizeFileName)(id)}.png`;
  const filePath = `${exportImagesPath}/${fileName}`;
  const {
    data
  } = await _axios.default.get(uri, {
    responseType: 'arraybuffer'
  });

  _fs.default.mkdirSync(exportImagesPath, {
    recursive: true
  });

  _fs.default.writeFileSync(filePath, data);

  return _objectSpread({}, node, {
    importComponent: _lodash.default.concat(["import { ImageBackground } from 'react-native';"], node.importComponent),
    renderComponent: (props, children) => [`<ImageBackground source={require('${exportImagesCodePrefix}/${fileName}')} ${(0, _utils.rip)({
      resizeMode: resizeModes[scaleMode],
      style: _objectSpread({}, (0, _utils.copyStylePosition)(props), (0, _utils.copyStyleSize)(props, {
        width: '100%',
        height: '100%'
      }), {
        opacity
      })
    }, 0, `background-${props.key}`)}>`, ...node.renderComponent(_objectSpread({}, props, {
      style: _objectSpread({}, _lodash.default.get(props, 'style'), (0, _utils.clearStylePosition)())
    }), children), '</ImageBackground>']
  });
}