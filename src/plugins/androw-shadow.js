import _ from 'lodash';

import { rip, color } from '../utils';

export default function middleware({ node, nodeJson }) {
  const { name } = nodeJson;

  const { effects } = nodeJson;
  if (!effects || effects.length === 0) {
    return node;
  }

  const effect = effects.find(
    ({ type, visible }) => visible && type === 'DROP_SHADOW',
  );

  if (!effect) {
    return node;
  }

  const {
    color: { r, g, b, a },
    offset: { x, y },
    radius,
  } = effect;

  return {
    ...node,
    importComponent: _.concat(
      ["import Androw from 'react-native-androw';"],
      node.importComponent,
    ),
    renderComponent: (props, children, thisNode) => [
      `<Androw ${rip(
        {
          style: {
            shadowOffset: { width: x, height: y },
            shadowRadius: radius,
            shadowColor: color({ r, g, b, a: 1 }),
            shadowOpacity: a,
          },
        },
        0,
        `shadow-${props.key}`,
      )}>`,
      ...node.renderComponent(props, children, thisNode),
      '</Androw>',
    ],
  };
}
