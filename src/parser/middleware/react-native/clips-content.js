import get from 'lodash/get';

export default function middleware({ node, nodeJson }) {
  const { clipsContent = false } = nodeJson;

  return {
    ...node,
    props: {
      ...node.props,
      style: {
        ...get(node, 'props.style'),
        overflow: clipsContent ? 'hidden' : undefined,
      },
    },
  };
}
