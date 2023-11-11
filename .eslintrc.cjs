/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest'
  },

  plugins: ['@kalimahapps/eslint-plugin-tailwind'],

  // overrides: [
  //   {
  //     files: ['**/*.vue'],
  //     rules: {
  //       indent: 'off',
  //       '@typescript-eslint/indent': 'off',
  //     },
  //   },
  // ],

  parser: 'vue-eslint-parser',

  rules: {
    '@kalimahapps/tailwind/sort': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    curly: ['off', 'multi'],
    indent: 'off',
    'linebreak-style': 'off',
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 1 }],
    'object-shorthand': ['error', 'always'],
    semi: [2, 'always'],
    'space-before-function-paren': ['error', 'always'],

    // Vue specific tweaks
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'always',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['error'],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 1,
        multiline: 1,
      },
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
      },
    ],
  },
}
