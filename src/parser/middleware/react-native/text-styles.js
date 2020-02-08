import get from 'lodash/get';

import { color } from '../../../utils';

const textDecorationMap = {
  STRIKETHROUGH: 'line-through',
  UNDERLINE: 'underline',
};

const alignHorMap = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFIED: 'justify',
};

const alignVertMap = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom',
};

export default function middleware({ node, nodeJson, context }) {
  const { type } = nodeJson;

  if (type !== 'TEXT') {
    return node;
  }

  const {
    parser: { getFontName },
  } = context;

  const {
    style: {
      fontFamily,
      fontPostScriptName,
      fontWeight,
      fontSize,
      italic,
      textAlignHorizontal,
      textAlignVertical,
      letterSpacing,
      lineHeightPx,
      textDecoration,
    },
    fills,
  } = nodeJson;

  const colorFill = fills.find(
    ({ type: fillType, visible = true, opacity = 1.0 }) =>
      fillType === 'SOLID' && visible && opacity > 0,
  );

  const { opacity = 1.0, color: textColor } = colorFill || {
    color: { r: 0, g: 0, b: 0, a: 1 },
  };

  return {
    ...node,
    props: {
      ...node.props,
      style: {
        ...get(node, 'props.style'),
        color: color(textColor, opacity),
        fontFamily: getFontName(fontFamily, fontPostScriptName),
        fontSize,
        fontWeight: `${fontWeight}`,
        fontStyle: italic ? 'italic' : 'normal',
        lineHeight: lineHeightPx,
        textAlign: alignHorMap[textAlignHorizontal],
        textAlignVertical: alignVertMap[textAlignVertical],
        letterSpacing,
        textDecorationLine: textDecorationMap[textDecoration],
      },
    },
  };
}
