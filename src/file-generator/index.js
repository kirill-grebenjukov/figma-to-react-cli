import fs from 'fs';
import { resolve } from 'path';

import exportJSFile from './component';
import exportStoryFile from './storybook';
import exportStylesFile from './styles';

import { initGlobProps } from '../utils';

export default async function exportTree({ context, sourceMap }) {
  const {
    storybook: storybookCfg = {},
    exportCode: {
      template: componentTemplatePath = resolve(
        __dirname,
        '../assets/templates/component.jst',
      ),
      styles: stylesMode = 'inline',
    },
  } = context;

  const componentTemplate = fs.readFileSync(componentTemplatePath, {
    encoding: 'utf8',
  });

  const {
    template: storybookTemplatePath = resolve(
      __dirname,
      '../assets/templates/stories.jst',
    ),
  } = storybookCfg;
  const storybookTemplate = storybookCfg
    ? fs.readFileSync(storybookTemplatePath, { encoding: 'utf8' })
    : null;

  Object.keys(sourceMap).forEach(key => {
    const node = sourceMap[key];

    console.log(`\n### [${node.id}] '${node.name}' -> ${key}`);

    const extractStyles =
      ['in-component-file', 'in-styles-file'].indexOf(stylesMode) >= 0;

    const styles = extractStyles ? {} : null;
    initGlobProps(styles);

    exportJSFile(componentTemplate, stylesMode, node, {
      context,
    });

    if (stylesMode === 'in-styles-file' && styles) {
      exportStylesFile(styles, node, {
        context,
      });
    }

    if (storybookCfg) {
      exportStoryFile(storybookTemplate, node, {
        context,
      });
    }
  });
}
