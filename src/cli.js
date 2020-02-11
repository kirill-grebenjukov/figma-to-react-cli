#!/usr/bin/env node

import Promise from 'bluebird';
import * as Figma from 'figma-api';
import _ from 'lodash';

import { cosmiconfigSync } from 'cosmiconfig';

import parseFigma from './parser';
import exportFiles from './file-generator';
import { findNodeByName } from './utils';
import { STORE_NAME, TEXT_STORE_NAME } from './constants';
import defaultConfig from './default-config';

const { config: cfg } = cosmiconfigSync('figma-to-react-cli').search();
const config = _.defaultsDeep(cfg, defaultConfig);

const {
  figma: { personalAccessToken, fileKey, pageNames },
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

      const pagesJson =
        pageNames && pageNames.length > 0
          ? pageNames.map(nodeName => findNodeByName(document, nodeName))
          : document.children;

      if (!pagesJson || pagesJson.length === 0) {
        console.log(`Can not find any page/canvas mentioned in ${pageNames}`);
        return;
      }

      const settingsJson = pagesJson.reduce((sum, pageJson) => {
        const settingsFrame = findNodeByName(pageJson, STORE_NAME);
        if (!settingsFrame) {
          console.warn(
            `Can not find Frame with name '${STORE_NAME}' inside page '${pageJson.name}'`,
          );
          return sum;
        }

        const settingsTextNode = findNodeByName(settingsFrame, TEXT_STORE_NAME);
        if (!settingsTextNode) {
          console.warn(
            `Can not find TextNode with name '${TEXT_STORE_NAME}' inside page '${pageJson.name}'`,
          );
          return sum;
        }

        const settingsText = settingsTextNode.characters;
        if (!settingsText) {
          console.warn(
            `TextNode with settings is empty inside page '${pageJson.name}'. No reason to process this page.`,
          );
          return sum;
        }

        return {
          ...sum,
          ...JSON.parse(settingsText),
        };
      }, {});

      console.log('Parsing...');
      const context = { ...config, figmaApi };

      const sourceMap = await parseFigma({
        pageJson: {
          children: _.flatMap(pagesJson, ({ children }) => children),
        },
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
