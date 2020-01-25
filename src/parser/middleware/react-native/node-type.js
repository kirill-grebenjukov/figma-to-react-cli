import { rip, rc } from '../../../utils';

export default function middleware({ node, nodeJson }) {
  const { type } = nodeJson;

  const res = { ...node };

  switch (type) {
    case 'FRAME':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [`<View ${rip(props)}>`, ...rc(children), '</View>'];
      break;
    case 'GROUP':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [`<View ${rip(props)}>`, ...rc(children), '</View>'];
      break;
    case 'VECTOR':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [
        `<View ${rip(props)}>`,
        "<View style={{ flex: 1, backgroundColor: 'red' }}>",
        ...rc(children),
        '</View>',
        '</View>',
      ];
      break;
    case 'RECTANGLE':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [`<View ${rip(props)}>`, ...rc(children), '</View>'];
      break;
    case 'TEXT':
      res.importCode = ["import { Text } from 'react-native';"];
      res.renderCode = props => [`<Text ${rip(props)}>${nodeJson.characters}</Text>`];
      break;
    case 'COMPONENT':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [`<View ${rip(props)}>`, ...rc(children), '</View>'];
      break;
    case 'INSTANCE':
      res.importCode = ["import { View } from 'react-native';"];
      res.renderCode = (props, children) => [`<View ${rip(props)}>`, ...rc(children), '</View>'];
      break;
    default: {
      // do nothing
    }
  }

  return res;
}
