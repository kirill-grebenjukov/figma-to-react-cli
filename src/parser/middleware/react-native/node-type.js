import { rip, rc, sanitizeText } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const { type, id: key } = nodeJson;

  const res = { ...node };

  switch (type) {
    case 'FRAME':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `frame-${key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'GROUP':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `group-${key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'VECTOR':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `vector-${key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'RECTANGLE':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `rectangle-${key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'TEXT':
      res.importComponent = ["import { Text } from 'react-native';"];
      res.renderComponent = props => [
        `<Text ${rip(props, 0, `text-${key}`)}>${sanitizeText(
          nodeJson.characters,
        )}</Text>`,
      ];
      break;
    case 'COMPONENT':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `component-${key}`)}>`,
        ...rc(children),
        '</View>',
      ];
      break;
    case 'INSTANCE':
      res.importComponent = ["import { View } from 'react-native';"];
      res.renderComponent = (props, children) => [
        `<View ${rip(props, 0, `instance-${key}`)}>`,
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
