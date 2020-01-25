import get from 'lodash/get';

import { color } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const { fills } = nodeJson;
  if (!fills) {
    return node;
  }

  const background = fills.find(
    ({ type, visible = true, opacity = 1.0 }) => type === 'SOLID' && visible && opacity > 0,
  );

  if (!background) {
    return node;
  }

  const { type } = nodeJson;
  if (type === 'TEXT') {
    // fills for TEXT isn't background, it's color of the text
    // we will handle it inside text-style.js
    return node;
  }

  const { opacity = 1.0, color: backgroundColor } = background;

  return {
    ...node,
    props: {
      ...node.props,
      style: {
        ...get(node, 'props.style'),
        backgroundColor: color(backgroundColor, opacity),
      },
    },
  };
}
