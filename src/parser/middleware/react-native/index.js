import concat from 'lodash/concat';

import nodeType from './node-type';
import extNodeType from './ext-node-type';

import backgroundSolid from './background-solid';
import backgroundImage from './background-image';
import backgroundLinearGradient from './background-linear-gradient';

import border from './border';
import opacity from './opacity';
import clipsContent from './clips-content';

import textStyles from './text-styles';

import layoutAndSize from './layout-and-size';
import stretch from './stretch';
import exportAsImageOrSVG from './export-as-image-or-svg';
import exportToComponent from './export-to-component';

const middlewares = [
  nodeType,
  extNodeType,
  backgroundSolid,
  backgroundImage,
  backgroundLinearGradient,
  border,
  opacity,
  clipsContent,
  textStyles,
  layoutAndSize,
  stretch,
];

const tail = [exportAsImageOrSVG, exportToComponent];

export default custom => concat(middlewares, custom, tail);
