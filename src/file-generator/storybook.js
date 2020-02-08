import kebabCase from 'just-kebab-case';

import toFile from './to-file';
import { getCodeExtension } from '../utils';

export default function exportJSFile(template, component, { context }) {
  const {
    exportCode: { path: exportCodePath, componentExt },
    exportSvgComponents: { path: exportSvgPath, fileExt },
    storybook: { codeSection, svgSection, fileExt: storyExt },
  } = context;

  const { componentName, componentPath, svgCode } = component;

  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const storiesSection = svgCode ? svgSection : codeSection;
  const ext = getCodeExtension(svgCode ? fileExt : componentExt);
  const componentNameKebab = kebabCase(componentName);

  const jsCode = template
    .replace('{{componentPath}}', componentNameKebab)
    .replace('{{storiesOf}}', storiesSection)
    .replace('{{extension}}', ext)
    .split('{{componentName}}')
    .join(componentName);

  toFile({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext: storyExt,
    context,
  });
}
