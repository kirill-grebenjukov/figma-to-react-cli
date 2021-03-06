"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportJSFile;

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _lodash = _interopRequireDefault(require("lodash"));

var _import = _interopRequireDefault(require("./import"));

var _utils = require("../utils");

var _styles = require("./styles");

var _toFile = _interopRequireDefault(require("./to-file"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function collectImports({
  importDecorator,
  importComponent,
  children
}) {
  return _lodash.default.concat(importDecorator || [], importComponent || [], _lodash.default.flatMap(children || [], child => collectImports(child)));
}

function renderStyles(styles) {
  if (!styles) {
    return [''];
  }

  return ['const PROPS = {', ...(0, _styles.renderProps)(styles), '}'];
}

function exportJSFile(template, stylesMode, component, {
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
    eol,
    hocs: hocsCfg
  } = context;
  const {
    componentName,
    componentPath,
    renderDecorator,
    renderComponent,
    children,
    props,
    hoc,
    svgCode
  } = component;
  const renderCode = renderDecorator || renderComponent;
  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const ext = svgCode ? fileExt : componentExt;
  const componentNameKebab = (0, _justKebabCase.default)(componentName);
  const inComponentFile = stylesMode === 'in-component-file';
  const inSeparateFile = stylesMode === 'in-styles-file';
  const styles = inComponentFile ? (0, _utils.getGlobProps)() : null;
  let jsCode = svgCode;

  if (!jsCode) {
    const allImportCode = [...(hocsCfg ? _lodash.default.flatMap(hocsCfg, ({
      import: i
    }) => i) : []), ...(hoc ? [hoc.import] : []), ...collectImports(component), ...(inSeparateFile ? [`import PROPS from './${componentNameKebab}.styles';`] : [])];
    const allHocs = [...(hocsCfg ? hocsCfg.map(({
      code: hocCode
    }) => hocCode) : []), ...(hoc ? [hoc.code] : [])];
    jsCode = template.split('{{componentName}}').join(componentName).replace('{{import}}', (0, _import.default)(allImportCode, eol)).replace('{{render}}', renderCode(props, children, component).join(eol)).replace('{{styles}}', renderStyles(styles).join(eol)).replace('{{export}}', `export default ${allHocs.reverse().reduce((sum, theHoc) => `${theHoc}(${sum})`, componentName)};`);
  }

  (0, _toFile.default)({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context
  });
  return `${exportPath}/${componentPath}/${componentNameKebab}`;
}