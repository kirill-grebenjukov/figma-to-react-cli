"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const sourceMap = {
  ExampleOne: {
    componentName: 'ExampleOne',
    componentPath: '',
    importCode: ["import { View, Text } from 'react-native';", "import { ResponsiveComponent } from 'react-native-responsive-ui';", "import KeyboardAwareScrollView from 'app/src/core/components/keyboard-aware-scrollview';", "import * as V from 'app/src/styles/variables';"],
    renderCode: ['<View style={V.sceneContent(contentWidth)}>', '<View style={V.hPadding(screenSize)}>', '<Text style={V.centerText(V.black(V.headingText))}>', 'Example One', '</Text>', '</View>', '</View>']
  },
  ExampleTwo: {
    componentName: 'ExampleTwo',
    componentPath: '',
    importCode: ["import { View, Text } from 'react-native';", "import { ResponsiveComponent } from 'react-native-responsive-ui';", "import KeyboardAwareScrollView from 'app/src/core/components/keyboard-aware-scrollview';", "import * as V from 'app/src/styles/variables';"],
    renderCode: ['<View style={V.sceneContent(contentWidth)}>', '<View style={V.hPadding(screenSize)}>', '<Text style={V.centerText(V.black(V.headingText))}>', 'Example Two', '</Text>', '</View>', '</View>']
  }
};
var _default = sourceMap;
exports.default = _default;