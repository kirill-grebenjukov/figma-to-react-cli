import { rip, rc, sanitizeText } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const { type } = nodeJson;

  const res = { ...node };

  switch (type) {
    case 'FRAME':
      // res.props = { ...node.props, style: { flex: 1 } };
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `frame-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'GROUP':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `group-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'VECTOR':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `vector-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'RECTANGLE':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `rectangle-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'TEXT':
      res.importComponent = ["import { Text } from 'react-native';"];
      res.renderComponent = props => [
        `<Text ${rip(props, 0, `text-${props.key}`)}>${sanitizeText(
          nodeJson.characters,
        )}</Text>`,
      ];
      break;
    case 'COMPONENT':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `component-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'INSTANCE':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `instance-${props.key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    default: {
      // do nothing
    }
  }

  return res;
}
