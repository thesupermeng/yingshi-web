module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-react',
    'eslint-plugin-jsx-a11y',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'no-unused-vars': [1, { args: 'none', ignoreRestSiblings: true }],
  },
};
