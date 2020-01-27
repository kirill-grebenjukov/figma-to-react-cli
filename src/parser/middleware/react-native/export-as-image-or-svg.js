import fs from 'fs';
import axios from 'axios';
import camelCase from 'camelcase';
import kebabCase from 'just-kebab-case';
import svgr from '@svgr/core';

import { rip, isVector, sanitizeFileName } from '../../../utils';

export default async function middleware({
  node,
  nodeJson,
  sourceMap,
  context,
}) {
  const { id, name, type } = nodeJson;

  const {
    settingsJson,
    figmaApi,
    figma: { fileKey },
    exportCode: { path: exportCodePath, codePrefix: exportCodePrefix },
    exportImages: {
      path: exportImagesPath,
      codePrefix: exportImagesCodePrefix,
    },
  } = context;
  const { componentName, componentPath = '', exportAs } =
    settingsJson[id] || {};

  if (!exportAs && !isVector(type)) {
    return node;
  }

  if (
    exportAs &&
    exportAs !== 'png' &&
    exportAs !== 'jpg' &&
    exportAs !== 'svg'
  ) {
    console.warn(
      `Unsupported 'exportAs'='${exportAs}' for node ${id} (${name})`,
    );
    return node;
  }

  const format = exportAs || 'svg';
  const scale = format === 'svg' ? 1 : 4;

  const { err, images } = await figmaApi.getImage(fileKey, {
    ids: id,
    scale,
    format,
  });

  if (err) {
    throw new Error(`Figma API getImages Error: ${err}`);
  }

  const uri = images[id];
  if (!uri) {
    return node;
  }

  const { data } = await axios.get(uri, {
    responseType: 'arraybuffer',
  });

  const fileName = `${sanitizeFileName(name)}I${sanitizeFileName(
    id,
  )}.${format}`;

  const res = { ...node };

  if (format === 'svg') {
    const className =
      componentName || camelCase(fileName, { pascalCase: true });
    const classPath = [
      exportCodePrefix,
      componentPath,
      `${kebabCase(className)}`,
      `${kebabCase(className)}.component`,
    ]
      .filter(t => !!t)
      .join('/');

    const svgCode = await svgr(
      data,
      {
        native: true,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      },
      { componentName: className },
    );

    sourceMap[className] = {
      ...node,
      componentName: className,
      importCode: [],
      renderCode: () => [],
      svgCode,
    };

    res.importCode = [`import ${className} from '${classPath}';`];
    res.renderCode = props => [`<${className} ${rip(props)} />`];
    res.svgCode = svgCode;
  } else {
    const filePath = `${exportImagesPath}/${fileName}`;
    const importPath = [exportImagesCodePrefix, fileName]
      .filter(t => !!t)
      .join('/');

    fs.mkdirSync(exportImagesPath, { recursive: true });
    fs.writeFileSync(filePath, data);

    res.importCode = ["import { Image } from 'react-native';"];
    res.renderCode = props => [
      `<Image source={require('${importPath}')} ${rip(props)} />`,
    ];
  }

  return res;
}
