import kebabCase from 'just-kebab-case';
import _ from 'lodash';

import toFile from './to-file';

import { rip0 } from '../utils';

export function renderProps(props) {
  if (!props) {
    return [''];
  }

  return [
    ..._.flatMap(_.keys(props), key0 => {
      const key = key0.indexOf('-') ? `'${key0}'` : key0;
      const value = rip0(props[key0], 1)
        .split('{...props},')
        .join('...props,');
      const hasProps = value.indexOf('...props') >= 0;

      return [`${key}: ${hasProps ? 'props' : '()'} => (`, value, '),'];
    }),
  ];
}

export default function exportStylesFile(styles, component, { context }) {
  const {
    exportCode: { path: exportCodePath, stylesExt: ext },
    exportSvgComponents: { path: exportSvgPath },
    eol,
  } = context;

  const { componentName, componentPath, svgCode } = component;
  const componentNameKebab = kebabCase(componentName);
  const exportPath = svgCode ? exportSvgPath : exportCodePath;

  const jsCode = ['module.exports = {', ...renderProps(styles), '}'].join(eol);

  toFile({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context,
  });
}
