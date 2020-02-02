"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportJSFile;

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _toFile = _interopRequireDefault(require("./to-file"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exportJSFile(template, component, {
  context
}) {
  const {
    exportCode: {
      path: exportCodePath
    },
    exportSvgComponents: {
      path: exportSvgPath
    },
    storybook: {
      codeSection = 'Components',
      svgSection = 'SVG',
      fileExt: ext = 'story.js'
    }
  } = context;
  const {
    componentName,
    componentPath,
    svgCode
  } = component;
  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const storiesSection = svgCode ? svgSection : codeSection;
  const componentNameKebab = (0, _justKebabCase.default)(componentName);
  const jsCode = template.replace('{{componentPath}}', componentNameKebab).replace('{{storiesOf}}', storiesSection).split('{{componentName}}').join(componentName);
  (0, _toFile.default)({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context
  });
}