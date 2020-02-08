module.exports = {
  exportCode: {
    codePrefix: 'app/src/components',
    componentExt: 'component.js',
    // styles: 'inline | in-component-file | in-styles-file',
    styles: 'in-styles-file',
    stylesExt: 'styles.js',
  },
  exportSvgComponents: {
    codePrefix: 'app/src/components',
    fileExt: 'svg.js',
  },
  exportImages: {
    codePrefix: 'app/src/assets/images',
  },
  eol: '\n',
  storybook: {
    codeSection: 'UI-Kit',
    svgSection: 'SVG Icons',
    fileExt: 'story.js',
  },
};
