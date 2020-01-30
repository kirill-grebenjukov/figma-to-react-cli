import fs from 'fs';

import getConfig from './get-config';
import exportJSFile from './component';
import exportStoryFile from './storybook';
import exportStylesFile from './styles';

import { initGlobProps } from '../utils';

export default async function exportTree({ context, sourceMap }) {
  const {
    storybook: storybookCfg = {},
    exportCode: {
      template: componentTemplatePath = './src/assets/templates/component.jst',
      styles: stylesMode = 'inline',
    },
    prettierrc,
  } = context;

  const componentTemplate = fs.readFileSync(componentTemplatePath, {
    encoding: 'utf8',
  });

  const {
    template: storybookTemplatePath = './src/assets/templates/story.jst',
  } = storybookCfg;
  const storybookTemplate = storybookCfg
    ? fs.readFileSync(storybookTemplatePath, { encoding: 'utf8' })
    : null;

  const prettierOptions = getConfig(prettierrc);

  Object.keys(sourceMap).forEach(key => {
    const extractStyles =
      ['in-component-file', 'in-styles-file'].indexOf(stylesMode) >= 0;

    const styles = extractStyles ? {} : null;
    initGlobProps(styles);

    exportJSFile(componentTemplate, stylesMode, sourceMap[key], {
      context,
      prettierOptions,
    });

    if ('in-styles-file' === stylesMode && styles) {
      exportStylesFile(styles, sourceMap[key], {
        context,
        prettierOptions,
      });
    }

    if (storybookCfg) {
      exportStoryFile(storybookTemplate, sourceMap[key], {
        context,
        prettierOptions,
      });
    }
  });
}
