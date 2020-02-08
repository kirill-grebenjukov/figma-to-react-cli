"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportJSFile;

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _toFile = _interopRequireDefault(require("./to-file"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exportJSFile(template, component, {
  context
}) {
  const {
    exportCode: {
      path: exportCodePath,
      componentExt
    },
    exportSvgComponents: {
      path: exportSvgPath,
      fileExt
    },
    storybook: {
      codeSection,
      svgSection,
      fileExt: storyExt
    }
  } = context;
  const {
    componentName,
    componentPath,
    svgCode
  } = component;
  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const storiesSection = svgCode ? svgSection : codeSection;
  const ext = (0, _utils.getCodeExtension)(svgCode ? fileExt : componentExt);
  const componentNameKebab = (0, _justKebabCase.default)(componentName);
  const jsCode = template.replace('{{componentPath}}', componentNameKebab).replace('{{storiesOf}}', storiesSection).replace('{{extension}}', ext).split('{{componentName}}').join(componentName);
  (0, _toFile.default)({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext: storyExt,
    context
  });
}