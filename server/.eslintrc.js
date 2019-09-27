module.exports = {
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:security/recommended'],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-triple-slash-reference': 'off',
    'spaced-comment': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.ts', '**/*.spec.tsx', '**/*/setupJest.js'] },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.spec.js', '**/*.spec.ts', '**/__mocks__/**/*'],
      env: {
        jest: true,
      },
      parserOptions: {
        typescript: true,
      },
    },
  ],
  globals: {},
  plugins: ['babel', 'import', 'security'],
};
