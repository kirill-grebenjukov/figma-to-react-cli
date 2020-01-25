module.exports = {
  root: true,
  extends: 'airbnb/base',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    jsx: true,
  },
  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },
  plugins: ['babel', 'import', 'compat', 'jest', 'prettier'],
  rules: {
    indent: 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'max-len': [1, 150],
    'no-else-return': 1,
    'lines-between-class-members': 1,
    'operator-linebreak': 0, // Несовместимо с prettier
    'implicit-arrow-linebreak': 0, // Несовместимо с prettier
    'arrow-parens': 'off', // Несовместимо с prettier
    'no-mixed-operators': 'off', // Несовместимо с prettier
    'object-curly-newline': 'off', // Несовместимо с prettier
    'space-before-function-paren': 0, // Несовместимо с prettier
    'function-paren-newline': 0, // Несовместимо с prettier
    'import/no-named-as-default': 0,
    'import/named': 0,
    'prettier/prettier': ['error'],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src', 'node_modules'],
      },
    },
  },
  globals: {
    DEBUG: false,
  },
};
