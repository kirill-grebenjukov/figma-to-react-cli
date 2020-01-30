import kebabCase from 'just-kebab-case';
import _ from 'lodash';

import normalizeImports from './import';
import { getGlobProps } from '../utils';
import { renderProps } from './styles';

import toFile from './to-file';

function collectImports({ importCode, children }) {
  return _.concat(
    importCode || [],
    _.flatMap(children || [], child => collectImports(child)),
  );
}

function renderStyles(styles) {
  if (!styles) {
    return [''];
  }

  return ['const PROPS = {', ...renderProps(styles), '}'];
}

export default function exportJSFile(
  template,
  stylesMode,
  component,
  { context },
) {
  const {
    exportCode: { path: exportCodePath, componentExt = 'component.js' },
    exportSvgComponents: { path: exportSvgPath, fileExt = 'component.js' },
    eol,
    hocs: hocsCfg,
  } = context;

  const {
    componentName,
    componentPath,
    renderCode,
    children,
    props,
    hoc,
    svgCode,
  } = component;

  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const ext = svgCode ? fileExt : componentExt;

  const componentNameKebab = kebabCase(componentName);

  const inComponentFile = stylesMode === 'in-component-file';
  const inSeparateFile = stylesMode === 'in-styles-file';
  const styles = inComponentFile ? getGlobProps() : null;

  let jsCode = svgCode;
  if (!jsCode) {
    const allImportCode = [
      ...(hocsCfg ? hocsCfg.flatMap(({ import: i }) => i) : []),
      ...(hoc ? [hoc.import] : []),
      ...collectImports(component),
      ...(inSeparateFile
        ? [`import PROPS from './${componentNameKebab}.styles';`]
        : []),
    ];

    const allHocs = [
      ...(hocsCfg ? hocsCfg.map(({ code: hocCode }) => hocCode) : []),
      ...(hoc ? [hoc.code] : []),
    ];

    jsCode = template
      .split('{{componentName}}')
      .join(componentName)
      .replace('{{import}}', normalizeImports(allImportCode, eol))
      .replace('{{render}}', renderCode(props, children).join(eol))
      .replace('{{styles}}', renderStyles(styles).join(eol))
      .replace(
        '{{export}}',
        `export default ${allHocs
          .reverse()
          .reduce((sum, hoc) => `${hoc}(${sum})`, componentName)};`,
      );
  }

  toFile({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context,
  });
}
