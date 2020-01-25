import fs from 'fs';
import path from 'path';
import kebabCase from 'just-kebab-case';
import prettier from 'prettier';
import _ from 'lodash';

import normalizeImports from './import';

function collectImports({ importCode, children }) {
  return _.concat(
    importCode || [],
    _.flatMap(children || [], child => collectImports(child)),
  );
}

export default async function exportJSFile(template, component, { config, prettierOptions }) {
  const { exportPath, eol, hocs: hocsCfg } = config;

  const { componentName, componentPath, renderCode, children, props, hoc } = component;

  const allImportCode = [
    ...(hocsCfg ? hocsCfg.flatMap(({ import: i }) => i) : []),
    ...(hoc ? [hoc.import] : []),
    ...collectImports(component),
  ];

  const allHocs = [
    ...(hocsCfg ? hocsCfg.map(({ code: hocCode }) => hocCode) : []),
    ...(hoc ? [hoc.code] : []),
  ];

  let jsCode = template
    .split('{{componentName}}')
    .join(componentName)
    .replace('{{import}}', normalizeImports(allImportCode, eol))
    .replace('{{styles}}', '')
    .replace('{{render}}', renderCode(props, children).join(eol))
    .replace(
      '{{export}}',
      `export default ${allHocs.reverse().reduce((sum, hoc) => `${hoc}(${sum})`, componentName)};`,
    );

  if (prettierOptions) {
    jsCode = prettier.format(jsCode, prettierOptions);
  }

  // console.log('jsCode: ', jsCode);
  const componentNameKebab = kebabCase(componentName);
  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.component.js`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
