import fs from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

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
    whitelist,
    blacklist,
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

  const report = {};
  Object.keys(sourceMap).forEach(key => {
    const node = sourceMap[key];

    const { id, name } = node;
    const blackOrWhiteListed =
      (_.isArray(whitelist) &&
        whitelist.length > 0 &&
        whitelist.indexOf(name) < 0 &&
        whitelist.indexOf(id) < 0) ||
      (_.isArray(blacklist) &&
        blacklist.length > 0 &&
        (blacklist.indexOf(name) >= 0 || blacklist.indexOf(id) >= 0));

    if (blackOrWhiteListed) {
      return;
    }

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

    report[key] = node;
  });

  console.log('### Export Report ###');
  Object.keys(report).forEach(key => {
    const node = report[key];
    console.log(`  [${node.id}] '${node.name}' -> ${key}`);
  });
  console.log('###');
}
