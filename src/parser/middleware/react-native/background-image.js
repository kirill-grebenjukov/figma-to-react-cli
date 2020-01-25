import fs from 'fs';
import path from 'path';
import axios from 'axios';
import get from 'lodash/get';

import { rip, copyStylePosition, copyStyleSize, clearStylePosition } from '../../../utils';

const resizeModes = {
  FILL: 'cover',
  FIT: 'center',
  TILE: 'repeat',
  STRETCH: 'stretch',
};

function sanitize(value) {
  return value
    .split('.')
    .join('_')
    .split(' ')
    .join('_')
    .split(':')
    .join('_')
    .split(';')
    .join('_');
}

export default async function middleware({ node, nodeJson, context }) {
  const {
    imagesJson,
    exportImages: { path: exportImagesPath, codePrefix: exportImagesCodePrefix },
  } = context;

  const { id, name, fills } = nodeJson;
  if (!fills) {
    return node;
  }

  const background = fills.find(
    ({ type, visible = true, opacity = 1.0 }) => type === 'IMAGE' && visible && opacity > 0,
  );

  if (!background) {
    return node;
  }

  const { opacity = 1.0, scaleMode, imageRef } = background;
  const uri = imagesJson[imageRef];
  if (!uri) {
    return node;
  }

  const fileName = `${sanitize(name)}_${sanitize(id)}.png`;
  const filePath = `${exportImagesPath}/${fileName}`;

  const { data } = await axios.get(uri, {
    responseType: 'arraybuffer',
  });

  fs.mkdirSync(exportImagesPath, { recursive: true });
  fs.writeFileSync(filePath, data);

  return {
    ...node,
    importCode: ["import { ImageBackground } from 'react-native';"],
    renderCode: (props, children) => [
      `<ImageBackground source={require('${exportImagesCodePrefix}/${fileName}')} ${rip({
        resizeMode: resizeModes[scaleMode],
        style: {
          ...copyStylePosition(props),
          ...copyStyleSize(props, { width: '100%', height: '100%' }),
          opacity,
        },
      })}>`,
      ...node.renderCode(
        {
          ...props,
          style: {
            ...get(props, 'style'),
            ...clearStylePosition(),
          },
        },
        children,
      ),
      '</ImageBackground>',
    ],
  };
}
