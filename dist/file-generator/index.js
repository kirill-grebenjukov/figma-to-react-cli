"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportTree;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

var _component = _interopRequireDefault(require("./component"));

var _storybook = _interopRequireDefault(require("./storybook"));

var _styles = _interopRequireDefault(require("./styles"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function exportTree({
  context,
  sourceMap
}) {
  const {
    storybook: storybookCfg = {},
    exportCode: {
      template: componentTemplatePath = (0, _path.resolve)(__dirname, '../assets/templates/component.jst'),
      styles: stylesMode = 'inline'
    }
  } = context;

  const componentTemplate = _fs.default.readFileSync(componentTemplatePath, {
    encoding: 'utf8'
  });

  const {
    template: storybookTemplatePath = (0, _path.resolve)(__dirname, '../assets/templates/story.jst')
  } = storybookCfg;
  const storybookTemplate = storybookCfg ? _fs.default.readFileSync(storybookTemplatePath, {
    encoding: 'utf8'
  }) : null;
  Object.keys(sourceMap).forEach(key => {
    const extractStyles = ['in-component-file', 'in-styles-file'].indexOf(stylesMode) >= 0;
    const styles = extractStyles ? {} : null;
    (0, _utils.initGlobProps)(styles);
    (0, _component.default)(componentTemplate, stylesMode, sourceMap[key], {
      context
    });

    if (stylesMode === 'in-styles-file' && styles) {
      (0, _styles.default)(styles, sourceMap[key], {
        context
      });
    }

    if (storybookCfg) {
      (0, _storybook.default)(storybookTemplate, sourceMap[key], {
        context
      });
    }
  });
}