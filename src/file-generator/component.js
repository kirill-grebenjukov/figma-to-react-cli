import kebabCase from 'just-kebab-case';
import _ from 'lodash';

import normalizeImports from './import';
import { getGlobProps } from '../utils';
import { renderProps } from './styles';

import toFile from './to-file';

function collectImports({ importDecorator, importComponent, children }) {
  return _.concat(
    importDecorator || [],
    importComponent || [],
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
    exportCode: { path: exportCodePath, componentExt },
    exportSvgComponents: { path: exportSvgPath, fileExt },
    eol,
    hocs: hocsCfg,
  } = context;

  const {
    componentName,
    componentPath,
    renderDecorator,
    renderComponent,
    children,
    props,
    hoc,
    svgCode,
  } = component;

  const renderCode = renderDecorator || renderComponent;

  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const ext = svgCode ? fileExt : componentExt;

  const componentNameKebab = kebabCase(componentName);

  const inComponentFile = stylesMode === 'in-component-file';
  const inSeparateFile = stylesMode === 'in-styles-file';
  const styles = inComponentFile ? getGlobProps() : null;

  let jsCode = svgCode;
  if (!jsCode) {
    const allImportCode = [
      ...(hocsCfg ? _.flatMap(hocsCfg, ({ import: i }) => i) : []),
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
      .replace('{{render}}', renderCode(props, children, component).join(eol))
      .replace('{{styles}}', renderStyles(styles).join(eol))
      .replace(
        '{{export}}',
        `export default ${allHocs
          .reverse()
          .reduce((sum, theHoc) => `${theHoc}(${sum})`, componentName)};`,
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

  return `${exportPath}/${componentPath}/${componentNameKebab}`;
}
