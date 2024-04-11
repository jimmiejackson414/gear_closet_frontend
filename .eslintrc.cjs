/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    './.eslintrc-auto-import.json',
    // 'plugin:storybook/recommended',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
  },

  plugins: ['@kalimahapps/eslint-plugin-tailwind', '@stylistic/js'],

  overrides: [
    {
      files: ['./pages/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.ts'],
      excludedFiles: '*.vue',
      rules: {
        '@stylistic/js/indent': ['error', 2],
        '@stylistic/js/linebreak-style': ['error', 'unix'],
      },
    },
  ],

  parser: 'vue-eslint-parser',

  rules: {
    '@kalimahapps/tailwind/sort': 'warn',
    '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    curly: ['off', 'multi'],
    '@stylistic/js/indent': 'off',
    '@stylistic/js/linebreak-style': 'off',
    '@stylistic/js/newline-per-chained-call': [2, { ignoreChainWithDepth: 1 }],
    'object-shorthand': ['error', 'always'],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/semi': [2, 'always'],
    '@stylistic/js/space-before-function-paren': ['error', 'always'],

    // Vue specific tweaks
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
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
    'vue/html-indent': ['error'],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 0,
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/padding-line-between-blocks': [1, 'always'],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/attributes-order': ['error', {
      'order': [
        "DEFINITION",
        "LIST_RENDERING",
        "CONDITIONALS",
        "RENDER_MODIFIERS",
        "GLOBAL",
        ["UNIQUE", "SLOT"],
        "TWO_WAY_BINDING",
        "OTHER_DIRECTIVES",
        "OTHER_ATTR",
        "EVENTS",
        "CONTENT",
      ],
      'alphabetical': true,
    }],
  },
};
