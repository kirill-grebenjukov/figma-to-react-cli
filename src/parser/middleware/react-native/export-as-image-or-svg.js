import fs from 'fs';
import axios from 'axios';
import camelCase from 'camelcase';
import kebabCase from 'just-kebab-case';
import svgr from '@svgr/core';

import {
  rip,
  isVector,
  sanitizeFileName,
  copyStylePosition,
  copyStyleSize,
  clearStylePosition,
  clearStyleSize,
  getCodeExtension,
} from '../../../utils';

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
    exportSvgComponents: { codePrefix: exportCodePrefix, fileExt },
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

  if (format === 'svg') {
    const className =
      componentName || camelCase(fileName, { pascalCase: true });
    const classPath = [
      exportCodePrefix,
      componentPath,
      `${kebabCase(className)}`,
      `${kebabCase(className)}.${getCodeExtension(fileExt)}`,
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

    const { props } = node;
    const componentProps = {
      ...props,
      style: {
        ...props.style,
        ...clearStylePosition(),
        ...clearStyleSize(),
        'last:prop': '...props.style',
      },
      'first:prop': '{...props}',
    };

    const instanceProps = {
      ...props,
      style: {
        ...copyStylePosition(props),
        ...copyStyleSize(props),
      },
    };

    // eslint-disable-next-line no-param-reassign
    sourceMap[className] = {
      ...node,
      componentName: className,
      componentPath,
      props: componentProps,
      importComponent: [],
      renderComponent: () => [],
      svgCode,
    };

    return {
      ...node,
      svgCode,
      props: instanceProps,
      importComponent: [`import ${className} from '${classPath}';`],
      // eslint-disable-next-line no-shadow
      renderComponent: props => [
        `<${className} ${rip(props, 0, `svg-${props.key}`)} />`,
      ],
    };
  }

  const filePath = `${exportImagesPath}/${fileName}`;
  const importPath = [exportImagesCodePrefix, fileName]
    .filter(t => !!t)
    .join('/');

  fs.mkdirSync(exportImagesPath, { recursive: true });
  fs.writeFileSync(filePath, data);

  return {
    ...node,
    importComponent: ["import { Image } from 'react-native';"],
    renderComponent: props => [
      `<Image source={require('${importPath}')} ${rip(
        props,
        0,
        `image-${props.key}`,
      )} />`,
    ],
  };
}
