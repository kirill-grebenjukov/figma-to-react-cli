import get from 'lodash/get';

export default function middleware({ node, nodeJson }) {
  const { opacity = 1 } = nodeJson;

  return {
    ...node,
    props: {
      ...node.props,
      style: {
        ...get(node, 'props.style'),
        opacity,
      },
    },
  };
}
