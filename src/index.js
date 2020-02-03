import Promise from 'bluebird';
import * as Figma from 'figma-api';
import _ from 'lodash';

import { cosmiconfigSync } from 'cosmiconfig';

import parseFigma from './parser';
import exportFiles from './file-generator';
import { findCanvas } from './utils';

import settingsJson from './assets/tests/Responsive.settings.json';

const { config } = cosmiconfigSync('figma-to-react-cli').search();

const {
  figma: { personalAccessToken, fileKey, pageName },
} = config;

// https://www.figma.com/developers/api
const figmaApi = new Figma.Api({ personalAccessToken });

Promise.all([figmaApi.getFile(fileKey), figmaApi.getImageFills(fileKey)])
  .then(
    async ([
      { document },
      {
        meta: { images: imagesJson },
      },
    ]) => {
      console.log('Getting data from Figma...');
      const pageJson = pageName ? findCanvas(document, pageName) : document;
      if (!pageJson) {
        console.log('No page/canvas found');
        return;
      }

      console.log('Parsing...');
      const context = { ...config, figmaApi };
      const sourceMap = await parseFigma({
        pageJson,
        imagesJson,
        settingsJson,
        context,
      });

      console.log('Exporting...');
      await exportFiles({ sourceMap, context });

      console.log('All done!');
    },
  )
  .catch(console.error);
