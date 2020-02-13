import get from 'lodash/get';

import { clearStylePosition, clearStyleSize } from '../../../utils';

export default function middleware({ node, context }) {
  const { id } = node;
  const { settingsJson } = context;

  const {
    // we need it mostly for parent (screen) components to occupy all the available space
    fullWidth = false,
    fullHeight = false,
  } = settingsJson[id] || {};

  if (!fullWidth && !fullHeight) {
    return node;
  }

  if (fullWidth && fullHeight) {
    return {
      ...node,
      props: {
        style: {
          ...node.props.style,
          ...clearStylePosition(),
          ...clearStyleSize(),
          flex: 1,
        },
      },
    };
  }

  return {
    ...node,
    props: {
      style: {
        ...node.props.style,
        ...(fullWidth ? { width: '100%' } : { height: '100%' }),
      },
    },
  };
}
