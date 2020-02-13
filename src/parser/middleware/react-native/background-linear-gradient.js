import get from 'lodash/get';

import { rip, color } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const { fills } = nodeJson;
  if (!fills) {
    return node;
  }

  const background = fills.find(
    ({ type, visible = true, opacity = 1.0 }) =>
      type === 'GRADIENT_LINEAR' && visible && opacity > 0,
  );

  if (!background) {
    return node;
  }

  const {
    opacity = 1.0,
    gradientHandlePositions: [start, end],
    gradientStops,
  } = background;

  const colors = gradientStops.map(({ color: c }) => color(c));
  const locations = gradientStops.map(({ position }) => position);

  return {
    ...node,
    importCode: ["import LinearGradient from 'react-native-linear-gradient';"],
    renderCode: (props, children) => [
      `<LinearGradient ${rip(
        {
          style: {
            ...get(props, 'style'),
            opacity,
          },
          start,
          end,
          colors,
          locations,
        },
        0,
        `gradient-background-${props.key}`,
      )}>`,
      ...node.renderCode(props, children),
      '</LinearGradient>',
    ],
  };
}
