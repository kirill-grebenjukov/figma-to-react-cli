#!/usr/bin/env node

import Promise from 'bluebird';
import * as Figma from 'figma-api';
import _ from 'lodash';

import { cosmiconfigSync } from 'cosmiconfig';

import parseFigma from './parser';
import exportFiles from './file-generator';
import { findCanvas, findNodeByName } from './utils';
import { STORE_NAME, TEXT_STORE_NAME } from './constants';

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
        console.log(`Can not find page/canvas with name '${pageName}'`);
        return;
      }

      const settingsFrame = findNodeByName(pageJson, STORE_NAME);
      if (!settingsFrame) {
        console.log(`Can not find Frame with name '${STORE_NAME}'`);
        return;
      }

      const settingsTextNode = findNodeByName(settingsFrame, TEXT_STORE_NAME);
      if (!settingsTextNode) {
        console.log(`Can not find TextNode with name '${TEXT_STORE_NAME}'`);
        return;
      }

      const settingsText = settingsTextNode.characters;
      if (!settingsText) {
        console.log('TextNode with settings is empty. No reason to proceed.');
        return;
      }

      const settingsJson = JSON.parse(settingsText);

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
