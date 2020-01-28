import nodeType from './node-type';
import extNodeType from './ext-node-type';
import layoutAndSize from './layout-and-size';

import border from './border';
import opacity from './opacity';

import backgroundSolid from './background-solid';
import backgroundImage from './background-image';
import backgroundLinearGradient from './background-linear-gradient';

import textStyles from './text-styles';

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
  textStyles,
  layoutAndSize,
  exportAsImageOrSVG,
  exportToComponent,
];

export default middlewares;
