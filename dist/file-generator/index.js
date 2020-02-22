"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportTree;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

var _lodash = _interopRequireDefault(require("lodash"));

var _component = _interopRequireDefault(require("./component"));

var _storybook = _interopRequireDefault(require("./storybook"));

var _styles = _interopRequireDefault(require("./styles"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function exportTree({
  context,
  sourceMap
}) {
  const {
    storybook: storybookCfg = {},
    exportCode: {
      template: componentTemplatePath = (0, _path.resolve)(__dirname, '../assets/templates/component.jst'),
      styles: stylesMode = 'inline'
    },
    whitelist,
    blacklist
  } = context;

  const componentTemplate = _fs.default.readFileSync(componentTemplatePath, {
    encoding: 'utf8'
  });

  const {
    template: storybookTemplatePath = (0, _path.resolve)(__dirname, '../assets/templates/stories.jst')
  } = storybookCfg;
  const storybookTemplate = storybookCfg ? _fs.default.readFileSync(storybookTemplatePath, {
    encoding: 'utf8'
  }) : null;
  const report = {};
  Object.keys(sourceMap).forEach(key => {
    const node = sourceMap[key];
    const {
      id,
      name
    } = node;
    const blackOrWhiteListed = _lodash.default.isArray(whitelist) && whitelist.length > 0 && whitelist.indexOf(name) < 0 && whitelist.indexOf(id) < 0 || _lodash.default.isArray(blacklist) && blacklist.length > 0 && (blacklist.indexOf(name) >= 0 || blacklist.indexOf(id) >= 0);

    if (blackOrWhiteListed) {
      return;
    }

    const extractStyles = ['in-component-file', 'in-styles-file'].indexOf(stylesMode) >= 0;
    const styles = extractStyles ? {} : null;
    (0, _utils.initGlobProps)(styles);
    const filePath = (0, _component.default)(componentTemplate, stylesMode, node, {
      context
    });

    if (stylesMode === 'in-styles-file' && styles) {
      (0, _styles.default)(styles, node, {
        context
      });
    }

    if (storybookCfg) {
      (0, _storybook.default)(storybookTemplate, node, {
        context
      });
    }

    report[key] = _objectSpread({}, node, {
      filePath
    });
  });
  console.log('### Export Report ###');
  Object.keys(report).forEach(key => {
    const node = report[key];
    console.log(`  [${node.id}] '${node.name}' -> ${key} -> ${node.filePath}`);
  });
  console.log('###');
}