import _ from 'lodash';

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
    importComponent: _.concat(
      ["import LinearGradient from 'react-native-linear-gradient';"],
      node.importComponent,
    ),
    renderComponent: (props, children, thisNode) => [
      `<LinearGradient ${rip(
        {
          style: {
            ..._.get(props, 'style'),
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
      ...node.renderComponent(props, children, thisNode),
      '</LinearGradient>',
    ],
  };
}
