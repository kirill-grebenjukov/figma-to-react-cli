import fs from 'fs';
import path from 'path';
import kebabCase from 'just-kebab-case';
import prettier from 'prettier';
import _ from 'lodash';

import normalizeImports from './import';
import { getGlobProps } from '../utils';
import { renderProps } from './styles';

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
  { context, prettierOptions },
) {
  const {
    exportCode: { path: exportCodePath },
    exportSvgComponents: { path: exportSvgPath },
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

  if (prettierOptions) {
    jsCode = prettier.format(jsCode, prettierOptions);
  }

  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.component.js`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
