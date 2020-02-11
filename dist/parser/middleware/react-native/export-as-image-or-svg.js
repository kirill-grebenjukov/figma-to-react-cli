"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _fs = _interopRequireDefault(require("fs"));

var _axios = _interopRequireDefault(require("axios"));

var _camelcase = _interopRequireDefault(require("camelcase"));

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _core = _interopRequireDefault(require("@svgr/core"));

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function middleware({
  node,
  nodeJson,
  sourceMap,
  context
}) {
  const {
    id,
    name,
    type
  } = nodeJson;
  const {
    settingsJson,
    figmaApi,
    figma: {
      fileKey
    },
    exportSvgComponents: {
      codePrefix: exportCodePrefix,
      fileExt
    },
    exportImages: {
      path: exportImagesPath,
      codePrefix: exportImagesCodePrefix
    }
  } = context;
  const {
    componentName,
    componentPath = '',
    exportAs
  } = settingsJson[id] || {};

  if (!exportAs && !(0, _utils.isVector)(type)) {
    return node;
  }

  if (exportAs && exportAs !== 'png' && exportAs !== 'jpg' && exportAs !== 'svg') {
    console.warn(`Unsupported 'exportAs'='${exportAs}' for node ${id} (${name})`);
    return node;
  }

  const format = exportAs || 'svg';
  const scale = format === 'svg' ? 1 : 4;
  const {
    err,
    images
  } = await figmaApi.getImage(fileKey, {
    ids: id,
    scale,
    format
  });

  if (err) {
    throw new Error(`Figma API getImages Error: ${err}`);
  }

  const uri = images[id];

  if (!uri) {
    return node;
  }

  const {
    data
  } = await _axios.default.get(uri, {
    responseType: 'arraybuffer'
  });
  const fileName = `${(0, _utils.sanitizeFileName)(name)}I${(0, _utils.sanitizeFileName)(id)}.${format}`;

  const res = _objectSpread({}, node);

  if (format === 'svg') {
    const className = componentName || (0, _camelcase.default)(fileName, {
      pascalCase: true
    });
    const classPath = [exportCodePrefix, componentPath, `${(0, _justKebabCase.default)(className)}`, `${(0, _justKebabCase.default)(className)}.${(0, _utils.getCodeExtension)(fileExt)}`].filter(t => !!t).join('/');
    const svgCode = await (0, _core.default)(data, {
      native: true,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx']
    }, {
      componentName: className
    });
    const {
      props
    } = node;

    const componentProps = _objectSpread({}, props, {
      style: _objectSpread({}, props.style, (0, _utils.clearStylePosition)(), (0, _utils.clearStyleSize)(), {
        'last:prop': '...props.style'
      }),
      'first:prop': '{...props}'
    });

    const instanceProps = _objectSpread({}, props, {
      style: _objectSpread({}, (0, _utils.copyStylePosition)(props), (0, _utils.copyStyleSize)(props))
    }); // eslint-disable-next-line no-param-reassign


    sourceMap[className] = _objectSpread({}, node, {
      componentName: className,
      componentPath,
      props: componentProps,
      importCode: [],
      renderCode: () => [],
      svgCode
    }); // eslint-disable-next-line no-shadow

    const render = props => [`<${className} ${(0, _utils.rip)(props, 0, `svg-${props.key}`)} />`];

    res.props = instanceProps;
    res.importCode = [`import ${className} from '${classPath}';`];
    res.svgCode = svgCode;

    if (res.renderInstance) {
      res.renderInstance = render;
    } else {
      res.renderCode = render;
    }
  } else {
    const filePath = `${exportImagesPath}/${fileName}`;
    const importPath = [exportImagesCodePrefix, fileName].filter(t => !!t).join('/');

    _fs.default.mkdirSync(exportImagesPath, {
      recursive: true
    });

    _fs.default.writeFileSync(filePath, data);

    res.importCode = ["import { Image } from 'react-native';"];

    const render = props => [`<Image source={require('${importPath}')} ${(0, _utils.rip)(props, 0, `image-${props.key}`)} />`];

    if (res.renderInstance) {
      res.renderInstance = render;
    } else {
      res.renderCode = render;
    }
  }

  return res;
}