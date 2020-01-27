import get from 'lodash/get';

import { color } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const {
    strokes,
    strokeWeight,
    cornerRadius,
    rectangleCornerRadii,
  } = nodeJson;

  const props = {
    ...node.props,
    style: {
      ...get(node, 'props.style'),
    },
  };

  if (rectangleCornerRadii) {
    const [
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
    ] = rectangleCornerRadii;

    props.style = {
      ...props.style,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0)',
    };
  } else if (cornerRadius && cornerRadius > 0) {
    props.style = {
      ...props.style,
      borderRadius: cornerRadius,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0)',
    };
  }

  if (strokes) {
    const stroke = strokes.find(({ type }) => type === 'SOLID');
    if (stroke) {
      const { color: c } = stroke;

      props.style = {
        ...props.style,
        borderWidth: strokeWeight,
        borderColor: color(c),
      };
    }
  }

  return {
    ...node,
    props,
  };
}
